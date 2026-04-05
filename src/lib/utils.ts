import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const MONTHS: Record<string, number> = {
  January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
  July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
};

/**
 * Calculate total years of experience from work history.
 * Handles overlapping roles correctly by merging date ranges.
 * Returns a whole number rounded up to nearest 0.5.
 */
export function calculateYearsOfExperience(
  workExperiences: Array<{
    startMonth?: string;
    startYear?: string;
    endMonth?: string;
    endYear?: string;
    isCurrentJob?: boolean;
    duration?: string; // legacy
  }>
): number {
  const ranges: Array<[Date, Date]> = [];
  const now = new Date();

  for (const w of workExperiences) {
    if (!w.startYear) continue;

    const startMonthNum = w.startMonth ? (MONTHS[w.startMonth] ?? 0) : 0;
    const start = new Date(parseInt(w.startYear), startMonthNum, 1);

    let end: Date;
    if (w.isCurrentJob) {
      end = now;
    } else if (w.endYear) {
      const endMonthNum = w.endMonth ? (MONTHS[w.endMonth] ?? 11) : 11;
      end = new Date(parseInt(w.endYear), endMonthNum + 1, 0); // last day of end month
    } else {
      end = now;
    }

    if (start <= end) ranges.push([start, end]);
  }

  if (ranges.length === 0) return 0;

  // Sort by start date
  ranges.sort((a, b) => a[0].getTime() - b[0].getTime());

  // Merge overlapping ranges
  const merged: Array<[Date, Date]> = [ranges[0]];
  for (let i = 1; i < ranges.length; i++) {
    const last = merged[merged.length - 1];
    const [start, end] = ranges[i];
    if (start <= last[1]) {
      last[1] = end > last[1] ? end : last[1]; // extend
    } else {
      merged.push([start, end]);
    }
  }

  // Sum total months
  let totalMonths = 0;
  for (const [start, end] of merged) {
    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    totalMonths += Math.max(0, months);
  }

  const years = totalMonths / 12;
  // Round to nearest 0.5, minimum 1
  return Math.max(1, Math.round(years * 2) / 2);
}
