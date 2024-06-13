import { ApiHandler } from "sst/node/api";
import { get, update } from "@todo-challenge/core/todo";
import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { response } from "./common/helper";

interface UpdateBody {
  title?: string;
  completed?: boolean;
  metadata?: string;
}

export const handler = ApiHandler(
  async (_evt): Promise<APIGatewayProxyStructuredResultV2> => {
    const id = _evt.pathParameters?.id;
    const body = JSON.parse(_evt.body || "") as UpdateBody;

    if (!id) {
      return response(400, { message: "ID is required" });
    }

    try {
      const existingItem = await get(id);

      if (!existingItem) {
        console.info("TODO item does not exists", id);

        return response(404, { message: "TODO item does not exists" });
      }

      const updatedItem = update(id, body.title, body.completed, body.metadata);

      console.info("TODO item updated successfully", updatedItem);

      return response(200, updatedItem);
    } catch (error: any) {
      return response(500, {
        message: error.message,
      });
    }
  }
);
