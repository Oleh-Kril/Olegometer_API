import {AutomapperProfile, InjectMapper} from '@automapper/nestjs'
import type { Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import {createMap, forMember, mapFrom} from "@automapper/core"
import {CreateProjectDto} from "../dtos/project.dto"
import {Project} from "../../models/project.model"
import {ProjectResponseDto} from "../dtos/projectResponse.dto"
import {CreateDesignDto} from "../dtos/design.dto"
import {Design} from "../../models/design.model"

@Injectable()
export class ProjectProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper) => {
            createMap(
                mapper,
                CreateProjectDto,
                Project,
                forMember(
                    (destination) => destination.pages,
                    mapFrom(() => ({})),
                ),
                forMember(
                    (destination) => destination.author,
                    mapFrom(() => "mayorford777@gmail.com"),
                )
            )

            createMap(
                mapper,
                Project,
                ProjectResponseDto,
                forMember(
                    (destination) => destination.pages,
                    mapFrom((source) => source.pages),
                ),
            )

            createMap(
                mapper,
                CreateDesignDto,
                Design,
                forMember(
                    (destination) => destination.dynamicElements,
                    mapFrom(() => ({})),
                ),
            )
        };
    }
}
