import { Controller, Get, UseGuards, Request, Post, Req, Headers, RawBodyRequest, HttpCode } from '@nestjs/common'
import * as express from 'express'

import { PaymentServices } from './payment.services'
import { AuthGuard } from '../auth/guards/auth.guard'


@Controller('/payments')
export class PaymentController {
    constructor(private paymentServices: PaymentServices) { }

    @HttpCode(303)
    @Get('/checkout-url')
    @UseGuards(AuthGuard)
    async getCheckoutUrl(@Request() req: express.Request) {
        const checkoutUrl = await this.paymentServices.createCheckoutSessionUrl(req['userId'], req.baseUrl)
        return { checkoutUrl }
    }

    @HttpCode(200)
    @Post('/webhook')
    async handlePaymentProcess(
        @Headers('stripe-signature') sig: string,
        @Req() req: RawBodyRequest<express.Request>
    ) {
        await this.paymentServices.handlePaymentSuccess(req.rawBody, sig)
        return
    }
}