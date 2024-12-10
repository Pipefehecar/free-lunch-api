import { NestFactory } from "@nestjs/core";
import serverlessExpress from "@vendia/serverless-express";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
  Handler,
  SQSEvent,
} from "aws-lambda";
import { Callback } from "aws-lambda/handler";
import "reflect-metadata";
import { AppModule } from "./app";
import { OrdersService } from "./services/order";

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
  if (!appInstance) {
    const app = await NestFactory.create(AppModule);
    await app.init();
    appInstance = app;
  }
  const ordersService = appInstance.get(OrdersService);
  for (const record of event.Records) {
    const messageBody = JSON.parse(record.body);
    console.log("Received SQS message in Kitchen:", messageBody);
    await ordersService.processIngredientsRequest(messageBody);
  }
  return;
};
