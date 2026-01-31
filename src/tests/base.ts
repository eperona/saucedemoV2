import { test as base } from "@playwright/test";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import CartPage from "../pages/CartPage";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import CheckoutPage from "../pages/CheckoutPage";
import CheckoutOverviewPage from "../pages/CheckoutOverviewPage";
import CheckoutCompletePage from "../pages/CheckoutCompletePage";

export type TestOptions = {
    loginPage: LoginPage;
    homePage: HomePage;
    productPage: HomePage;
    cartPage: CartPage;
    productDetailsPage: ProductDetailsPage;
    checkoutPage: CheckoutPage;
    checkoutOverviewPage: CheckoutOverviewPage;
    checkoutCompletePage: CheckoutCompletePage;
};

export const test = base.extend<TestOptions>({

    productPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        const homePage = new HomePage(page);
        await loginPage.goto();
        const username = process.env.USERID;
        const password = process.env.PASSWORD;
        if (!username || !password) {
            throw new Error("Environment variables USER and PASSWORD must be set.");
        }
        await loginPage.login(username, password);
        await use(homePage);
    },
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(loginPage);
    },
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    }, 
    cartPage: async ({ page }, use) => {
        const cartPage = new CartPage(page);
        await use(cartPage);
    },
    productDetailsPage: async ({ page }, use) => {
        const productDetailsPage = new ProductDetailsPage(page);
        await use(productDetailsPage);
    },
    checkoutPage: async ({page}, use) => {
        const checkoutPage = new CheckoutPage(page)
        await use(checkoutPage)
    },
    checkoutOverviewPage: async ({page}, use) => {
        const checkoutOverviewPage = new CheckoutOverviewPage(page)
        await use(checkoutOverviewPage)
    },
    checkoutCompletePage: async ({page}, use) => {
        const checkoutCompletePage = new CheckoutCompletePage(page)
        await use(checkoutCompletePage)
    }
});

export { expect } from "@playwright/test";

export function step(stepName?: string, param?: string) {
    return function decorator(
        target: Function,
        context: ClassMethodDecoratorContext
    ) {
    return function replacementMethod( ...args: any[]) {
        const name =
            stepName || `${this.constructor.name}.${context.name as string}`;
            return test.step(name, async () => {
                return await target.call(this, ...args);
            });
      };
    };
}