import { BookDocument } from '../../books/books.schema'

export interface CartItem {
    book: string | BookDocument
    quantity?: number
}