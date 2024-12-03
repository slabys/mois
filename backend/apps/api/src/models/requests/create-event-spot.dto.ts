import { IsInt, IsPositive, Min, MinLength } from "class-validator";

export class CreateEventSpot {
  @MinLength(6)
  name: string;

  @IsInt()
  @IsPositive()
  capacity: number;

  @IsInt()
  @Min(0)
  price: number;
  
}
