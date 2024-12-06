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

export interface GenerateInvoice {
  outputPath: string;
  data: {
    id: number;

    supplier: PaymentSubject;
    subscriber: PaymentSubject;

    payment: {
      ban: string;
      iban: string;
      variableSymbol: number;
      swift?: string;
      amount: number;
    };
  };
}

export type GenerateInvoiceResult =
  | {
      success: false;
      error: string;
    }
  | { success: true };
