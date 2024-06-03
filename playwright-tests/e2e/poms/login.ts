import { Page, expect } from "@playwright/test";
import { LOGIN_SELECTORS, NAVBAR_SELECTORS } from "../constants/selectors";

interface LoginPageProps {
  email: string;
  password: string;
  username: string;
}
export default class LoginPage {
  constructor(private page: Page) {}

  loginAndVerifyUser = async ({
    email,
    password,
    username,
  }: LoginPageProps): Promise<void> => {
    await this.page.getByTestId(LOGIN_SELECTORS.emailField).fill(email);
    await this.page.getByTestId(LOGIN_SELECTORS.passwordField).fill(password);
    await this.page.getByTestId(LOGIN_SELECTORS.loginButton).click();

    await expect(
      this.page.getByTestId(NAVBAR_SELECTORS.usernameLabel)
    ).toContainText(username);
    await expect(
      this.page.getByTestId(NAVBAR_SELECTORS.logoutButton)
    ).toBeVisible();
  };
}
