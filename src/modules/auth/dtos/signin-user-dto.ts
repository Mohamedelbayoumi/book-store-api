import { IsEmail, IsString, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class SignInUserDto {

    @ApiProperty({
        examples: {
            normal_user: 'test@test.com',
            admin_user: 'toto@toto.com'
        },
        uniqueItems: true
    })
    @IsEmail()
    readonly email: string

    @ApiProperty({ type: 'string', format: 'password', minLength: 5 })
    @IsString()
    @Length(5)
    readonly password: string
}