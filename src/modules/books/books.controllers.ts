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
    Patch,
    Request,
    BadRequestException,
    ParseFilePipe
} from '@nestjs/common'
import {
    ApiTags,
    ApiOkResponse,
    ApiCreatedResponse,
    ApiConsumes,
    ApiBody,
    ApiResponse,
    ApiBearerAuth,
    ApiUnauthorizedResponse,
    ApiNoContentResponse,
    ApiBadRequestResponse,
    ApiForbiddenResponse
} from '@nestjs/swagger'
import { Schema } from 'mongoose'
import { FileInterceptor } from '@nestjs/platform-express'
import * as express from 'express'

import { BookService } from './books.services'
import { CreateBookDto } from './dtos/create-book-dto'
import { UpdateBookDto } from './dtos/update-book-dto'
import { ListQueryParams } from './dtos/list-query-params'
import { RolePermission } from '../auth/decorators/roles.decorator'
import { Role } from '../auth/enums/roles.enum'
import { AuthGuard } from '../auth/guards/auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { storage, fileFilter } from '../../common/configs/multer.config'
import { Book } from './books.schema'
import { DiscountPercentageDto } from './dtos/discount-percentage-dto'
import { CheckFileValidationPipe } from './pipes/check-file.pipe'

@ApiTags('Books')
@Controller('/books')
export class BookController {
    constructor(private bookService: BookService) { }

    @Get()
    @ApiOkResponse({
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    name: { type: 'string' },
                    price: { type: 'integer' }
                }
            }
        }
    })

    async getBooks(@Query(new ValidationPipe({ transform: true })) query: ListQueryParams) {

        const books = await this.bookService.findBooks(query)

        return { books }
    }



    @Get('/:id')
    @ApiOkResponse({
        type: Book
    })

    async getBook(@Param('id') id: string, @Request() req: express.Request) {
        const book = await this.bookService.findBookById(id)
        book.book_cover = `${req.baseUrl}/public/books_images/${book.book_cover}`
        return { book }
    }



    @Post()
    @RolePermission(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @UseInterceptors(FileInterceptor('bookCover', {
        storage: storage,
        fileFilter: fileFilter
    }))
    @ApiConsumes('multipart/form-data')
    @ApiBearerAuth()
    @ApiBody({
        type: CreateBookDto
    })
    @ApiCreatedResponse({ description: "Book added Successfully" })
    @ApiResponse({ status: 415, description: 'only png & jpeg mimetypes are allowed' })
    @ApiUnauthorizedResponse({ description: 'authentication error' })
    @ApiBadRequestResponse({ description: 'validation error' })
    @ApiForbiddenResponse({ description: 'authorization error' })

    async addBook(
        @Body(new ValidationPipe({ transform: true })) createBookDto: CreateBookDto,
        @UploadedFile(CheckFileValidationPipe) file: Express.Multer.File
    ) {
        await this.bookService.createBook(createBookDto, file.filename)
        return { message: "Book added Successfully" }
    }



    @Put('/:id')
    @RolePermission(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @UseInterceptors(FileInterceptor('book_cover', {
        storage: storage,
        fileFilter: fileFilter
    }))
    @ApiConsumes('multipart/form-data')
    @ApiBearerAuth()
    @ApiBody({
        type: UpdateBookDto
    })
    @ApiOkResponse({ description: 'Book Updated Successfully' })
    @ApiResponse({ status: 415, description: 'only png & jpeg mimetypes are allowed' })
    @ApiUnauthorizedResponse({ description: 'authentication error' })
    @ApiBadRequestResponse({ description: 'validation error' })
    @ApiForbiddenResponse({ description: 'authorization error' })

    async updateBook(
        @Param('id') id: Schema.Types.ObjectId,
        @Body(new ValidationPipe({ transform: true })) updateBookDto: UpdateBookDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        const fileName = file ? file.filename : undefined
        await this.bookService.updateBook(id, updateBookDto, fileName)
        return { message: "Book Updated Successfully" }

    }



    @HttpCode(204)
    @Patch('/:id/discount_upserted')
    @RolePermission(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @ApiBearerAuth()
    @ApiNoContentResponse()
    @ApiUnauthorizedResponse({ description: 'authentication error' })
    @ApiBadRequestResponse({ description: 'authorization error' })

    async upesrtDiscount(@Param('id') id: string, @Body(ValidationPipe) discountPercentageDto: DiscountPercentageDto) {
        await this.bookService.upsertDiscountInBook(id, discountPercentageDto.discountPercentage)
        return
    }



    @HttpCode(204)
    @Patch('/:id/discount_removal')
    @RolePermission(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @ApiBearerAuth()
    @ApiNoContentResponse()
    @ApiUnauthorizedResponse({ description: 'authentication error' })
    @ApiBadRequestResponse({ description: 'authorization error' })

    async removeDiscount(@Param('id') id: string) {
        await this.bookService.removeDiscountFromBook(id)
        return
    }



    @HttpCode(204)
    @Delete('/:id')
    @RolePermission(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @ApiBearerAuth()
    @ApiNoContentResponse()
    @ApiUnauthorizedResponse({ description: 'authentication error' })
    @ApiBadRequestResponse({ description: 'authorization error' })

    async deleteBook(@Param() id: Schema.Types.ObjectId) {
        await this.bookService.deleteBook(id)
        return
    }

}