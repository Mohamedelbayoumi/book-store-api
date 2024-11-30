# Book-Store-Api

## Overview

This is an book store api project that is devleoped to run in the production environment.
The api handles the process of buying books and the books will be shipped to the user's address . The api is built using nest.js framework. The api contain many features like authentication, authorization, file upload, validation, dockerization, swagger docs, full text search and so on .

## Table of Contents

- [Book-Store-Api](#book-store-api)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technologies](#technologies)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [API Endpoints](#api-endpoints)

## Features

- **User Authentication:** Secure user authentication using JWT (Json Web Token) .
- **Validation :** Validating DTO (data request object) using class-validator .
- **Authorization :** Using RBAC (role based access control) to allow premission to access some features.
- **Order Management**: Users have three options to place an order:
  1. **Full Payment Online**: The user can pay the total price of the books online.
  2. **Partial Payment (Deposit)**: The user can pay a deposit online and pay the remaining amount upon receiving the books.
  3. **Cash on Delivery**: The user can choose to pay the full amount upon receipt of the books.
- **Apply Discount :** Some books can have discounts to decrease the price
- **Admin Users :** Admin users are allowed to make crud operation on books and authors. They can add or remove discounts that applied on some books. They can update the status of orders if they changed.
- **Payment Integration:** Integrate with a payment gateway like stripe and use the webhook to handle the successful payment process.
- **File Upload :**  Admin users can upload an image cover for the book.
- **Database Managment :** Using Nosql databases like MongoDB help me to use the embedded and refrence to documents. it helps me to make a transaction operations and some different queries
- **Full Text Search :** Using MongoDB to make a full text search that help my search queries to get more fast and more performant
- **Filter Books Results :** find books with some filters like search, sorted in some order and pagination

## Technologies

- **Node.js**
- **Nest.js**
- **MongoDB/Mongoose**
- **Multer**
- **Stripe**
- **JWT**
- **class-validator**
- **class-transformer**

## Installation

   ```sh
   // Clone the repository
    git clone https://github.com/Mohamedelbayoumi/Book-Store-Api.git
    
    // Navigate to the project directory
    cd yourproject
    
    // Install dependencies
    npm install

    // Run the application
    npm start
  ```

   ```sh
   /* or you can isntall docker on your device 
   and copy Dockerfile and docker-compose.yml 
   and run this command to run the application *
   docker-compose up

   
  ```

## Configuration

- *node version >=18.12.1*
- *MongoDB server*
- *set the values of environment variables that exist in .env.example file*

## API Endpoints

For detailed API documentation, please visit <https://app.swaggerhub.com/apis-docs/MOHAMEDALBAYOUMI822_1/book-store-api-docs/1.0>

- ### Authentication

  - **POST /signup** - Register a new user
  - **POST /login** - Login a user and return the access token

- ### Books

  - **GET /books** - returns books using pagination
  - **GET /books/id** - returns a book with a specific id
  - **POST /books** - Add an Book
  - **PUT /books/id** - updates a specific book by its id
  - **PATCH /books/id/discount_upserted** - create or update a discount for a specific book
  - **PATCH /books/id/discount_removal** - removes a discount for a specifc book
  - **DELETE /books/id** - delete a spccific book by its id

- ### Authors

  - **GET /authors** - returns all authors
  - **GET /authors/id** - returns a specific author
  - **GET /authors/id/books** - returns books for a specific author
  - **POST /authors** - add an author
  - **PUT /authors/id** - update author's information
  - **DELETE /authors/id** - delete a specific author

- ### Cart

  - **GET /cart** - returns cart content
  - **POST /cart** - add a book to the cart
  - **PATCH /cart** - delete an image from the cart
  - **DELETE /cart** - delete the cart

- ### Payment

  - **POST /checkout-url** - returns checkout url that created by stripe api
  - **POST /webhook** - to get notified that the payment process succeeded to create the order

- ### Orders

  - **GET /orders** - returns the list of orders for a specific user
  - **GET /orders/admin** - returns orders that is ready to be shipped for the users
  - **GET /orders/id** - returns a specific order by its id
  - **POST /orders** - create an order and this for users who will pay upon receipt
  - **PATCH /orders** - allow admin to change the status of the order to be shipped or any other status

- ### Users

  - **PATCH /user_account** - update user's address
  - **DELETE /user_account** - delete the user's account
