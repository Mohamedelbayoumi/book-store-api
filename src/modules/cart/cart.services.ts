import { Injectable } from "@nestjs/common"
import { InjectModel } from '@nestjs/mongoose'
import { Model, Schema, ClientSession } from 'mongoose'

import { Cart } from './cart.schema'
import { CartItem } from "./interfaces/cart-item.interface"
import { BookService } from '../books/books.services'


@Injectable()
export class CartServices {

    constructor(
        @InjectModel(Cart.name) private cartModel: Model<Cart>,
        private bookService: BookService
    ) { }

    async findCart(userId: string, populateOn?: boolean) {

        if (populateOn) {
            return await this.cartModel.findOne({ userId })
                .select('cart_items total_price ')
                .populate('cart_items.book', 'name price -_id')
                .exec()
        }

        return await this.cartModel.findOne({ userId })
            .select('cart_items total_price ')
            .exec()

    }

    private async createCart(
        userId: string, cartItemData: CartItem, bookPrice: number
    ) {

        await this.cartModel.create({
            userId,
            cart_items: [{
                quantity: cartItemData.quantity,
                book: cartItemData.book
            }],
            total_price: bookPrice * cartItemData.quantity
        })
    }

    async addCartItem(userId: string, cartItemData: CartItem) {

        const book = await this.bookService.findBookById((cartItemData.book as string), 'name price')

        const cart = await this.findCart(userId)

        if (!cart) {
            await this.createCart(userId, cartItemData, book.price)
            return
        }

        cart.cart_items.push(cartItemData)

        cart.total_price = cart.total_price + (book.price * cartItemData.quantity)

        await cart.save()

    }

    async removeCartItem(userId: string, cartItemData: CartItem) {

        const cart = await this.findCart(userId, true)

        const book = await this.bookService.findBookById((cartItemData.book as string), 'price -_id')

        const removedCartItem = cart.cart_items.find(function (cartItem) {
            return cartItem.book == cartItemData.book
        })

        cart.total_price = cart.total_price - (removedCartItem.quantity * book.price)

        const filteredCart = cart.cart_items.filter(function (cartItem) {
            return cartItem.book != cartItemData.book
        })

        cart.cart_items = filteredCart

        cart.save()
    }

    async deleteCart(userId: string, transactionSession?: ClientSession) {

        let transactionOptions: any = {}

        if (transactionSession) transactionOptions.session = transactionSession

        await this.cartModel.deleteOne({ userId }, transactionOptions)
    }
}