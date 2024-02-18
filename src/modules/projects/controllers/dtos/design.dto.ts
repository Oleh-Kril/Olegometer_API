import {Contains, IsString, MaxLength} from "class-validator"
import {AutoMap} from "@automapper/classes"
import {PartialType} from "@nestjs/mapped-types"

export class CreateDesignDto {
    @AutoMap()
    @IsString()
    @MaxLength(200)
    @Contains('node-id')
    designUrl: string;

    @AutoMap()
    @IsString()
    @MaxLength(100)
    name: string;
}

export class UpdateDesignDto extends PartialType(CreateDesignDto) {}
