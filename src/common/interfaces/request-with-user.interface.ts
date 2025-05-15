import { Request } from 'express';

export interface UserPayload {
  userId?: string; // Optional if you decided to remove it from payload earlier
  username: string;
}

export interface RequestWithUser extends Request {
  user: UserPayload;
} 