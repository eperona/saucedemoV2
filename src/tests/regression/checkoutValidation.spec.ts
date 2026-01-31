import { expect, test } from '../base';

test.describe('Checkout Validation Tests', () => {
    const productName = 'Sauce Labs Backpack';

    test.beforeEach(async ({ productPage, cartPage }) => {
        await productPage.isHomePageLoaded();
        await productPage.addProductToCart(productName);
        await productPage.clickCartIcon();
        await cartPage.isCartPageLoaded();
        await cartPage.clickCheckoutButton();
    });

    test('should display error when submitting checkout with empty first name', async ({ checkoutPage }) => {
        await checkoutPage.isOpened();
        await checkoutPage.fillFirstName('');
        await checkoutPage.fillLastName('Doe');
        await checkoutPage.fillPostCode('12345');
        await checkoutPage.clickContinueButton();


        const errorElement = await checkoutPage['page'].locator('[data-test="error"]');
        await expect(errorElement).toBeVisible();
        await expect(errorElement).toContainText('First Name is required');
    });

    test('should display error when submitting checkout with empty last name', async ({ checkoutPage }) => {
        await checkoutPage.isOpened();
        await checkoutPage.fillFirstName('John');
        await checkoutPage.fillLastName('');
        await checkoutPage.fillPostCode('12345');
        await checkoutPage.clickContinueButton();


        const errorElement = await checkoutPage['page'].locator('[data-test="error"]');
        await expect(errorElement).toBeVisible();
        await expect(errorElement).toContainText('Last Name is required');
    });

    test('should display error when submitting checkout with empty postal code', async ({ checkoutPage }) => {
        await checkoutPage.isOpened();
        await checkoutPage.fillFirstName('John');
        await checkoutPage.fillLastName('Doe');
        await checkoutPage.fillPostCode('');
        await checkoutPage.clickContinueButton();

        const errorElement = await checkoutPage['page'].locator('[data-test="error"]');
        await expect(errorElement).toBeVisible();
        await expect(errorElement).toContainText('Postal Code is required');
    });

    test('should display error when submitting checkout with all empty fields', async ({ checkoutPage }) => {
        await checkoutPage.isOpened();
        await checkoutPage.fillFirstName('');
        await checkoutPage.fillLastName('');
        await checkoutPage.fillPostCode('');
        await checkoutPage.clickContinueButton();

        const errorElement = await checkoutPage['page'].locator('[data-test="error"]');
        await expect(errorElement).toBeVisible();
        await expect(errorElement).toContainText('First Name is required');
    });

    test('should navigate back to cart when clicking cancel', async ({ checkoutPage, cartPage }) => {
        await checkoutPage.isOpened();
        await checkoutPage.clickCancelButton();
        await cartPage.isCartPageLoaded();
    });
});
