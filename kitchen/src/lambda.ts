import { NestFactory } from "@nestjs/core";
import { configure } from "@vendia/serverless-express"; // Ajustado para la nueva API
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
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix("kitchen/api/v1");
  await app.init();
  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  const expressApp = app.getHttpAdapter().getInstance();
  return configure({ app: expressApp }); 
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
