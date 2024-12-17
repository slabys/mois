interface PaymentSubject {
  name: string;
  cin: string;
  vatId: string;
  address: {
    city: string;
    country: string;
    houseNumber: string;
    street: string;
    zip: string;
  };
}

interface GenerateInvoiceItem {
  name: string;
  /**
   * Price is in pennies, so you must multiply it by 100
   * VAT must be already included
   */
  price: number;
  amount: number;
}

export interface GenerateInvoice {
  /**
   * Force regenerate invoice even if exist
   */
  force?: boolean;
  /**
   * Storage output path (must be mount to same directory, or it must be rewritten to use buffers instead)
   */
  outputPath: string;

  /**
   * Invoice data
   */
  data: {
    id: string;

    supplier: PaymentSubject;
    subscriber: PaymentSubject;

    payment: {
      iban: string;
      swift: string;
      variableSymbol: number;
      amount: number;
    };

    items: GenerateInvoiceItem[];

    /**
     * ISO 4217
     */
    currency: string;
  };
}

export type GenerateInvoiceResult =
  | { success: true }
  | {
      success: false;
      error: string;
    };
