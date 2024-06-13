import { SSTConfig } from "sst";
import { TodoStack } from "./stacks/TodoStack";

export default {
  config(_input) {
    return {
      name: "todo-challenge",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(TodoStack);
  }
} satisfies SSTConfig;
