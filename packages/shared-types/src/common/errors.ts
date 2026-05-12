export enum CommonErrorCodeEnum {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

export const COMMON_ERRORS = {
  VALIDATION_ERROR: {
    code: CommonErrorCodeEnum.VALIDATION_ERROR,
    field: 'field',
    message: 'data in field is invalid',
  },
} as const;
