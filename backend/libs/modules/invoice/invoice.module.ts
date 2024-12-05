import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { InvoiceService } from "./providers/services";

@Module({
  imports: [
    ClientsModule.registerAsync({
      clients: [
        {
          name: "DOCUMENTS",
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            transport: Transport.REDIS,
            options: {
              // TODO: SET THIS IN Env
              db: 0,
              host: configService.getOrThrow("REDIS_HOST"),
              port: configService.get("REDIS_PORT"),
              username: configService.get("REDIS_USERNAME"),
              password: configService.get("REDIS_PASSWORD"),
            },
          }),
        },
      ],
    }),
  ],
  providers: [InvoiceService],
  exports: [InvoiceService],
})
export class InvoiceModule {}
