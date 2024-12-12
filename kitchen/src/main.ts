import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app";

const PORT = process.env.PORT || 3009;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix("kitchen/api/v1");
  await app.listen(PORT);
  app.enableCors(
    {
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  );
  console.log("Api started on port http://localhost:" + PORT + "/kitchen/api/v1");
}
bootstrap();
