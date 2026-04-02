import { en } from './en';
import { ru } from './ru';

export type Language = 'en' | 'ru';
export type MessageKey = keyof typeof en;

const DEFAULT_LANGUAGE: Language = 'ru';
const STORAGE_KEY = 'athlink.language';

const isSupportedLanguage = (value: string | null): value is Language =>
  value === 'en' || value === 'ru';

export const getLanguage = (): Language => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isSupportedLanguage(stored) ? stored : DEFAULT_LANGUAGE;
};

export const setLanguage = (language: Language) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, language);
};

const interpolate = (template: string, vars?: Record<string, string | number>) => {
  if (!vars) return template;
  return Object.entries(vars).reduce((acc, [key, value]) => {
    return acc.split(`{${key}}`).join(String(value));
  }, template);
};

export const t = (key: MessageKey, vars?: Record<string, string | number>) => {
  const lang = getLanguage();
  const dictionary = lang === 'ru' ? ru : en;
  const fallback = en[key] ?? key;
  return interpolate(dictionary[key] ?? fallback, vars);
};
