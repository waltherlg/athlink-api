import {
  ACCOUNT_ERRORS,
  AUTH_ERRORS,
  COACH_ERROS,
  COMMON_ERRORS,
  JOURNAL_ACCESS_ERRORS,
  SESSION_ERRORS,
  TRAINING_JOURNAL_ERRORS,
  TRAINING_RECORD_ERRORS,
} from '@shared-types';
import type { ErrorCode } from '@shared-types';
import { getLanguage } from '../i18n';
import type { ApiError } from './http';

type ErrorMessageDto = {
  code?: ErrorCode;
  field?: string | null;
  message?: string;
};

type ErrorResponseDto = {
  errorMessages?: ErrorMessageDto[];
};

type SharedErrorDef = {
  code: ErrorCode;
  field: string | null;
  message: string;
};

export type FormErrors<TField extends string> = {
  fieldErrors: Partial<Record<TField, string[]>>;
  globalErrors: string[];
};

const SERVER_UNAVAILABLE = {
  ru: 'Сервер недоступен.',
  en: 'Server unavailable.',
} as const;

const DEFAULT_ERROR = {
  ru: 'Не удалось выполнить запрос.',
  en: 'Request could not be completed.',
} as const;

const ERROR_MESSAGES: Record<ErrorCode, { ru: string; en: string }> = {
  EMAIL_ALREADY_EXISTS: {
    ru: 'Пользователь с таким email уже зарегистрирован.',
    en: 'User with this email is already registered.',
  },
  USERNAME_ALREADY_EXISTS: {
    ru: 'Пользователь с таким именем уже зарегистрирован.',
    en: 'User with this username is already registered.',
  },
  CODE_ALREADY_CONFIRMED: {
    ru: 'Код уже был подтвержден.',
    en: 'The code has already been confirmed.',
  },
  CODE_INCORRECT: {
    ru: 'Неверный код подтверждения.',
    en: 'Incorrect confirmation code.',
  },
  CODE_EXPIRED: {
    ru: 'Срок действия кода истек.',
    en: 'The code has expired.',
  },
  CODE_INVALID: {
    ru: 'Код подтверждения неверный или устарел.',
    en: 'The confirmation code is invalid or expired.',
  },
  EMAIL_ALREADY_CONFIRMED: {
    ru: 'Email уже подтвержден.',
    en: 'Email is already confirmed.',
  },
  EMAIL_NOT_FOUND: {
    ru: 'Пользователь с таким email не найден.',
    en: 'User with this email was not found.',
  },
  EMAIL_NOT_CONFIRMED: {
    ru: 'Email не подтвержден.',
    en: 'Email is not confirmed.',
  },
  NOT_OWNER: {
    ru: 'Недостаточно прав для этого действия.',
    en: 'You do not have permission for this action.',
  },
  UNAUTHORIZED: {
    ru: 'Сессия истекла. Войдите снова.',
    en: 'Your session has expired. Please sign in again.',
  },
  EMAIL_OR_PASSWORD_INCORRECT: {
    ru: 'Неверный email или пароль.',
    en: 'The email or password is incorrect.',
  },
  NO_RESPONSE_FROM_OAUTH: {
    ru: 'OAuth-сервис не ответил.',
    en: 'OAuth service did not respond.',
  },
  UNSUPPORTED__OAUTH_PROVIDER: {
    ru: 'Этот OAuth-провайдер не поддерживается.',
    en: 'This OAuth provider is not supported.',
  },
  SESSION_NOT_FOUND: {
    ru: 'Сессия не найдена. Войдите снова.',
    en: 'Session was not found. Please sign in again.',
  },
  VALIDATION_ERROR: {
    ru: 'Проверьте значение поля.',
    en: 'Check this field value.',
  },
  TRAINING_JOURNAL_ALREADY_EXISTS: {
    ru: 'Дневник для этого вида спорта уже существует.',
    en: 'A journal for this sport type already exists.',
  },
  TRAINING_JOURNAL_NOT_FOUND: {
    ru: 'Дневник не найден.',
    en: 'Training journal was not found.',
  },
  EVENT_REQUIRED: {
    ru: 'Выберите упражнение.',
    en: 'Select an exercise.',
  },
  EVENT_NOT_ALLOWED: {
    ru: 'Для свободной тренировки упражнение выбирать нельзя.',
    en: 'Free training does not allow exercise selection.',
  },
  EVENT_INVALID: {
    ru: 'Выбранное упражнение недоступно.',
    en: 'Selected exercise is invalid.',
  },
  RESULT_REQUIRED: {
    ru: 'Введите результат.',
    en: 'Enter a result.',
  },
  RESULT_INVALID: {
    ru: 'Некорректный результат.',
    en: 'Result value is invalid.',
  },
  RESULT_NOT_ALLOWED: {
    ru: 'Для свободной тренировки результат не нужен.',
    en: 'Free training does not allow a result.',
  },
  COACH_PROFILE_ALREADY_EXISTS: {
    ru: 'Профиль тренера для этого вида спорта уже существует.',
    en: 'A coach profile for this sport type already exists.',
  },
  COACH_PROFILE_NOT_FOUND: {
    ru: 'Профиль тренера не найден.',
    en: 'Coach profile was not found.',
  },
  REQUEST_NOT_FOUND: {
    ru: 'Запрос доступа не найден.',
    en: 'Access request was not found.',
  },
  REQUEST_ALREADY_EXISTS: {
    ru: 'Запрос этому тренеру уже отправлен.',
    en: 'A pending request already exists.',
  },
  REQUEST_ALREADY_PROCESSED: {
    ru: 'Этот запрос уже обработан.',
    en: 'This request has already been processed.',
  },
  ACCESS_ALREADY_EXISTS: {
    ru: 'Доступ уже выдан.',
    en: 'Access already exists.',
  },
  ACCESS_NOT_FOUND: {
    ru: 'Доступ не найден.',
    en: 'Access was not found.',
  },
  JOURNAL_NOT_FOUND: {
    ru: 'Дневник не найден.',
    en: 'Journal was not found.',
  },
  SPORT_TYPE_MISMATCH: {
    ru: 'Вид спорта профиля тренера не совпадает с дневником.',
    en: 'Coach profile sport type does not match the journal.',
  },
};

const SHARED_ERROR_DEFS: SharedErrorDef[] = [
  ...Object.values(ACCOUNT_ERRORS),
  ...Object.values(AUTH_ERRORS),
  ...Object.values(SESSION_ERRORS),
  ...Object.values(COMMON_ERRORS),
  ...Object.values(TRAINING_JOURNAL_ERRORS),
  ...Object.values(TRAINING_RECORD_ERRORS),
  ...Object.values(COACH_ERROS),
  ...Object.values(JOURNAL_ACCESS_ERRORS),
];

const SHARED_FIELD_BY_CODE = SHARED_ERROR_DEFS.reduce<
  Partial<Record<ErrorCode, string | null>>
>((acc, error) => {
  acc[error.code] = error.field;
  return acc;
}, {});

const getLocalized = (messages: { ru: string; en: string }) =>
  messages[getLanguage()];

const getMessageByCode = (code: ErrorCode | undefined): string | null => {
  if (!code) return null;
  return getLocalized(ERROR_MESSAGES[code] ?? DEFAULT_ERROR);
};

export const isApiError = (error: unknown): error is ApiError =>
  Boolean(error && typeof error === 'object' && 'message' in error);

export const getServerUnavailableMessage = () =>
  getLocalized(SERVER_UNAVAILABLE);

export const getDefaultApiErrorMessage = () => getLocalized(DEFAULT_ERROR);

export const parseApiErrorMessages = (
  details: unknown,
): ErrorMessageDto[] => {
  if (!details || typeof details !== 'object') return [];
  const errorMessages = (details as ErrorResponseDto).errorMessages;
  return Array.isArray(errorMessages) ? errorMessages : [];
};

export const getApiErrorMessages = (
  error: unknown,
  fallback = getDefaultApiErrorMessage(),
): string[] => {
  if (isApiError(error) && error.isNetworkError) {
    return [getServerUnavailableMessage()];
  }

  const errorMessages = parseApiErrorMessages(
    isApiError(error) ? error.details : undefined,
  );
  const messages = errorMessages
    .map((item) => getMessageByCode(item.code))
    .filter((message): message is string => Boolean(message));

  if (messages.length) return messages;
  return [fallback];
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = getDefaultApiErrorMessage(),
) => getApiErrorMessages(error, fallback)[0] ?? fallback;

export const normalizeApiFormErrors = <TField extends string>(
  error: unknown,
  fields: readonly TField[],
  fallback = getDefaultApiErrorMessage(),
): FormErrors<TField> => {
  const result: FormErrors<TField> = { fieldErrors: {}, globalErrors: [] };

  if (isApiError(error) && error.isNetworkError) {
    result.globalErrors.push(getServerUnavailableMessage());
    return result;
  }

  const fieldSet = new Set<string>(fields);
  const errorMessages = parseApiErrorMessages(
    isApiError(error) ? error.details : undefined,
  );

  for (const item of errorMessages) {
    const message = getMessageByCode(item.code) ?? fallback;
    const payloadField =
      typeof item.field === 'string' && fieldSet.has(item.field)
        ? item.field
        : null;
    const sharedField =
      item.code && SHARED_FIELD_BY_CODE[item.code]
        ? SHARED_FIELD_BY_CODE[item.code]
        : null;
    const targetField =
      payloadField ??
      (sharedField && fieldSet.has(sharedField) ? sharedField : null);

    if (targetField) {
      const typedField = targetField as TField;
      result.fieldErrors[typedField] = [
        ...(result.fieldErrors[typedField] ?? []),
        message,
      ];
    } else {
      result.globalErrors.push(message);
    }
  }

  if (!result.globalErrors.length && !Object.keys(result.fieldErrors).length) {
    result.globalErrors.push(fallback);
  }

  return result;
};
