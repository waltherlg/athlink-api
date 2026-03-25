import { getSchemaPath } from '@nestjs/swagger';
import { ErrorResponse } from '../exceptions/domain-exceptions';

type ErrorDef = {
  code: string;
  field: string;
  message: string;
};

export abstract class SwaggerHelper {
  private static buildErrorExamples(errors: ErrorDef[]) {
    return Object.fromEntries(
      errors.map((error) => [
        error.code,
        {
          value: {
            errorMessages: [
              {
                code: error.code,
                message: error.message,
                field: error.field,
              },
            ],
          },
        },
      ]),
    );
  }

  static buildErrorResponse(errors: ErrorDef[]) {
    return {
      schema: {
        allOf: [{ $ref: getSchemaPath(ErrorResponse) }],
      },
      examples: this.buildErrorExamples(errors),
    };
  }
}
