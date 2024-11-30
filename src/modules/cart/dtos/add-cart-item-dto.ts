import { IsNumber, IsMongoId } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class AddCartItemDto {

    @ApiProperty({ example: 'data structure' })
    @IsMongoId()
    readonly book: string

    @ApiProperty({ example: 4 })
    @IsNumber()
    readonly quantity: number

}