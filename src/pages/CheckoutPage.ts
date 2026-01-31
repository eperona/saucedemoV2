import { Page } from '@playwright/test';
import { expect, step } from '../tests/base';

export default class CheckoutPage {
    private readonly firstNameLocator = '#first-name';
    private readonly lastNameLocator = '#last-name';
    private readonly postalCodeLocator = '#postal-code'
    private readonly cancelButtonLocator = '#cancel'
    private readonly continueButtonLocator = '#continue'

    constructor(private page: Page) {}

    @step('Fill firstname')
    async fillFirstName(firstName: string) {
        await this.page.locator(this.firstNameLocator).fill(firstName);
    }
    
    @step('Fill lastname')
    async fillLastName(lastName: string) {
        await this.page.locator(this.lastNameLocator).fill(lastName);
    }

    @step('Fill postal code')
    async fillPostCode(postalCode: string) {
        await this.page.locator(this.postalCodeLocator).fill(postalCode)
    }

    @step('Click Continue Button')
    async clickContinueButton() {
        await this.page.locator(this.continueButtonLocator).click();
    }

    @step('Click Cancel Button')
    async clickCancelButton() {
        await this.page.locator(this.cancelButtonLocator).click();
    }

    @step('Checkout Page is Opened')
    async isOpened() {
        await expect(this.page.locator(this.firstNameLocator)).toBeVisible();
        await expect(this.page.locator(this.continueButtonLocator)).toBeVisible();
    }
}