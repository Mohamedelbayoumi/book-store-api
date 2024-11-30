import { NestFactory } from '@nestjs/core'
import { SwaggerModule } from '@nestjs/swagger'
import { connect } from '@ngrok/ngrok'

import { AppModule } from './app.module';
import { swaggerConfig } from './common/configs/swagger.config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true
  });

  app.enableCors({
    origin: '*'
  })

  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig)

  SwaggerModule.setup('api-docs', app, documentFactory)

  await app.listen(5000);
}
bootstrap();
