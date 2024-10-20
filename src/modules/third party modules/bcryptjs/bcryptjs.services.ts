import { Injectable } from '@nestjs/common'
import { hash, compare } from 'bcryptjs'

@Injectable()
export class BcryptJsService {

    async hashPassword(password: string): Promise<string> {
        return await hash(password, 12)
    }

    async compareHashing(password: string, hashedPassword: string): Promise<Boolean> {
        return await compare(password, hashedPassword)
    }
}