import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EscrowGateway } from './escrow.gateway';
import { EventsService } from './events.service';

@Global() // Make module globally accessible across application features
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fallback-secret-key-32-chars-long',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [EscrowGateway, EventsService],
  exports: [EventsService],
})
export class RealtimeModule {}