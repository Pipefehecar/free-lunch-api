import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PurchaseItem, InventoryItem } from "../interfaces/dynamo";


@Injectable()
export class AwsDynamoService {
  private docClient: DynamoDBDocumentClient;
  private inventoryTable: string;
  private purchasesTable: string;

  constructor(private readonly configService: ConfigService) {
    const { region, dynamo, credentials  } = this.configService.get("aws");
    const stage = this.configService.get("stage");
    let client: DynamoDBClient;
    if (stage === "local") {
      client = new DynamoDBClient({
          region: region || "us-east-1",
          credentials: {
            accessKeyId: credentials.accessKeyId,
            secretAccessKey: credentials.secretAccessKey,
          },
      });
    }else{
      client = new DynamoDBClient({
        region: region || "us-east-1",
      });
    }
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
    return Items?.map((item: any) => ({
      id: item.id.S,
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
    return Items?.map((item: any) => ({
      id: item.id.S,
      name: item.name.S,
      quantitySold: item.quantitySold.N ,
      date: item.date.S,
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
