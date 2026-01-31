import {expect, test} from '../base';
import { faker } from '@faker-js/faker';
import { USERS, PRODUCTS } from '../../config/testData';

[
    {username: USERS.STANDARD, productName: PRODUCTS.BACKPACK},
    {username: USERS.PROBLEM, productName: PRODUCTS.BIKE_LIGHT},
    {username: USERS.PERFORMANCE_GLITCH, productName: PRODUCTS.FLEECE_JACKET},
    {username: USERS.ERROR, productName: PRODUCTS.ONESIE},
    {username: USERS.VISUAL, productName: PRODUCTS.BOLT_TSHIRT}
].forEach(({username, productName}) => {
    test(`End-to-end test for user "${username}"`, async ({ 
                    loginPage, 
                    homePage, 
                    productDetailsPage, 
                    cartPage,
                    checkoutPage,
                    checkoutOverviewPage,
                    checkoutCompletePage 
                }) => {

        await test.step(`Login with user "${username}"`, async () => {
            await loginPage.goto();
            await loginPage.login(username, process.env.PASSWORD!);
        });

        await homePage.isHomePageLoaded();

        let productPrice = await homePage.getProductPrice(productName);
        let productDescription = await homePage.getProductDescription(productName);

        await homePage.clickProductLink(productName);
        await productDetailsPage.isProductDetailsPageLoaded();
        expect(await productDetailsPage.checkIfImageIsCorrect(productName), "Product image should be correct").toBeTruthy();
        expect(await productDetailsPage.checkIfPriceIsCorrect(productPrice), "Product price should be correct").toBeTruthy();
        expect(await productDetailsPage.checkIfDescriptionIsCorrect(productDescription), "Product description should be correct").toBeTruthy();

        await productDetailsPage.clickAddToCartButton();
        await productDetailsPage.isRemoveButtonVisible();

        await productDetailsPage.clickCartButton();
        await cartPage.isCartPageLoaded();
        expect(await cartPage.getCartItemsCount(), "Cart items count should be 1").toBe(1);
        expect(await cartPage.checkIfProductNameIsCorrect(productName), "Product name should be correct").toBeTruthy();
        expect(await cartPage.checkIfDescriptionIsCorrect(productName, productDescription), "Product description should be correct").toBeTruthy();
        expect(await cartPage.checkIfPriceIsCorrect(productName, productPrice), "Product price should be correct").toBeTruthy();
        await cartPage.clickRemoveButtonInCartPage(productName);
        await cartPage.clickContinueShopping();

        await homePage.isHomePageLoaded();
        await homePage.addProductToCart(productName);
        expect(await homePage.isAddToCartButtonVisible(productName), "Add to Cart button should be hidden").toBeFalsy();
        expect(await homePage.isRemoveButtonVisible(productName), "Remove button should be visible").toBeTruthy();
        await homePage.clickCartIcon();
        await cartPage.isCartPageLoaded();
        expect(await cartPage.getCartItemsCount(), "Cart items count should be 1").toBe(1);
        expect(await cartPage.checkIfProductNameIsCorrect(productName), "Product name should be correct").toBeTruthy();
        await cartPage.clickCheckoutButton();

        await checkoutPage.isOpened();
        await checkoutPage.fillFirstName(username);
        await checkoutPage.fillLastName(faker.person.lastName());
        await checkoutPage.fillPostCode(faker.location.zipCode());
        await checkoutPage.clickContinueButton();

        await checkoutOverviewPage.isOpened();
        expect(await checkoutOverviewPage.getSubtotal(), "Subtotal should contain product price").toContain(productPrice);

        const tax = await checkoutOverviewPage.getTax();
        const subtotal = await checkoutOverviewPage.getSubtotal()
        const totalAmount = await checkoutOverviewPage.getTotalAmount();       

        expect(subtotal).toContain(productPrice);
        expect(totalAmount).toContain(
            subtotal !== null
                ? ("Total: $" + (
                    parseFloat(subtotal.replace(/[^0-9.-]+/g,"")) +
                    (tax !== null ? parseFloat(tax.replace(/[^0-9.-]+/g,"")) : 0)
                  ).toFixed(2))
                : null
        );  
        await checkoutOverviewPage.clickFinishButton();

        await checkoutCompletePage.isOpened();
        await checkoutCompletePage.clickBackHomeButton();
        await homePage.isHomePageLoaded();

    });
});