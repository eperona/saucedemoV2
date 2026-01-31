import { defineConfig, devices } from '@playwright/test';

if (!process.env.NODE_ENV) {
  require("dotenv").config({ path: `${__dirname}//src//config//.env` });
} else {
  require("dotenv").config({
    path: `${__dirname}//src//config//.env.${process.env.NODE_ENV}`,
  });
}

export default defineConfig({
  testDir: './src/tests',
  
  // Maximum time one test can run
  timeout: 30 * 1000,
  
  // Maximum time expect() should wait for condition
  expect: {
    timeout: 5 * 1000
  },
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 1,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter to use
  reporter: [
    ['allure-playwright'],
    ['html'],
    ['list']
  ],

  use: {
    // Base URL for UI tests
    baseURL: process.env.URL || 'https://www.saucedemo.com/',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Take screenshot on failure
    screenshot: 'only-on-failure',
    
    // Record video on failure
    video: 'retain-on-failure',
    
    // Maximum time each action can take
    actionTimeout: 10 * 1000,
    
    // Maximum time for navigation
    navigationTimeout: 30 * 1000,
  },

   projects: [
    {
      name: 'sanity',
      testDir: './src/tests/sanity',
      use: {
        ...devices['Desktop Chrome'],
      }
    },
    {
      name: 'regression',
      dependencies: ['sanity'],
      fullyParallel: true,
      testDir: './src/tests/regression',
      use: {
        ...devices['Desktop Chrome'],
      }
    },
    {
      name: 'api',
      testDir: './src/tests/api',
      fullyParallel: true,
      use: {
        baseURL: 'https://petstore.swagger.io/v2',
      }
    }
  ],
});
