import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { renderToBuffer } from "@react-pdf/renderer";

import { FileStorageService } from "modules/file-storage";

import { InvoiceDocument } from "./components/invoice.document";
import type { GenerateInvoice } from "./types";

@Controller()
export class DocumentsController {
  constructor(private readonly storageService: FileStorageService) {}

  @EventPattern("invoice.generate")
  async invoiceGenerate(@Payload() { data, outputPath }: GenerateInvoice) {
    const document = InvoiceDocument(data);
    const buffer = await renderToBuffer(document);

    await this.storageService.save(outputPath, buffer);
    return "YO";
  }
}
