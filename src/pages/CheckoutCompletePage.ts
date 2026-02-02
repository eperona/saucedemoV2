import { Page } from '@playwright/test';
import { expect, step } from '../tests/base';

export default class CheckoutCompletePage {

    private readonly backHomeButtonSelector = "#back-to-products";

    constructor(private page: Page) {}

    @step('Checkout Complete Page is opened')
    async isOpened() {
        await expect(this.page.locator(this.backHomeButtonSelector)).toBeVisible();
    }

    @step('Click on Back Home button')
    async clickBackHomeButton() {
        await this.page.locator(this.backHomeButtonSelector).click();
    }
}