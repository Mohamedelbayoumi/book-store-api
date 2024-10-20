import { UnsupportedMediaTypeException } from '@nestjs/common'
import { diskStorage, FileFilterCallback } from 'multer'
import { Request, Express } from 'express'

export const storage = diskStorage({
    destination(req, file, callback) {
        callback(null, 'public/books_images')
    },
    filename(req, file, callback) {
        const [imageName, extName] = file.originalname.split('.')
        callback(null, imageName + "-" + Date.now() + "." + extName)
    }
})

export const fileFilter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
        callback(null, true)
    }
    else {
        callback(new UnsupportedMediaTypeException())
    }
}