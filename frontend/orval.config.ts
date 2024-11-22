import { customInstance } from "@/utils/customInstance";
import { defineConfig } from "orval";

export default defineConfig({
  api: {
    output: {
      mode: "split",
      client: "react-query",
      target: "src/utils/api.ts",
      baseUrl: "http://localhost:4000",
      override: {
        mutator: {
          path: "./src/utils/customInstance.ts",
          name: "customInstance",
        },
      },
    },
    input: {
      target: "http://localhost:4000/api-json",
    },
    hooks: {
      afterAllFilesWrite: ["yarn prettier --write ./src/utils/api.ts"],
    },
  },
});
