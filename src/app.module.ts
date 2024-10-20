import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

import { mongooseModuleAsyncOptions } from './common/configs/mongoose.config'
import { AuthorModule } from './modules/authors/authors.module'
import { BookModule } from './modules/books/books.module'
import { AuthModule } from './modules/auth/auth.module'
import { CartModule } from './modules/cart/cart.module'
import { OrdersModule } from './modules/orders/orders.module'
import { PaymentModule } from './modules/payment/payment.module'
import { UserModule } from './modules/users/users.module'

@Module({
  imports: [
    MongooseModule.forRootAsync(mongooseModuleAsyncOptions),
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '/public/books_images'),
      serveRoot: '/public/books_images'
    }),
    AuthorModule,
    BookModule,
    AuthModule,
    CartModule,
    OrdersModule,
    PaymentModule,
    UserModule
  ]
})
export class AppModule { }
