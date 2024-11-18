import { Allow, MinLength } from "class-validator";

export class CreateEvent {
  @MinLength(6)
  title: string;

  @Allow()
  since: Date;

  @Allow()
  until: Date;

  @MinLength(30)
  description: string;
}
