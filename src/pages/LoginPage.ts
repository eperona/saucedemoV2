import {Page} from '@playwright/test';
import { step } from '../tests/base';

export default class LoginPage {
    private readonly usernameInputSelector = "#user-name";
    private readonly passwordInputSelector = "#password";
    private readonly submitButtonSelector = "#login-button";

  constructor(private page: Page) {}
  
  @step('Go to login page')
  async goto() {
     const url = process.env.URL;
     if (!url) {
       throw new Error("Environment variable 'URL' is not defined.");
     }
     await this.page.goto(url);
  }

  @step('Fill username')
  async fillUsername(username: string) {
    await this.page.locator(this.usernameInputSelector).fill(username);
  }

  @step('Fill password')
  async fillPassword(password: string) {
    await this.page.locator(this.passwordInputSelector).fill(password);
  }

  @step('Click submit button')
  async submit() {
    await this.page.locator(this.submitButtonSelector).click();
  }

  @step('Check if error message is visible')
  async getErrorMessage(): Promise<string> {
    const errorMessage = await this.page.textContent('[data-test="error"]');
    return errorMessage ?? "";
  }
  
  @step('Login')
  async login(username: string, password: string) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.submit();
  }
}

