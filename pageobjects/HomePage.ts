import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  private readonly contactLink: Locator;
  private readonly shopLink: Locator;

  constructor(page: Page) {
    super(page, '/');
    this.contactLink = page.locator('#nav-contact a');
    this.shopLink = page.locator('#nav-shop a');
  }

  async goToContactPage(): Promise<void> {
    await this.clickElement(this.contactLink);
    await this.waitForPageLoad();
  }

  async goToShopPage(): Promise<void> {
    await this.clickElement(this.shopLink);
    await this.waitForPageLoad();
  }
}
