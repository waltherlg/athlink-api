import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../../api/auth/registration';
import type { ErrorCode, UserRegistrationInput } from '@shared-types';
import { AccountErrorCodeEnum, CommonErrorCodeEnum } from '@shared-types';
import RegistrationForm from './RegistrationForm';
import type { ApiError } from '../../../api/http';
import { t } from '../../../i18n';

type FieldKey = keyof UserRegistrationInput;

type ErrorMessageDto = {
  code?: ErrorCode;
  field?: string | null;
  message?: string;
};

type ErrorResponseDto = {
  errorMessages?: ErrorMessageDto[];
};

type FormErrors = {
  fieldErrors: Partial<Record<FieldKey, string[]>>;
  globalErrors: string[];
};

const EMPTY_ERRORS: FormErrors = { fieldErrors: {}, globalErrors: [] };
const FALLBACK_MESSAGE = t('register.failed');
const CODE_FIELD_MAP: Partial<Record<ErrorCode, FieldKey | null>> = {
  [AccountErrorCodeEnum.EMAIL_ALREADY_EXISTS]: 'email',
  [AccountErrorCodeEnum.USERNAME_ALREADY_EXISTS]: 'userName',
  [CommonErrorCodeEnum.VALIDATION_ERROR]: null,
};

const isFieldKey = (value: string): value is FieldKey =>
  value === 'email' || value === 'userName' || value === 'password';

export default function RegistrationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>(EMPTY_ERRORS);
  const navigate = useNavigate();

  const appendFieldError = (
    acc: FormErrors,
    field: FieldKey,
    message: string,
  ) => {
    if (!acc.fieldErrors[field]) {
      acc.fieldErrors[field] = [];
    }
    acc.fieldErrors[field]?.push(message);
  };

  const normalizeErrors = (details: unknown): FormErrors => {
    const result: FormErrors = { fieldErrors: {}, globalErrors: [] };

    if (!details || typeof details !== 'object') {
      result.globalErrors.push(FALLBACK_MESSAGE);
      return result;
    }

    const errorMessages = (details as ErrorResponseDto).errorMessages;
    if (!Array.isArray(errorMessages) || errorMessages.length === 0) {
      result.globalErrors.push(FALLBACK_MESSAGE);
      return result;
    }

    for (const error of errorMessages) {
      if (!error || typeof error !== 'object') {
        continue;
      }
      const message =
        typeof error.message === 'string' && error.message.trim().length > 0
          ? error.message
          : FALLBACK_MESSAGE;
      const fieldFromPayload =
        typeof error.field === 'string' && error.field.trim().length > 0
          ? error.field
          : null;
      const directField =
        fieldFromPayload && isFieldKey(fieldFromPayload)
          ? fieldFromPayload
          : null;
      const mappedField =
        !directField && error.code ? CODE_FIELD_MAP[error.code] ?? null : null;
      const targetField = directField ?? mappedField;

      if (targetField) {
        appendFieldError(result, targetField, message);
      } else {
        result.globalErrors.push(message);
      }
    }

    if (result.globalErrors.length === 0 && !Object.keys(result.fieldErrors).length) {
      result.globalErrors.push(FALLBACK_MESSAGE);
    }

    return result;
  };

  const handleSubmit = async (input: UserRegistrationInput) => {
    setIsLoading(true);
    setErrors(EMPTY_ERRORS);
    try {
      await registerUser(input);
      navigate('/login');
    } catch (err) {
      const apiError = err as ApiError | undefined;
      const normalized = normalizeErrors(apiError?.details);
      if (normalized.globalErrors.length === 0 && apiError?.message) {
        normalized.globalErrors.push(apiError.message);
      }
      setErrors(normalized);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="page">
      <header className="page-header">
        <h1>{t('register.title')}</h1>
        <p className="subtitle">{t('register.subtitle')}</p>
      </header>

      <RegistrationForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        errors={errors}
      />
    </section>
  );
}
