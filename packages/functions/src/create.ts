import { ApiHandler } from "sst/node/api";
import { create } from "@todo-challenge/core/todo";
import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { response } from "./common/helper";

interface CreateBody {
  title: string;
  metadata: string;
}

export const handler = ApiHandler(
  async (_evt): Promise<APIGatewayProxyStructuredResultV2> => {
    const body = JSON.parse(_evt.body || "") as CreateBody;

    if (!body) {
      return response(400, { message: "TODO object is required!" });
    }

    if (!body.title || body.title.length < 2) {
      return response(400, {
        message: "Title is required and must mean something",
      });
    }

    if (!body.metadata) {
      return response(400, {
        message: "Metadata is required",
      });
    }

    try {
      // Create item always as incomplete
      const item = await create(body.title, false, body.metadata);

      return response(200, item);
    } catch (error: any) {
      return response(500, {
        message: error.message,
      });
    }
  }
);
