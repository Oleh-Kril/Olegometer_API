import {Contains, IsString, Length, Matches, MaxLength} from "class-validator";

export class CreateProjectDto {
    @IsString()
    @MaxLength(50)
    name: string;

    @IsString()
    @MaxLength(50)
    @Matches("^https?://")
    domainUrl: string;

    @IsString()
    @Length(45, 45)
    figmaToken: string;

    pages: Record<Url, Page>;
}
