import { defineConfig } from "orval";

export default defineConfig({
  api: {
    output: {
      mode: "split",
      client: "react-query",
      target: "src/utils/api.ts",
      override: {
        mutator: {
          path: "./src/utils/customInstance.ts",
          name: "customInstance",
        },
      },
    },
    input: {
      // target: "http://localhost:4000/docs-json",
      target: "https://api.slabys.cz/docs-json",
    },
    hooks: {
      afterAllFilesWrite: ["yarn prettier --write ./src/utils/api.ts"],
    },
  },
});
