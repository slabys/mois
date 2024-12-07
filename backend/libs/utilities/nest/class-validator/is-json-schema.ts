import { applyDecorators } from "@nestjs/common";
import Ajv from "ajv";
import { Transform, type TransformFnParams } from "class-transformer";
import {
  Validate,
  type ValidationArguments,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
} from "class-validator";

import { isDevelopment } from "utilities/env";

@ValidatorConstraint({ name: "jsonSchemaValidator", async: false })
export class JsonSchemaValidatorConstraint
  implements ValidatorConstraintInterface
{
  validate(schema: object, args?: ValidationArguments): boolean {
    try {
      const ajv = new Ajv({
        validateSchema: isDevelopment ? "log" : true,
      });
      ajv.compile(schema);
      return true;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args?: ValidationArguments): string {
    return `${args.property}: Invalid JSON schema structure`;
  }
}

const JsonSchemaTransformer = (data: TransformFnParams) => {
  const schemaKeys = Object.keys(data.value).filter((e) => !e.startsWith("$"));
  const compl = schemaKeys.reduce(
    // biome-ignore lint/performance/noAccumulatingSpread: Shorthand to Object.assign
    (prev, current) => ({ ...prev, [current]: data.value[current] }),
    {}
  );
  return compl;
};

export function IsValidJsonSchema() {
  return applyDecorators(
    // Remove key with $
    Transform(JsonSchemaTransformer),
    // Validate modified param
    Validate(JsonSchemaTransformer)
  );
}
