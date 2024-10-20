import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { JwtModule } from '@nestjs/jwt'

import { Book, BookSchema } from './books.schema'
import { BookController } from './books.controllers'
import { BookService } from './books.services'
import { AuthorModule } from '../authors/authors.module'
import { jwtModuleAsyncOptions } from '../../common/configs/jwt.config'

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
        forwardRef(() => AuthorModule),
        JwtModule.registerAsync(jwtModuleAsyncOptions),
    ],
    providers: [BookService],
    controllers: [BookController],
    exports: [MongooseModule, BookService]
})
export class BookModule { }