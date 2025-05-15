import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  const config = new DocumentBuilder()
      .setTitle('Olegometer API')
      .setVersion('1.0')
      .addCookieAuth('access_token', { 
        type: 'apiKey',
        in: 'cookie',
        name: 'access_token',
      })
      .build();
  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('api/swagger', app, document, {
    swaggerOptions: {
      withCredentials: true,
    },
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.PORT || 5050;
  await app.listen(port, "0.0.0.0");
}
bootstrap();
