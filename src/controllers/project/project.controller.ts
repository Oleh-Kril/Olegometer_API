import {Body, Controller, Get, Param, Put, Delete, Post, UseGuards, Req} from '@nestjs/common'
import {CreateProjectDto} from "./dtos/create-project.dto";

@Controller("projects")
export class ProjectController {
  @Post('/')
  public async createProject(@Body() project: CreateProjectDto) {

  }

  @Get('/:id')
  public async getProject(@Param('id') id: string) {

  }

  @Delete('/:id')
  public async deleteNews(@Param('id') id: string) {

  }
}
