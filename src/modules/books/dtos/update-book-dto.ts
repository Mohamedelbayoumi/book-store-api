import { IsBoolean, IsEnum, IsISO8601, IsNumber, IsString } from 'class-validator'
import { Transform } from 'class-transformer'

import { Category } from '../enums/category.enum'
import { UploadImageDto } from '../dtos/upload-image-dto'

export class UpdateBookDto extends UploadImageDto {

    @IsString()
    readonly name: string

    @IsString()
    readonly description: string

    @IsEnum(Category)
    readonly category: Category

    @IsISO8601()
    readonly dateOfAuthorship: Date

    @IsNumber()
    @Transform((value) => +value)
    readonly copiesInStock: number

    @IsNumber()
    @Transform((value) => +value)
    readonly price: number

    @IsString()
    readonly authorName: string

    @IsBoolean()
    readonly availableToBorrow: boolean
}