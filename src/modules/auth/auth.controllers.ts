import { Controller, Get, Post, Body, ValidationPipe } from '@nestjs/common'

import { AuthService } from './auth.service'
import { CreateUserDto } from './dtos/create-user-dto'
import { SignInUserDto } from './dtos/signin-user-dto'

@Controller('/auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('/signup')
    async signup(@Body(ValidationPipe) createUserDto: CreateUserDto) {

        await this.authService.signUp(createUserDto)

        return { messsge: "User Registered Successfully" }
    }

    @Post('/login')
    async login(@Body() signInUserDto: SignInUserDto) {

        const { email, password } = signInUserDto

        const accessToken = await this.authService.signIn(email, password)

        return accessToken
    }

    @Get('/users')
    async getUsers() {
        const users = await this.authService.getUsers()
        return { users }
    }
}