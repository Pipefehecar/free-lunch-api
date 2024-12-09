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
  },
  postgres: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432", 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  stage: process.env.STAGE,
});
