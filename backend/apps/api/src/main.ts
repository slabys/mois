import packageJson from "package.json";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import { isDevelopment, isProduction } from "utilities/env";
import { includeSwagger } from "utilities/swagger";
import { AppModule } from "./app.module";
import { ExpressAdapter } from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());

  app.enableCors({
    // Allow all origins
    origin: ["https://slabys.cz", "https://api.slabys.cz"],
    credentials: true,
  });

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

  // const configService = app.get(ConfigService);
  app.use(cookieParser());
  await app.listen(process.env.PORT_APP1 ?? 4000);
}

bootstrap();
