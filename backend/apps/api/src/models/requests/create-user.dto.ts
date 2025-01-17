import { IsEmail, IsEnum, IsObject, IsOptional, IsString, Matches, MinLength } from "class-validator";
import { UserGender } from "modules/users/enums";
import { CreateAddress } from "./create-address.dto";
import { Type } from "class-transformer";

export class CreateUser {
	/**
	 * User email
	 */
	@IsEmail()
	email: string;

	/**
	 * User password
	 */
	@MinLength(6)
	@IsString()
	password: string;

	/**
	 * First name
	 */
	@IsString()
	firstName: string;

	/**
	 * Last name
	 */
	@IsString()
	lastName: string;

	/**
	 * Must not contain special characters
	 */
	@IsString()
	@Matches(/^[a-zA-Z0-9]+$/)
	@MinLength(6)
	username: string;

	/**
	 * User gender
	 */
	@IsEnum(UserGender)
	gender: UserGender = UserGender.PreferNotToSay;

	@IsObject()
	@IsOptional()
	@Type(() => CreateAddress)
	personalAddress?: CreateAddress | undefined | null;
}
