import {
    Controller,
    Get,
    UseGuards,
    Request,
    Patch,
    Body,
    Delete,
    ValidationPipe,
    HttpCode,
    Post,
    UseInterceptors
} from '@nestjs/common'

import { AuthGuard } from '../auth/guards/auth.guard'
import { CartService } from './cart.services'
import { AddCartItemDto } from './dtos/add-cart-item-dto'
import { RemoveCartItemDto } from './dtos/remove-cart-item-dto'
import { CartInterceptor } from './interceptors/cart.interceptor'

@Controller('/cart')
@UseGuards(AuthGuard)
export class CartController {

    constructor(private cartService: CartService) { }

    @Get()
    @UseInterceptors(CartInterceptor)
    async getCart(@Request() req) {

        const cart = await this.cartService.findCart(req.userId)

        if (!cart) {
            return { cart }
        }

        return {
            cart: {
                totalPrice: cart.total_price,
                cartItems: cart.cart_items
            }
        }
    }

    @Post('/item')
    async addCartItem(@Request() req, @Body(ValidationPipe) addCartItemDto: AddCartItemDto) {
        await this.cartService.addCartItem(req.userId, addCartItemDto)
        return { message: "Item added to cart" }
    }

    @HttpCode(204)
    @Patch()
    async removeCartItem(@Request() req, @Body(ValidationPipe) removeCartItemDto: RemoveCartItemDto) {
        await this.cartService.removeCartItem(req.userId, removeCartItemDto)
        return
    }

    @HttpCode(204)
    @Delete()
    async deleteCart(@Request() req) {
        await this.cartService.deleteCart(req.userId)
        return
    }

}