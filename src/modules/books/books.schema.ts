import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import * as mongoose from 'mongoose'

import { Author } from '../authors/authors.schema'
import { Category } from './enums/category.enum'

export type BookDocument = mongoose.HydratedDocument<Book>

@Schema()
export class Book {

    @ApiProperty()
    @Prop({ required: true })
    name: string

    @ApiProperty()
    @Prop({ required: true })
    description: string

    @ApiProperty({
        type: 'object',
        properties: {
            _id: { type: 'string' },
            name: { type: 'string' }
        }
    })
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Author' })
    author: Author

    @ApiProperty()
    @Prop({ required: true })
    book_cover: string

    @ApiProperty()
    @Prop({ default: true })
    available_to_borrow: boolean

    @ApiProperty()
    @Prop({ required: true, enum: Category })
    category: string

    @ApiProperty()
    @Prop({ default: 1 })
    copies_in_stock: number

    @ApiProperty()
    @Prop({ required: false })
    date_of_authorship: Date

    @ApiProperty()
    @Prop({ required: true })
    price: number

    @ApiPropertyOptional()
    @Prop()
    discount_percentage: number

}

export const BookSchema = SchemaFactory.createForClass(Book)

BookSchema.index({ name: 'text', description: 'text' })

