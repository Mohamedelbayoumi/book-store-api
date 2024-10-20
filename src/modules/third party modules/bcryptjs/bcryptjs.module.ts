import { Module } from '@nestjs/common'

import { BcryptJsService } from './bcryptjs.services'

@Module({
    providers: [BcryptJsService],
    exports: [BcryptJsService]
})
export class BcryptJsModule { }