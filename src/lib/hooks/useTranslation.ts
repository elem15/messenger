import { useLocation } from 'react-router-dom';
import { en, ru } from '../locales'

export const useTranslation = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const locale = searchParams.get('locale') || 'en';

  const t = locale === 'en' ? en : ru

  return { t }
}
