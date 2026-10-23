# SOS Mulheres — Plataforma PWA de Proteção e Monitoramento Integrado 190 (COPOM)

Plataforma corporativa de resposta a emergências e salvaguarda para mulheres sob risco de violência doméstica, em estrita conformidade com a **Lei Maria da Penha (Lei nº 11.340/2006)** e a **Cadeia de Custódia de Prova Digital (Art. 158-A do CPP / Lei Anticrime nº 13.964/2019)**.

---

## 🏛️ Arquitetura Empresarial (Clean Architecture)

```
sos-mulheres-project/
├── docker-compose.yml              # Orquestração de Containers (PostGIS + Backend + Frontend)
├── package.json                    # Monorepo Scripts (dev, build, start)
├── database/
│   ├── neon_postgis_schema.sql     # DDL com extensões UUID e PostGIS (SRID 4326)
│   └── seed.sql                    # Massa de dados de homologação (vítima Maria da Silva)
├── backend/                        # API Node.js + TypeScript (Clean Architecture)
│   ├── Dockerfile                  # Multi-stage production build
│   ├── tsconfig.json
│   ├── package.json
│   └── src/
│       ├── config/                 # Validação de Env (Zod) e Pool Neon Serverless
│       ├── core/                   # Entidades, Types e Exceções de Domínio
│       ├── application/            # Casos de Uso, DTOs e Regras de Negócio (SOS, Coação)
│       ├── adapters/               # SMS (Sandbox, TextBee, Twilio), CAD 190, Caixa-Preta Áudio
│       ├── infrastructure/         # Repositórios PostGIS, Fallback InMemory e WebSockets
│       ├── presentation/           # Controllers REST, Middlewares e Rotas Express
│       ├── app.ts                  # Configuração Express, CORS e Middlewares
│       └── server.ts               # Bootstrap HTTP + Socket.io e Graceful Shutdown
└── frontend/                       # PWA Mobile-First + Painel Tático COPOM (React + Vite)
    ├── Dockerfile                  # Multi-stage NGINX
    ├── tailwind.config.js          # Design System e cores oficiais SOS Mulheres
    ├── src/
        ├── context/                # Contexto Reativo Global (SosContext)
        ├── services/               # API Client com fallback e Fila GPS Offline (IndexedDB)
        └── components/
            ├── common/             # Barra Superior de Demonstração e Controles
            ├── mobile/             # iPhone Frame, Dynamic Island, Login, Home, SOS, Camuflagem
            ├── copom/              # Painel 190, Radar Tático, Trilha PostGIS, Terminal Sandbox
            └── modals/             # PIN Real vs Coação (9999), Ligação Falsa, Chatbot Rápido
```

---

## 🛡️ Protocolos de Segurança e Funcionalidades Críticas

1. **Código de Coação Silenciosa (Duress PIN — 9999)**:
   - Se o agressor render a vítima e exigir o cancelamento do alarme, a digitação do PIN `9999` aciona o **Falso Desligamento**: a tela do celular simula o encerramento do app, enquanto em segundo plano a Central 190 / COPOM recebe um **Alerta Vermelho Crítico Piscante** mantendo o rastreamento GPS e gravação de áudio ativos!
   - O encerramento real e definitivo é efetuado exclusivamente com o PIN autêntico `1234`.

2. **Modo Camuflagem (Calculadora Funcional)**:
   - Disfarça a interface como uma calculadora de sistema comum. Para destravá-la e voltar ao SOS, digite o código de segurança `911=`.

3. **Arquitetura Offline-First (Fila GPS Local)**:
   - Caso a vítima passe por regiões sem sinal telefônico, as coordenadas são enfileiradas com timestamp local no dispositivo e sincronizadas em lote no PostGIS assim que a rede retornar (*Background Sync*).

4. **Ligação Falsa com Áudio Dissuasivo**:
   - Simula chamada telefônica recebida do pai ("Oi filha, já estou aqui na esquina te vendo...") para desestimular abordagens suspeitas.

5. **Caixa-Preta de Áudio com Integridade Forense (SHA-256)**:
   - Gravação de áudio ambiente com geração de hash criptográfico para preservação da cadeia de custódia judicial da prova.

---

## 🚀 Como Executar o Projeto Localmente

### Opção 1: Execução com Scripts Rápidos

Na raiz da pasta `sos-mulheres-project`:

1. **Subir o Backend (Porta 3000)**:
   ```bash
   cd backend
   npm run dev
   ```
2. **Subir o Frontend (Porta 5173)** em outro terminal:
   ```bash
   cd frontend
   npm run dev
   ```
3. Acesse `http://localhost:5180` no seu navegador.

### Opção 2: Execução Total via Docker Compose

```bash
docker compose up -d
```
- Frontend: `http://localhost:8080`
- Backend API: `http://localhost:3000`
- PostGIS Local: `localhost:5432`

---

## ☁️ Deploy em Nuvem (Neon.tech + Render / Railway / Vercel)

1. **Banco Neon PostGIS**:
   - No console do [Neon.tech](https://neon.tech), execute os scripts em `database/neon_postgis_schema.sql` e `database/seed.sql`.
   - Copie a connection string fornecida pelo Neon e adicione à variável `DATABASE_URL` no `.env` do backend.
2. **Backend**:
   - Conecte o repositório ao Render, Railway ou Fly.io apontando para a pasta `backend/`.
3. **Frontend**:
   - Faça o deploy no Vercel, Netlify ou Cloudflare Pages apontando para a pasta `frontend/`, configurando `VITE_API_URL` com a URL do backend publicado.
