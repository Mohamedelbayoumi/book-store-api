import { Injectable, ConflictException, ForbiddenException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { UserService } from '../users/users.services'
import { BcryptJsService } from '../third party modules/bcryptjs/bcryptjs.services'
import { IUser } from '../users/interfaces/user.interface'

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private bcryptJsService: BcryptJsService
    ) { }

    async signUp(userData: IUser) {

        const user = await this.userService.findUserByEmail(userData.email)

        if (user) {
            throw new ConflictException('User Already existed')
        }

        const hashedPassword = await this.bcryptJsService.hashPassword(userData.password)

        await this.userService.createUser(userData, hashedPassword)

    }

    async signIn(email: string, password: string) {

        const user = await this.userService.findUserByEmail(email)

        if (!user) {
            throw new ForbiddenException("Email is not verified")
        }

        const comparisonResult = await this.bcryptJsService.compareHashing(password, user.password)

        if (!comparisonResult) {
            throw new UnauthorizedException()
        }

        const payload = { sub: user._id }

        if (user.isAdmin) {
            payload['role'] = "admin"
        }

        return {
            accessToken: this.jwtService.sign(payload)
        }
    }

    async getUsers() {
        return await this.userService.getUsers()
    }
}

