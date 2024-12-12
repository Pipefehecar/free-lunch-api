import { Injectable } from '@nestjs/common';
import { SQSClient, SendMessageCommand, SendMessageCommandOutput } from '@aws-sdk/client-sqs';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AwsSqsService {
  private sqsClient: SQSClient;
  private requestQueueUrl: string;

  constructor(private configService: ConfigService) {
    const { sqs, region } = this.configService.get('aws');
    this.sqsClient = new SQSClient({
      endpoint: sqs.endpoint,
      region: region,
    });
    const queueUrl = sqs.requestQueueUrl;
    if (!queueUrl) {
      throw new Error(
        "SQS_REQUEST_QUEUE_URL is not defined in environment variables",
      );
    }
    this.requestQueueUrl = queueUrl;
  }

  async sendMessage(messageBody: any): Promise<SendMessageCommandOutput> {
    try {
      console.log('Sending message to SQS:', messageBody);
      console.log('Queue URL:', this.requestQueueUrl);
      const command = new SendMessageCommand({
        QueueUrl: this.requestQueueUrl,
        MessageBody: JSON.stringify(messageBody),
      });
      return this.sqsClient.send(command);
    } catch (error: unknown) {
      console.error('Error sending message to SQS:', error);
      if (error && typeof error === 'object' && '$response' in error) {
        console.error('Raw response:', (error as { $response: unknown }).$response);
      }
      throw error;
    }
  }
}