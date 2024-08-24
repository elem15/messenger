import {en, ru} from "@/lib/locales";
// import {useLocation} from "react-router";

export const useTranslation = () => {
  // const location = useLocation();
  // const searchParams = new URLSearchParams(location.search);
  // const locale = searchParams.get('locale') || 'en';
  const locale = navigator.language.split('-')[0]

  const t = locale === 'en' ? en : ru
  return { t }
}
