import { Module } from '@nestjs/common';

import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [ProjectModule],
  providers: [ProjectService],
  controllers: [ProjectController],
})
export class ProjectModule {}
