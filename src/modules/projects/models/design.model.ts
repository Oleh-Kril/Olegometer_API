import {DynamicElement} from "./dynamic-element.model"
import {Prop, Schema} from "@nestjs/mongoose"
import {AutoMap} from "@automapper/classes"

@Schema()
export class Design {
    @AutoMap()
    @Prop({ required: true })
    width: number;

    @AutoMap()
    @Prop({ required: true })
    designUrl: string;

    @AutoMap()
    @Prop({ required: true, type: Object })
    dynamicElements: Record<string, DynamicElement>;

    @AutoMap()
    designSnapshotUrl: string;

    @AutoMap()
    websiteSnapshotUrl: string;

    @AutoMap()
    designSnapshotLastUpdated: string;

    @AutoMap()
    websiteSnapshotLastUpdated: string;
}

