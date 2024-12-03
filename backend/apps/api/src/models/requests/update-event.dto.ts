import { PartialType } from "@nestjs/swagger";
import { CreateEvent } from "./create-event.dto";

export class UpdateEvent extends PartialType(CreateEvent) {}
