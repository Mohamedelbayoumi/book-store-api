import { MongooseModuleAsyncOptions } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'

export const mongooseModuleAsyncOptions: MongooseModuleAsyncOptions = {
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI')
    }),
    inject: [ConfigService]
}