import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

export const STORAGE_STATE = "./auth/session.json";

dotenv.config({ path: "./e2e/config/.env" });

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    trace: "on-first-retry",
    baseURL: "http://localhost:3000",
  },

  projects: [
    {
      name: "login",
      use: { ...devices["Desktop Chrome"] },
      testMatch: "**/login.setup.ts",
    },
    {
      name: "teardown",
      use: { ...devices["Desktop Chrome"] },
      testMatch: "**/global.teardown.ts",
    },
    {
      name: "Logged In tests",
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      dependencies: ["login"],
      teardown: "teardown",
      testMatch: "**/*.spec.ts",
      testIgnore: "**/register.spec.ts",
    },
    {
      name: "Logged out tests",
      use: { ...devices["Desktop Chrome"] },
      testMatch: "**/register.spec.ts",
    },
  ],
});
