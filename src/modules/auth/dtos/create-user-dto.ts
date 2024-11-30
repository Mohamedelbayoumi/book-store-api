import { IsEmail, IsString, Length, IsNotEmptyObject, IsPhoneNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import { UserAddress } from '../../users/interfaces/address.interface'

export class CreateUserDto {

    @ApiProperty({ example: 'koko' })
    @IsString()
    readonly firstName: string

    @ApiProperty({ example: 'toto' })
    @IsString()
    readonly lastName: string

    @ApiProperty({ example: 'test@test.com', uniqueItems: true })
    @IsEmail()
    readonly email: string

    @ApiProperty({ type: 'string', format: 'passsword', minLength: 5 })
    @IsString()
    @Length(5)
    readonly password: string

    @ApiProperty({ uniqueItems: true, example: '01033333333', maxLength: 11 })
    @IsPhoneNumber('EG')
    readonly phoneNumber: string

    @ApiProperty({
        properties: {
            country: { type: 'string', example: 'egypt' },
            state: { type: 'string', example: 'cairo' },
            city: { type: 'string', example: 'cairo' },
            street: { type: 'string', example: 'safia zaghloul st' },
            building_description: { type: 'string', example: 'next to kaban restaraunt' },
            floor_number: { type: 'integer', example: 4 }
        }
    })
    @IsNotEmptyObject()
    readonly address: UserAddress

}