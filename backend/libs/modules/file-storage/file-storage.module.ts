import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { FileStorageService } from "./providers/services";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          rootPath: process.cwd(),
          renderPath: configService.getOrThrow("STORAGE_ROOT"),
          serveStaticOptions: {
            index: false,
          },
        },
      ],
    }),
  ],
  providers: [FileStorageService],
  exports: [FileStorageService],
})
export class FileStorageModule {}
