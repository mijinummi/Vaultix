import { 
  WebSocketGateway, 
  WebSocketServer, 
  OnGatewayConnection, 
  OnGatewayDisconnect, 
  SubscribeMessage, 
  MessageBody, 
  ConnectedSocket
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, Logger } from '@nestjs/common';
import { WsJwtAuthGuard } from './ws-jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_ORIGIN || '*',
    credentials: true,
  },
  namespace: '/',
})
export class EscrowGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(EscrowGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const authHeader = client.handshake.headers.authorization || client.handshake.auth?.token;
      if (!authHeader) {
        client.disconnect(true);
        return;
      }
      const token = authHeader.split(' ')[1] || authHeader;
      const payload = await this.jwtService.verifyAsync(token);
      
      client['user'] = { id: payload.sub, role: payload.role };
      
      // Auto-join private personal user notification room target
      await client.join(`user:${payload.sub}`);
      
      // Route administrators to specialized monitoring lanes
      if (payload.role === 'ADMIN') {
        await client.join('admin');
      }

      this.logger.log(`Client ${client.id} authenticated and assigned tracking room for User: ${payload.sub}`);
    } catch (err) {
      this.logger.warn(`Unauthenticated connection dropped: ${client.id}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client connection closed: ${client.id}`);
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('subscribe:escrow')
  async handleEscrowSubscribe(
    @MessageBody('escrowId') escrowId: string,
    @ConnectedSocket() client: Socket
  ) {
    if (!escrowId) return { event: 'error', data: 'Missing target escrow identifier.' };
    await client.join(`escrow:${escrowId}`);
    this.logger.log(`Client ${client.id} subscribed to stream updates for Escrow Room: ${escrowId}`);
    return { event: 'subscribed', room: `escrow:${escrowId}` };
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('unsubscribe:escrow')
  async handleEscrowUnsubscribe(
    @MessageBody('escrowId') escrowId: string,
    @ConnectedSocket() client: Socket
  ) {
    if (!escrowId) return { event: 'error', data: 'Missing target escrow identifier.' };
    await client.leave(`escrow:${escrowId}`);
    return { event: 'unsubscribed', room: `escrow:${escrowId}` };
  }
}