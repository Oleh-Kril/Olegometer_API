import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose"
import {Page} from "./page.model"
import {MongoBase} from "./mongo-base.model"
import {AutoMap} from "@automapper/classes"

export type ProjectDocument = Project & Document;

@Schema({ minimize: false })
export class Project extends MongoBase{
    @AutoMap()
    @Prop({ required: true, unique: true })
    name: string;

    @AutoMap()
    @Prop({ required: true })
    author: string;

    @AutoMap()
    @Prop({ required: true })
    domainUrl: string;

    @AutoMap()
    @Prop({ required: true })
    figmaToken: string;

    @AutoMap()
    @Prop({ required: true, type: Object })
    pages: Record<string, Page>;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

