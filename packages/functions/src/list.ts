import { ApiHandler } from "sst/node/api";
import { list } from "@todo-challenge/core/todo";
import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import { response } from "./common/helper";

export const handler = ApiHandler(async (_evt): Promise<APIGatewayProxyStructuredResultV2> => {
  const items = list();

  return response(200, items)
});
