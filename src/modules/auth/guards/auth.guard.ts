import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const req = context.switchToHttp().getRequest<Request>()

        const token = this.extractTokenFromHeader(req)

        if (!token) {
            throw new UnauthorizedException('No Token Provided')
        }

        try {

            const payload = await this.jwtService.verifyAsync(token)

            req['userId'] = payload.sub

            req['role'] = payload.role

        } catch (err) {
            console.error(err)
            throw new UnauthorizedException(err.message)
        }

        return true
    }

    private extractTokenFromHeader(req: Request) {

        const [type, token] = req.headers.authorization?.split(' ') || []

        return type === 'Bearer' ? token : undefined
    }
}