import { Controller, Get, Post, Body, ValidationPipe } from '@nestjs/common'
import { ApiCreatedResponse, ApiTags, ApiConflictResponse, ApiBadRequestResponse, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger'

import { AuthService } from './auth.service'
import { CreateUserDto } from './dtos/create-user-dto'
import { SignInUserDto } from './dtos/signin-user-dto'

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('/signup')
    @ApiCreatedResponse({ description: 'User Registered Successfully' })
    @ApiConflictResponse({ description: 'User Already existed' })
    @ApiBadRequestResponse()
    async signup(@Body(ValidationPipe) createUserDto: CreateUserDto) {

        await this.authService.signUp(createUserDto)

        return { messsge: "User Registered Successfully" }
    }

    @ApiCreatedResponse({
        schema: {
            type: 'object',
            properties: {
                accessToken: {
                    type: 'string',
                    example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
                eyJzdWIiOiI2NzA5MjEyOGJmZTAwN2VlZGY2OWJlMzAiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MjkzNjYwODksImV4cCI6MTcyOTUzODg4OX0.
                mAvYC08V09r_nEO27D-HY2mLuRIYdaTVNqSBJKyNxHs`,
                },
                role: {
                    type: 'string',
                    examples: {
                        admin_user: 'admin',
                        normal_user: null
                    }
                }
            }
        }
    })
    @ApiForbiddenResponse({ description: 'Email is not verified' })
    @ApiUnauthorizedResponse({ description: 'Incorrect Password' })
    @ApiBadRequestResponse()
    @Post('/login')
    async login(@Body(ValidationPipe) signInUserDto: SignInUserDto) {

        const { email, password } = signInUserDto

        const { accessToken, role } = await this.authService.signIn(email, password)

        return { accessToken, role }
    }
}