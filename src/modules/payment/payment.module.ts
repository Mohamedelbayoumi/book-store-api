import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config'

import { StripeModule } from '../third party modules/stripe/stripe.module'
import { PaymentServices } from './payment.services'
import { PaymentController } from './payment.controllers'
import { CartModule } from '../cart/cart.module'
import { BookModule } from '../books/books.module'
import { jwtModuleAsyncOptions } from 'src/common/configs/jwt.config'
import { OrdersModule } from '../orders/orders.module'

@Module({
    imports: [
        StripeModule.forRootAsync(),
        CartModule,
        BookModule,
        OrdersModule,
        JwtModule.registerAsync(jwtModuleAsyncOptions),
        ConfigModule.forRoot()
    ],
    providers: [PaymentServices],
    controllers: [PaymentController]
})
export class PaymentModule { }