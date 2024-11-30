import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Min, Max } from 'class-validator'

export class DiscountPercentageDto {

    @ApiProperty({ required: true })
    @IsInt()
    @Min(1)
    @Max(100)
    readonly discountPercentage: number
}