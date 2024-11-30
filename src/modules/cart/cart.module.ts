import { Module } from "@nestjs/common"
import { MongooseModule } from '@nestjs/mongoose'
import { JwtModule } from '@nestjs/jwt'

import { Cart, CartSchema } from './cart.schema'
import { CartServices } from './cart.services'
import { CartController } from './cart.controllers'
import { jwtModuleAsyncOptions } from '../../common/configs/jwt.config'
import { BookModule } from '../books/books.module'


@Module({
    imports: [
        MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
        JwtModule.registerAsync(jwtModuleAsyncOptions),
        BookModule
    ],
    providers: [CartServices],
    controllers: [CartController],
    exports: [CartServices]
})
export class CartModule { }