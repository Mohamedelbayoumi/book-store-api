import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Schema, ClientSession } from 'mongoose'

import { Order } from './orders.schema'
import { OrderedBook } from './interfaces/ordered-book.interface'
import { Status } from './enums/status.emum'
import { CartServices } from '../cart/cart.services'
import { BookDocument } from '../books/books.schema'


@Injectable()
export class OrdersServices {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<Order>,
        private cartServices: CartServices
    ) { }

    async createOrderForFullPayment(
        userId: string, orderedBooks: Promise<OrderedBook>[],
        totalPaid: number, totalPrice: number
    ) {
        await this.orderModel.create({
            user: userId,
            ordered_books: orderedBooks,
            total_paid: totalPaid,
            total_price: totalPrice,
            status: Status.Confirmed
        })
    }

    async createOrderForPaymentUponReceipt(userId: string) {
        const { cart_items, total_price } = await this.cartServices.findCart(userId, true)

        await this.orderModel.create({
            user: userId,
            total_price: total_price,
            total_paid: 0,
            status: Status.PaymentUponReceipt,
            ordered_books: cart_items.map((item) => {
                return {
                    book_name: (item.book as BookDocument).name,
                    book_price: (item.book as BookDocument).price,
                    book_quantity: item.quantity
                }
            })
        })

        await this.cartServices.deleteCart(userId)
    }

    async findOrdersForUser(userId: Schema.Types.ObjectId) {
        return await this.orderModel.find({ user: userId })
            .lean()
    }

    async findOrdersForAdmin() {
        return await this.orderModel.find()
            .or([{ status: Status.Confirmed }, { status: Status.PaymentUponReceipt }])
            .populate('user')
            .lean()
            .exec()
    }

    async findOrderById(orderId: Schema.Types.ObjectId) {
        return await this.orderModel.findById(orderId)
            .populate('user')
            .exec()
    }

    async updateStatus(orderId: Schema.Types.ObjectId, status: Status) {
        await this.orderModel.findByIdAndUpdate(orderId, { status: status })
    }

    async deleteUserOrders(userId: string, transactionSession: ClientSession) {
        await this.orderModel.deleteMany({ user: userId }, { session: transactionSession })
    }


}