import { STORAGE_STATE } from "../../playwright.config";
import { COMMON_TEXTS } from "../constants/texts";
import { test } from "../fixtures";

test.describe("Login page", () => {
  test("should login with the correct credentials", async ({
    page,
    loginPage,
  }) => {
    await test.step("Step 1: Visit login page", () => page.goto("/"));
    await test.step("Step 2: Login and verify admin user", () =>
      loginPage.loginAndVerifyUser({
        email: process.env.ADMIN_EMAIL!,
        password: process.env.ADMIN_PASSWORD!,
        username: COMMON_TEXTS.defaultUserName,
      }));
      
    await page.context().storageState({ path: STORAGE_STATE });
  });
});
