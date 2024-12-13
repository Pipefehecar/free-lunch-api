import { NestFactory } from "@nestjs/core";
import serverlessExpress from "@codegenie/serverless-express";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Callback, Context, Handler, SQSEvent } from "aws-lambda";
import { AppModule } from "./app";
import { InventoryService } from "./services/inventory";

let lambdaProxy: Handler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix("warehouse/api/v1");
  await app.init();
  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
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

  if (!appInstance) {
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
