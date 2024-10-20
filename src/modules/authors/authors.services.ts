import { Injectable, Inject, forwardRef } from '@nestjs/common'
import { Model, Schema } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'

import { Author } from './authors.schema'
import { IAuthor } from './interfaces/author.interface'
import { BookService } from '../books/books.services'

@Injectable()
export class AuthorService {
    constructor(
        @InjectModel(Author.name) private authorModel: Model<Author>,
        @Inject(forwardRef(() => BookService))
        private bookService: BookService
    ) { }

    async findAllAuthors(selectQuery: string | undefined) {

        let selectData: string | undefined

        if (selectQuery) {
            selectData = selectQuery.split(',').join(' ')
        }

        return await this.authorModel.find()
            .select(selectData)
    }

    async findAuthorById(id: Schema.Types.ObjectId) {
        return await this.authorModel.findById(id)
    }

    async findAuthorBooks(authorId: Schema.Types.ObjectId) {
        return await this.bookService.findBooksByAuthorID(authorId)
    }

    async createAuthor(authorData: IAuthor) {

        const { name, age, description, nationality } = authorData

        await this.authorModel.create({
            name,
            age,
            description,
            nationality
        })
    }


    async updateAuthor(authorId: Schema.Types.ObjectId, authorData: IAuthor) {

        const { name, age, description, nationality } = authorData

        await this.authorModel.findByIdAndUpdate(authorId, {
            name,
            age,
            description,
            nationality
        })
    }

    async deleteAuthor(authorId: Schema.Types.ObjectId) {
        await this.authorModel.findByIdAndDelete(authorId)
    }

    async findAuthorByName(authorName: string) {
        return await this.authorModel
            .findOne({ name: authorName })
            .select('_id')
            .exec()
    }
}