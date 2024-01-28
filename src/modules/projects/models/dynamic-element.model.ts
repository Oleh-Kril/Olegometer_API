import {Prop, Schema} from "@nestjs/mongoose"
import {AutoMap} from "@automapper/classes"

@Schema()
class Action {
    @AutoMap()
    @Prop({ required: true })
    type: string;

    @AutoMap()
    @Prop({ required: true })
    element: Record<string, string>
}

@Schema()
export class DynamicElement {
    @AutoMap()
    @Prop({ required: true })
    actions: Action[];

    @AutoMap()
    @Prop({ required: true })
    designUrl: string;

    @AutoMap()
    @Prop({ required: true, type: Object })
    elementToCapture: Record<string, string>;
}
