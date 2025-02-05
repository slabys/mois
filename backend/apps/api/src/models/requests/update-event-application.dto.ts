import { PartialType, PickType } from "@nestjs/swagger";
import { CreateEventApplication } from "./create-event-application.dto";

export class UpdateEventApplication extends PartialType(
	PickType(CreateEventApplication, ["invoiceMethod", "idNumber", "invoiceAddress", "additionalFormData"]),
) {
}
