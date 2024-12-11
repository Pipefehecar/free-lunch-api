import { config } from "dotenv";
import { join } from "path";

config({ path: join(__dirname, "../../.env") });

export const configuration = () => ({
  port: parseInt(process.env.PORT || "3000", 10),
  aws: {
    region: process.env.REGION || "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test",
    },
    sqs: {
      requestQueueUrl: process.env.SQS_REQUEST_QUEUE_URL,
      endpoint: process.env.AWS_ENDPOINT,
    },
    dynamo: {
      inventoryTable: process.env.DYNAMODB_TABLE_INVENTORY,
      purchasesTable: process.env.DYNAMODB_TABLE_PURCHASES,
    },
  },
  stage: process.env.STAGE,
});
