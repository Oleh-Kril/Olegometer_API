import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.model';
import { MongoGenericRepository } from '../../../core/abstracts/mongo-generic-repository';

@Injectable()
export class UsersRepository implements OnApplicationBootstrap {
  repository: MongoGenericRepository<UserDocument>;

  constructor(
    @InjectModel(User.name) private userRepository: Model<UserDocument>,
  ) {}

  onApplicationBootstrap() {
    this.repository = new MongoGenericRepository<UserDocument>(this.userRepository);
  }

  async findByUsername(username: string): Promise<UserDocument | null> {
    return this.userRepository.findOne({ username }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userRepository.findById(id).exec();
  }
} 