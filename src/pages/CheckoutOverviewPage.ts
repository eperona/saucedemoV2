import { Page } from '@playwright/test';
import { expect, step } from '../tests/base';

export default class CheckoutOverviewPage {

    private readonly finishButtonSelector = "#finish";
    private readonly cancelButtonSelector = "#cancel";
    private readonly subtotalSelector = ".summary_subtotal_label";
    private readonly taxSelector = ".summary_tax_label";
    private readonly totalSelector = ".summary_total_label";

    constructor(private page: Page) {}

    @step('Checkout Overview Page is opened')
    async isOpened() {
        await expect(this.page.locator(this.finishButtonSelector)).toBeVisible();
    }

    @step('Click on Cancel button')
    async clickCancelButton() {
        await this.page.locator(this.cancelButtonSelector).click();
    }

    @step('Get Subtotal amount')
    async getSubtotal() {
        return this.page.locator(this.subtotalSelector).textContent();
    }
    
    @step('Get Tax amount')
    async getTax() {
        return this.page.locator(this.taxSelector).textContent();
    }

    @step('Get Total amount')
    async getTotalAmount() {
        return this.page.locator(this.totalSelector).textContent();
    }

    @step('Click on Finish button')
    async clickFinishButton() {
        await this.page.locator(this.finishButtonSelector).click();
    }

}