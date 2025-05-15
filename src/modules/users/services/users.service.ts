import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dtos/user.dto';
import { User } from '../models/user.model';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<Omit<User, 'passwordHash'>> {
    const { username, password } = createUserDto;

    const existingUser = await this.usersRepository.findByUsername(username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = await this.usersRepository.repository.create({ username, passwordHash } as User);
    
    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findByUsername(username);
  }

  async validatePassword(password: string, passwordHash: string): Promise<boolean> {
    if (!password || !passwordHash) return false;
    return bcrypt.compare(password, passwordHash);
  }
} 