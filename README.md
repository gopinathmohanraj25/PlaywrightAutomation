# Playwright Automation Framework

## Requirements
Application URL: http://jupiter.cloud.planittesting.com

## About Framework
A comprehensive Playwright automation framework using TypeScript with Page Object Model (POM) design pattern for testing the Jupiter Toys application

- **BasePage class - Abstract base class with common page operations
- **Page Object Model - Separate classes for HomePage, ContactPage, ShopPage, and CartPage
- **Encapsulation - Private locators and public methods for interactions
- **Reusability - Common utilities and test data management

## 🏗 Project Structure

```
playwright-jupiter-toys/
├── pageobjects/           # Page Object Model classes
│   ├── BasePage.ts        # Base page with common functionality
│   ├── Cartpage.ts        # Cart page object
│   ├── ContactPage.ts     # Contact page object
│   ├── HomePage.ts        # Home page object
│   └── ShopPage.ts        # Shop page object
├── tests/                 # Test specification files
│   ├── contact.spec.ts    # Contact form tests
│   └── cart.spec.ts       # Shopping cart tests
├── utils/                 # Utility modules
│   └── TestData.ts        # Test Data configuration
├── test-results/          # Test execution results
├── playwright-report/     # HTML test reports
├── playwright.config.ts   # Playwright configuration
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```

## Test Cases Implemented:

Test case 1:
Contact Form Validation - Error message verification and field validation

Test Case 2:
Contact Form Submission - Runs 5 times to ensure 100% pass rate

Test Case 3:
Shopping Cart - Product addition, price verification, and calculation validation

## Assumptions:
It has been assumed that automation is to be carried out for written test cases, as detailed requirements are not available
