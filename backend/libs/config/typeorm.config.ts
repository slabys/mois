import path from "node:path";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

import { isProduction } from "utilities/env";

const getDataSource = async () => {
  ConfigModule.forRoot({ isGlobal: true });

  const configService = new ConfigService();
  const migrationFiles = isProduction ? ".{ts,js}" : ".ts";

  return new DataSource({
    type: "postgres",
    host: configService.getOrThrow("DB_HOST"),
    port: +configService.get("DB_PORT") || 5432,
    username: configService.get("DB_USER"),
    password: configService.get("DB_PASS"),
    database: configService.getOrThrow("DB_NAME"),
    namingStrategy: new SnakeNamingStrategy(),
    entities: [`./**/*.entity${migrationFiles}`],
    migrations: [
      path.join(process.cwd(), "database", "migrations", `*${migrationFiles}`),
    ],
  });
};

export default getDataSource();
