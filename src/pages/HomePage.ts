import {expect, Page} from '@playwright/test';
import { step } from '../tests/base';

export default class HomePage {
    private readonly headerProductSelector = ".title:has-text('Products')";
    private readonly inventoryPageUrl = process.env.URL! + 'inventory.html';
    private readonly cartIconSelector = ".shopping_cart_link";
    private readonly selectProductSorterSelector = ".product_sort_container";   
    private readonly selectAtoZProductsOptionSelector = "option[value='az']";
    private readonly selectZtoAProductsOptionSelector = "option[value='za']";
    private readonly selectLowToHighProductsOptionSelector = "option[value='lohi']";
    private readonly selectHighToLowProductsOptionSelector = "option[value='hilo']";

    constructor(private page: Page) {}

    @step('Go to Product page')
    async goto() {  
        await this.page.goto(this.inventoryPageUrl);
    }

    @step('Click the icon cart')
    async clickCartIcon() {
        await this.isCartIconVisible();
        await this.page.locator(this.cartIconSelector).click();
    }

    @step('Check if cart icon is visible')
    async isCartIconVisible() {
        return await this.page.locator(this.cartIconSelector).isVisible();
    }

    @step('Click Add to Cart button')
    async addProductToCart(productName: string) {
        const productSelector = `.inventory_item:has-text("${productName}") .btn_inventory:has-text("Add to cart")`;
        await this.page.locator(productSelector).click();
    }

    @step('Click Remove button')
    async clickRemoveButtonInProductPage(productName: string) {
        const removeButtonSelector = `.inventory_item:has-text("${productName}") .btn_secondary:has-text("Remove")`;
        await this.page.locator(removeButtonSelector).click();
    }

    @step('Check if Home Page is loaded')
    async isHomePageLoaded() {
        await expect(this.page.locator(this.headerProductSelector)).toBeVisible();
        await expect(this.page.locator(this.selectProductSorterSelector)).toBeVisible();
    }

    @step('Check if add to Add to Cart button is visible')
    async isAddToCartButtonVisible(productName: string) {
        const addButtonSelector = `.inventory_item:has-text("${productName}") .btn_primary:has-text("Add to cart")`;
        return await this.page.locator(addButtonSelector).isVisible();
    }

    @step('Check if remove button is visible')
    async isRemoveButtonVisible(productName: string) {
        const removeButtonSelector = `.inventory_item:has-text("${productName}") .btn_secondary:has-text("Remove")`;
        return await this.page.locator(removeButtonSelector).isVisible();
    }

    @step('Click on Product link')
    async clickProductLink(productName: string) {
        const productLinkSelector = `.inventory_item:has-text("${productName}") .inventory_item_name`;
        await this.page.locator(productLinkSelector).click();
    }

    @step('Click on Product image')
    async clickOnProductImage(productName: string) {
        await this.page.getByAltText(productName).click();
    }

    @step('Get product price')
    async getProductPrice(productName: string): Promise<string> {
        const priceSelector = `.inventory_item:has-text("${productName}") .inventory_item_price`;
        return await this.page.locator(priceSelector).textContent() || '';
    }

    @step('Get Product description')
    async getProductDescription(productName: string): Promise<string> {
        const descriptionSelector = `.inventory_item:has-text("${productName}") .inventory_item_desc`;
        return await this.page.locator(descriptionSelector).textContent() || '';
    }

    @step('Check if product is in product page')
    async checkIfProductIsInProductPage(productName: string): Promise<boolean> {
        const productSelector = `.inventory_item:has-text("${productName}")`;
        return await this.page.locator(productSelector).isVisible();
    }

    @step('Select product Name A to Z')
    async selectProductNameAtoZ() {
        await this.page.locator(this.selectProductSorterSelector).click();
        await this.page.locator(this.selectAtoZProductsOptionSelector).waitFor({ state: 'attached' });
        await this.page.selectOption(this.selectProductSorterSelector, { value: 'az' });
    }

    @step('Select product Name Z to A')
    async selectProductNameZtoA() {
        await this.page.locator(this.selectProductSorterSelector).click();
        await this.page.locator(this.selectZtoAProductsOptionSelector).waitFor({ state: 'attached' });
        await this.page.selectOption(this.selectProductSorterSelector, { value: 'za' });
    }

    @step('Select product Price Low to High')
    async selectProductPriceLowToHigh() {
        await this.page.locator(this.selectProductSorterSelector).click();
        await this.page.locator(this.selectLowToHighProductsOptionSelector).waitFor({ state: 'attached' });
        await this.page.selectOption(this.selectProductSorterSelector, { value: 'lohi' });
    }

    @step('Select product Price High to Low')
    async selectProductPriceHighToLow() {
        await this.page.locator(this.selectProductSorterSelector).click();
        await this.page.locator(this.selectHighToLowProductsOptionSelector).waitFor({ state: 'attached' });
        await this.page.selectOption(this.selectProductSorterSelector, { value: 'hilo' });
    }

    @step('Get all product names in page')
    async getAllProductNames(): Promise<string[]> {
        const productNameLocator = '.inventory_item_name';
        const names = await this.page.locator(productNameLocator).allTextContents();
        return names.map(name => name.trim());
    }

    @step('Check if product names are in specified alphabetical order')
    async areProductNamesOrdered(order: 'asc' | 'desc' = 'asc'): Promise<boolean> {
        const names = await this.getAllProductNames();
        const sorted = names.slice().sort((a, b) =>
            order === 'asc' ? a.localeCompare(b) : b.localeCompare(a)
        );
        return names.every((name, idx) => name === sorted[idx]);
    }

    @step('Get all product prices in page')
    async getAllProductPrices(): Promise<string[]> {
        const priceLocator = '.inventory_item_price';
        const prices = await this.page.locator(priceLocator).allTextContents();
        return prices.map(price => price.trim());
    }
    
    @step('Check if product prices are in specified order')
    async areProductPricesOrdered(order: 'asc' | 'desc' = 'asc'): Promise<boolean> {
        const prices = await this.getAllProductPrices();
        const numericPrices = prices.map(price => parseFloat(price.replace('$', '')));
        const sorted = numericPrices.slice().sort((a, b) =>
            order === 'asc' ? a - b : b - a
        );
        return numericPrices.every((price, idx) => price === sorted[idx]);
    }
}