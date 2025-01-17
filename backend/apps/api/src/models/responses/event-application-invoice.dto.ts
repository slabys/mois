import { ApiExtraModels } from "@nestjs/swagger";
import { Invoice } from "modules/invoice/entities";

@ApiExtraModels(Invoice)
export class EventApplicationInvoice {
	invoice: Invoice;
	url: string;
}
