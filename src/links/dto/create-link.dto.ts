import { IsNotEmpty, IsUrl, IsString } from "class-validator";

export class CreateLinkDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    @IsUrl()
    url: string;
}
