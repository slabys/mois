import { Module } from "@nestjs/common";
import { FileStorageModule } from "modules/file-storage";
import { DocumentsController } from "./documents.controller";

@Module({
	controllers: [DocumentsController],
	imports: [FileStorageModule],
})
export class DocumentsModule {}
