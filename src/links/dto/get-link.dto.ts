import {IsString, IsUUID } from "class-validator"
export class GetLinkDto {
    @IsString()
    @IsUUID()
    id: string
}