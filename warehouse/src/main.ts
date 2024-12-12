import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app";

const PORT = process.env.PORT || 3002;
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });
  app.setGlobalPrefix("warehouse/api/v1");
  await app.listen(PORT);
  console.log("Api started on port http://localhost:" + PORT + "/api/v1");
}
bootstrap();
