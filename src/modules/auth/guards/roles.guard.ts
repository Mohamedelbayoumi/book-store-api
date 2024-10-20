import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { Role } from '../enums/roles.enum'

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private reflactor: Reflector) { }

    canActivate(context: ExecutionContext): boolean {

        // what is the required roles ?
        const requiredRole = this.reflactor.getAllAndOverride<Role>('roles', [
            context.getClass(),
            context.getHandler()
        ])

        if (!requiredRole) {
            return true
        }

        //does the user has the required role ?
        const req = context.switchToHttp().getRequest()

        return req.role === requiredRole
    }
}