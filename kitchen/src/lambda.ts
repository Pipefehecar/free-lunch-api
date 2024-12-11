import { NestFactory } from "@nestjs/core";
import * as serverlessExpress from "@vendia/serverless-express";
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

export const sqsHandler = async (event: SQSEvent) => {
  for (const record of event.Records) {
    const messageBody = JSON.parse(record.body);
    console.log("Received SQS message in Kitchen:", messageBody);
    // Aquí procesarías la lógica: por ejemplo, si la bodega responde que ya hay ingredientes,
    // actualizarías la orden en Postgres usando tu servicio.
  }
  return;
};
