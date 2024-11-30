import { ApiProperty } from '@nestjs/swagger'

export class UploadImageDto {

    @ApiProperty({ type: 'string', format: 'binary' })
    readonly bookCover: any
}