import crypto from "crypto";
import { Table } from "sst/node/table";
import { DynamoDBClient, ScanCommandInput } from "@aws-sdk/client-dynamodb";
import {
  GetCommand,
  UpdateCommand,
  ScanCommand,
  PutCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";

export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  metadata: string;
}

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export async function create(
  title: string,
  completed: boolean,
  metadata: string
): Promise<TodoItem> {
  const newItem: TodoItem = {
    id: crypto.randomUUID(),
    title,
    completed,
    metadata,
  };
  const params = {
    TableName: Table.todos.tableName,
    Item: newItem,
  };

  try {
    await db.send(new PutCommand(params));

    console.log("TODO item created successfully:", newItem);

    return newItem;
  } catch (error) {
    console.error("Error creating TODO item:", error);

    throw new Error("Could not create TODO item");
  }
}

export async function update(
  id: string,
  title?: string,
  completed?: boolean,
  metadata?: string
): Promise<TodoItem> {
  const updateExpressions = [];
  const expressionAttributeNames: { [key: string]: string } = {};
  const expressionAttributeValues: { [key: string]: any } = {};

  if (title !== undefined) {
    updateExpressions.push("#title = :title");
    expressionAttributeNames["#title"] = "title";
    expressionAttributeValues[":title"] = title;
  }

  if (completed !== undefined) {
    updateExpressions.push("#completed = :completed");
    expressionAttributeNames["#completed"] = "completed";
    expressionAttributeValues[":completed"] = completed;
  }

  if (metadata !== undefined) {
    updateExpressions.push("#metadata = :metadata");
    expressionAttributeNames["#metadata"] = "metadata";
    expressionAttributeValues[":metadata"] = metadata;
  }

  const updateExpression = "SET " + updateExpressions.join(", ");

  try {
    const result = await db.send(
      new UpdateCommand({
        TableName: Table.todos.tableName,
        Key: { id },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW",
      })
    );

    console.log("TODO item updated successfully:", result.Attributes);

    return result.Attributes as TodoItem;
  } catch (error) {
    console.error("Error updating TODO item:", error);

    throw new Error("Could not update TODO item");
  }
}

export async function list() {
  const params: ScanCommandInput = {
    TableName: Table.todos.tableName,
  };
  const results = await db.send(new ScanCommand(params));

  return results.Items as TodoItem[];
}

export async function get(id: string): Promise<TodoItem> {
  const params = {
    TableName: Table.todos.tableName,
    Key: { id },
  };

  try {
    const { Item } = await db.send(new GetCommand(params));

    if (!Item) {
      throw new Error("Item not found");
    }

    console.log("TODO item retrieved successfully:", Item);

    return Item as TodoItem;
  } catch (error) {
    console.error("Error retrieving TODO item:", error);

    throw new Error("Could not retrieve TODO item");
  }
}

export async function remove(id: string): Promise<{ id: string }> {
  const params = {
    TableName: Table.todos.tableName,
    Key: { id },
  };

  try {
    const existingItem = await get(id);

    if (!existingItem.completed) {
      console.log("Selected item does not exist!");

      throw new Error("Selected item does not exist!");
    }

    await db.send(new DeleteCommand(params));

    console.log("TODO item deleted successfully:", id);

    return { id };
  } catch (error) {
    console.error("Error deleting TODO item:", error);

    throw new Error("Could not delete TODO item");
  }
}
