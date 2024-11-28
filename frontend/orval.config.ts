import { customInstance } from "@/utils/customInstance";
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
      target: "https://api.slabys.cz/api-json",
    },
    hooks: {
      afterAllFilesWrite: ["yarn prettier --write ./src/utils/api.ts"],
    },
  },
});
