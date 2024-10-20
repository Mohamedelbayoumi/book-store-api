import { Controller, Get, Post, Body, ValidationPipe, Put, Delete, HttpCode, UseGuards, Param, Query } from '@nestjs/common'
import { Schema } from 'mongoose'

import { AuthorService } from './authors.services'
import { CreateAuthorDto } from './dtos/create-author-dto'
import { RolePermission } from '../auth/decorators/roles.decorator'
import { Role } from '../auth/enums/roles.enum'
import { AuthGuard } from '../auth/guards/auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { UpdateAuthorDto } from './dtos/update-author-dto'

@Controller('/authors')
export class AuhtorController {

    constructor(private auhtorService: AuthorService) { }

    @Get()
    async getAuthors(@Query('select') selectQuery: string | undefined) {

        const authors = await this.auhtorService.findAllAuthors(selectQuery)

        return { authors }
    }

    @Get('/:id')
    async getOneAuthor(@Param('id') id: Schema.Types.ObjectId) {

        const author = await this.auhtorService.findAuthorById(id)

        return { author }
    }

    @Get('/:id/books')
    async getAuthorBooks(@Param('id') id: Schema.Types.ObjectId) {

        const books = await this.auhtorService.findAuthorBooks(id)

        return { books }

    }

    @Post()
    @RolePermission(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    async addAuthor(@Body(ValidationPipe) createAuthorDto: CreateAuthorDto) {
        await this.auhtorService.createAuthor(createAuthorDto)
        return { message: "Author added successfully" }
    }

    @Put('/:id')
    @RolePermission(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    async updateAuthor(
        @Param('id') id: Schema.Types.ObjectId,
        @Body(ValidationPipe) updateAuthorDto: UpdateAuthorDto
    ) {
        await this.auhtorService.updateAuthor(id, updateAuthorDto)
        return { message: "Author Data Updated" }

    }

    @HttpCode(204)
    @Delete('/:id')
    @RolePermission(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    async deleteBook(@Param('id') id: Schema.Types.ObjectId) {

        await this.auhtorService.deleteAuthor(id)
        return
    }

}