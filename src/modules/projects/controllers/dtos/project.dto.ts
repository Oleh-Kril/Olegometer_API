import {IsObject, IsOptional, IsString, Length, Matches, MaxLength} from "class-validator"
import {AutoMap} from "@automapper/classes"

export class CreateProjectDto {
    @AutoMap()
    @IsString()
    @MaxLength(50)
    name: string;

    @AutoMap()
    @IsString()
    @MaxLength(50)
    @Matches("^https?://")
    domainUrl: string;

    @AutoMap()
    @IsString()
    @Length(45, 45)
    figmaToken: string;

    @AutoMap()
    @IsObject()
    @IsOptional()
    users: object;
}
