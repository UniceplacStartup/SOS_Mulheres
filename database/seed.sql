-- ==============================================================================
-- SOS MULHERES - SEED INICIAL DE DADOS PARA AMBIENTE DE HOMOLOGAÇÃO / DEMO
-- ==============================================================================

-- 1. Insere Usuária Padrão com Medida Protetiva (Maria da Silva)
-- PIN Real: 1234 | PIN de Coação Silenciosa: 9999
INSERT INTO users (id, full_name, cpf, email, password_hash, real_pin_hash, duress_pin_hash, protective_measure_number)
VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'Maria da Silva',
    '412.889.100-22',
    'maria.silva@email.com',
    '12345678',
    '1234',
    '9999',
    'MP-2026-991'
)
ON CONFLICT (cpf) DO NOTHING;

-- 2. Insere Contatos de Confiança Vinculados
INSERT INTO emergency_contacts (id, user_id, name, relationship, phone, email)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Ana (Irmã)', 'Irmã', '(11) 98765-4321', 'ana.irma@email.com'),
    ('c2222222-2222-2222-2222-222222222222', 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Delegacia 5ª DP', 'Autoridade Policial', '(11) 3333-4444', '5dp.mulher@policia.sp.gov.br')
ON CONFLICT DO NOTHING;

-- 3. Exemplo de Ocorrência com Ponto Geoespacial Inicial
INSERT INTO incidents (id, protocol_code, user_id, status, triggered_offline, public_agency_notified)
VALUES (
    'i9999999-9999-9999-9999-999999999999',
    'COPOM-2026-8841',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'ACTIVE',
    FALSE,
    TRUE
)
ON CONFLICT (protocol_code) DO NOTHING;

-- 4. Ponto Geoespacial na Trilha (Centro de São Paulo / Av. Paulista)
INSERT INTO location_logs (incident_id, latitude, longitude, geom, accuracy_meters, captured_offline, captured_at)
VALUES (
    'i9999999-9999-9999-9999-999999999999',
    -23.55052,
    -46.633308,
    ST_SetSRID(ST_MakePoint(-46.633308, -23.55052), 4326),
    8.0,
    FALSE,
    NOW() - INTERVAL '5 minutes'
)
ON CONFLICT DO NOTHING;
