/**
 * Helper Utilities
 * Common utility functions for test automation
 */

import { Page } from '@playwright/test';

/**
 * Waits for page to be fully loaded
 */
export async function waitForPageLoad(page: Page): Promise<void> {
    await page.waitForLoadState('networkidle');
}

/**
 * Waits for DOM to be ready
 */
export async function waitForDOMReady(page: Page): Promise<void> {
    await page.waitForLoadState('domcontentloaded');
}

/**
 * Extracts numeric value from price string
 * @param priceString - Price string like "$29.99"
 * @returns Numeric value
 */
export function extractPrice(priceString: string): number {
    return parseFloat(priceString.replace(/[^0-9.-]+/g, ''));
}

/**
 * Generates a random alphanumeric string
 * @param length - Length of the string
 * @returns Random string
 */
export function generateRandomString(length: number = 10): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

/**
 * Formats currency value
 * @param value - Numeric value
 * @returns Formatted currency string
 */
export function formatCurrency(value: number): string {
    return `$${value.toFixed(2)}`;
}

/**
 * Checks if array is sorted
 * @param array - Array to check
 * @param order - Sort order (asc or desc)
 * @returns True if sorted, false otherwise
 */
export function isSorted<T>(array: T[], order: 'asc' | 'desc' = 'asc'): boolean {
    for (let i = 0; i < array.length - 1; i++) {
        if (order === 'asc' && array[i] > array[i + 1]) return false;
        if (order === 'desc' && array[i] < array[i + 1]) return false;
    }
    return true;
}

/**
 * Delays execution for specified milliseconds
 * @param ms - Milliseconds to wait
 */
export async function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Takes a screenshot with a custom name
 * @param page - Playwright page object
 * @param name - Screenshot name
 */
export async function takeScreenshot(page: Page, name: string): Promise<void> {
    await page.screenshot({
        path: `test-results/screenshots/${name}-${Date.now()}.png`,
        fullPage: true
    });
}

/**
 * Validates email format
 * @param email - Email string to validate
 * @returns True if valid email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Retries a function multiple times until it succeeds or max retries reached
 * @param fn - Function to retry
 * @param maxRetries - Maximum number of retries
 * @param delayMs - Delay between retries in milliseconds
 */
export async function retry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
): Promise<T> {
    let lastError: Error | undefined;

    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;
            if (i < maxRetries - 1) {
                await delay(delayMs);
            }
        }
    }

    throw lastError;
}
