import { IsNumber, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateAuthorDto {

    @ApiProperty({ example: 'lenardo dafinshi' })
    @IsString()
    readonly name: string

    @ApiProperty({ example: 44 })
    @IsNumber()
    readonly age: number

    @ApiProperty({ example: 'a very famous author that write many books' })
    @IsString()
    readonly description: string

    @ApiProperty({ example: 'egyption' })
    @IsString()
    readonly nationality: string

}