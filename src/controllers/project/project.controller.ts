import { Body, Controller, Get, Param, Put, Delete } from '@nestjs/common';

@Controller()
export class ProjectController {

  @Get('project/:id')
  public async getProject(@Param('id') id: string) {

  }

  @Delete('project/:id')
  public async deleteNews(@Param('id') id: string) {

  }
}
