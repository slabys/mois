import { OmitType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { Invoice, InvoiceItem } from "modules/invoice/entities";

export class InvoiceSimpleItem extends OmitType(InvoiceItem, ["invoice"]) {}

export class InvoiceSimple extends OmitType(Invoice, ["items"]) {
	@Type(() => InvoiceSimpleItem)
	items: InvoiceSimpleItem[];
}
