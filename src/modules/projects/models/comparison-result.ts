import {Prop, Schema} from "@nestjs/mongoose"
import {AutoMap} from "@automapper/classes"
import {Insights} from "./Insights.model"

export type InsightsType = 'missing' | 'size';

@Schema()
export class ComparisonResult {
    @AutoMap()
    @Prop({ required: true })
    designElementsCount: string;

    @AutoMap()
    @Prop({ required: true })
    websiteElementsCount: string;

    @AutoMap()
    @Prop({ required: true })
    totalTime: string;

    @AutoMap()
    @Prop({ required: true, type: Object })
    insights: Record<string, Insights[]>

    @AutoMap()
    pairsFound: string;
}
