import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger"
import {ValidationPipe} from "@nestjs/common"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
      .setTitle('Olegometer API')
      .setVersion('1.0')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));

  await app.listen(5000);
}
bootstrap();
