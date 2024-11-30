import { Body, Controller, Get, Param, Patch, Request, UseGuards, HttpCode, UseInterceptors, Post } from '@nestjs/common'
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiBody, ApiBearerAuth, ApiUnauthorizedResponse, ApiNoContentResponse } from '@nestjs/swagger'
import { Schema } from 'mongoose'

import { OrdersServices } from './orders.services'
import { AuthGuard } from '../auth/guards/auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { RolePermission } from '../auth/decorators/roles.decorator'
import { Role } from '../auth/enums/roles.enum'
import { Status } from './enums/status.emum'
import { SingleOrderInterceptor } from './interceptors/order.interceptor'
import { Order } from './orders.schema'

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('/orders')
export class OrdersConrtrollers {
    constructor(private ordersServices: OrdersServices) { }

    @Get()
    @UseGuards(AuthGuard)
    @ApiOkResponse({ type: [Order] })
    @ApiUnauthorizedResponse({ description: 'authentication error' })
    async getOrdersForUser(@Request() req) {
        const orders = await this.ordersServices.findOrdersForUser(req.userId)
        return { orders }
    }

    @Get('/admin')
    @RolePermission(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @ApiOkResponse({ type: [Order] })
    @ApiUnauthorizedResponse({ description: 'authentication error' })
    @ApiForbiddenResponse({ description: 'authorization error' })
    async getOrdersForAdmin() {
        const orders = await this.ordersServices.findOrdersForAdmin()
        return { orders }
    }

    @Get('/:id')
    @UseGuards(AuthGuard)
    @UseInterceptors(SingleOrderInterceptor)
    @ApiOkResponse({ type: Order })
    @ApiUnauthorizedResponse({ description: 'authentication error' })
    async getOrderById(@Param('id') id: Schema.Types.ObjectId) {
        const order = await this.ordersServices.findOrderById(id)
        return { order }
    }

    @Post()
    @UseGuards(AuthGuard)
    @ApiCreatedResponse({ description: 'Order created successfully' })
    @ApiUnauthorizedResponse({ description: 'authentication error' })
    async creteOrder(@Request() req) {
        await this.ordersServices.createOrderForPaymentUponReceipt(req.userId)
        return { message: 'Order created successfully' }
    }


    @HttpCode(204)
    @Patch('/:id')
    @RolePermission(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    @ApiBody({ enum: Status })
    @ApiNoContentResponse()
    @ApiUnauthorizedResponse({ description: 'authentication error' })
    @ApiForbiddenResponse({ description: 'authorization error' })
    async updateOrderStatus(@Param('id') id: Schema.Types.ObjectId, @Body() status: Status) {
        await this.ordersServices.updateStatus(id, status)
        return
    }
}