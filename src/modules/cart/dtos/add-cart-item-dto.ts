import { IsNumber, IsMongoId } from 'class-validator'
import { Schema } from 'mongoose'

export class AddCartItemDto {

    @IsMongoId()
    readonly book: string

    @IsNumber()
    readonly quantity: number

}