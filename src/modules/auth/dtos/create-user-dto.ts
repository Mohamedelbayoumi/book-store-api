import { IsEmail, IsString, Length, IsNotEmptyObject, IsPhoneNumber } from 'class-validator'

import { UserAddress } from '../../users/interfaces/address.interface'

export class CreateUserDto {

    @IsString()
    readonly firstName: string

    @IsString()
    readonly lastName: string

    @IsEmail()
    readonly email: string

    @IsString()
    @Length(5)
    readonly password: string

    @IsPhoneNumber('EG')
    readonly phoneNumber: string

    @IsNotEmptyObject()
    readonly address: UserAddress

}