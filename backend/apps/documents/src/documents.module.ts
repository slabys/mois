import { Module } from "@nestjs/common";
import { FileStorageModule } from "modules/file-storage";
import { DocumentsService } from "./documents.service";
import { DocumentsController } from "./documents.controller";

@Module({
  controllers: [DocumentsController],
  imports: [FileStorageModule],
  providers: [DocumentsService],
})
export class DocumentsModule {}
