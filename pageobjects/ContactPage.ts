import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ContactPage extends BasePage {
  private readonly forenameField: Locator;
  private readonly emailField: Locator;
  private readonly messageField: Locator;
  private readonly submitButton: Locator;
  private readonly forenameError: Locator;
  private readonly emailError: Locator;
  private readonly messageError: Locator;
  private readonly successMessage: Locator;

  constructor(page: Page) {
    super(page, '/contact');
    this.forenameField = page.locator('#forename');
    this.emailField = page.locator('#email');
    this.messageField = page.locator('#message');
    this.submitButton = page.locator('a[class*="btn-contact"]');
    this.forenameError = page.locator('#forename-err');
    this.emailError = page.locator('#email-err');
    this.messageError = page.locator('#message-err');
    this.successMessage = page.locator('.alert-success');
  }

  async clickSubmit(): Promise<void> {
    await this.clickElement(this.submitButton);
  }

  async fillMandatoryFields(forename: string, email: string, message: string): Promise<void> {
    await this.fillField(this.forenameField, forename);
    await this.fillField(this.emailField, email);
    await this.fillField(this.messageField, message);
  }

  async verifyErrorMessages(): Promise<void> {
    await expect(this.forenameError).toBeVisible();
    await expect(this.emailError).toBeVisible();
    await expect(this.messageError).toBeVisible();
    
    await expect(this.forenameError).toContainText('Forename is required');
    await expect(this.emailError).toContainText('Email is required');
    await expect(this.messageError).toContainText('Message is required');
  }

  async verifyErrorsAreGone(): Promise<void> {
    await expect(this.forenameError).not.toBeVisible();
    await expect(this.emailError).not.toBeVisible();
    await expect(this.messageError).not.toBeVisible();
  }

  async verifySuccessMessage(): Promise<void> {
    await expect(this.successMessage).toBeVisible({ timeout: 15000 });
    await expect(this.successMessage).toContainText('Thanks');
  }
}
