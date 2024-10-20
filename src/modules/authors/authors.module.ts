import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { JwtModule } from '@nestjs/jwt'


import { AuthorSchema, Author } from './authors.schema'
import { AuhtorController } from './authors.controllers'
import { AuthorService } from './authors.services'
import { BookModule } from '../books/books.module'
import { jwtModuleAsyncOptions } from 'src/common/configs/jwt.config'

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Author.name, schema: AuthorSchema }]),
        forwardRef(() => BookModule),
        JwtModule.registerAsync(jwtModuleAsyncOptions)
    ],
    providers: [AuthorService],
    controllers: [AuhtorController],
    exports: [AuthorService]
})
export class AuthorModule { }