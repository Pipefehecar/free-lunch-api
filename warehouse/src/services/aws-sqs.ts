import { Injectable } from '@nestjs/common';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

@Injectable()
export class AwsSqsService {
  private sqsClient: SQSClient;

  constructor() {
    this.sqsClient = new SQSClient({
      endpoint: process.env.AWS_ENDPOINT,
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
      },
    });
  }

  async sendMessage(queueUrl: string, message: any): Promise<void> {
    const command = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(message),
    });

    await this.sqsClient.send(command);
  }
} 