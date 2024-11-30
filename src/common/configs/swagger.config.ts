import { DocumentBuilder } from '@nestjs/swagger'

export const swaggerConfig = new DocumentBuilder()
    .setTitle('Book-Store-API')
    .setVersion('1.0')
    .setDescription('a documentation for a book-store api')
    .addServer('http://localhost:5000', 'Development Environment')
    .addBearerAuth()
    .build()

