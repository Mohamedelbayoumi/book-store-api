import { IsNumber, IsString } from 'class-validator'

export class CreateAuthorDto {

    @IsString()
    readonly name: string

    @IsNumber()
    readonly age: number

    @IsString()
    readonly description: string

    @IsString()
    readonly nationality: string

}