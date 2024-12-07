import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateEvent } from "./create-event.dto";

export class UpdateEvent extends OmitType(PartialType(CreateEvent), [
  "registrationForm",
]) {}
