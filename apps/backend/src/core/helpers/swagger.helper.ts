import { ErrorResponse } from '../exceptions/domain-exceptions';

export function buildErrorExamples(
  errors: Record<string, { field: string; message: string }>,
) {
  const examples: Record<string, { value: ErrorResponse }> = {};

  for (const [key, error] of Object.entries(errors)) {
    examples[key] = {
      value: {
        errorMessages: [
          {
            message: error.message,
            field: error.field,
          },
        ],
      },
    };
  }

  return examples;
}
