import { Injectable, Inject, forwardRef, UnprocessableEntityException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Schema } from 'mongoose'

import { Book, BookDocument } from './books.schema'
import { AuthorService } from '../authors/authors.services'
import { IBookForCreate, IBookforUpdate } from './interfaces/books.interface'
import { ListQueryParams } from './dtos/list-query-params'
import { CartItem } from '../cart/interfaces/cart-item.interface'
import { PucrchasedBook } from '../payment/interfaces/purchased-book.interface'


@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name) private bookModel: Model<Book>,
        @Inject(forwardRef(() => AuthorService))
        private authorService: AuthorService
    ) { }

    /**
     * Finds books based on the provided filters.
     *
     * @param filters - An object containing the filters to apply to the book search.
     * @param filters.name - A string to filter books by name.
     * @param filters.category - A string to filter books by category.
     * @param filters.allow_borrow - A boolean to filter books by whether they are available to borrow.
     * @param filters.sortOrder - An object specifying the sort order for the results.
     * @param filters.page - The page number to retrieve (default is 1).
     * @returns A promise that resolves to an array of books matching the provided filters, with the name and price fields selected.
     */
    async findBooks(filters: ListQueryParams) {

        let queryFilters: any = {}
        const { name, category, allow_borrow, sortOrder, page = 1 } = filters

        if (name) queryFilters.name = { $regex: name, $options: 'i' }
        if (category) queryFilters.category = category
        if (allow_borrow || allow_borrow === false) queryFilters.available_to_borrow = allow_borrow

        return await this.bookModel.find(queryFilters)
            .skip((page - 1) * 5)
            .limit(5)
            .select('name price')
            .sort(sortOrder)
            .lean()
    }


    /**
     * Finds a book by its unique identifier.
     *
     * @param id - The unique identifier of the book to find.
     * @param selcetData - An optional string specifying the fields to select from the book document.
     * @returns A promise that resolves to the book document matching the provided ID, with the specified fields selected.
     */
    async findBookById(id: string, selcetData?: string | undefined) {
        return await this.bookModel.findById(id)
            .select(selcetData)
            .exec()
    }


    /**
     * Creates a new book in the database.
     *
     * @param book - An object containing the details of the book to create.
     * @param book.name - The name of the book.
     * @param book.description - The description of the book.
     * @param book.category - The category of the book.
     * @param book.dateOfAuthorship - The date of authorship of the book.
     * @param book.copiesInStock - The number of copies of the book in stock.
     * @param book.authorName - The name of the author of the book.
     * @param book.price - The price of the book.
     * @param bookCoverName - The image cover of the book.
     * @returns A promise that resolves when the book has been created.
     */
    async createBook(book: IBookForCreate, bookCoverName: string) {

        const {
            name,
            description,
            category,
            dateOfAuthorship,
            copiesInStock,
            authorName,
            price
        } = book

        const author = await this.authorService.findAuthorByName(authorName)

        await this.bookModel.create({
            name,
            description,
            category,
            date_of_authorship: dateOfAuthorship,
            copies_in_stock: copiesInStock,
            author: author._id,
            price: price,
            book_cover: bookCoverName
        })

    }


    /**
     * Updates an existing book in the database.
     *
     * @param bookId - The unique identifier of the book to update.
     * @param bookData - An object containing the updated details of the book.
     * @param bookData.name - The updated name of the book.
     * @param bookData.description - The updated description of the book.
     * @param bookData.category - The updated category of the book.
     * @param bookData.dateOfAuthorship - The updated date of authorship of the book.
     * @param bookData.copiesInStock - The updated number of copies of the book in stock.
     * @param bookData.authorName - The updated name of the author of the book.
     * @param bookData.price - The updated price of the book.
     * @param bookData.availableToBorrow - The updated availability of the book for borrowing.
     * @returns A promise that resolves when the book has been updated.
     */
    async updateBook(bookId: Schema.Types.ObjectId, bookData: IBookforUpdate) {

        const {
            name,
            description,
            category,
            dateOfAuthorship,
            copiesInStock,
            authorName,
            price,
            availableToBorrow
        } = bookData


        const author = await this.authorService.findAuthorByName(authorName)

        await this.bookModel.findByIdAndUpdate(bookId, {
            name,
            description,
            category,
            price,
            date_of_authorship: dateOfAuthorship,
            copies_in_stock: copiesInStock,
            author: author._id,
            available_to_borrow: availableToBorrow
        })
    }


    /**
     * Updates the discount percentage for a book or add a discount if there is no one already.
     *
     * @param bookId - The unique identifier of the book to update the discount for.
     * @param discountPercentage - The new discount percentage to apply to the book.
     * @returns A promise that resolves when the book's discount percentage has been updated.
     */
    async upsertDiscountInBook(bookId: string, discountPercentage: number) {
        const book = await this.findBookById(bookId, 'discount_percentage')
        book.discount_percentage = discountPercentage
        await book.save()
    }


    async removeDiscountFromBook(bookId: string) {
        const book = await this.findBookById(bookId, 'discount_percentage')
        book.discount_percentage = null
        await book.save()
    }


    /**
     * Deletes a book from the database by its unique identifier.
     *
     * @param bookId - The unique identifier of the book to delete.
     * @returns A promise that resolves when the book has been deleted.
     */
    async deleteBook(bookId: Schema.Types.ObjectId) {
        await this.bookModel.findByIdAndDelete(bookId)
    }


    /**
 * Finds books by the specified author ID.
 *
 * @param authorId - The unique identifier of the author to find books for.
 * @returns A promise that resolves to an array of books matching the provided author ID, with the name and price fields selected.
 */
    async findBooksByAuthorID(authorId: Schema.Types.ObjectId) {
        return await this.bookModel.find({ author: authorId })
            .select('name price')
    }


    /**
     * Finds the books in the cart, checks their availability, and returns the details of the purchased books.
     *
     * @param cartItems - An array of cart items, where each item contains the book ID and quantity.
     * @returns An array of purchased books, where each book contains its ID, name, quantity, and price.
     */
    async findAndCheckBooksQuantity(cartItems: CartItem[]): Promise<PucrchasedBook[]> {
        let books: PucrchasedBook[] = []
        for await (const item of cartItems) {
            const book = await this.findBookById(item.book, 'name price copies_in_stock book_cover')
            this.checkBooksQuantity(book, item.quantity)
            books.push({
                id: book._id,
                name: book.name,
                quantity: item.quantity,
                price: book.price,
                cover: book.book_cover
            })
        }
        return books
    }


    async decreaseBookCopies(bookId: string, noOfPurchasedBooks: number) {
        const book = await this.findBookById(bookId, 'copies_in_stock')
        book.copies_in_stock = book.copies_in_stock - noOfPurchasedBooks
        await book.save()
    }


    private checkBooksQuantity(book: BookDocument, noOfPurchasedBooks: number) {
        if (book.copies_in_stock < noOfPurchasedBooks) {
            throw new UnprocessableEntityException(
                `${book.name}'s copies are only ${book.copies_in_stock} in our stock`
            )
        }
    }
}