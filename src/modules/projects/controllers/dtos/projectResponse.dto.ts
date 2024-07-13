import {AutoMap} from "@automapper/classes"
import {Page} from "../../models/page.model"

export class ProjectResponseDto{
    @AutoMap()
    id: string;

    @AutoMap()
    name: string;

    @AutoMap()
    domainUrl: string;

    @AutoMap()
    figmaToken: string;

    @AutoMap()
    pages: Record<string, Page>;
}
