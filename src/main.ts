import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  // env
  const PORT = process.env.PORT;

  const app = await NestFactory.create(AppModule);

  // swagger config
  const config = new DocumentBuilder()
    .setTitle('** Jamming API ** ')
    .setDescription('The jamming API description')
    .setVersion('1.0')
    .addTag('jamming')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // listen
  await app.listen(PORT);
  console.log(`Server listening on ${PORT}`);
}
bootstrap();
