import { IsInt, IsString, Min, MinLength } from "class-validator";

export class CreateEventSpot {
  @MinLength(6)
  @IsString()
  name: string;

  @IsInt()
  @Min(0)
  price: number;
}
