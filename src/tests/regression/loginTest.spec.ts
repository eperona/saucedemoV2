import { expect, test } from '../base';
import { USERS, ERROR_MESSAGES } from '../../config/testData';

test.describe('Login Tests', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('should log in with valid credentials', async ({ loginPage, homePage }) => {
    await loginPage.fillUsername(USERS.STANDARD);
    await loginPage.fillPassword(process.env.PASSWORD!);
    await loginPage.submit();
    await homePage.isHomePageLoaded();
  });

  test('should not log in with invalid credentials', async ({ loginPage }) => {
    await loginPage.fillUsername('invalid_user');
    await loginPage.fillPassword('invalid_password');
    await loginPage.submit();

    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain(ERROR_MESSAGES.INVALID_CREDENTIALS);
  });

  test('should display error message for empty credentials', async ({ loginPage }) => {
      await loginPage.fillUsername('');
      await loginPage.fillPassword('');
      await loginPage.submit();

      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toContain(ERROR_MESSAGES.USERNAME_REQUIRED);
  });

  test('should display error message for locked out user', async ({ loginPage }) => {
      await loginPage.fillUsername(USERS.LOCKED_OUT);
      await loginPage.fillPassword(process.env.PASSWORD!);
      await loginPage.submit();

      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toContain(ERROR_MESSAGES.LOCKED_OUT);
  });

  test('should display error message for missing password', async ({ loginPage }) => {
      await loginPage.fillUsername(USERS.STANDARD);
      await loginPage.fillPassword('');
      await loginPage.submit();

      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toContain(ERROR_MESSAGES.PASSWORD_REQUIRED);
  });

  test('should display error message for missing username', async ({ loginPage }) => {
      await loginPage.fillUsername('');
      await loginPage.fillPassword(process.env.PASSWORD!);
      await loginPage.submit();

      const errorMessage = await loginPage.getErrorMessage();
      expect(errorMessage).toContain(ERROR_MESSAGES.USERNAME_REQUIRED);
  });
});