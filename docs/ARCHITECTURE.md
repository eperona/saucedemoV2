# Framework Architecture Documentation

**Project:** E2E Test Automation Framework
**Author:** Edwin Perona
**Date:** February 2, 2026

---

## Overview

This document explains the design decisions and architectural choices behind the test automation framework. I've built this using Playwright and TypeScript to handle both UI and API testing for two different applications. The goal was to create something that's maintainable, scalable, and actually pleasant to work with.

---

## Why Playwright?

When I started this project, I had two options on the table: Selenium and Playwright. Here's why I went with Playwright:

**The unified framework argument:**
The requirement was to test both UI and API. I could have used different tools for API, but maintaining two separate frameworks felt like unnecessary overhead. Playwright handles both, which means:
- One set of dependencies to manage
- Consistent patterns across all tests
- Single CI/CD pipeline configuration
- Easier onboarding (learn one tool instead of two)

**TypeScript support:**
Playwright was built with TypeScript in mind, not as an afterthought. The type definitions are excellent, which means less time debugging runtime errors and more confidence during refactoring.

**Auto-waiting:**
One of the biggest pain points in test automation is flaky tests caused by timing issues. Playwright's auto-waiting mechanism eliminates most of these issues. No more arbitrary `wait(5000)` calls scattered through tests.

**Developer experience:**
The trace viewer is genuinely useful when debugging failures. Being able to see the exact timeline of what happened, network calls, console logs, and screenshots all in one place saves a ton of time.

**Active development:**
Microsoft is actively maintaining Playwright with regular releases. The documentation is solid, and the community is growing. I've seen too many test frameworks die from lack of maintenance, so this mattered.

**What I gave up:**
Selenium has broader browser support and more plugins. But for this project, Playwright's strengths outweighed these considerations.

---

## TypeScript: Worth the Setup Cost?

Yes, but it wasn't an automatic choice. Here's the reasoning:

**Pros:**
- Catch silly mistakes at compile time (wrong parameter types, typos in property names)
- Better IDE support - autocomplete actually works properly
- Makes refactoring safer (if you rename something, TypeScript tells you everywhere it breaks)
- Self-documenting to some extent (function signatures tell you what's expected)

**Cons:**
- Slightly more setup and configuration
- Can be verbose for simple scripts
- Team needs to be comfortable with TypeScript

For a framework that I expect to grow and be maintained over time, the benefits clearly outweigh the costs. The initial setup takes maybe an extra hour, but you save that time back within the first week of development.

**Configuration choices:**
I enabled strict mode (`"strict": true`) because I'd rather deal with type errors upfront than hunt down bugs later. I also enabled `experimentalDecorators` to support the `@step` pattern for Allure reporting.

---

## Architecture Overview

The framework follows a layered approach. Here's how I structured it:

```
Tests (what we're testing)
    ↓
Page Objects & Fixtures (abstraction layer)
    ↓
Utilities & Helpers (reusable functions)
    ↓
Configuration (settings, test data, env variables)
    ↓
Playwright Core
```

Each layer has a specific job and doesn't reach across boundaries. Tests don't directly interact with Playwright APIs - they go through page objects. Utilities don't know about specific pages. This keeps things modular.

---

## Design Patterns and Why They Matter

### Page Object Model

**What it is:**
Each page (or component) gets its own class that encapsulates the selectors and actions for that page.

**Why I used it:**
Without page objects, you end up with selectors scattered across your tests. When a button ID changes, you're hunting through dozens of test files to update it. With page objects, you change it in one place.

**Example:**
```typescript
// LoginPage.ts
export default class LoginPage {
    private readonly usernameInputSelector = "#user-name";
    private readonly passwordInputSelector = "#password";

    async fillUsername(username: string) {
        await this.page.locator(this.usernameInputSelector).fill(username);
    }
}
```

Now every test that needs to fill in a username calls `loginPage.fillUsername()`. If the selector changes, I update it in one place.

**The tradeoff:**
Page objects add an extra layer of abstraction, which means more code to write initially. For small projects, you might skip this. But once you have more than a handful of tests, it pays off.

**Where I deviated from pure POM:**
I don't strictly enforce "one page = one class" because modern web apps are component-based, not page-based. The cart is accessible from multiple pages, so I have a CartPage class that handles cart interactions regardless of where you are in the app.

---

### Custom Fixtures

Playwright's fixture system is powerful, and I leveraged it heavily.

**The problem:**
Most tests need a logged-in state. Without fixtures, every test starts with:
```typescript
await loginPage.goto();
await loginPage.fillUsername(user);
await loginPage.fillPassword(password);
await loginPage.submit();
```

This is repetitive, slow, and makes tests harder to read.

**The solution:**
Create a fixture that handles login and provides a ready-to-use page object:

```typescript
// base.ts
export const test = base.extend<TestOptions>({
    productPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(username, password);
        const homePage = new HomePage(page);
        await use(homePage);
    }
});
```

**Usage in tests:**
```typescript
test('Add product to cart', async ({ productPage }) => {
    // productPage is already logged in, ready to go
    await productPage.addProductToCart('Backpack');
});
```

**Benefits:**
- Tests are shorter and more readable
- Login logic is centralized
- Setup and teardown happen automatically
- Tests declare their dependencies clearly

**Where this breaks down:**
If you have many different user types or test data variations, you can end up with fixture explosion. I kept it simple with just a few key fixtures.

---

### Test Data Management

I took a hybrid approach: some data is static (constants), some is dynamic (generated).

**Static data** (in `testData.ts`):
```typescript
export const USERS = {
    STANDARD: 'standard_user',
    LOCKED_OUT: 'locked_out_user'
};

export const PRODUCTS = {
    BACKPACK: 'Sauce Labs Backpack',
    BIKE_LIGHT: 'Sauce Labs Bike Light'
};
```

These are real values from the application that won't change often.

**Dynamic data** (in `apiHelpers.ts`):
```typescript
export function generatePetId(): number {
    return Date.now();
}
```

For API tests, I generate unique IDs on the fly to avoid conflicts when tests run in parallel.

**Environment-specific data** (`.env` files):
```
URL=https://www.saucedemo.com/
USERID=standard_user
PASSWORD=secret_sauce
```

This allows running the same tests against different environments by just changing `NODE_ENV`.

**Why this approach:**
I tried using Faker.js for everything initially, but it made tests less predictable. For UI tests, I want to use actual product names that I know exist. For API tests where I'm creating resources, random data is fine and actually helps avoid conflicts.

---

### API Test Helpers

API tests have a lot of boilerplate - setting headers, constructing payloads, handling cleanup. I consolidated this into helper functions.

**Examples:**
```typescript
// Always use these headers
function createHeaders() {
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
}

// Create a valid pet payload
function createPetPayload(id: number, name: string, status: string) {
    return {
        id, name, status,
        category: { id: 1, name: 'Dogs' },
        photoUrls: ['https://example.com/photo.jpg']
    };
}
```

**Benefits:**
- Tests are more readable (less JSON noise)
- Payloads stay valid when API schema changes
- Consistent headers across all requests

**Cleanup:**
API tests create data that needs to be cleaned up. I handle this in `afterEach` hooks:
```typescript
test.afterEach(async ({ request }) => {
    await deletePet(request, petId);
});
```

This ensures tests don't leave junk data behind, even when they fail.

---

### Decorator Pattern for Reporting

I wanted granular step reporting in Allure without cluttering up the page object methods. TypeScript decorators solved this nicely:

```typescript
@step('Fill username')
async fillUsername(username: string) {
    await this.page.locator(this.usernameInputSelector).fill(username);
}
```

The `@step` decorator wraps the method in a Playwright test step, which shows up as a separate step in Allure reports.

**Alternative approaches:**
I could have manually wrapped every call in `test.step()`, but that's verbose. Or I could have skipped step-level reporting, but debugging failures is much harder without it.

---

## Project Structure

Here's how I organized the code:

```
src/
├── config/
│   ├── .env                    # Environment variables (not committed)
│   ├── apiConfig.ts            # API endpoints and constants
│   └── testData.ts             # Test data constants
├── pages/
│   ├── LoginPage.ts
│   ├── HomePage.ts
│   ├── CartPage.ts
│   └── [other page objects]
├── tests/
│   ├── base.ts                 # Custom fixtures
│   ├── sanity/                 # Smoke tests
│   ├── regression/             # Full UI test suite
│   └── api/                    # API tests
└── utils/
    ├── apiHelpers.ts
    ├── allureHelpers.ts
    └── helpers.ts
```

**Design decisions:**

**Why separate `sanity` and `regression`?**
Sanity tests are the critical smoke tests that should always pass. In CI, if sanity fails, there's no point running the full regression suite. This fail-fast approach saves time and makes build status clearer.

**Why `utils` instead of mixing helpers into page objects?**
Some utilities (like API helpers) aren't tied to any specific page. Keeping them separate makes them easier to reuse and test independently.

**Why `config` folder?**
All configuration lives in one place. When someone needs to add a new endpoint or test user, they know exactly where to look.

---

## Key Technical Decisions

### Test Organization: Projects

Playwright supports multiple "projects" - essentially different test suites with different configs. I defined three:

```typescript
projects: [
    {
        name: 'sanity',
        testDir: './src/tests/sanity',
    },
    {
        name: 'regression',
        dependencies: ['sanity'],  // Only runs if sanity passes
        testDir: './src/tests/regression',
    },
    {
        name: 'api',
        testDir: './src/tests/api',
    }
]
```

**Why dependencies?**
If login (a sanity test) is broken, there's no point running the full regression suite. Everything will fail. The dependency ensures we fail fast and give clear signal about what's broken.

**Alternative:**
I could have used tags instead of separate directories. But separate projects make it clearer what each suite is for and make it easier to configure them differently (different timeouts, different browsers, etc.).

---

### Retry Strategy

```typescript
retries: process.env.CI ? 2 : 1
```

**Locally:** 1 retry. If a test fails, I want to know about it quickly so I can fix it.

**In CI:** 2 retries. Network issues and resource constraints are more common in CI environments, and I don't want false negatives.

**Considered alternatives:**
- No retries: Too many false failures in CI
- More retries: Hides real flakiness issues

One retry locally strikes a balance - it catches the occasional flake without masking problems.

---

### Parallel Execution

```typescript
fullyParallel: true,
workers: process.env.CI ? 1 : undefined
```

**Locally:** Use all available CPU cores. Tests run fast.

**In CI:** Use a single worker. GitHub Actions runners have limited resources, and parallel execution was causing timeouts.

This was a pragmatic decision based on actual CI failures. Ideally, I'd use more workers in CI too, but I had to work within the constraints.

---

### Environment Configuration

I'm using dotenv to load environment variables:

```typescript
if (!process.env.NODE_ENV) {
  require("dotenv").config({ path: `.env` });
} else {
  require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
}
```

**How it works:**
- Default: loads `.env`
- With `NODE_ENV=qa`: loads `.env.qa`
- With `NODE_ENV=staging`: loads `.env.staging`

This makes it easy to run the same tests against different environments without changing any code.

**Security note:**
`.env` files are gitignored. I provide a `.env.example` so people know what variables are needed.

---

## Testing Strategy

### UI Testing Approach

I'm testing from the user's perspective (black-box testing). Tests don't know or care about the internal implementation - they interact with the UI just like a user would.

**Coverage strategy:**
- Happy paths (successful login, successful purchase)
- Common error cases (wrong password, empty fields)
- Edge cases (cart operations, sorting edge cases)

I didn't try to achieve 100% coverage. I focused on the most important flows and the places where bugs would have the biggest impact.

### API Testing Approach

For APIs, I'm doing a mix of:
- **Contract testing:** Verify responses match the expected schema
- **Functional testing:** Verify the API actually does what it's supposed to do
- **Error testing:** Verify proper error handling (404s, invalid payloads)

**HTTP method coverage:**
I made sure to test different HTTP methods (POST, GET, PUT, DELETE) because each has different semantics and failure modes.

**Test data lifecycle:**
Each test:
1. Generates a unique ID
2. Creates a resource using that ID
3. Runs the test
4. Cleans up the resource in `afterEach`

This ensures tests don't interfere with each other, even when running in parallel.

---

## Reporting Strategy

### Dual Reporting: Playwright HTML + Allure

I configured both reporters:

```typescript
reporter: [
    ['allure-playwright'],
    ['html'],
    ['list']  // Console output
]
```

**Why both?**

**Playwright HTML:**
- Dead simple to use (`npx playwright show-report`)
- Fast to generate
- Good for local development
- Great for quick debugging

**Allure:**
- Much prettier and more detailed
- Historical trends (see how tests perform over time)
- Better for stakeholders and reports
- Supports custom attachments (API request/response bodies)

**The cost:**
Running two reporters is slightly slower, and you generate more artifacts. But the benefits for debugging and reporting outweigh this.

### Custom Allure Helpers

I wrote a helper to attach API request/response data to Allure reports:

```typescript
export async function attachApiCall(method: string, url: string, response: APIResponse) {
    await test.step(`${method} ${url}`, async () => {
        const body = await response.json().catch(() => null);
        allure.attachment('Response', JSON.stringify(body, null, 2), 'application/json');
    });
}
```

Now when an API test fails, I can see the exact request and response in the report. This has saved me countless hours of debugging.

---

## CI/CD Integration

### GitHub Actions Pipeline

The pipeline uses a matrix strategy to run three jobs in parallel:

```yaml
strategy:
  matrix:
    project: [sanity, regression, api]
```

Each job:
1. Installs dependencies
2. Installs Playwright browsers (skipped for API tests)
3. Runs the specific test suite
4. Uploads artifacts (reports, screenshots, videos)

**Why matrix?**
The three test suites can run independently. Matrix parallelization speeds up the overall pipeline.

**After all jobs complete:**
A separate job aggregates all the Allure results and generates a combined report.

### CI Optimizations

**Install only Chromium:**
```yaml
- name: Install Playwright Browsers
  run: npx playwright install --with-deps chromium
  if: matrix.project != 'api'
```

API tests don't need browsers, so we skip installation. Even for UI tests, we only install Chromium instead of all three browsers. This cuts installation time significantly.

**Artifact retention:**
```yaml
retention-days: 30
```

We keep test reports and artifacts for 30 days. Enough time to investigate failures, but not forever (storage isn't free).

---

## Best Practices and Code Quality

### Linting and Formatting

I set up ESLint and Prettier from the start:

```bash
npm run lint        # Check for issues
npm run lint:fix    # Auto-fix issues
npm run format      # Format code
```

**Why this matters:**
Consistent code style makes reviews easier and prevents bikeshedding. ESLint catches common mistakes (unused variables, missing awaits).

I considered enforcing these as pre-commit hooks but decided against it for now. In a team environment, I'd add that.

### Test Writing Guidelines

A few rules I tried to follow:

**1. Descriptive test names:**
```typescript
// Good
test('should display error message for locked out user', ...)

// Bad
test('login test 3', ...)
```

Test names should describe what you're testing, not how you're testing it.

**2. Arrange-Act-Assert pattern:**
```typescript
test('example', async ({ productPage }) => {
    // Arrange: Set up test data
    const productName = 'Backpack';

    // Act: Perform the action
    await productPage.addProductToCart(productName);

    // Assert: Verify the result
    expect(await productPage.getCartCount()).toBe(1);
});
```

This structure makes tests easier to read and debug.

**3. Tests should be independent:**
Never rely on the order tests run in. Each test should set up its own state (using fixtures) and clean up after itself.

**4. Use page objects, always:**
```typescript
// Do this
await loginPage.fillUsername(username);

// Not this
await page.locator('#username').fill(username);
```

Direct selectors in tests make refactoring harder.

---

## What I'd Do Differently

Looking back, here are some things I'd approach differently:

**1. More comprehensive test data factory:**
Instead of individual helper functions, I'd probably build a proper test data factory using builder pattern. Would make creating complex test scenarios easier.

**2. Visual regression testing:**
I didn't include visual regression testing, but for UI tests, it would catch CSS bugs that functional tests miss. Playwright has built-in screenshot comparison.

**3. Contract testing for APIs:**
I'm doing manual schema validation. Using a proper JSON schema validator or Pact would be more robust.

**4. Better test categorization:**
I used directories (sanity, regression, api). Tags might have been more flexible for cross-cutting concerns (e.g., "smoke", "critical", "slow").

**5. Database cleanup:**
For API tests, I'm relying on the DELETE endpoint. If that endpoint is broken, cleanup fails and tests leave garbage data. Direct database cleanup would be more reliable.

---

## Scalability Considerations

### Adding New Tests

The framework is designed to make adding tests straightforward:

**For UI tests:**
1. Create a page object if needed (if you're testing a new page)
2. Add a fixture in `base.ts` if you need special setup
3. Write the test in the appropriate directory
4. Follow existing patterns

**For API tests:**
1. Add endpoints to `apiConfig.ts`
2. Create helper functions if needed
3. Write tests following existing structure
4. Remember cleanup hooks

### Multi-Environment Support

The `.env` file approach scales to multiple environments:
```bash
# Development
npm test

# QA
NODE_ENV=qa npm test

# Staging
NODE_ENV=staging npm test
```

No code changes needed, just different environment variables.

### Multi-Browser Support

Currently testing only Chromium, but extending to other browsers is trivial:

```typescript
projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
    { name: 'firefox', use: devices['Desktop Firefox'] },
    { name: 'webkit', use: devices['Desktop Safari'] }
]
```

Tests don't need to change - Playwright handles the browser differences.

---

## Performance Considerations

**Current performance:**
- Full test suite: ~5 minutes locally, ~10 minutes in CI
- Sanity suite: ~30 seconds
- Individual test: 5-30 seconds depending on complexity

**Optimizations implemented:**
- Parallel execution (locally)
- Browser context reuse (via fixtures)
- Playwright's auto-waiting (no unnecessary waits)
- Conditional browser installation in CI

**Future optimizations:**
- Test sharding (split tests across multiple machines)
- Selective test execution (only run tests affected by code changes)
- API mocking for faster UI tests (though this changes what you're testing)

---

## Lessons Learned

**1. Start with page objects from day one:**
I initially wrote a few tests without page objects thinking "I'll refactor later." That was a mistake. Refactoring tests is harder than writing them correctly the first time.

**2. Invest in good reporting early:**
Being able to see exactly what happened when a test failed saves enormous amounts of time. Don't skimp on this.

**3. Fixtures are worth learning:**
Playwright's fixture system has a learning curve, but once you get it, it makes tests much cleaner.

**4. CI is different from local:**
What works locally doesn't always work in CI. Budget time for CI-specific issues (timeouts, resource constraints, network flakiness).

**5. Documentation matters:**
I put off writing this architecture doc initially. I should have written it as I built the framework, when decisions were fresh. Writing it after the fact required reconstructing my thinking.

---

## Conclusion

This framework achieves the core goals: it's maintainable, scalable, and handles both UI and API testing. The key architectural decisions - using Playwright, implementing page objects, leveraging fixtures, and setting up good reporting - all contribute to a framework that should serve well as it grows.

There's always room for improvement (better test data management, visual regression, contract testing), but the foundation is solid. The most important thing is that it's actually pleasant to work with, which increases the likelihood that tests will be maintained over time.

---

## References and Resources

**Framework Documentation:**
- Playwright: https://playwright.dev/
- TypeScript: https://www.typescriptlang.org/
- Allure: https://docs.qameta.io/allure/

**Patterns and Practices:**
- Page Object Model: https://martinfowler.com/bliki/PageObject.html
- Test Design Techniques: ISTQB Foundation Level Syllabus

**CI/CD:**
- GitHub Actions: https://docs.github.com/en/actions

---

**Contact:**
Edwin Perona
GitHub: https://github.com/eperona/saucedemoV2
