import { Injectable, Inject, BadRequestException, UnprocessableEntityException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Schema } from 'mongoose'
import Stripe from 'stripe'

import { CartService } from '../cart/cart.services'
import { BookService } from '../books/books.services'
import { OrdersServices } from '../orders/orders.services'

@Injectable()
export class PaymentServices {

    constructor(
        @Inject('STRIPE_CLIENT') private stripeClient: Stripe,
        private cartService: CartService,
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
    async createCheckoutSessionUrl(userId: Schema.Types.ObjectId, baseUrl: string) {

        const books = await this.findBooksForPayment(userId)

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
                        unit_amount: purchasedBook.price * 100
                    },
                    quantity: purchasedBook.quantity
                }
            }),
            client_reference_id: String(userId),
            mode: 'payment',
            success_url: 'http://localhost:5000/success.html',
            cancel_url: 'http://localhost:5000/cancel.html'
        })
        console.log(session.line_items)
        console.log('--------------------------------------')
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

        const endPointSercret: string = await this.configService.get('END_POINT_SECRET')

        let event: Stripe.Event

        try {
            event = this.stripeClient.webhooks.constructEvent(payload, sig, endPointSercret)
        } catch (err) {
            throw new BadRequestException(`Webhook Error : ${err.message}`)
        }

        if (
            event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {

            const { id, amount_total, client_reference_id } = event.data.object

            const lineItems = await this.getLineItems(id)

            const orderedBooks = lineItems.map(async (lineItem) => {
                const { book_id, book_name } = (lineItem.price.product as Stripe.Product).metadata
                // await this.bookService.decreaseBookCopies(book_id, lineItem.quantity)
                return {
                    bookName: book_name,
                    bookPrice: lineItem.price.unit_amount / 100,
                    bookQuantity: lineItem.quantity
                }
            })

            console.log(lineItems)

            // await this.orderService.create(
            //     checkoutSessionCompletedObject.client_reference_id,
            //     orderedBooks,
            //     checkoutSessionCompletedObject.amount_total
            // )

            // await this.cartService.deleteCart(userId)
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
    private async findBooksForPayment(userId: Schema.Types.ObjectId) {

        const cart = await this.cartService.findCart(userId, true)

        return await this.bookService.findAndCheckBooksQuantity(cart.cart_items)
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