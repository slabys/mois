import { Allow } from "class-validator";

export class CreateEventApplication {
  @Allow()
  spotTypeId: string;
}
