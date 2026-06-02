import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Get client IP, handle proxy headers
    const forwardedFor = req.headers?.['x-forwarded-for'];
    if (typeof forwardedFor === 'string') {
      const firstIp = forwardedFor.split(',')[0]?.trim();
      if (firstIp) return firstIp;
    }
    return req.ip || req.connection?.remoteAddress || 'unknown-ip';
  }
}
