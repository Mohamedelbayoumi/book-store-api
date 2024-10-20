import { IsBoolean, IsEnum, IsISO8601, IsNumber, IsString } from 'class-validator'

import { Category } from '../enums/category.enum'

export class UpdateBookDto {

    @IsString()
    readonly name: string

    @IsString()
    readonly description: string

    @IsEnum(Category)
    readonly category: Category

    @IsISO8601()
    readonly dateOfAuthorship: Date

    @IsNumber()
    readonly copiesInStock: number

    @IsNumber()
    readonly price: number

    @IsString()
    readonly authorName: string

    @IsBoolean()
    readonly availableToBorrow: boolean
}