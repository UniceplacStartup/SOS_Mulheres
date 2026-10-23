-- ============================================================================
-- SOS MULHERES - NEON SERVERLESS POSTGRESQL + POSTGIS SCHEMA
-- ============================================================================

-- 1. Habilitar extensões para geração de UUID e Geoprocessamento (PostGIS)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. Tabela de Usuárias (Vítimas cadastradas)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    real_pin_hash VARCHAR(255) NOT NULL,     -- PIN real para cancelar alarme (ex: 1234)
    duress_pin_hash VARCHAR(255) NOT NULL,   -- PIN de coação silenciosa (ex: 9999)
    protective_measure_number VARCHAR(80),   -- Número de processo de Medida Protetiva (se houver)
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Contatos de Emergência (Até 5 contatos de confiança por usuária)
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    relationship VARCHAR(60) NOT NULL,
    phone VARCHAR(25) NOT NULL,
    telegram_chat_id VARCHAR(60),
    email VARCHAR(150),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Ocorrências de Pânico (Incidents)
CREATE TYPE incident_status AS ENUM ('ACTIVE', 'UNDER_DURESS', 'RESOLVED');

CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    protocol_code VARCHAR(30) UNIQUE NOT NULL, -- Ex: COPOM-2026-8841
    user_id UUID NOT NULL REFERENCES users(id),
    status incident_status DEFAULT 'ACTIVE',
    triggered_offline BOOLEAN DEFAULT FALSE,
    public_agency_notified BOOLEAN DEFAULT FALSE,
    started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMPTZ
);

-- 5. Logs Geoespaciais de Localização (Suporta sincronização em lote offline)
CREATE TABLE IF NOT EXISTS location_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    geom GEOMETRY(Point, 4326) NOT NULL, -- Ponto espacial SRID 4326 (WGS 84)
    accuracy_meters DOUBLE PRECISION,
    captured_offline BOOLEAN DEFAULT FALSE,
    captured_at TIMESTAMPTZ NOT NULL,    -- Momento exato em que o GPS leu no celular
    synced_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP -- Momento em que chegou ao servidor
);

-- Índice espacial GIST para buscas rápidas de viaturas/delegacias próximas no PostGIS
CREATE INDEX IF NOT EXISTS idx_location_logs_geom ON location_logs USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_location_logs_incident ON location_logs (incident_id, captured_at DESC);

-- 6. Evidências de Áudio (Caixa-Preta Jurídica)
CREATE TABLE IF NOT EXISTS audio_evidences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    storage_url TEXT NOT NULL,
    sha256_checksum VARCHAR(64) NOT NULL, -- Garante integridade jurídica da prova
    duration_seconds INTEGER NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Exemplo de Query PostGIS: Buscar os últimos pontos da trilha de uma ocorrência
-- SELECT latitude, longitude, captured_offline, ST_AsGeoJSON(geom)
-- FROM location_logs WHERE incident_id = '...' ORDER BY captured_at ASC;
