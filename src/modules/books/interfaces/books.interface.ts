import { Category } from '../enums/category.enum'

export interface IBookForCreate {

    name: string

    description: string

    category: Category

    dateOfAuthorship: Date

    copiesInStock?: number

    price: number

    authorName: string
}

export interface IBookforUpdate {
    name: string

    description: string

    category: Category

    dateOfAuthorship: Date

    copiesInStock: number

    price: number

    authorName: string

    availableToBorrow: boolean
}