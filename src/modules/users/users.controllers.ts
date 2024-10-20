import { Controller, Body, UseGuards, Delete, Patch, HttpCode } from '@nestjs/common'

import { UserService } from './users.services'
import { AuthGuard } from '../auth/guards/auth.guard'
import { UserAddress } from './interfaces/address.interface'

@Controller('/user_account')
export class Usercontroller {

    constructor(private userService: UserService) { }

    @HttpCode(204)
    @Patch()
    async upateUseraAdress(address: UserAddress) {
        await this.userService
    }

    @HttpCode(204)
    @Delete()
    @UseGuards(AuthGuard)
    async deleteUser(@Body() email: string) {
        await this.userService.deleteUserAccount(email)
        return
    }
}