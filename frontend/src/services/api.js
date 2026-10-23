/**
 * Cliente HTTP da API SOS Mulheres
 * Conecta-se ao backend Node/TypeScript com tolerância a falhas e modo Sandbox.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

async function fetchWithTimeout(url, options = {}, timeoutMs = 4000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

export const SosApi = {
  /**
   * Dispara abertura de alarme de pânico
   */
  async triggerSos(payload) {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/incidents/sos`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('⚠️ [API Offline] triggerSos caindo no simulador local:', err.message);
      return {
        success: true,
        data: {
          id: `inc-${Date.now()}`,
          protocolCode: `COPOM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          status: 'ACTIVE',
        },
      };
    }
  },

  /**
   * Finaliza ocorrência com PIN (1234 Real ou 9999 Coação)
   */
  async terminateIncident(incidentId, pin) {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/incidents/${incidentId || 'active'}/terminate`, {
        method: 'POST',
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || 'Erro ao validar PIN');
      return data;
    } catch (err) {
      // Regra de coação em fallback local
      if (pin === '9999') {
        return {
          success: true,
          data: {
            uiAction: 'FAKE_SHUTDOWN',
            internalStatus: 'UNDER_DURESS',
            copomPriorityAlert: 'VÍTIMA SOB COAÇÃO FORÇADA A DESLIGAR O APP',
          },
        };
      }
      if (pin === '1234') {
        return {
          success: true,
          data: {
            uiAction: 'REAL_SHUTDOWN',
            internalStatus: 'RESOLVED',
          },
        };
      }
      throw new Error(err.message || 'PIN Inválido');
    }
  },

  /**
   * Envia ponto de GPS em tempo real para o PostGIS
   */
  async streamLocation(incidentId, point) {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/incidents/${incidentId || 'active'}/telemetry`, {
        method: 'POST',
        body: JSON.stringify(point),
      });
      return await res.json();
    } catch {
      return { success: false, offline: true };
    }
  },

  /**
   * Sincronização em lote de pontos salvos no IndexedDB
   */
  async syncOfflineBatch(incidentId, points) {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/incidents/${incidentId || 'active'}/sync-offline`, {
        method: 'POST',
        body: JSON.stringify({ points }),
      });
      return await res.json();
    } catch {
      return { success: false, fallbackCount: points.length };
    }
  },

  /**
   * Busca lista de ocorrências ativas para o COPOM
   */
  async getActiveIncidents() {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/incidents/active`);
      if (!res.ok) throw new Error('Falha');
      return await res.json();
    } catch {
      return { success: false, data: [] };
    }
  },

  /**
   * Verifica integridade do backend
   */
  async checkHealth() {
    try {
      const res = await fetchWithTimeout(`${API_BASE_URL}/health`, {}, 2000);
      return res.ok;
    } catch {
      return false;
    }
  },
};
