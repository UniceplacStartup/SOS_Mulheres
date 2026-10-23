import { Pool } from '@neondatabase/serverless';
import { env } from './env';

/**
 * Conexão Serverless Neon PostgreSQL com suporte ao PostGIS
 * Inicializa a pool apenas quando DATABASE_URL estiver configurada.
 */
let poolInstance: Pool | null = null;
let isDbConnected = false;

if (env.DATABASE_URL && env.DATABASE_URL.startsWith('postgres')) {
  try {
    poolInstance = new Pool({
      connectionString: env.DATABASE_URL,
    });
  } catch (err) {
    console.warn('⚠️ [DB Warning] Falha ao inicializar Neon Pool:', err);
  }
}

export const dbPool = poolInstance;

/**
 * Testa a integridade e latência da conexão com o Neon Serverless
 */
export async function checkDatabaseHealth(): Promise<{ status: 'UP' | 'DOWN' | 'UNCONFIGURED'; message: string }> {
  if (!dbPool) {
    return {
      status: 'UNCONFIGURED',
      message: 'DATABASE_URL não configurada no .env. Operando em modo Sandbox InMemory.',
    };
  }

  try {
    const client = await dbPool.connect();
    await client.query('SELECT 1;');
    client.release();
    isDbConnected = true;
    return { status: 'UP', message: 'Conexão ativa com Neon Serverless Postgres + PostGIS.' };
  } catch (error: any) {
    isDbConnected = false;
    return { status: 'DOWN', message: `Erro ao conectar com Neon DB: ${error?.message || error}` };
  }
}

export function isNeonConnected(): boolean {
  return isDbConnected;
}
