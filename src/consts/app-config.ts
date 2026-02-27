import type { AdminUserData } from "@/schemas/user";

// We currently only support these two regions. Will expand in the future
export const SUPPORTED_LANGUAGES = ["EN", "ZH"] as const;
export const THEMES = ["dark", "light", "system"] as const;
export const LOCALSTORAGE_KEY = "northpost";
export const LLM_MODELS = [
  "gemini-3-flash-preview",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gpt-5-mini",
  "gpt-5-nano",
  "gpt-4.1-mini",
] as const;
// reference: https://platform.openai.com/docs/guides/latest-model#gpt-5-2-parameter-compatibility
// https://github.com/openai/openai-go/blob/1094636e1d496ed46d2f9e3b8cb5ee8614e443e9/shared/shared.go#L914
export const REASONING_EFFORTS = ["low", "medium", "high", "xhigh"] as const;
export const THINKING_LEVELS = ["minimal", "low", "medium", "high"] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];
export type LLMModel = (typeof LLM_MODELS)[number];
export type Theme = (typeof THEMES)[number];
export type ReasonEffort = (typeof REASONING_EFFORTS)[number];
export type ThinkingLevel = (typeof THINKING_LEVELS)[number];
type LocalStorageType = {
  config?: AppConfigLocalstorageType;
  user?: UserDataLocalstorageType;
};

export interface AppConfigLocalstorageType {
  language?: Language;
  theme?: Theme;
}
export interface UserDataLocalstorageType {
  user?: AdminUserData;
}

export const DEFAULT_MODEL: LLMModel = "gemini-3-flash-preview";
export const DEFAULT_LANGUAGE: Language = "EN";
export const DEFAULT_THEME: Theme = "system";
export const DEFAULT_EFFORT: ReasonEffort = "low";
export const DEFAULT_THINKING_LEVEL: ThinkingLevel = "low";

// For all addresses pagination, fetch 3 pages in advance
export const DEFAULT_PAGE_DISPLAY_SIZE = 16;
export const DEFAULT_PAGE_FETCH_SIZE = DEFAULT_PAGE_DISPLAY_SIZE * 3;

export function getLocalAppConfig(): AppConfigLocalstorageType {
  const localData = getLocalData();
  return localData["config"] || {};
}

export function updateLocalAppConfig(newAppConfig: AppConfigLocalstorageType) {
  const localData = getLocalData();
  localStorage.setItem(
    LOCALSTORAGE_KEY,
    JSON.stringify({ ...localData, config: newAppConfig } as LocalStorageType),
  );
}

export function getLocalUserData(): UserDataLocalstorageType {
  const localData = getLocalData();
  return localData["user"] || {};
}

export function updateLocalUserData(userData: AdminUserData) {
  const localData = getLocalData();
  localStorage.setItem(
    LOCALSTORAGE_KEY,
    JSON.stringify({ ...localData, user: userData } as LocalStorageType),
  );
}

export function clearLocalUserData() {
  const localData = getLocalData();
  delete localData["user"];
  localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(localData));
}

function getLocalData() {
  return JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY) || "{}") as LocalStorageType;
}
