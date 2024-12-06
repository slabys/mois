import {
  Inject,
  Injectable,
  type OnApplicationBootstrap,
  type OnApplicationShutdown,
} from "@nestjs/common";
import type { ClientProxy } from "@nestjs/microservices";

import type {
  GenerateInvoice,
  GenerateInvoiceResult,
} from "apps/documents/src/types";

@Injectable()
export class InvoiceService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  constructor(
    @Inject("DOCUMENTS")
    private readonly clientProxy: ClientProxy
  ) {}

  async onApplicationBootstrap() {
    await this.clientProxy.connect();
  }

  onApplicationShutdown(signal?: string) {
    this.clientProxy.close();
  }

  /**
   * Generate new invoice
   * @param data Invoice data
   * @returns Observable that allows to manipulate with result
   *
   * @note To get actual data use `firstValueFrom`, to timeout it, use `.pipe` and timeout operator.
   *
   * @example Input data
   * ```
   * {
   *   id: 123,
   *   payment: {
   *     amount: 5000,
   *     ban: "BAN",
   *     iban: "CZ2650512338195119544144",
   *     variableSymbol: 123,
   *     swift: "SWIFT",
   *   },
   *   subscriber: {
   *     address: {
   *       city: "CITY",
   *       country: "COUNTRY",
   *       houseNumber: "132",
   *       region: "REGION",
   *       street: "STREET",
   *       zip: "123 12",
   *     },
   *     cin: "CIN",
   *     name: "SUBSCRIBER NAME",
   *     vatId: "VAT ID",
   *   },
   *   supplier: {
   *     address: {
   *       city: "CITY",
   *       country: "COUNTRY",
   *       houseNumber: "132",
   *       region: "REGION",
   *       street: "STREET",
   *       zip: "123 12",
   *     },
   *     cin: "CIN",
   *     name: "SUPPLIER NAME",
   *     vatId: "VAT ID",
   *   },
   * }
   * ```
   */
  generate(data: GenerateInvoice["data"]) {
    const outputPath = `invoices/${data.id}.pdf`;

    const payload = <GenerateInvoice>{
      data,
      outputPath,
    };

    return this.clientProxy.send<GenerateInvoiceResult>(
      "invoice.generate",
      payload
    );
  }
}
