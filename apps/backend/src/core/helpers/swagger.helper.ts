type ErrorDef = {
  code: string;
  field: string;
  message: string;
};

export function buildErrorExamples(errors: ErrorDef[]) {
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
