import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a number to Bengali numerals with optional zero-padding
 * Example: 1 -> "০১", 2 -> "০২", 10 -> "১০"
 */
export function toBanglaNumber(num: number, padZero: boolean = true): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  let str = String(num);
  if (padZero && num < 10) {
    str = '0' + str;
  }
  return str
    .split('')
    .map(d => bnDigits[parseInt(d, 10)] ?? d)
    .join('');
}

/**
 * Cleans any existing leading serial number prefixes such as "(০১)", "(০২)", "(১)", "০১.", "১." from subject text
 */
export function cleanSubjectPrefix(subject: string | undefined | null): string {
  if (!subject) return '';
  return subject
    .replace(/^\s*\([০-৯0-9]+\)\s*/, '')
    .replace(/^\s*[০-৯0-9]+[।.)]\s*/, '')
    .trim();
}
