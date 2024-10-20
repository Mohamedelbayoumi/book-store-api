import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

import { Status } from './enums/status.emum'
import { User } from '../users/users.schema'
import { OrderedBook } from './interfaces/ordered-book.interface'

@Schema()
export class Order {

    @Prop({
        type: [{
            book_name: { type: String },
            book_price: { type: Number },
            book_quantity: { type: Number }
        }],
        required: true
    })
    ordered_books: OrderedBook[]

    @Prop({ default: new Date().toISOString() })
    date: Date

    @Prop({ enum: Status, default: Status.Confirmed })
    status: Status

    @Prop({ required: true })
    total_price: number

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User
}

export const OrderSchema = SchemaFactory.createForClass(Order)