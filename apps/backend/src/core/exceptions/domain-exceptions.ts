import { ApiProperty } from '@nestjs/swagger';
import { DomainExceptionCode } from './domain-exception-codes';
import { AccountErrorCodeEnum, ErrorCode } from '@shared-types';

export class ErrorResponse {
  @ApiProperty({
    type: () => ErrorMessage,
    isArray: true,
    example: [
      {
        message: 'string',
        field: 'string',
      },
    ],
  })
  errorMessages: ErrorMessage[];
}

export class ErrorMessage {
  @ApiProperty({
    enum: [...Object.values(AccountErrorCodeEnum)],
  })
  code: ErrorCode;
  @ApiProperty({ example: 'string' })
  message: string;
  @ApiProperty({ example: 'string' })
  field: string | null;

  constructor(code: ErrorCode, message: string, field: string | null = null) {
    this.code = code;
    this.message = message;
    this.field = field;
  }
}

export class DomainException extends Error {
  constructor(
    public message: string,
    public code: DomainExceptionCode,
    public extensions: ErrorMessage[],
  ) {
    super(message);
  }
}

function ConcreteDomainExceptionFactory(
  commonMessage: string,
  code: DomainExceptionCode,
) {
  return class extends DomainException {
    constructor(extensions: ErrorMessage[]) {
      super(commonMessage, code, extensions);
    }
    // static create(message?: string, key?: string) {
    //   return new this(message ? [new ErrorMessage(message, key)] : []);
    // }
    static create(errorObj?: {
      code: ErrorCode;
      field: string;
      message: string;
    }) {
      return new this(
        errorObj
          ? [new ErrorMessage(errorObj.code, errorObj.message, errorObj.field)]
          : [],
      );
    }

    static createWithArray(extensions: ErrorMessage[]) {
      return new this(extensions);
    }
  };
}

export const NotFoundDomainException = ConcreteDomainExceptionFactory(
  'Not Found',
  DomainExceptionCode.NotFound,
);

export const BadRequestDomainException = ConcreteDomainExceptionFactory(
  'BadRequest',
  DomainExceptionCode.BadRequest,
);

export const ForbiddenDomainException = ConcreteDomainExceptionFactory(
  'Forbidden',
  DomainExceptionCode.Forbidden,
);

export const UnauthorizedDomainException = ConcreteDomainExceptionFactory(
  'Unauthorized',
  DomainExceptionCode.Unauthorized,
);

export const TooManyRequestsDomainException = ConcreteDomainExceptionFactory(
  'TooManyRequests',
  DomainExceptionCode.TooManyRequests,
);
