import { Controller, UseGuards, Request, Post, Req, Headers, RawBodyRequest, HttpCode, Body } from '@nestjs/common'
import { ApiTags, ApiOkResponse, ApiBearerAuth, ApiUnauthorizedResponse, ApiTemporaryRedirectResponse } from '@nestjs/swagger'
import * as express from 'express'

import { PaymentServices } from './payment.services'
import { AuthGuard } from '../auth/guards/auth.guard'

@ApiTags('Payment')
@Controller('/payments')
export class PaymentController {
    constructor(private paymentServices: PaymentServices) { }

    @HttpCode(303)
    @Post('/checkout-url')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiTemporaryRedirectResponse({ type: 'string' })
    @ApiUnauthorizedResponse({ description: 'authentication error' })
    async getCheckoutUrl(@Request() req: express.Request, @Body() depositPercentage: string) {
        const checkoutUrl = await this.paymentServices.createCheckoutSessionUrl(req['userId'], req.baseUrl, +depositPercentage)
        return { checkoutUrl }
    }

    @HttpCode(200)
    @Post('/webhook')
    @ApiOkResponse()
    async handlePaymentProcess(
        @Headers('stripe-signature') sig: string,
        @Req() req: RawBodyRequest<express.Request>
    ) {
        await this.paymentServices.handlePaymentSuccess(req.rawBody, sig)
        return
    }
}