import {Injectable, NotImplementedException} from '@nestjs/common'
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import {Model} from "mongoose"
import {InjectModel} from "@nestjs/mongoose"

@Injectable()
export class ProjectService {
  constructor() {}

  public async getAllProjectsByUser(): Promise<AxiosResponse> {
    throw NotImplementedException
  }

}
