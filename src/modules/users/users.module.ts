import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { JwtModule } from '@nestjs/jwt'

import { User, UserSchema } from './users.schema'
import { UserService } from './users.services'
import { jwtModuleAsyncOptions } from 'src/common/configs/jwt.config'
import { Usercontroller } from './users.controllers'
import { OrdersModule } from '../orders/orders.module'
import { CartModule } from '../cart/cart.module'

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        JwtModule.registerAsync(jwtModuleAsyncOptions),
        OrdersModule,
        CartModule
    ],
    controllers: [Usercontroller],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule { }