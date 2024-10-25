import { Logger } from "@nestjs/common";
import type { INestApplication } from "@nestjs/common";
import { SwaggerModule, type OpenAPIObject } from "@nestjs/swagger";
import type { Response, Express } from "express";

const template = `
<!DOCTYPE html>
<html>
  <head>
    <title>API Documentation</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="https://unpkg.com/@stoplight/elements/styles.min.css">
    <script src="https://unpkg.com/@stoplight/elements/web-components.min.js"></script>
    <style>
      body {
        margin: 0;
        padding: 0;
      }
      elements-api {
        display: block;
        height: 100vh;
      }
    </style>
  </head>
  <body>
    <elements-api
      apiDescriptionUrl="/api-json"
      router="hash"
      layout="sidebar"
    />
  </body>
</html>
`;

export const includeSwagger = (app: INestApplication<Express>, openApi: Omit<OpenAPIObject, "paths">) => {
	const document = SwaggerModule.createDocument(app, openApi, {
		operationIdFactory: (controllerKey: string, methodKey: string) => {
			// Convert "getUsers" to "Get Users"
			const methodName = methodKey
				.replace(/([A-Z])/g, " $1")
				// Capitalize first letter
				.replace(/^./, (str) => str.toUpperCase())
				// Remove common prefixes like 'get', 'post', etc.
				.replace(/^(Get|Post|Put|Delete|Patch)\s/, "");

			return methodName.trim();
		},
	});

	app.use("/api-json", (_, res) => {
		res.json(document);
	});
	// Serve custom documentation page
	app.use("/api", (_, res: Response) => res.send(template));

	// biome-ignore lint/suspicious/noExplicitAny: NestJS does not expose direct httpServer access. This is for informative, can be deleted
	(app as any).httpServer.on("listening", () => {
		Logger.log("Listening docs on: /api", "Swagger");
	});
};
