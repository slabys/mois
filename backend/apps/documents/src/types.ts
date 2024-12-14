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
  outputPath: string;
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
  | {
      success: false;
      error: string;
    }
  | { success: true };
