import { Page } from '@playwright/test';
import { expect, step } from '../tests/base';

export default class ProductDetailsPage {
    private readonly productNameSelector = ".inventory_details_name";
    private readonly productPriceSelector = ".inventory_details_price";
    private readonly productDescriptionSelector = ".inventory_details_desc";
    private readonly addToCartButtonSelector = ".btn_inventory";
    private readonly removeButtonSelector = "#remove";
    private readonly backToProductsButtonSelector = "#back-to-products";
    private readonly cartIconSelector = ".shopping_cart_link";


    constructor(private page: Page) {}

    @step('Click Add to Cart button')
    async clickAddToCartButton() {
        await this.page.locator(this.addToCartButtonSelector).click();
    }

    @step('Click Remove button')
    async clickRemoveButton() {
        await this.page.locator(this.removeButtonSelector).click();
    }

    @step('Click Cart button')
    async clickCartButton() {
        await this.page.locator(this.cartIconSelector).click();
    }

    @step('Click Back to Products button')
    async clickBackToProductsButton() {     
        await this.page.locator(this.backToProductsButtonSelector).click();
    }

    @step('Check if Image is Correct for product')
    async checkIfImageIsCorrect(productName: string): Promise<boolean> {
        const altValue = await this.page.locator('.inventory_details_img').getAttribute('alt');
        return altValue === productName;
    }

    @step('Check if Price is Correct for product')
    async checkIfPriceIsCorrect(productPrice: string): Promise<boolean> {
        const priceValue = await this.page.locator('.inventory_details_price').textContent();
        return priceValue === productPrice;
    }

    @step('Check if Description is Correct for product')
    async checkIfDescriptionIsCorrect(productDescription: string): Promise<boolean> {
        const descriptionValue = await this.page.locator('.inventory_details_desc').textContent();
        return descriptionValue === productDescription;
    }

    @step('Check if Add to Cart button is visible')
    async isAddToCartButtonVisible(): Promise<void> {
        await expect(this.page.locator(this.addToCartButtonSelector)).toBeVisible();
    }

    @step('Check if Remove button is visible')
    async isRemoveButtonVisible(): Promise<void> {
        await expect(this.page.locator(this.removeButtonSelector)).toBeVisible();
    }

    @step('Check if product details page is loaded')
    async isProductDetailsPageLoaded(): Promise<void>{
        await expect(this.page.locator(this.productNameSelector)).toBeVisible();
        await expect(this.page.locator(this.productPriceSelector)).toBeVisible();
        await expect(this.page.locator(this.productDescriptionSelector)).toBeVisible();
    }   
}