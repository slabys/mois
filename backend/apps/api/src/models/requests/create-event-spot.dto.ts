import { IsInt, Min, MinLength } from "class-validator";

export class CreateEventSpot {
  @MinLength(6)
  name: string;

  @IsInt()
  @Min(0)
  price: number;
}
