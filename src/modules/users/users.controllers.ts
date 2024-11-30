import { Controller, Request, UseGuards, Delete, Patch, HttpCode, Body } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiNoContentResponse, ApiUnauthorizedResponse } from '@nestjs/swagger'

import { UserService } from './users.services'
import { AuthGuard } from '../auth/guards/auth.guard'
import { UserAddress } from './interfaces/address.interface'

@ApiTags('Users')
@ApiBearerAuth()
@ApiNoContentResponse()
@ApiUnauthorizedResponse({ description: 'authentication error' })
@Controller('/user_account')
export class Usercontroller {

    constructor(private userService: UserService) { }

    @HttpCode(204)
    @Patch()
    @UseGuards(AuthGuard)
    async upateUseraAdress(@Request() req, @Body() userAdress: UserAddress) {
        await this.userService.updateUserAddress(req.userId, userAdress)
        return
    }

    @HttpCode(204)
    @Delete()
    @UseGuards(AuthGuard)
    async deleteUser(@Request() req) {
        await this.userService.deleteUserAccount(req.userId)
        return
    }
}