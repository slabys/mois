import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { InvoiceService } from "./providers/services";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Invoice, InvoiceItem } from "./entities";

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, InvoiceItem]),
    ClientsModule.registerAsync({
      clients: [
        {
          name: "DOCUMENTS",
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            transport: Transport.REDIS,
            options: {
              db: configService.get("REDIS_DB"),
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
