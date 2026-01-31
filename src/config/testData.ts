export const PRODUCTS = {
    BACKPACK: 'Sauce Labs Backpack',
    BIKE_LIGHT: 'Sauce Labs Bike Light',
    BOLT_TSHIRT: 'Sauce Labs Bolt T-Shirt',
    FLEECE_JACKET: 'Sauce Labs Fleece Jacket',
    ONESIE: 'Sauce Labs Onesie',
    RED_TSHIRT: 'Test.allTheThings() T-Shirt (Red)',
} as const;

export const USERS = {
    STANDARD: 'standard_user',
    LOCKED_OUT: 'locked_out_user',
    PROBLEM: 'problem_user',
    PERFORMANCE_GLITCH: 'performance_glitch_user',
    ERROR: 'error_user',
    VISUAL: 'visual_user',
} as const;

export const ERROR_MESSAGES = {
    INVALID_CREDENTIALS: 'Epic sadface: Username and password do not match any user in this service',
    USERNAME_REQUIRED: 'Epic sadface: Username is required',
    PASSWORD_REQUIRED: 'Epic sadface: Password is required',
    LOCKED_OUT: 'Epic sadface: Sorry, this user has been locked out.',
} as const;

export const SORT_OPTIONS = {
    NAME_A_TO_Z: 'az',
    NAME_Z_TO_A: 'za',
    PRICE_LOW_TO_HIGH: 'lohi',
    PRICE_HIGH_TO_LOW: 'hilo',
} as const;

export const URLS = {
    BASE: process.env.URL || 'https://www.saucedemo.com/',
    INVENTORY: `${process.env.URL || 'https://www.saucedemo.com/'}inventory.html`,
    CART: `${process.env.URL || 'https://www.saucedemo.com/'}cart.html`,
    CHECKOUT_STEP_ONE: `${process.env.URL || 'https://www.saucedemo.com/'}checkout-step-one.html`,
    CHECKOUT_STEP_TWO: `${process.env.URL || 'https://www.saucedemo.com/'}checkout-step-two.html`,
    CHECKOUT_COMPLETE: `${process.env.URL || 'https://www.saucedemo.com/'}checkout-complete.html`,
} as const;
