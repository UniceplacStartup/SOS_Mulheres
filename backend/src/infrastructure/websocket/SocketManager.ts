import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { env } from '../../config/env';

export class SocketManager {
  private static instance: SocketManager;
  private io: SocketIOServer | null = null;

  public static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  public initialize(httpServer: HttpServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: env.CORS_ORIGIN,
        methods: ['GET', 'POST'],
      },
    });

    this.io.on('connection', (socket: Socket) => {
      console.log(`🔌 [Socket.io] Novo cliente conectado: ${socket.id}`);

      socket.on('join:copom', () => {
        socket.join('copom_monitors');
        console.log(`🚓 [Socket.io] Cliente ${socket.id} entrou na sala do COPOM 190`);
      });

      socket.on('join:incident', (incidentId: string) => {
        socket.join(`incident:${incidentId}`);
      });

      socket.on('disconnect', () => {
        console.log(`🔌 [Socket.io] Cliente desconectado: ${socket.id}`);
      });
    });

    console.log('⚡ [Socket.io] Servidor WebSocket inicializado');
  }

  public broadcastToCopom(event: string, data: any) {
    if (this.io) {
      this.io.to('copom_monitors').emit(event, data);
      this.io.emit(event, data); // Fallback para todos os clientes da interface
    }
  }

  public broadcastToIncident(incidentId: string, event: string, data: any) {
    if (this.io) {
      this.io.to(`incident:${incidentId}`).emit(event, data);
    }
  }

  public broadcastNotificationLog(log: { channel: string; recipient: string; msg: string; time?: string }) {
    if (this.io) {
      this.io.emit('copom:log', {
        ...log,
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        time: log.time || new Date().toLocaleTimeString('pt-BR'),
      });
    }
  }
}

export const socketManager = SocketManager.getInstance();
