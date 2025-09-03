import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: true, namespace: '/notifications' })
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly jwtService: JwtService) {}

  handleConnection(client: Socket) {
    try {
      const rawAuth = client.handshake.auth?.token as string | undefined;
      const rawHeader = (client.handshake.headers?.authorization as string | undefined) ?? '';
      const tokenFromHeader = rawHeader.startsWith('Bearer ') ? rawHeader.slice(7) : undefined;
      const token = rawAuth || tokenFromHeader;

      if (!token) {
        client.disconnect(true);
        return;
      }

      const payload: any = this.jwtService.verify(token);
      const userId = payload?.sub ?? payload?.id;
      if (!userId) {
        client.disconnect(true);
        return;
      }

      const room = `user:${userId}`;
      client.join(room);
      client.emit('connected', { room });
    } catch {
      client.disconnect(true);
    }
  }

  handleDisconnect(_client: Socket) {
    // Limpieza opcional
  }

  notifyUser(userId: number, payload: any) {
    this.server.to(`user:${userId}`).emit('notification', payload);
  }

  notifyMany(userIds: number[], payload: any) {
    const rooms = userIds.map((id) => `user:${id}`);
    this.server.to(rooms).emit('notification', payload);
  }

  // Nuevo: emitir contador actualizado de no leídas
  sendUnreadCount(userId: number, count: number) {
    this.server.to(`user:${userId}`).emit('notifications:count', { count });
  }
}