import { IsEnum, IsInt, IsString, Min, MinLength } from "class-validator";
import { CurrencyEnum } from "modules/events/enums/currency.enum";

export class CreateEventSpot {
	@MinLength(6)
	@IsString()
	name: string;

	/**
	 * Price in format `1000` => `10.00`
	 *
	 * @example 5090 means 50.90,-
	 */
	@IsInt()
	@Min(0)
	price: number;

	@IsEnum(CurrencyEnum)
	currency: CurrencyEnum = CurrencyEnum.CZK;
}
