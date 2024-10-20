import { Module, DynamicModule } from '@nestjs/common'
import { Stripe } from 'stripe'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({})
export class StripeModule {

    static forRootAsync(): DynamicModule {

        return {
            module: StripeModule,
            imports: [ConfigModule],
            providers: [
                {
                    provide: 'STRIPE_CLIENT',
                    useFactory: async (configService: ConfigService) => {
                        const apiKey: string = configService.get('STRIPE_TEST_SECRET_KEY')
                        const stripe = new Stripe(apiKey)
                        return stripe
                    },
                    inject: [ConfigService]
                }
            ],
            exports: ['STRIPE_CLIENT']
        }
    }
}