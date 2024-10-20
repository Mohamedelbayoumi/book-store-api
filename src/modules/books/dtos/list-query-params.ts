import { IsEnum, IsIn, IsNumber, IsOptional, IsString } from 'class-validator'
import { Transform } from 'class-transformer'

import { Category } from '../enums/category.enum'

export class ListQueryParams {

    @IsOptional()
    @IsNumber()
    readonly page?: number

    @IsOptional()
    @IsEnum(Category)
    readonly category?: Category

    @IsOptional()
    @IsString()
    readonly name?: string

    @IsOptional()
    @IsIn(['true', 'false'])
    @Transform(({ value }) => value === 'true')
    readonly allow_borrow?: boolean

    @IsOptional()
    @IsIn(['price', '-price'])
    readonly sortOrder?: "price" | "-price"
}