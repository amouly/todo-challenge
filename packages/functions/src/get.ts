import { ApiHandler } from "sst/node/api";
import { get } from "@todo-challenge/core/todo";
import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { response } from "./common/helper";

export const handler = ApiHandler(
  async (_evt): Promise<APIGatewayProxyStructuredResultV2> => {
    const id = _evt.pathParameters?.id;

    if (!id) {
      return response(400, { message: "ID is required!" });
    }

    try {
      const item = await get(id);

      return response(200, item);
    } catch (error: any) {
      return response(500, {
        message: error.message,
      });
    }
  }
);
