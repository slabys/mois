import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { getDataSourceOptions } from "config/typeorm.config";
import { AuthController, UsersController } from "./controllers";

import { AuthModule } from "modules/auth";
import { UsersModule } from "modules/users";

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const options = getDataSourceOptions();
        return {
          ...options,
          entities: undefined,
          autoLoadEntities: true,
          migrations: undefined,
        };
      },
    }),
  ],
  controllers: [AuthController, UsersController],
  providers: [],
})
export class AppModule {}
