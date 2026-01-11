import { describe, it, expect, beforeEach } from "vitest";
import {
  LOCALSTORAGE_KEY,
  getLocalAppConfig,
  updateLocalAppConfig,
  getLocalUserData,
  updateLocalUserData,
  clearLocalUserData,
  type AppConfigLocalstorageType,
} from "./app-config";
import type { AdminUserData } from "@/schemas/user";

describe("app-config", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should get and update app config", () => {
    expect(getLocalAppConfig()).toEqual({});
    const config: AppConfigLocalstorageType = { language: "ZH", theme: "dark" };
    updateLocalAppConfig(config);
    expect(getLocalAppConfig()).toEqual(config);
  });

  it("should get and update user data", () => {
    expect(getLocalUserData()).toEqual({});
    const userData: AdminUserData = {
      email: "test@example.com",
      displayName: "Test User",
      lastLogin: 1234567890,
      imageUrl: null,
    };
    updateLocalUserData(userData);
    expect(getLocalUserData()).toEqual(userData);
  });

  it("should preserve config when updating user data", () => {
    const config: AppConfigLocalstorageType = { language: "ZH" };
    updateLocalAppConfig(config);
    const userData: AdminUserData = {
      email: "test@example.com",
      displayName: "Test User",
      lastLogin: 1234567890,
      imageUrl: null,
    };
    updateLocalUserData(userData);
    expect(getLocalAppConfig()).toEqual(config);
    expect(getLocalUserData()).toEqual(userData);
  });

  it("should clear user data while preserving config", () => {
    const config: AppConfigLocalstorageType = { language: "ZH" };
    const userData: AdminUserData = {
      email: "test@example.com",
      displayName: "Test User",
      lastLogin: 1234567890,
      imageUrl: null,
    };
    updateLocalAppConfig(config);
    updateLocalUserData(userData);
    clearLocalUserData();
    const stored = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)!);
    expect(stored.user).toBeUndefined();
    expect(stored.config).toEqual(config);
  });
});
