import {Schema} from "@nestjs/mongoose"
import {Types} from "mongoose"

@Schema()
export class MongoBase {
    _id: Types.ObjectId;
    __v: number;
}
