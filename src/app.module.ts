import { Module } from '@nestjs/common';

import {classes} from "@automapper/classes"
import {AutomapperModule} from "@automapper/nestjs"
import {ProjectsModule} from "./modules/projects/projects.module"

@Module({
  imports: [
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    ProjectsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
