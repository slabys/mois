import {
  Controller,
  Get,
  Header,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  StreamableFile,
} from "@nestjs/common";
import {
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { FileStorageService } from "modules/file-storage";
import { InvoiceService } from "modules/invoice";

import { firstValueFrom } from "rxjs";
import { InvoiceSimple, InvoiceUrl } from "../models/responses";

@ApiTags("Invoices")
@Controller("invoice")
export class InvoiceController {
  private readonly logger = new Logger(InvoiceController.name);

  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly fileStorageService: FileStorageService
  ) {}

  /**
   * Get invoice data
   */
  @ApiOkResponse({ type: InvoiceSimple, description: "Invoice data" })
  @ApiNotFoundResponse({ description: "Invoice not found" })
  @Get(":id")
  async getInvoice(@Param("id") id: string): Promise<InvoiceSimple> {
    const invoice = await this.invoiceService.findById(id);
    if (!invoice) throw new NotFoundException("Invoice not found");

    return invoice;
  }

  /**
   * Get invoice PDF public address
   *
   * Will be generated if does not exist.
   */
  @ApiOkResponse({ type: InvoiceUrl })
  @ApiNotFoundResponse({ description: "Invoice not found" })
  @Get(":id/url")
  async getInvoiceUrl(@Param("id") id: string): Promise<InvoiceUrl> {
    const invoice = await this.invoiceService.findById(id);
    if (!invoice) throw new NotFoundException("Invoice not found");

    const data = await this.invoiceService.generatePdfFromInvoice(
      invoice,
      true
    );
    const result = await firstValueFrom(data);

    if (result.success) {
      const url = await this.fileStorageService.getPublicUrl(result.outputPath);
      return {
        url,
      };
    }

    this.logger.warn(`Service error: ${result.error}`);
    throw new InternalServerErrorException("Could fetch invoice");
  }

  /**
   * Get invoice PDF public address
   *
   * Will be generated if does not exist.
   */
  @ApiConsumes()
  @ApiOkResponse({ schema: {} })
  @Header("content-type", "application/pdf")
  @Get(":id/stream")
  async getInvoicePdfStream(@Param("id") id: string): Promise<StreamableFile> {
    const invoice = await this.invoiceService.findById(id);
    if (!invoice) throw new NotFoundException("Invoice not found");

    const data = await this.invoiceService.generatePdfFromInvoice(invoice);
    const result = await firstValueFrom(data);

    if (result.success) {
      const stream = await this.fileStorageService.read(result.outputPath);
      return new StreamableFile(stream, { type: "application/pdf" });
    }

    this.logger.warn(`Service error: ${result.error}`);
    throw new InternalServerErrorException("Could fetch invoice");
  }
}
