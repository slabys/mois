import { Module } from "@nestjs/common";
import { FileStorageService } from "./providers/services";

@Module({
  providers: [FileStorageService],
  exports: [FileStorageService],
})
export class FileStorageModule {}
