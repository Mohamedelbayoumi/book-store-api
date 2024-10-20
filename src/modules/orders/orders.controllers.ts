import { Body, Controller, Get, Param, Patch, Request, UseGuards, HttpCode, UseInterceptors } from '@nestjs/common'
import { Schema } from 'mongoose'

import { OrdersServices } from './orders.services'
import { AuthGuard } from '../auth/guards/auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { RolePermission } from '../auth/decorators/roles.decorator'
import { Role } from '../auth/enums/roles.enum'
import { Status } from './enums/status.emum'
import { SingleOrderInterceptor } from './interceptors/order.interceptor'

@Controller('/orders')
export class OrdersConrtrollers {
    constructor(private ordersServices: OrdersServices) { }

    @Get()
    @UseGuards(AuthGuard)
    async getOrdersForUser(@Request() req) {
        const orders = await this.ordersServices.findOrdersForUser(req.userId)
        return { orders }
    }

    @Get('/admin')
    @RolePermission(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    async getOrdersForAdmin() {
        const orders = await this.ordersServices.findOrdersForAdmin()
        return { orders }
    }

    @Get('/:id')
    @UseGuards(AuthGuard)
    @UseInterceptors(SingleOrderInterceptor)
    async getOrderById(@Param('id') id: Schema.Types.ObjectId) {
        const order = await this.ordersServices.findOrderById(id)
        return { order }
    }

    @HttpCode(204)
    @Patch('/:id')
    @RolePermission(Role.Admin)
    @UseGuards(AuthGuard, RolesGuard)
    async updateOrderStatus(@Param('id') id: Schema.Types.ObjectId, @Body() status: Status) {
        await this.ordersServices.updateStatus(id, status)
        return
    }
}