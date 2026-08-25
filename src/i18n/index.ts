import { ko } from './ko';

export const localeMessages = { ko } as const;
export type Locale = keyof typeof localeMessages;
export const defaultLocale: Locale = 'ko';
export const t = localeMessages[defaultLocale];
