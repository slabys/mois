import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { renderToBuffer } from "@react-pdf/renderer";

import { FileStorageService } from "modules/file-storage";

import { InvoiceDocument } from "./components/invoice.document";
import type { GenerateInvoice, GenerateInvoiceResult } from "./types";

@Controller()
export class DocumentsController {
  constructor(private readonly storageService: FileStorageService) {}

  @EventPattern("invoice.generate")
  async invoiceGenerate(
    @Payload() { data, outputPath, force }: GenerateInvoice
  ): Promise<GenerateInvoiceResult> {
    
    /**
     * TODO: Handle errors or create app-wise interceptor
     */
    if (!force && (await this.storageService.exist(outputPath)))
      return { success: true };

    try {
      const document = InvoiceDocument(data);
      const buffer = await renderToBuffer(document);

      await this.storageService.save(outputPath, buffer);
      return { success: true };
    } catch (e: unknown) {
      if (e instanceof Error) return { success: false, error: e.message };

      return { success: false, error: "Unknown error" };
    }
  }
}
