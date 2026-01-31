import { Page } from '@playwright/test';
import { expect, step } from '../tests/base';


export default class CartPage {
    private readonly cartItemsSelector = ".cart_item";
    private readonly checkoutButtonSelector = ".checkout_button";
    private readonly cartPageUrl = process.env.URL! + 'cart.html';
    private readonly continueShoppingButtonSelector = "#continue-shopping";

    constructor(private page: Page) {}

    @step('Go to cart page')
    async goto() {
        await this.page.goto(this.cartPageUrl);
    }

    @step('Click continue shopping button')
    async clickContinueShopping() {
        await expect(this.page.locator(this.continueShoppingButtonSelector)).toBeVisible();
        await this.page.locator(this.continueShoppingButtonSelector).click();
    }

    @step("Click remove button in cart page")
    async clickRemoveButtonInCartPage(productName: string) {
        const removeButtonSelector = `.cart_item:has-text("${productName}") .btn_secondary:has-text("Remove")`;
        await this.page.locator(removeButtonSelector).click();
    }

    @step('Click checkout button')
    async clickCheckoutButton() {
        await this.page.locator(this.checkoutButtonSelector).click();
    }
    
    @step('Check if cart page is loaded')
    async isCartPageLoaded() {
         await expect(this.page.locator(this.checkoutButtonSelector)).toBeVisible();
    }

    @step('Check if added item is visible')
    async isCartItemVisible() {
        await expect(this.page.locator(this.cartItemsSelector)).toBeVisible();
    }

    @step('Check if checkout button is visible')
    async isCheckoutButtonVisible() {
         await expect(this.page.locator(this.checkoutButtonSelector)).toBeVisible();
    }

    @step('Get the number of items in the cart')
    async getCartItemsCount(): Promise<number> {
        try {
            const items = await this.page.locator(this.cartItemsSelector).count();
            return items;
        } catch (error) {
            throw new Error(`Failed to get cart items count: ${error}`);
        }
    }
    
    @step('Check if price is correct for product in cart')
    async checkIfPriceIsCorrect(productName: string, expectedPrice: string): Promise<boolean> {
        const priceLocator = `.cart_item:has-text("${productName}") .inventory_item_price`;
        const actualPrice = await this.page.locator(priceLocator).innerText();
        if (!actualPrice) {
            throw new Error(`Price not found for product: ${productName}`);
        }
        return actualPrice === expectedPrice;
    }

    @step('Check if description is correct for product in cart')
    async checkIfDescriptionIsCorrect(productName: string, expectedDescription: string): Promise<boolean> {
        const descriptionLocator = `.cart_item:has-text("${productName}") .inventory_item_desc`;
        const actualDescription = await this.page.locator(descriptionLocator).innerText();
        return actualDescription === expectedDescription;
    }

    @step('Check if product name is correct in cart page')
    async checkIfProductNameIsCorrect(productName: string): Promise<boolean> {
        const nameLocator = `.cart_item:has-text("${productName}") .inventory_item_name`;
        const actualName = await this.page.locator(nameLocator).innerText();
        return actualName === productName;
    }
}


