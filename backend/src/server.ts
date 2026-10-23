import http from 'http';
import { createApp } from './app';
import { env } from './config/env';
import { socketManager } from './infrastructure/websocket/SocketManager';
import { checkDatabaseHealth } from './config/db';

async function bootstrap() {
  const app = createApp();
  const server = http.createServer(app);

  // Inicializa a camada WebSocket para telemetria em tempo real
  socketManager.initialize(server);

  // Diagnóstico inicial do Banco Neon PostGIS
  const dbHealth = await checkDatabaseHealth();
  console.log(`📦 [Database Status]: ${dbHealth.status} - ${dbHealth.message}`);

  server.listen(env.PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚨 SOS Mulheres — Backend Clean Architecture`);
    console.log(`🚀 Servidor HTTP rodando na porta: http://localhost:${env.PORT}`);
    console.log(`🔌 WebSocket Gateway ativo em: ws://localhost:${env.PORT}`);
    console.log(`🛡️  Healthcheck: http://localhost:${env.PORT}/api/v1/health`);
    console.log(`📲 Gateway SMS: ${env.SMS_PROVIDER}`);
    console.log(`======================================================\n`);
  });

  // Tratamento de encerramento gracioso (Graceful Shutdown)
  const shutdown = () => {
    console.log('\n🛑 Encerrando servidor SOS Mulheres de forma graciosa...');
    server.close(() => {
      console.log('✅ Servidor HTTP finalizado.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

bootstrap().catch((err) => {
  console.error('❌ Falha crítica na inicialização do servidor:', err);
  process.exit(1);
});
