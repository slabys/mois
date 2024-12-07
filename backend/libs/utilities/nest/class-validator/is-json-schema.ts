import {
  ValidatorConstraint,
  type ValidatorConstraintInterface,
  type ValidationArguments,
  Validate,
} from "class-validator";
import Ajv from "ajv";

@ValidatorConstraint({ name: "jsonSchemaValidator", async: false })
export class JsonSchemaValidatorConstraint
  implements ValidatorConstraintInterface
{
  validate(schema: object, args?: ValidationArguments): boolean {
    try {
      const ajv = new Ajv();
      ajv.compile(schema);
      return true;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args?: ValidationArguments): string {
    return "Invalid JSON schema structure";
  }
}

export function IsValidJsonSchema() {
  return Validate(JsonSchemaValidatorConstraint);
}
