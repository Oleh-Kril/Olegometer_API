import { Module } from '@nestjs/common';
import { ProjectsController } from './controllers/projects.controller';
import { ProjectsService } from './services/projects.service';
import {ProjectsRepository} from "./repositories/projects.repository";
import {ProjectProfile} from "./controllers/mapper/projectProfile"
import {DATA_BASE_CONFIGURATION} from "../../configuration"
import {MongooseModule} from "@nestjs/mongoose"
import {Project, ProjectSchema} from "./models/project.model"

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
    ]),
    MongooseModule.forRoot(DATA_BASE_CONFIGURATION.mongoConnectionString),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsRepository, ProjectProfile]
})
export class ProjectsModule {}
