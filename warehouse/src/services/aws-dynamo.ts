import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AwsDynamoService {
  private docClient: DynamoDBDocumentClient;
  private inventoryTable: string;
  private purchasesTable: string;

  constructor(private readonly configService: ConfigService) {
    const { region, credentials, dynamo } = this.configService.get("aws");
    const client = new DynamoDBClient({
      region: region,
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
      },
    });
    this.inventoryTable = dynamo.inventoryTable;
    this.purchasesTable = dynamo.purchasesTable;
    this.docClient = DynamoDBDocumentClient.from(client);
  }

  async getInventoryByIngredient(ingredient: string) {
    const command = new GetCommand({
      TableName: this.inventoryTable,
      Key: { ingredient },
    });
    const { Item } = await this.docClient.send(command);
    return {
      id: Item?.id,
      name: Item?.name,
      stock: Item?.stock,
    };
  }

  async getIngredientById(id: number) {
    const command = new GetCommand({
      TableName: this.inventoryTable,
      Key: { id },
    });
    const { Item } = await this.docClient.send(command);
    return {
      id: Item?.id,
      name: Item?.name,
      stock: Item?.stock,
    };
  }

  async getInventoryAll() {
    const command = new ScanCommand({
      TableName: this.inventoryTable,
    });
    const { Items } = await this.docClient.send(command);
    return Items?.map((item) => ({
      id: item.id.N,
      name: item.name.S,
      stock: item.stock.N,
    }));
  }
  async updateInventory(id: number, quantity: number) {
    const command = new UpdateCommand({
      TableName: this.inventoryTable,
      Key: { id },
      UpdateExpression: "set stock = stock + :val",
      ExpressionAttributeValues: { ":val": quantity },
    });
    return await this.docClient.send(command);
  }

  async getPurchaseHistory() {
    const command = new ScanCommand({
      TableName: this.purchasesTable,
    });
    const { Items } = await this.docClient.send(command);
    return Items?.map((item) => ({
      id: item.id.N,
      name: item.name.S,
      quantity: item.quantity.N,
    }));
  }

  async makePurchase(id: number, name: string, quantity: number) {
    const command = new PutCommand({
      TableName: this.purchasesTable,
      Item: { id, name, quantity },
    });
    return await this.docClient.send(command);
  }
}
