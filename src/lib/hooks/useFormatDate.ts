export function useFormatDate(dateString: string, language: 'en' | 'ru'): string {
  const date = new Date(dateString);
  const now = new Date();

  const isSameDay = date.toDateString() === now.toDateString();
  const isSameWeek = getWeekNumber(date) === getWeekNumber(now) && date.getFullYear() === now.getFullYear();
  const isSameYear = date.getFullYear() === now.getFullYear();

  if (isSameDay) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (isSameWeek) {
    return date.toLocaleDateString([language], { weekday: 'short' });
  } else if (isSameYear) {
    return date.toLocaleDateString([language], { day: 'numeric', month: 'short' });
  } else {
    return date.getFullYear().toString();
  }
}

function getWeekNumber(date: Date): number {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
}