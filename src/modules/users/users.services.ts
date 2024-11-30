import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, startSession } from 'mongoose'

import { User } from './users.schema'
import { IUser } from './interfaces/user.interface'
import { CartServices } from '../cart/cart.services'
import { OrdersServices } from '../orders/orders.services'
import { UserAddress } from './interfaces/address.interface'

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private orderService: OrdersServices,
        private cartService: CartServices
    ) { }

    async createUser(userData: IUser, hashedPassword: string) {
        const { firstName, lastName, email, phoneNumber, address } = userData

        return await this.userModel.create({
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: hashedPassword,
            address: address,
            phone_number: phoneNumber
        })
    }

    async findUserByEmail(email: string) {
        return this.userModel.findOne({ email })
            .select('_id password isAdmin')
            .exec()
    }

    async getUsers() {
        return await this.userModel.find()
    }

    async deleteUserAccount(id: string) {

        const session = await startSession()

        try {

            await session.withTransaction(async () => {

                await this.cartService.deleteCart(id, session)

                await this.orderService.deleteUserOrders(id, session)

                await this.userModel.deleteOne({ id }, { session })
            })

        } catch (err) {
            await session.abortTransaction()
            throw new InternalServerErrorException(err.message)
        } finally {
            await session.endSession()
        }
    }

    async updateUserAddress(id: string, address: UserAddress) {
        await this.userModel.findByIdAndUpdate(id, { address: address })
    }
}