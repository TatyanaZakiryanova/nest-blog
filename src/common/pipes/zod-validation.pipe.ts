import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

export class ZodValidationPipe<T> implements PipeTransform {
  constructor(private schema: ZodSchema<T>) {}

  transform(value: unknown, { type }: ArgumentMetadata): T {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (err) {
      if (err instanceof ZodError) {
        throw new BadRequestException({
          message: `Validation failed for ${type}`,
          errors: err.errors,
        });
      }
      throw err;
    }
  }
}
