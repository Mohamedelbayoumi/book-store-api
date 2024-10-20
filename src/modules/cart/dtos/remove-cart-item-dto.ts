import { IsMongoId } from 'class-validator'
import { Schema } from 'mongoose'

export class RemoveCartItemDto {

    @IsMongoId()
    readonly book: string
}