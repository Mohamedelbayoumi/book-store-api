import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

import { Book } from '../books/books.schema'

@Schema()
export class Author {

    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    age: number

    @Prop({ required: true })
    nationality: string

    @Prop({ required: true })
    description: string
}


export const AuthorSchema = SchemaFactory.createForClass(Author)