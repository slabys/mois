import { Allow } from "class-validator";

export class CreateEventApplication {
  @Allow()
  spotTypeId: number;

  @Allow()
  additionalFormData: object = {};
}
