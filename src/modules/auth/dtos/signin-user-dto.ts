import { IsEmail, IsString, Length } from 'class-validator'

export class SignInUserDto {

    @IsEmail()
    readonly email: string

    @IsString()
    @Length(5)
    readonly password: string
}