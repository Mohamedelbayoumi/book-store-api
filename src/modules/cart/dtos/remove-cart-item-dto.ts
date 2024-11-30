import { IsMongoId } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RemoveCartItemDto {

    @ApiProperty({ example: '670125e7fc3915a917395aee' })
    @IsMongoId()
    readonly book: string
}