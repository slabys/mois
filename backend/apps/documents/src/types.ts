interface PaymentSubject {
  name: string;
  cin: string;
  vatId: string;
  address: {
    city: string;
    country: string;
    houseNumber: string;
    region: string;
    street: string;
    zip: string;
  };
}

interface GenerateInvoiceItem {
  name: string;
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
      ban: string;
      iban: string;
      variableSymbol: number;
      swift?: string;
      amount: number;
    };

    items: GenerateInvoiceItem[];
  };
}

export type GenerateInvoiceResult =
  | { success: true }
  | {
      success: false;
      error: string;
    };
