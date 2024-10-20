import { Types } from 'mongoose'

export interface PucrchasedBook {
    id: Types.ObjectId
    name: string,
    quantity: number,
    price: number,
    cover: string
}