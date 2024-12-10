import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app";
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: false});
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api/v1');
  await app.listen(3001);
  // imprimimos env
//   console.log(process.env);
// cors para localhost


}
bootstrap();
