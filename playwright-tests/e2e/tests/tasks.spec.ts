import { test } from "../fixtures";
import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import LoginPage from "../poms/login";

test.describe("Tasks page", () => {
  let taskName: string;

  test.beforeEach(async ({ page, taskPage }, testInfo) => {
    taskName = faker.word.words({ count: 5 });

    if (testInfo.title.includes("[SKIP_SETUP]")) return;

    await page.goto("/");
    await taskPage.createTaskAndVerify({ taskName });
  });

  test.afterEach(async ({ page, taskPage }) => {
    await page.goto("/");
    await taskPage.markTaskAsCompletedAndVerify({ taskName });
    const completedTaskInDashboard = page
      .getByTestId("tasks-completed-table")
      .getByRole("row", { name: taskName });

    await completedTaskInDashboard
      .getByTestId("completed-task-delete-link")
      .click();

    await expect(completedTaskInDashboard).toBeHidden();
    await expect(
      page
        .getByTestId("tasks-pending-table")
        .getByRole("row", { name: taskName })
    ).toBeHidden();
  });

  test("should be able to mark a task as completed", async ({ taskPage }) => {
    await taskPage.markTaskAsCompletedAndVerify({ taskName });
  });

  test.describe("Starring tasks feature", () => {
    test.describe.configure({ mode: "serial" });

    test("should be able to star a pending task", async ({ taskPage }) => {
      await taskPage.starTaskAndVerify({ taskName });
    });

    test("should be able to un-star a pending task", async ({
      page,
      taskPage,
    }) => {
      await taskPage.starTaskAndVerify({ taskName });
      const starIcon = page
        .getByTestId("tasks-pending-table")
        .getByRole("row", { name: taskName })
        .getByTestId("pending-task-star-or-unstar-link");
      await starIcon.click();
      await expect(starIcon).toHaveClass(/ri-star-line/);
    });
  });

  test("should create a new task with a different user as the assignee [SKIP_SETUP]", async ({
    page,
    browser,
    taskPage,
  }) => {
    await page.goto("/");
    await taskPage.createTaskAndVerify({ taskName, userName: "Sam Smith" });

    // Creating a new browser context and a page in the browser without restoring the session
    const newUserContext = await browser.newContext({
      storageState: { cookies: [], origins: [] },
    });
    const newUserPage = await newUserContext.newPage();

    // Initializing the login POM here because the fixture is configured to use the default page context
    const loginPage = new LoginPage(newUserPage);

    await newUserPage.goto("/");
    await loginPage.loginAndVerifyUser({
      email: "sam@example.com",
      password: "welcome",
      username: "Sam Smith",
    });
    await expect(
      newUserPage
        .getByTestId("tasks-pending-table")
        .getByRole("row", { name: taskName })
    ).toBeVisible();

    await newUserPage.close();
    await newUserContext.close();
  });
});
