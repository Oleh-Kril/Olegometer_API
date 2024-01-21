import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {config} from "dotenv"
config()

@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGODB_URI),
    ],
    exports: [MongooseModule],
})
export class DatabaseModule {}
