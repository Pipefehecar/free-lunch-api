import { Injectable } from '@nestjs/common';
import { SQSClient, SendMessageCommand, SendMessageCommandOutput } from '@aws-sdk/client-sqs';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AwsSqsService {
  private sqsClient: SQSClient;
  private requestQueueUrl: string;
  private responseQueueUrl: string;

  constructor(private configService: ConfigService) {
    const { sqs, region } = this.configService.get('aws');
    this.sqsClient = new SQSClient({
      endpoint: sqs.endpoint,
      region: region,
    });
   
    if (!sqs.responseQueueUrl || !sqs.requestQueueUrl) {
      throw new Error(
        "SQS_QUEUE_URLs is not defined in environment variables",
      );
    }
    this.requestQueueUrl = sqs.requestQueueUrl;
    this.responseQueueUrl = sqs.responseQueueUrl;
  }
  
  async sendMessage(messageBody: any, mode: "request" | "response" ): Promise<SendMessageCommandOutput> {
    try {
      const queueUrl = mode === "request" ? this.requestQueueUrl : this.responseQueueUrl;
      console.log('Sending message to SQS:', messageBody);
      console.log('Queue URL:', this.requestQueueUrl);
      const command = new SendMessageCommand({
        QueueUrl: queueUrl,
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