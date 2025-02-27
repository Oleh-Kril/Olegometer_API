import {Prop, Schema} from "@nestjs/mongoose"
import {Design} from "./design.model"
import {AutoMap} from "@automapper/classes"

@Schema()
export class Page {
    @AutoMap()
    @Prop({ required: true, type: Object})
    designs: Record<string, Design>;

    @AutoMap()
    @Prop({ required: false })
    avoidAuth: boolean;

    @AutoMap()
    @Prop({ required: false })
    authPage: boolean;
}
