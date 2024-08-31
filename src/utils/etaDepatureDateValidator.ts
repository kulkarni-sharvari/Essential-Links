import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

/**
 * Custom validator to check if ETA is on or after depature date when raising shipment request.
 */
@ValidatorConstraint({ name: 'isAfterOrEqual', async: false })
export class IsAfterOrEqualConstraint implements ValidatorConstraintInterface {
  validate(value: Date, args: ValidationArguments): boolean {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    if (!(value instanceof Date) || !(relatedValue instanceof Date)) {
      return false;
    }
    return value >= relatedValue;
  }

  defaultMessage(): string {
    return `Expected arrival date should be on or after departure date`;
  }
}