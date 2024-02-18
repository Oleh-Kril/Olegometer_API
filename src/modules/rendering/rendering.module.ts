import { Module } from '@nestjs/common';
import {RenderingService} from "./services/rendering.service"

@Module({
    providers: [RenderingService],
    exports: [RenderingService],
})
export class RenderingModule {}
