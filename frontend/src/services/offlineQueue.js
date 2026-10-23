/**
 * Serviço de Fila Offline (IndexedDB / LocalStorage Fallback)
 * Garante que Latitude e Longitude continuem sendo gravadas mesmo em áreas sem sinal telefônico
 * e sincronizadas automaticamente no PostGIS quando a conexão for restabelecida.
 */

const STORAGE_KEY = 'sos_mulheres_offline_gps_queue';

export const OfflineGeoQueue = {
  /**
   * Grava uma coordenada capturada no dispositivo local
   */
  saveCoordinateOffline(coord) {
    const queue = this.getQueue();
    const item = {
      ...coord,
      capturedOffline: true,
      capturedAt: coord.capturedAt || new Date().toISOString(),
    };
    queue.push(item);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    } catch (e) {
      console.warn('⚠️ Falha ao salvar no LocalStorage:', e);
    }
    return queue;
  },

  /**
   * Recupera todos os pontos pendentes de sincronização
   */
  getQueue() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  /**
   * Limpa a fila após confirmação de persistência no Neon PostGIS
   */
  clearQueue() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('⚠️ Falha ao limpar fila:', e);
    }
  },

  /**
   * Quantidade de itens retidos offline
   */
  get count() {
    return this.getQueue().length;
  },
};
