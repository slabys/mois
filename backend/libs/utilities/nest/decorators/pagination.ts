import {
	BadRequestException,
	type ExecutionContext,
	type ParamDecoratorEnhancer,
	createParamDecorator,
} from "@nestjs/common";
import { ApiQuery, type ApiQueryOptions } from "@nestjs/swagger";
import type { Request } from "express";

export interface PaginationOptions {
	skip: number;
	take: number;
}

/**
 * {@link ApiQueryOptions} does not expose default by default
 */
type ApiQueryWithDefault = ApiQueryOptions & {
	default: unknown;
};

/**
 * Enhanced applies Swagger decorators
 * @param defaultOptions Default pagination options
 * @returns
 */
const PaginationTypeEnhancer =
	(defaultOptions?: Partial<PaginationOptions>): ParamDecoratorEnhancer =>
	(target: Record<string, unknown>, propertyKey: string): void => {
		const descriptor = Reflect.getOwnPropertyDescriptor(target, propertyKey);
		ApiQuery(<ApiQueryWithDefault>{
			name: "take",
			type: Number,
			required: false,
			description: "Pagination number of results",
			default: defaultOptions?.take ?? 16,
		})(target, propertyKey, descriptor);
		ApiQuery(<ApiQueryWithDefault>{
			name: "skip",
			type: Number,
			required: false,
			description: "Pagination number of skipped results",
			default: defaultOptions?.skip ?? 0,
		})(target, propertyKey, descriptor);
	};

/**
 * Pagination
 * @param defaultOptions Default pagination options
 * @returns {PaginationOptions}
 */
export const Pagination = (
	defaultOptions?: Partial<PaginationOptions>,
	// biome-ignore lint/suspicious/noExplicitAny: Nest handle dataOrPipes same way
	...dataOrPipes: any[]
) =>
	createParamDecorator(
		(_, context: ExecutionContext) => {
			if (context.getType() !== "http") throw new BadRequestException("Invalid context");

			const request = context.switchToHttp().getRequest<Request>();

			let take = Number(request.query?.take);
			let skip = Number(request.query?.skip);

			take = !Number.isNaN(take) ? take : defaultOptions?.take || 16;
			skip = !Number.isNaN(skip) ? skip : defaultOptions?.skip || 0;

			take = Math.max(take, 0);
			skip = Math.max(skip, 0);

			return <PaginationOptions>{
				take,
				skip,
			};
		},
		[PaginationTypeEnhancer(defaultOptions)],
	)(...dataOrPipes);
