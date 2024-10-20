import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'

import { CartItem } from './interfaces/cart-item.interface'

@Schema()
export class Cart {

    @Prop({ required: true })
    total_price: number

    @Prop({
        type: [{
            book: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Book'
            },
            quantity: Number
        }],
        required: true,
        _id: false
    })
    cart_items: CartItem[]

    @Prop({ required: true, unique: true })
    userId: mongoose.Schema.Types.ObjectId
}

export const CartSchema = SchemaFactory.createForClass(Cart)