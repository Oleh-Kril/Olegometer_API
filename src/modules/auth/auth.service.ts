import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, LoginUserDto } from '../users/dtos/user.dto';
import { UsersService } from '../users/services/users.service';
import { User } from '../users/models/user.model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && user.passwordHash && await this.usersService.validatePassword(pass, user.passwordHash)) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(userDto: LoginUserDto) {
    const user = await this.usersService.findOneByUsername(userDto.username);
    if (!user || !user.passwordHash) {
        throw new NotFoundException('User not found. Please check your username.');
    }

    const isValid = await this.usersService.validatePassword(userDto.password, user.passwordHash);
    if (!isValid) {
        throw new UnauthorizedException('Invalid credentials. Please check your password.');
    }

    const payload = { username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);

    const payload = { username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
      user: { username: user.username } 
    };
  }
} 