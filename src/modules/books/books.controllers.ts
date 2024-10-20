import {
    Controller,
    Get,
    Query,
    Param,
    Post,
    Put,
    Body,
    ValidationPipe,
    Delete,
    UseGuards,
    HttpCode,
    UseInterceptors,
    UploadedFile,
    Patch
} from '@nestjs/common'
import { Schema } from 'mongoose'
import { FileInterceptor } from '@nestjs/platform-express'
import { Express } from 'express'

import { BookService } from './books.services'
import { CreateBookDto } from './dtos/create-book-dto'
import { UpdateBookDto } from './dtos/update-book-dto'
import { ListQueryParams } from './dtos/list-query-params'
import { RolePermission } from '../auth/decorators/roles.decorator'
import { Role } from '../auth/enums/roles.enum'
import { AuthGuard } from '../auth/guards/auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { storage, fileFilter } from '../../common/configs/multer.config'


@Controller('/books')
export class BookController {
    constructor(private bookService: BookService) { }

    @Get()
    async getBooks(@Query(new ValidationPipe({ transform: true })) query: ListQueryParams) {

        const books = await this.bookService.findBooks(query)

        return { books }
    }

    @Get('/:id')
    async getBook(@Param('id') id: string) {
        const book = await this.bookService.findBookById(id)
        return { book }
    }

    @Post()
    @RolePermission(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @UseInterceptors(FileInterceptor('image', {
        storage: storage,
        fileFilter: fileFilter
    }))
    async addBook(
        @Body(new ValidationPipe({ transform: true })) createBookDto: CreateBookDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        await this.bookService.createBook(createBookDto, file.filename)
        return { message: "Book added Successfully" }
    }

    @Put('/:id')
    @RolePermission(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    async updateBook(
        @Param('id') id: Schema.Types.ObjectId,
        @Body(ValidationPipe) updateBookDto: UpdateBookDto
    ) {

        await this.bookService.updateBook(id, updateBookDto)
        return { message: "Book Updated Successfully" }

    }

    @HttpCode(204)
    @Patch('/:id/discount_upserted')
    @RolePermission(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    async upesrtDiscount(@Param('id') id: string, @Body() discountPercentage: number) {
        await this.bookService.upsertDiscountInBook(id, discountPercentage)
        return
    }

    @HttpCode(204)
    @Patch('/:id/discount_removal')
    @RolePermission(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    async removeDiscount(@Param('id') id: string) {
        await this.bookService.removeDiscountFromBook(id)
        return
    }

    @HttpCode(204)
    @Delete('/:id')
    @RolePermission(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    async deleteBook(@Param('id') id: Schema.Types.ObjectId) {
        await this.bookService.deleteBook(id)
        return
    }

}