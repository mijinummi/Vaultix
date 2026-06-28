import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtAuthGuard.name);

  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient<Socket>();
      const authHeader = client.handshake.headers.authorization || client.handshake.auth?.token;

      if (!authHeader) {
        this.logger.warn(`Handshake rejected: Missing authorization credentials for client ${client.id}`);
        throw new WsException('Unauthorized connection dropped.');
      }

      const token = authHeader.split(' ')[1] || authHeader;
      const payload = await this.jwtService.verifyAsync(token);
      
      // Attach tracking user entity identifiers onto socket runtime state
      client['user'] = {
        id: payload.sub,
        role: payload.role,
      };

      return true;
    } catch (err) {
      this.logger.error('WebSocket JWT Verification exception caught:', err);
      throw new WsException('Authentication failed. Connection terminated.');
    }
  }
}