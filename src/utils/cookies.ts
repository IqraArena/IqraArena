export interface ReadingProgressCookie {
  bookId: string;
  currentPage: number;
  pagesRead: number;
  completedQuizzes: string[];
  lastReadAt: string;
}

export const COOKIE_NAME = 'iqra_reading_progress';
export const COOKIE_EXPIRY_DAYS = 365;

export function setCookie(name: string, value: string, days: number): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

export function getCookie(name: string): string | null {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function deleteCookie(name: string): void {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

export function saveReadingProgress(progress: ReadingProgressCookie): void {
  try {
    const existingData = getReadingProgress();
    const updatedData = {
      ...existingData,
      [progress.bookId]: progress,
    };
    setCookie(COOKIE_NAME, JSON.stringify(updatedData), COOKIE_EXPIRY_DAYS);
  } catch (error) {
    console.error('Error saving reading progress:', error);
  }
}

export function getReadingProgress(): Record<string, ReadingProgressCookie> {
  try {
    const cookieValue = getCookie(COOKIE_NAME);
    if (!cookieValue) return {};
    return JSON.parse(cookieValue);
  } catch (error) {
    console.error('Error reading progress cookie:', error);
    return {};
  }
}

export function getBookProgress(bookId: string): ReadingProgressCookie | null {
  const allProgress = getReadingProgress();
  return allProgress[bookId] || null;
}

export function hasCompletedQuiz(bookId: string, quizId: string): boolean {
  const progress = getBookProgress(bookId);
  return progress?.completedQuizzes?.includes(quizId) || false;
}

export function markQuizCompleted(bookId: string, quizId: string): void {
  const progress = getBookProgress(bookId);
  if (progress) {
    if (!progress.completedQuizzes) {
      progress.completedQuizzes = [];
    }
    if (!progress.completedQuizzes.includes(quizId)) {
      progress.completedQuizzes.push(quizId);
      saveReadingProgress(progress);
    }
  }
}

export function clearReadingProgress(): void {
  deleteCookie(COOKIE_NAME);
}
