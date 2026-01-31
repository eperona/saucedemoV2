# E2E Test Automation Framework - Playwright TypeScript
- Author: Edwin Perona

## Applications Under Test
- **UI Testing**: [Sauce Demo](https://www.saucedemo.com/)
- **API Testing**: [Petstore API](https://petstore.swagger.io/)


## Prerequisites
- Node.js (>=14.x) and npm installed
- Git installed
- Chrome 
- VSCode

## Installation

1. **Clone the Repository**
    ```
    git clone https://github.com/eperona/saucedemo.git
    ```

2. **Install Dependencies**
    
    dotenv installation
    ```
    npm install dotenv --save --force
    ```
    Allure report installation. 
    
      -https://allurereport.org/docs/install-for-nodejs/

    Faker installation (Test data generation)
    ```
    npm i @faker-js/faker
    ```

3. **Configure Environment**
    - Create a `.env` file under ./src/config folder.
    - Create another `.env` file with additional suffix `.<environment>` (e.g. .env.qa)
    - Example content:
      ```
      URL=https://www.saucedemo.com/
      USERID=standard_user
      PASSWORD=secret_sauce
      ```
      Before running the test, set environment the value for NODE_ENV or create an npm custom script for it
      ```
      set NODE_ENV=qa
      ```
      NOTE: These env files should be added in gitignore or should be changed in the future to use Vault api or similar.


  ## Running Tests Locally

  ### UI Tests
  - Run all UI tests:
    ```bash
    npx playwright test --project=sanity --project=regression
    ```
  - Run sanity tests only:
    ```bash
    npx playwright test --project=sanity
    ```
  - Run regression tests only:
    ```bash
    npx playwright test --project=regression
    ```
  - Run specific test with UI:
    ```bash
    npx playwright test <Testname.spec.ts> --headed
    ```

  ### API Tests
  - Run all API tests:
    ```bash
    npx playwright test --project=api
    ```
  - Run specific API test file:
    ```bash
    npx playwright test src/tests/api/petAPI.spec.ts
    npx playwright test src/tests/api/storeAPI.spec.ts
    ```

  ### Run All Tests (UI + API)
  - Run everything:
    ```bash
    npx playwright test
    ```
  ## Maintenance

  - Update dependencies:
    ```bash
    npm update
    ```
  - Add new test cases in the `src/tests/regression` directory.
  - Review and refactor code regularly for best practices.

  ## Artifacts & Reports
    
  ## Opening the HTML Report
     
      ```
      npx playwright show-report
      ```

  ## Opening the Allure HTML Report
  Generate Allure Report after the tests are executed:
  ```
  npx allure generate ./allure-results --clean
  ```
  Open the generated report:
  ```
  npx allure open ./allure-report
  ```

  ## Continuous Integration (Jenkins) - ToDo

  1. **Jenkins Setup**
      - Install Node.js plugin on Jenkins.
      - Configure Jenkins to use your repository.

  2. **Jenkins Pipeline Example**
      ```groovy
      pipeline {
        agent any
        stages {
          stage('Checkout') {
              steps {
                git 'https://github.com/eperona/saucedemo.git'
              }
          }
          stage('Install') {
              steps {
                sh 'npm install'
              }
          }
          stage('Test') {
              steps {
                sh 'npx playwright test --project=sanity --project=regression'
              }
          }
        }
      }
      ```
  ## Continuous Integration (GitHub Actions)

  1. **Sample Workflow Configuration**
      ```yaml
      name: Playwright Tests
      on:
        push:
          branches: [ main, master ]
        pull_request:
          branches: [ main, master ]
      jobs:
        test:
          timeout-minutes: 60
          runs-on: ubuntu-latest
          steps:
          - uses: actions/checkout@v4
          - uses: actions/setup-node@v4
            with:
              node-version: lts/*
          - name: Install dependencies
            run: npm ci
          - name: Install Playwright Browsers
            run: npx playwright install --with-deps
          - name: Run Playwright tests
            run: npx playwright test --project=sanity --project=regression
          - uses: actions/upload-artifact@v4
            if: ${{ !cancelled() }}
            with:
              name: playwright-report
              path: playwright-report/
              retention-days: 30
      ```

## Best Practices

- Keep dependencies up to date.
- Use version control for all changes.
- Document new features and test cases.
- Monitor CI builds and fix failures promptly.
