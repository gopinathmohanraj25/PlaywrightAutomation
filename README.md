# PlaywrightAutomation Object-Oriented Design:

BasePage class - Abstract base class with common page operations
Page Object Model - Separate classes for HomePage, ContactPage, ShopPage, and CartPage
Encapsulation - Private locators and public methods for interactions
Reusability - Common utilities and test data management

Framework Structure:
├── src/
│   ├── pages/          # Page Object Model classes
│   └── utils/          # Test data and utilities
├── tests/              # Test specifications
├── playwright.config.ts
├── package.json
└── Jenkinsfile


Test Cases Implemented:

Contact Form Validation - Error message verification and field validation
Contact Form Submission - Runs 5 times to ensure 100% pass rate
Shopping Cart - Product addition, price verification, and calculation validation
