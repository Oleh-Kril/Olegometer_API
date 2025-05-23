import {Contains, IsBoolean, IsOptional, IsString, MaxLength} from "class-validator"
import {AutoMap} from "@automapper/classes"

export class CreatePageDto {
    @AutoMap()
    @IsString()
    @MaxLength(100)
    @Contains('/')
    pageUrl: string;

    @AutoMap()
    @IsBoolean()
    @IsOptional()
    avoidAuth: boolean;

    @AutoMap()
    @IsBoolean()
    @IsOptional()
    authPage: boolean;
}
