import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class CartInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        const returnedCart = {
            cart: {
                totalPrice: 0,
                cartItems: []
            }
        }
        return next
            .handle()
            .pipe(map(data => data.cart === null ? returnedCart : data))
    }
}