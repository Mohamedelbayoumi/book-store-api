import { UserAddress } from './address.interface'

export interface IUser {
    firstName: string
    lastName: string
    email: string
    password: string
    phoneNumber: string
    address: UserAddress
}