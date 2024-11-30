import { IsEnum, IsIn, IsNumber, IsOptional, IsString } from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'

import { Category } from '../enums/category.enum'
import { PriceOrder } from '../enums/price-order.enum'

export class ListQueryParams {

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @IsNumber()
    readonly page?: number

    @ApiPropertyOptional({ enum: Category })
    @IsOptional()
    @IsEnum(Category)
    readonly category?: Category

    @ApiPropertyOptional({ enum: ['true', 'false'] })
    @IsOptional()
    @IsIn(['true', 'false'])
    @Transform(({ value }) => value === 'true')
    readonly allow_borrow?: boolean

    @ApiPropertyOptional({ enum: PriceOrder })
    @IsOptional()
    @IsEnum(PriceOrder)
    readonly price_order?: PriceOrder

    @ApiPropertyOptional({ example: 'data design' })
    @IsOptional()
    @IsString()
    readonly search_query: string
}