import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const result = super.canActivate(context);
    return result;
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      let errorMessage = 'Session expired or invalid. Please log in again.';
      if (info && info.name === 'TokenExpiredError') {
        errorMessage = 'Token has expired. Please log in again.';
      }
      if (info && info.name === 'JsonWebTokenError') {
        errorMessage = `Invalid token: ${info.message}. Please log in again.`;
      }
      throw err || new UnauthorizedException(errorMessage);
    }
    return user;
  }
} 