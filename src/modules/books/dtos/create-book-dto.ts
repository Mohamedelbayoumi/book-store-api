import { IsEnum, IsISO8601, IsNumber, IsOptional, IsString } from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { Category } from '../enums/category.enum'
import { UploadImageDto } from './upload-image-dto'

export class CreateBookDto extends UploadImageDto {

    @ApiProperty({ example: 'data structures' })
    @IsString()
    readonly name: string

    @ApiProperty({ example: 'a book talks about to structure the data in an amazing way' })
    @IsString()
    readonly description: string

    @ApiProperty({ enum: Category })
    @IsEnum(Category)
    readonly category: Category

    @ApiProperty({ example: "2024-10-01T12:00:00Z" })
    @IsISO8601()
    readonly dateOfAuthorship: Date

    @ApiPropertyOptional({ example: 2 })
    @IsOptional()
    @IsNumber()
    readonly copiesInStock?: number

    @ApiProperty({ example: 439 })
    @IsNumber()
    @Transform(({ value }) => +value)
    readonly price: number

    @ApiProperty({ example: 'lenaorda dafinshi' })
    @IsString()
    readonly authorName: string
}