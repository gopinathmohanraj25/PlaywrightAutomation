import { test, expect } from '@playwright/test';
import { HomePage } from '../pageobjects/HomePage';
import { ContactPage } from '../pageobjects/ContactPage';
import { TestData } from '../utils/TestData';

test.describe('Contact Page Tests', () => {
  test('Test Case 1: Verify error messages and validation', async ({ page }) => {
    const homePage = new HomePage(page);
    const contactPage = new ContactPage(page);

    // 1. From the home page go to contact page
    await homePage.navigate();
    await homePage.goToContactPage();

    // 2. Click submit button
    await contactPage.clickSubmit();

    // 3. Verify error messages
    await contactPage.verifyErrorMessages();

    // 4. Populate mandatory fields
    await contactPage.fillMandatoryFields(
      TestData.CONTACT_DATA.forename,
      TestData.CONTACT_DATA.email,
      TestData.CONTACT_DATA.message
    );

    // 5. Validate errors are gone
    await contactPage.verifyErrorsAreGone();
  });

  // Test Case 2: Run 5 times to ensure 100% pass rate
  for (let i = 1; i <= 5; i++) {
    test(`Test Case 2 - Run ${i}: Successful form submission`, async ({ page }) => {
      const homePage = new HomePage(page);
      const contactPage = new ContactPage(page);

      // 1. From the home page go to contact page
      await homePage.navigate();
      await homePage.goToContactPage();

      // 2. Populate mandatory fields
      await contactPage.fillMandatoryFields(
        TestData.CONTACT_DATA.forename,
        TestData.CONTACT_DATA.email,
        TestData.CONTACT_DATA.message
      );

      // 3. Click submit button
      await contactPage.clickSubmit();

      // 4. Validate successful submission message
      await contactPage.verifySuccessMessage();
    });
  }
});

