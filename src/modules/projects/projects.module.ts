import { Module } from '@nestjs/common';
import { ProjectsController } from './controllers/projects.controller';
import { ProjectsService } from './services/projects.service';
import {ProjectsRepository} from "./repositories/projects.repository";
import {ProjectProfile} from "./controllers/mapper/projectProfile"
import {DATA_BASE_CONFIGURATION} from "../../configuration"
import {MongooseModule} from "@nestjs/mongoose"
import {Project, ProjectSchema} from "./models/project.model"
import {RenderingService} from "../rendering/services/rendering.service"
import {IntegrationService} from "../integration/services/integration.service"
import {FileStorageService} from "../file-storage/services/file-storage.service"
import {HttpModule} from "@nestjs/axios"

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
    ]),
    MongooseModule.forRoot(DATA_BASE_CONFIGURATION.mongoConnectionString),
    HttpModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, RenderingService, IntegrationService, FileStorageService, ProjectsRepository, ProjectProfile]
})
export class ProjectsModule {}
