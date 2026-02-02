# Test Plan Document

**Project:** E2E Test Automation Framework
**Prepared by:** Edwin Perona
**Date:** February 2, 2026
**Version:** 1.0

---

## 1. Introduction

### 1.1 Purpose
This document outlines the test plan for automating end-to-end tests across two distinct applications: a web-based e-commerce platform (Sauce Demo) and a RESTful API service (Petstore API). The goal is to establish automated test coverage for critical business flows while demonstrating a scalable test automation approach.

### 1.2 Background
Both applications represent common testing scenarios in modern software development:
- **Sauce Demo** simulates a typical e-commerce platform where users can browse products, manage shopping carts, and complete purchases
- **Petstore API** provides a standard REST API implementing basic CRUD operations, commonly used for API testing practice

This test automation effort focuses on proving out an automation framework that could scale to cover more features in the future.

### 1.3 Scope
This is an initial automation effort covering a representative subset of functionality. The selection criteria for features and APIs were based on business criticality and user impact rather than comprehensive coverage.

---

## 2. Test Items

### 2.1 Application Under Test: Sauce Demo
- **URL:** https://www.saucedemo.com/
- **Type:** Web Application (E-commerce)
- **Technology:** Browser-based UI
- **Access:** Publicly available with predefined test accounts

### 2.2 Application Under Test: Petstore API
- **URL:** https://petstore.swagger.io/v2
- **Type:** RESTful API
- **Technology:** HTTP/JSON
- **Documentation:** OpenAPI/Swagger specification available

---

## 3. Features to be Tested

### 3.1 UI Testing - Sauce Demo

#### 3.1.1 User Authentication
I selected authentication as the first feature because it's the gateway to the entire application. If users can't log in reliably, nothing else matters. Based on analyzing the demo site, there are several user types with different behaviors, which made this an interesting test case.

**What we're testing:**
- Successful authentication with valid credentials
- Authentication failure scenarios (invalid credentials, locked accounts)
- Form validation (empty fields, missing username/password)
- Error messaging accuracy and clarity

**Test approach:**
We're using the predefined test users (standard_user, locked_out_user, etc.) provided by the application. Each test validates not just the action but also the appropriate system response, including error messages.

**Test cases implemented:**
1. Valid user login flow
2. Invalid credentials rejection
3. Empty field validation
4. Locked user handling
5. Missing password scenario
6. Missing username scenario

**Why these specific tests?**
These cover the main authentication paths users would encounter. I didn't include password complexity testing since the demo application doesn't enforce password rules.

---

#### 3.1.2 Shopping Cart and Product Management
The shopping cart is central to the e-commerce flow. I chose this over checkout completion because cart management is where users spend the most time and where bugs would have the highest visibility.

**What we're testing:**
- Adding products to cart from product listing
- Removing products (both from product page and cart page)
- Cart state persistence as users navigate
- Product sorting functionality
- Cart item count accuracy

**Test approach:**
Tests simulate real user behavior - browsing products, adding multiple items, changing their mind and removing items, checking the cart, and continuing to shop. We're validating both the UI state and the underlying cart logic.

**Test cases implemented:**
1. Add and remove multiple products
2. Continue shopping workflow
3. Checkout button availability
4. Remove from product listing vs cart page
5. Cart icon navigation
6. Product sorting (name A-Z, Z-A, price low-high, high-low)

**Why these specific tests?**
After manually exploring the application, these represented the most common user workflows. Cart bugs directly impact revenue, so this felt like the right second feature to automate.

---

### 3.2 API Testing - Petstore

For the API testing requirement, I selected 2 specific APIs with different HTTP methods to demonstrate diverse testing scenarios. The requirement was to choose a mix of HTTP methods (not both GET, for example), so I selected POST and DELETE operations.

#### 3.2.1 API 1: POST /pet (Create Pet)

**Why this API?**
Creating a pet is a fundamental operation that touches the core functionality of the Petstore API. POST requests are critical because they create new resources, and any bugs here would prevent users from adding pets to the system.

**HTTP Method:** POST
**Endpoint:** `https://petstore.swagger.io/v2/pet`
**Request Format:** JSON
**Expected Response:** 200 OK with created pet object

**What we're testing:**
- Successful resource creation with valid payload
- Handling different status values (available, pending, sold)
- Minimal vs complete payload validation
- Response schema validation

**Core Test Cases (Required):**

1. **Create pet with complete payload**
   - Send a fully populated pet object with all fields
   - Verify 200 OK response
   - Verify created pet matches request data
   - Validate all response fields are present

2. **Create pet with different status values**
   - Create pet with status "pending" instead of default "available"
   - Verify status is correctly set in response
   - Ensures the API properly handles status enum values

3. **Create pet with minimal required fields**
   - Send only required fields (id, name, photoUrls)
   - Verify API accepts minimal payload
   - This test was added because the Swagger documentation wasn't crystal clear on which fields are truly required vs optional

**Rationale:**
These three tests cover the essential scenarios for the POST operation: standard creation, variation in data (status), and boundary testing (minimal fields). This gives confidence that the create operation works properly under different conditions.

---

#### 3.2.2 API 2: DELETE /store/order/{orderId} (Delete Order)

**Why this API?**
I chose DELETE to complement the POST method, giving us a good mix of HTTP verbs. Order deletion represents a critical business operation - users need to be able to cancel orders. DELETE operations are interesting because they need to properly clean up resources and handle edge cases like deleting non-existent items.

**HTTP Method:** DELETE
**Endpoint:** `https://petstore.swagger.io/v2/store/order/{orderId}`
**Request Format:** Path parameter (orderId)
**Expected Response:** 200 OK for success, 404 for not found

**What we're testing:**
- Successful deletion of existing orders
- Proper cleanup (verify order is actually gone)
- Error handling for non-existent orders
- Idempotency considerations

**Core Test Cases (Required):**

1. **Delete existing order**
   - Create an order first using POST
   - Delete that order using DELETE
   - Verify 200 OK response
   - Attempt to GET the deleted order
   - Verify 404 response (confirms deletion worked)
   - This two-step verification ensures the delete actually happened, not just returned success

2. **Delete non-existent order**
   - Attempt to delete an order ID that doesn't exist (999999999)
   - Verify 404 Not Found response
   - Ensures proper error handling

**Rationale:**
These two tests cover the happy path (successful deletion with verification) and the error path (attempting to delete something that doesn't exist). The first test is particularly important because it verifies the delete actually worked by attempting to retrieve the deleted resource.

---

### 3.2.3 API Testing Summary

**Total API Tests: 5**
- API 1 (POST /pet): 3 tests
- API 2 (DELETE /store/order/{orderId}): 2 tests
- HTTP Methods: POST and DELETE (meeting the requirement for mixed methods)

---

## 4. Features Not to be Tested

The following are explicitly out of scope for this test automation effort:

**UI Testing:**
- Checkout completion flow (partial coverage exists but not comprehensive)
- Payment processing
- User registration (no registration feature in demo)
- Password reset functionality
- Product detail pages beyond basic navigation
- Responsive design/mobile layouts
- Cross-browser compatibility (focusing on Chromium only)
- Accessibility compliance
- Performance under load

**API Testing:**
- User endpoints (decided to focus on Pet and Store only)
- File upload functionality (image upload for pets)
- Authentication/authorization (API key validation)
- Rate limiting
- API versioning
- Batch operations

**General:**
- Security testing (XSS, SQL injection, etc.)
- Load/stress testing
- Disaster recovery scenarios
- Database testing
- Third-party integrations

**Why these exclusions?**
Given this is a proof-of-concept automation framework, I focused on demonstrating solid automation patterns rather than exhaustive coverage. The excluded items would be prioritized in a real project based on business risk and available time.

---

## 5. Test Approach

### 5.1 Test Automation Strategy

I'm using Playwright with TypeScript for both UI and API testing. Initially considered using separate tools (maybe Cypress for UI and a different tool for API), but decided the consistency of using one framework outweighed any individual tool advantages.

**Framework Selection Criteria:**
- Must support both UI and API testing
- Strong TypeScript support (for maintainability)
- Active community and good documentation
- Built-in parallel execution
- Good debugging tools

Playwright checked all these boxes, plus the auto-waiting feature helps reduce flaky tests.

### 5.2 Test Design Techniques

**UI Tests:**
- Experience-based testing (manual exploration informed test case selection)
- Equivalence partitioning (valid user types, invalid users, locked users)
- Boundary value analysis (empty fields, special characters in products)
- Error guessing (what could go wrong in a shopping cart?)

**API Tests:**
- Specification-based testing (following Swagger documentation)
- Positive and negative testing
- State transition testing (create → read → update → delete lifecycle)
- Boundary testing (minimum required fields vs full payload)

### 5.3 Test Environment

**UI Testing:**
- Browser: Chromium (headless for CI, headed for local debugging)
- Resolution: Desktop (1280x720)
- Operating System: Platform-independent (CI runs on Ubuntu)

**API Testing:**
- Protocol: HTTPS
- Data format: JSON
- Base URL: https://petstore.swagger.io/v2

### 5.4 Test Data Management

**UI Test Data:**
- Using predefined users from the application (standard_user, locked_out_user, etc.)
- Credentials stored in environment variables (not hardcoded)
- Product names are real values from the application catalog

**API Test Data:**
- Dynamic ID generation using timestamps (avoids conflicts in parallel execution)
- Predefined payload templates for consistency
- Status values from documented enums

**Cleanup Strategy:**
- API tests clean up created resources in afterEach hooks
- Each test generates unique IDs to prevent interference

### 5.5 Test Execution Strategy

**Test Organization:**
- Sanity suite: Quick smoke tests (runs first)
- Regression suite: Comprehensive UI tests (runs if sanity passes)
- API suite: All API tests (runs independently)

**Execution Modes:**
- Local: Parallel execution using all CPU cores
- CI/CD: Sequential execution to manage resource constraints
- On-demand: Individual test or suite execution

**Retry Logic:**
- 1 retry locally (fail fast for development)
- 2 retries in CI (network issues are more common there)

---

## 6. Pass/Fail Criteria

### 6.1 Individual Test Pass Criteria
A test passes if:
- All assertions pass without errors
- Expected elements are visible/interactable
- API responses return correct status codes
- Response data matches expected schema
- No unexpected errors in console (for UI tests)

### 6.2 Individual Test Fail Criteria
A test fails if:
- Any assertion fails
- Timeout occurs (element not found, page doesn't load)
- Unexpected error/exception
- API returns wrong status code
- Response data is malformed or missing required fields

### 6.3 Test Suite Pass Criteria
A test suite passes if:
- At least 95% of tests pass
- All critical path tests pass (login, add to cart, API CRUD)
- No new failures introduced (regression)

### 6.4 Overall Test Execution Pass Criteria
The test execution is successful if:
- Sanity suite: 100% pass rate (these are critical smoke tests)
- Regression suite: ≥95% pass rate
- API suite: ≥95% pass rate
- No critical defects identified
- Test execution completes within expected time (30 minutes)

---

## 7. Suspension and Resumption Criteria

### 7.1 Suspension Criteria
Test execution will be suspended if:
- Test environment is unavailable (application down, network issues)
- More than 50% of tests are failing (indicates environmental or systemic issue)
- Critical blocking defects are discovered
- Test data is corrupted or unavailable

### 7.2 Resumption Criteria
Testing can resume when:
- Environment issues are resolved and verified
- Blocking defects are fixed
- Test data is restored/corrected
- Root cause of mass failures is identified and addressed

---

## 8. Test Deliverables

### 8.1 Before Testing
- This test plan document
- Test automation framework (code repository)
- Test environment setup instructions

### 8.2 During Testing
- Test execution progress (visible in CI/CD pipeline)
- Preliminary test results
- Defect reports (if issues found)

### 8.3 After Testing
- Test execution summary report (Playwright HTML report)
- Detailed test report (Allure report with historical trends)
- Test artifacts (screenshots, videos for failures)
- Updated test documentation

---

## 9. Environmental Needs

### 9.1 Hardware
- **Local Development:** Standard developer workstation (no special requirements)
- **CI/CD:** GitHub Actions runners (Ubuntu, 2-core, 7GB RAM)

### 9.2 Software
- Node.js (v14 or higher)
- npm (comes with Node.js)
- Chromium browser (installed via Playwright)
- Git (for version control)

### 9.3 Network
- Internet connection (applications are cloud-hosted)
- No VPN or proxy requirements
- Firewall must allow HTTPS traffic

### 9.4 Test Accounts
- Sauce Demo: Predefined users (standard_user, etc.)
- Petstore API: No authentication required (public API)

---

## 10. Staffing and Responsibilities

**Test Automation Engineer (Edwin Perona):**
- Framework design and implementation
- Test case development
- CI/CD pipeline setup
- Test execution and monitoring
- Defect reporting
- Documentation

**Note:** This is an individual project, but in a team environment, responsibilities would be distributed among QA engineers, developers, and DevOps.

---

## 11. Schedule and Milestones

This is a retrospective plan (framework already implemented), but here's how the work was approached:

**Phase 1: Framework Setup** (Week 1)
- Playwright installation and configuration
- Project structure design
- Base patterns implementation (Page Objects, fixtures)

**Phase 2: UI Test Development** (Week 2)
- Login test implementation
- Shopping cart test implementation
- Additional regression scenarios

**Phase 3: API Test Development** (Week 2-3)
- API helper utilities
- Pet API tests
- Store API tests

**Phase 4: Reporting and CI/CD** (Week 3)
- Allure report integration
- GitHub Actions workflow
- Documentation

**Phase 5: Documentation** (Week 4)
- Test plan
- Architecture documentation
- README refinement

---

## 12. Risks and Mitigation

| Risk | Probability | Impact | Mitigation Strategy | Status |
|------|-------------|--------|---------------------|---------|
| Application downtime | Medium | High | Implement retry logic; monitor uptime | Mitigated |
| Flaky tests due to timing | Medium | Medium | Use Playwright auto-waiting; avoid hard waits | Mitigated |
| Test data conflicts | Low | Medium | Generate unique IDs per test; implement cleanup | Mitigated |
| CI runner resource limits | Medium | Low | Use single worker in CI; optimize test parallelization | Mitigated |
| API schema changes | Low | High | Version control; contract testing in future | Accepted |
| Test environment instability | Medium | High | Retry mechanism; early failure detection via sanity suite | Mitigated |
| Browser compatibility issues | Low | Medium | Focus on Chromium only for initial implementation | Accepted |
| Lack of test data | Low | Medium | Use dynamic data generation; predefined users | Mitigated |

---

## 13. Assumptions and Dependencies

### 13.1 Assumptions
- Both applications (Sauce Demo and Petstore API) remain publicly accessible
- Test users in Sauce Demo continue to work with current credentials
- API schema doesn't change without notice
- GitHub Actions remains available for CI/CD
- No major breaking changes to Playwright framework

### 13.2 Dependencies
- Internet connectivity for accessing test applications
- GitHub repository access
- npm registry availability for installing dependencies
- Playwright browser binaries available for download

---

## 14. Approvals

**Prepared by:**
Edwin Perona - Test Automation Engineer
Date: February 2, 2026

**Reviewed by:**
_[Pending Review]_

**Approved by:**
_[Pending Approval]_

---

## Appendix A: Test Metrics

After implementation, here's what we ended up with:

**UI Tests:**
- Total test cases: 25
- Core feature tests (Login + Cart): 14
- Additional regression tests: 11
- Coverage: 2 major features + edge cases

**API Tests:**
- API 1: POST /pet - 3 tests
- API 2: DELETE /store/order/{orderId} - 2 tests
- **Total API tests: 5**
- HTTP methods covered: POST, DELETE (mixed methods as required)

**Overall:**
- Combined test cases: 30
- UI tests: 25 (14 core + 11 additional)
- API tests: 5 (meeting exact requirement)
- Estimated execution time: ~3 minutes (local), ~6 minutes (CI)
- Pass rate target: ≥95%

---

## Appendix B: Test Case Traceability

**UI Tests:**

| Feature | Test File | Test Count | Status |
|---------|-----------|------------|--------|
| Login (Core) | loginTest.spec.ts | 6 | Implemented |
| Shopping Cart (Core) | orderProductTest.spec.ts | 8 | Implemented |
| Checkout Validation (Additional) | checkoutValidation.spec.ts | Variable | Implemented |
| Cart Edge Cases (Additional) | cartEdgeCases.spec.ts | Variable | Implemented |
| End-to-End (Additional) | endToEndTest.spec.ts | Variable | Implemented |
| Sanity (Additional) | sanity.spec.ts | Variable | Implemented |

**API Tests:**

| API / Endpoint | HTTP Method | Test File | Test Count | Status |
|----------------|-------------|-----------|------------|--------|
| POST /pet | POST | petAPI.spec.ts | 3 | Implemented |
| DELETE /store/order/{orderId} | DELETE | storeAPI.spec.ts | 2 | Implemented |

**Summary:**
- Total automated tests: 30
- UI tests: 25 (6 Login + 8 Cart + 11 Additional)
- API tests: 5 (3 POST /pet + 2 DELETE /store/order)

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Feb 2, 2026 | Edwin Perona | Initial version |