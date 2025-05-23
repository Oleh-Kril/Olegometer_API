import {Prop, Schema} from "@nestjs/mongoose"
import {AutoMap} from "@automapper/classes"
import {InsightsType} from "./comparison-result"

@Schema()
export class Insights {
    @AutoMap()
    message: string;

    @Prop({ required: true })
    type: InsightsType;

    @AutoMap()
    absoluteDiffWidth: string;

    @AutoMap()
    width_diff_sign: string;

    @AutoMap()
    height_diff_sign: string;

    @AutoMap()
    absoluteDiffHeight: string;

    @AutoMap()
    diffWidthInPercents: string;

    @AutoMap()
    diffHeightInPercents: string;
}
