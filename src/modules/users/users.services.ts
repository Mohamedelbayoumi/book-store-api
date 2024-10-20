import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { User } from './users.schema'
import { IUser } from './interfaces/user.interface'

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private userModel: Model<User>
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

    async deleteUserAccount(email: string) {
        await this.userModel.deleteOne({ email })
    }

    async getUsers() {
        return await this.userModel.find()
    }
}