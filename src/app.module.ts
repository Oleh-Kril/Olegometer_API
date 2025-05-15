import { Module } from '@nestjs/common';
import { classes } from "@automapper/classes"
import {AutomapperModule} from "@automapper/nestjs"
import {ProjectsModule} from "./modules/projects/projects.module"
import {FileStorageModule} from "./modules/file-storage/file-storage.module"
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    ProjectsModule,
    FileStorageModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
