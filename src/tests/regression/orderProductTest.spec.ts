import {expect, test } from '../base';
import { PRODUCTS } from '../../config/testData';

test.describe('Order Product Tests', () => {
    const product1Name = PRODUCTS.BACKPACK;
    const product2Name = PRODUCTS.BIKE_LIGHT;

    test('Add and remove products from cart', async ({ productPage, cartPage }) => {  
        await productPage.addProductToCart(product1Name);
        await productPage.addProductToCart(product2Name);
        await productPage.isHomePageLoaded();
        await productPage.clickCartIcon();
        expect(await cartPage.getCartItemsCount(), "Cart items count should be 2").toBe(2);
        await cartPage.clickRemoveButtonInCartPage(product1Name);
        expect(await cartPage.getCartItemsCount(), "Cart items count should be 1").toBe(1);
    });

    test('Continue shopping from cart', async ({ productPage, cartPage }) => {
        await productPage.addProductToCart(product1Name);
        await productPage.clickCartIcon();
        await cartPage.isCartItemVisible();
        await cartPage.clickContinueShopping();
        await productPage.isHomePageLoaded();
    });

    test('Checkout button visibility', async ({ productPage, cartPage }) => {
        await productPage.addProductToCart(product1Name);
        await productPage.clickCartIcon();
        await cartPage.isCheckoutButtonVisible();
    });

    test('Remove product from product page', async ({ productPage }) => {
        await productPage.addProductToCart(product1Name);
        await productPage.clickRemoveButtonInProductPage(product1Name);
        await productPage.isHomePageLoaded();
        await productPage.isAddToCartButtonVisible(product1Name);
    });

    test('Remove product from cart page', async ({ productPage, cartPage }) => {
        await productPage.addProductToCart(product1Name);
        await productPage.clickCartIcon();
        await cartPage.isCartItemVisible();
        await cartPage.clickRemoveButtonInCartPage(product1Name);
        expect(await cartPage.getCartItemsCount(), "Cart items count should be 0").toBe(0);
    });

    test('Cart icon visibility', async ({ productPage }) => {
        await productPage.isHomePageLoaded();
        await productPage.isCartIconVisible();
    });

    test('Cart icon click navigates to cart page', async ({ productPage, cartPage }) => {
        await productPage.addProductToCart('Sauce Labs Backpack');
        await productPage.clickCartIcon();
        await cartPage.isCartItemVisible();
    });

    test('Product sorting functionality', async ({ productPage }) => {      
        await productPage.isHomePageLoaded();
        await productPage.selectProductNameAtoZ();
        expect(await productPage.areProductNamesOrdered('asc'), "Product names should be in ascending order").toBe(true);
        await productPage.selectProductNameZtoA();
        expect(await productPage.areProductNamesOrdered('desc'), "Product names should be in descending order").toBe(true);
        await productPage.selectProductPriceLowToHigh();
        expect(await productPage.areProductPricesOrdered('asc'), "Product prices should be in ascending order").toBe(true);
        await productPage.selectProductPriceHighToLow();
        expect(await productPage.areProductPricesOrdered('desc'), "Product prices should be in descending order").toBe(true);
    });
}); 


