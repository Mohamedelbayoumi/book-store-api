import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

import { Author } from '../authors/authors.schema'
import { Category } from './enums/category.enum'

export type BookDocument = mongoose.HydratedDocument<Book>

@Schema()
export class Book {

    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    description: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Author' })
    author: Author

    @Prop({ required: true })
    book_cover: string

    @Prop({ default: true })
    available_to_borrow: boolean

    @Prop({ required: true, enum: Category })
    category: string

    @Prop({ default: 1 })
    copies_in_stock: number

    @Prop({ required: false })
    date_of_authorship: Date

    @Prop({ required: true })
    price: number

    @Prop()
    discount_percentage: number

}

export const BookSchema = SchemaFactory.createForClass(Book)