import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from "@nestjs/common";

interface ParseDatePipeOptions {
  required: boolean;
}

export class ParseDatePipe implements PipeTransform {
  constructor(private readonly options?: ParseDatePipeOptions) {}

  transform(value: string, metadata: ArgumentMetadata) {
    if (!value && !this.options?.required) return undefined;
    const number = Number.parseInt(value);
    if (Number.isNaN(number)) throw new BadRequestException("Invalid date");
    return new Date(number);
  }
}
