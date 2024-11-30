import { Injectable, Inject, BadRequestException, UnprocessableEntityException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Schema } from 'mongoose'
import Stripe from 'stripe'

import { CartServices } from '../cart/cart.services'
import { BookService } from '../books/books.services'
import { OrdersServices } from '../orders/orders.services'
import { OrderedBook } from '../orders/interfaces/ordered-book.interface'

@Injectable()
export class PaymentServices {

    constructor(
        @Inject('STRIPE_CLIENT') private stripeClient: Stripe,
        private cartService: CartServices,
        private bookService: BookService,
        private configService: ConfigService,
        private orderService: OrdersServices
    ) { }

    /**
     * Creates a Stripe checkout session URL for the user's cart.
     *
     * This method is responsible for the following actions:
     * - Retrieves the books in the user's cart
     * - Creates a Stripe checkout session with the cart items
     * - Sets the client reference ID to the user's ID
     * - Sets the success and cancel URLs for the checkout session
     *
     * @param userId - The ID of the user whose cart should be used for the checkout session
     * @returns The URL of the created Stripe checkout session
     */
    async createCheckoutSessionUrl(userId: string, baseUrl: string, depositPercentage: number) {

        const { books, total_price } = await this.findBooksForPayment(userId)

        if (!depositPercentage) depositPercentage = 0

        const session = await this.stripeClient.checkout.sessions.create({
            line_items: books.map((purchasedBook) => {
                return {
                    price_data: {
                        currency: 'EGP',
                        product_data: {
                            name: purchasedBook.name,
                            images: [`${baseUrl}/${purchasedBook.cover}`],
                            metadata: {
                                book_id: String(purchasedBook.id),
                                book_name: purchasedBook.name
                            }
                        },
                        unit_amount: (purchasedBook.price - (purchasedBook.price * +depositPercentage / 100)) * 100
                    },
                    quantity: purchasedBook.quantity
                }
            }),
            metadata: {
                total_price
            },
            client_reference_id: String(userId),
            mode: 'payment',
            success_url: this.configService.get('CHECKOUT_SUCCESS_URL'),
            cancel_url: this.configService.get('CHECKOUT_CANCEL_URL')
        })
        return session.url
    }

    /**
     * Handles the payment success callback from Stripe.
     * This method is responsible for the following actions:
     * - Deleting the user's cart
     * - Creating a new order
     * - Decreasing the quantity of books in the inventory
     *
     * @param payload - The raw payload received from the Stripe webhook
     * @param sig - The signature received from the Stripe webhook
     * @throws {BadRequestException} If there is an error verifying the Stripe webhook
     * @throws {UnprocessableEntityException} If the event type is not 'checkout.session.completed' or 'checkout.session.async_payment_succeeded'
     */
    async handlePaymentSuccess(payload: Buffer, sig: string) {

        const endPointSercret: string = await this.configService.get('Stripe_END_POINT_SECRET')

        let event: Stripe.Event

        try {
            event = this.stripeClient.webhooks.constructEvent(payload, sig, endPointSercret)
        } catch (err) {
            throw new BadRequestException(`Webhook Error : ${err.message}`)
        }

        if (
            event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {

            const { id, amount_total, client_reference_id, metadata } = event.data.object

            const lineItems = await this.getLineItems(id)

            const orderedBooks = lineItems.map(async (lineItem) => {
                const { book_id, book_name } = (lineItem.price.product as Stripe.Product).metadata
                await this.bookService.decreaseBookCopies(book_id, lineItem.quantity)
                return {
                    bookName: book_name,
                    bookPrice: lineItem.price.unit_amount / 100,
                    bookQuantity: lineItem.quantity
                }
            })

            console.log(metadata.total_price)

            await this.orderService.createOrderForFullPayment(
                client_reference_id,
                orderedBooks,
                amount_total,
                +metadata.total_price
            )

            await this.cartService.deleteCart(client_reference_id)
        }
        else {
            throw new UnprocessableEntityException(`Unhandled event type ${event.type}`)
        }
    }

    /**
     * Finds the books in the user's cart and checks their availability in the stock.
     *
     * @param userId - The ID of the user whose cart to find.
     * @returns An array of book objects with their quantities.
     */
    private async findBooksForPayment(userId: string) {

        const { cart_items, total_price } = await this.cartService.findCart(userId, true)

        const purchasedBooks = await this.bookService.findAndCheckBooksQuantity(cart_items)

        return {
            books: purchasedBooks,
            total_price: total_price
        }
    }

    /**
     * Retrieves the line items associated with a Stripe checkout session.
     *
     * @param sessionId - The ID of the Stripe checkout session.
     * @returns The line items associated with the specified checkout session.
     */
    private async getLineItems(sessionId: string) {

        const lineItems = await this.stripeClient.checkout.sessions.listLineItems(sessionId, {
            expand: ['data.price.product'],
            limit: 20
        })
        return lineItems.data
    }
}