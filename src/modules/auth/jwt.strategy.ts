import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { UsersService } from '../users/services/users.service';
import { ConfigService } from '@nestjs/config';

const cookieExtractor = (req: Request): string | null => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['access_token'];
  } else {
  }
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: any) {
    if (!payload || !payload.username) {
      throw new UnauthorizedException('Invalid token payload.');
    }

    const user = await this.usersService.findOneByUsername(payload.username);

    if (!user) {
      throw new UnauthorizedException('User from token not found. Please log in again.');
    }

    return { username: user.username };
  }
} 