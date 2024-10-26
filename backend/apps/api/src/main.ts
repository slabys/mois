import packageJson from "package.json";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder } from "@nestjs/swagger";
import helmet from "helmet";

import { isDevelopment, isProduction } from "utilities/env";
import { includeSwagger } from "utilities/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableShutdownHooks();

  if (isDevelopment) {
    const config = new DocumentBuilder()
      .setTitle(`${packageJson.name} API`)
      .setDescription(`The ${packageJson.name} API description`)
      .setVersion(packageJson.version)
      .addBearerAuth()
      .build();

    includeSwagger(app, config);
  }

  if (isProduction) {
    app.use(helmet());
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
