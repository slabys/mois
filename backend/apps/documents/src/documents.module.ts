import { Module } from "@nestjs/common";
import { FileStorageModule } from "modules/file-storage";
import { DocumentsService } from "./documents.service";

@Module({
  imports: [FileStorageModule],
  providers: [DocumentsService],
})
export class DocumentsModule {}
