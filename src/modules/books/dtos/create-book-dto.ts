import { IsEnum, IsISO8601, IsNumber, IsOptional, IsString } from 'class-validator'
import { Transform } from 'class-transformer'

import { Category } from '../enums/category.enum'

export class CreateBookDto {

    @IsString()
    readonly name: string

    @IsString()
    readonly description: string

    @IsEnum(Category)
    readonly category: Category

    @IsISO8601()
    readonly dateOfAuthorship: Date

    @IsOptional()
    @IsNumber()
    readonly copiesInStock?: number

    @IsNumber()
    @Transform(({ value }) => +value)
    readonly price: number

    @IsString()
    readonly authorName: string
}