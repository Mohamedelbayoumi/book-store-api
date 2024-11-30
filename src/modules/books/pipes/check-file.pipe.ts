import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common'

export class CheckFileValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (!value) {
            throw new BadRequestException('book image is missing')
        }
    }
}