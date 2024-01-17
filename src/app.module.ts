import {
  Module,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProjectController } from './controllers/project/project.controller';
import {ProjectService} from "./controllers/project/project.service"
import {DatabaseModule} from "./shared/modules/database.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class AppModule{}
