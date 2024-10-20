import { Injectable, CallHandler, ExecutionContext, NestInterceptor, UnauthorizedException } from "@nestjs/common"
import { Observable, map } from "rxjs"

import { Role } from '../../auth/enums/roles.enum'

@Injectable()
export class SingleOrderInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {

        const req = context.switchToHttp().getRequest()

        const loggedUserId = req.userId
        const role = req.role

        return next.handle()
            .pipe(map((data) => {
                const orderUserId = data.order.user._id

                if (orderUserId !== loggedUserId && role !== Role.Admin) {
                    throw new UnauthorizedException('not allowed to access this order')
                }
            }))
    }
}