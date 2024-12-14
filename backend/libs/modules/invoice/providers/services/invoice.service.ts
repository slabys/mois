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
import { Invoice } from "modules/invoice/entities/invoice.entity";

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
  generatePdf(data: GenerateInvoice["data"]) {
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

  /**
   * Generate invoice pdf from invoice data
   * @param invoice Invoice data
   * @returns
   */
  generatePdfFromInvoice(invoice: Invoice) {
    const totalCost = invoice.items.reduce(
      (prev, current) => prev + current.price,
      0
    );

    return this.generatePdf({
      id: invoice.id,
      payment: {
        amount: totalCost,
        ban: "BAN",
        iban: invoice.iban,
        variableSymbol: invoice.variableSymbol,
        swift: invoice.swift,
      },
      subscriber: {
        vatId: "ID",
        address: {
          city: invoice.subscriber.address.city,
          country: invoice.subscriber.address.country,
          houseNumber: invoice.subscriber.address.houseNumber,
          region: "REGION",
          street: invoice.subscriber.address.street,
          zip: invoice.subscriber.address.zip,
        },
        cin: invoice.subscriber.cin,
        name: invoice.subscriber.name,
      },
      supplier: {
        vatId: "ID",
        address: {
          city: invoice.supplier.address.city,
          country: invoice.supplier.address.country,
          houseNumber: invoice.supplier.address.houseNumber,
          region: "REGION",
          street: invoice.supplier.address.street,
          zip: invoice.supplier.address.zip,
        },
        cin: invoice.subscriber.cin,
        name: invoice.supplier.name,
      },
      items: invoice.items.map((item) => ({
        amount: item.amount,
        name: item.name,
        price: item.price,
      })),
    });
  }
}
