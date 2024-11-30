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
import { ApiBearerAuth, ApiTags, ApiOkResponse, ApiUnauthorizedResponse, ApiCreatedResponse, ApiNoContentResponse } from '@nestjs/swagger'
import { AuthGuard } from '../auth/guards/auth.guard'
import { CartServices } from './cart.services'
import { AddCartItemDto } from './dtos/add-cart-item-dto'
import { RemoveCartItemDto } from './dtos/remove-cart-item-dto'
import { CartInterceptor } from './interceptors/cart.interceptor'

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('/cart')
@UseGuards(AuthGuard)
export class CartController {

    constructor(private cartService: CartServices) { }

    @Get()
    @UseInterceptors(CartInterceptor)
    @ApiOkResponse({
        schema: {
            type: 'object',
            properties: {
                cart: {
                    type: 'object',
                    properties: {
                        totalPrice: { type: 'number' },
                        cartItems: {
                            type: 'object',
                            properties: {
                                book: { type: 'string' },
                                quantity: { type: 'number' }
                            }
                        }
                    }
                }
            }
        }
    })
    @ApiUnauthorizedResponse({ description: 'authentication error' })
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

    @Post()
    @ApiCreatedResponse({ description: 'Item added to cart' })
    @ApiUnauthorizedResponse({ description: 'authentication error' })
    async addCartItem(@Request() req, @Body(ValidationPipe) addCartItemDto: AddCartItemDto) {
        await this.cartService.addCartItem(req.userId, addCartItemDto)
        return { message: "Item added to cart" }
    }

    @HttpCode(204)
    @Patch()
    @ApiNoContentResponse()
    @ApiUnauthorizedResponse({ description: 'authentication error' })
    async removeCartItem(@Request() req, @Body(ValidationPipe) removeCartItemDto: RemoveCartItemDto) {
        await this.cartService.removeCartItem(req.userId, removeCartItemDto)
        return
    }

    @HttpCode(204)
    @Delete()
    @ApiNoContentResponse()
    @ApiUnauthorizedResponse({ description: 'authentication error' })
    async deleteCart(@Request() req) {
        await this.cartService.deleteCart(req.userId)
        return
    }

}