// utils/userId.ts

const STORAGE_KEY = 'daily_spark_user_id';

export function getUserId(): string {
  if (typeof window === 'undefined') return ''; // SSR aizsardzībai

  let userId = localStorage.getItem(STORAGE_KEY);

  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, userId);
  }

  return userId;
}
