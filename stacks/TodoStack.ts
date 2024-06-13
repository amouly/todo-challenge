import { StackContext, Api, Table } from "sst/constructs";

export function TodoStack({ stack }: StackContext) {
  const table = new Table(stack, "todos", {
    fields: {
      id: "string",
      title: "string",
      completed: "number",
      metadata: "string",
    },
    primaryIndex: { partitionKey: "id" },
  });

  const api = new Api(stack, "api", {
    routes: {
      "POST   /todo":     "packages/functions/src/create.handler",
      "GET    /todo":     "packages/functions/src/list.handler",
      "GET    /todo/{id}": "packages/functions/src/get.handler",
      "PUT    /todo/{id}":     "packages/functions/src/update.handler",
      "DELETE /todo/{id}":     "packages/functions/src/delete.handler",
    },
  });

  api.attachPermissions([table]);
  api.bind([table]);

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
