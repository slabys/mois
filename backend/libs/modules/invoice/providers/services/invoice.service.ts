import {
  Inject,
  Injectable,
  type OnApplicationBootstrap,
  type OnApplicationShutdown,
} from "@nestjs/common";
import type { ClientProxy } from "@nestjs/microservices";
import { InjectEntityManager } from "@nestjs/typeorm";
import dayjs from "dayjs";

import type {
  GenerateInvoice,
  GenerateInvoiceResult,
} from "apps/documents/src/types";
import { Invoice } from "modules/invoice/entities/invoice.entity";
import { map } from "rxjs";
import { Between, EntityManager } from "typeorm";

type CreateInvoice = Omit<Invoice, "id" | "createdAt">;

@Injectable()
export class InvoiceService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  constructor(
    @Inject("DOCUMENTS")
    private readonly clientProxy: ClientProxy,
    @InjectEntityManager()
    private readonly entityManager: EntityManager
  ) {}

  async onApplicationBootstrap() {
    await this.clientProxy.connect();
  }

  onApplicationShutdown() {
    this.clientProxy.close();
  }

  /**
   * Get invoice by ID
   * @param id ID
   */
  findById(id: string) {
    return this.entityManager.findOne(Invoice, {
      where: { id },
    });
  }

  /**
   * Format invoice ID
   * @param number Invoice ID
   * @param year Invoice create year
   * @returns E<year>{0..0}<invoiceId>
   *
   * @example E20240001
   */
  private formatInvoiceId(number: number, year: number) {
    const suffix =
      number.toString().length > 4 ? number : "0".repeat(4 - number) + number;
    return `E${year}${suffix}`;
  }

  /**
   * Create new invoice
   * @param data Invoice data
   * @returns Saved invoice
   */
  async create(data: CreateInvoice) {
    return this.entityManager.transaction(async (em) => {
      const start = dayjs().hour(0).minute(0).second(0).millisecond(0);
      const end = dayjs(start).add(1, "day");

      const todayInvoices = await em.countBy(Invoice, {
        createdAt: Between(start.toDate(), end.toDate()),
      });

      const id = this.formatInvoiceId(todayInvoices, start.year());

      const invoice = new Invoice({
        id,
        iban: data.iban,
        items: data.items,
        subscriber: data.subscriber,
        constantSymbol: data.constantSymbol,
        variableSymbol: data.variableSymbol,
        swift: data.swift,
        supplier: data.supplier,
      });

      return em.save(invoice);
    });
  }

  /**
   * Generate new invoice
   * @param data Invoice data
   * @param force Force rengenerate invoice PDF
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
  generatePdf(data: GenerateInvoice["data"], force?: boolean) {
    const outputPath = `invoices/${data.id}.pdf`;

    const payload = <GenerateInvoice>{
      data,
      outputPath,
      force,
    };

    const observable = this.clientProxy.send<GenerateInvoiceResult>(
      "invoice.generate",
      payload
    );

    return observable.pipe(
      map((result) => ({
        outputPath,
        success: result.success,
        error: result.success === false ? result.error : undefined,
      }))
    );
  }

  /**
   * Generate invoice pdf from invoice data
   * @param invoice Invoice data
   * @returns
   */
  generatePdfFromInvoice(invoice: Invoice, force?: boolean) {
    const totalCost = invoice.items.reduce(
      (prev, current) => prev + current.price,
      0
    );

    return this.generatePdf(
      {
        id: invoice.id,
        payment: {
          amount: totalCost,
          ban: "BAN",
          iban: invoice.iban,
          variableSymbol: invoice.variableSymbol,
          swift: invoice.swift,
        },
        subscriber: {
          vatId: invoice.subscriber.vatId,
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
          vatId: invoice.supplier.vatId,
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
      },
      force
    );
  }
}
