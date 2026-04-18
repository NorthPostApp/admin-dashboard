import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseMusicDuration = (seconds: number | undefined) => {
  if (seconds !== undefined && seconds >= 0) {
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(Math.round(seconds % 60)).padStart(2, "0");
    return `${min}:${sec}`;
  }
  return "--:--";
};

export const parseBytes = (bytes: number): string => {
  const size = bytes / Math.pow(1024, 2);
  if (size <= 1024) {
    return `${size.toFixed(2)} MB`;
  } else {
    return `${(size / 1024).toFixed(2)} GB`;
  }
};

export const getPercentage = (numerator: number, denominator: number) => {
  if (numerator === 0 || denominator === 0) {
    return 0;
  }
  return numerator / denominator;
};
