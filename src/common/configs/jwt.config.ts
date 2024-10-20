import { JwtModuleAsyncOptions } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'

export const jwtModuleAsyncOptions: JwtModuleAsyncOptions = {
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
        signOptions: { expiresIn: "2d" }
    }),
    inject: [ConfigService]
}