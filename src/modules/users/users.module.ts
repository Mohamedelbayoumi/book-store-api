import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { JwtModule } from '@nestjs/jwt'

import { User, UserSchema } from './users.schema'
import { UserService } from './users.services'
import { jwtModuleAsyncOptions } from 'src/common/configs/jwt.config'
import { Usercontroller } from './users.controllers'

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.registerAsync(jwtModuleAsyncOptions)
    ],
    controllers: [Usercontroller],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule { }