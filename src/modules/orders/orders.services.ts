import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Schema } from 'mongoose'

import { Order } from './orders.schema'
import { OrderedBook } from './interfaces/ordered-book.interface'
import { Status } from './enums/status.emum'


@Injectable()
export class OrdersServices {
    constructor(@InjectModel(Order.name) private orderModel: Model<Order>) { }

    async create(userId: string, orderedBooks: Promise<OrderedBook>[], totalPrice: number) {
        await this.orderModel.create({
            user: userId,
            ordered_books: orderedBooks,
            total_price: totalPrice
        })
    }

    async findOrdersForUser(userId: Schema.Types.ObjectId) {
        return await this.orderModel.find({ user: userId })
    }

    async findOrdersForAdmin() {
        return await this.orderModel.find({ status: Status.Confirmed })
    }

    async findOrderById(orderId: Schema.Types.ObjectId) {
        return await this.orderModel.findById(orderId)
            .populate('user')
            .exec()
    }

    async updateStatus(orderId: Schema.Types.ObjectId, status: Status) {
        await this.orderModel.findByIdAndUpdate(orderId, { status: status })
    }


}