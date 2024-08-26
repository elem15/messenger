import {en, ru} from "@/lib/locales";

export const useTranslation = (locale: 'en' | 'ru') => {

  // const locale = localStorage.getItem('lang')
  const t = locale === 'en' ? en : ru
  return { t }
}
