import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { JwtModule } from '@nestjs/jwt'

import { OrdersConrtrollers } from './orders.controllers'
import { OrdersServices } from './orders.services'
import { Order, OrderSchema } from './orders.schema'
import { jwtModuleAsyncOptions } from '../../common/configs/jwt.config'


@Module({
    imports: [
        MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
        JwtModule.registerAsync(jwtModuleAsyncOptions)
    ],
    providers: [OrdersServices],
    controllers: [OrdersConrtrollers],
    exports: [OrdersServices]
})
export class OrdersModule { }