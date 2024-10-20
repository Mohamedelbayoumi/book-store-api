import { NestFactory } from '@nestjs/core';
import { connect } from '@ngrok/ngrok'
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true
  });

  app.enableCors({
    origin: '*'
  })

  await app.listen(5000);
  // const listener = await connect({
  //   addr: 5000,
  //   authtoken_from_env: true
  // })
  // console.log(`Ingress established at: ${listener.url()}`)
}
bootstrap();
