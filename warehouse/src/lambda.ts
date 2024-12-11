import { NestFactory } from "@nestjs/core";
import serverlessExpress from "@codegenie/serverless-express";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Callback, Context, Handler, SQSEvent } from "aws-lambda";
import { AppModule } from "./app";
import { InventoryService } from "./services/inventory";

let lambdaProxy: Handler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback
): Promise<APIGatewayProxyResult> => {
  if (!lambdaProxy) {
    lambdaProxy = await bootstrap();
  }
  return lambdaProxy(event, context, callback);
};


let appInstance: any;
export const sqsHandler = async (event: SQSEvent) => {

  // Obtenemos InventoryService desde el appInstance (DI de Nest)
  if (!appInstance) {
    // Si no está inicializado, lo inicializamos (puede ser que no esté inicializado si se invoca directamente SQS)
    const app = await NestFactory.create(AppModule);
    await app.init();
    appInstance = app;
  }

  const inventoryService = appInstance.get(InventoryService);

  for (const record of event.Records) {
    const messageBody = JSON.parse(record.body);
    await inventoryService.processIngredientsRequest(messageBody);
  }
  return;
};
