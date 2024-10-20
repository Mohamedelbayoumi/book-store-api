import { Module } from "@nestjs/common"
import { JwtModule } from '@nestjs/jwt'

import { jwtModuleAsyncOptions } from '../../common/configs/jwt.config'
import { UserModule } from '../users/users.module'
import { BcryptJsModule } from '../third party modules/bcryptjs/bcryptjs.module'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controllers'

@Module({
    imports: [
        JwtModule.registerAsync(jwtModuleAsyncOptions),
        UserModule,
        BcryptJsModule
    ],
    providers: [AuthService],
    controllers: [AuthController]
})
export class AuthModule { }