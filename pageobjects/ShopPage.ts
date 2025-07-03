import { Page, expect, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface Product {
  name: string;
  price: number;
  quantity: number;
}

export class ShopPage extends BasePage {
  private readonly cartLink: Locator;

  constructor(page: Page) {
    super(page, '/shop');
    this.cartLink = page.locator('#nav-cart a');
  }

  

  async addProductToCart(productName: string, quantity: number): Promise<void> {
  // Update to use list item structure
  const productItem = this.page.locator(`li:has(h4:has-text("${productName}"))`);
  
  //  check if quantity selection appears after clicking buy
  const buyButton = productItem.locator('a:has-text("Buy")');
  
  for (let i = 0; i < quantity; i++) {
    await this.clickElement(buyButton);
    await this.page.waitForTimeout(500); // Brief pause between clicks
  }
  
  await this.page.waitForTimeout(1000);
}

async getProductPrice(productName: string): Promise<number> {
  await this.page.waitForLoadState('networkidle');
  
  // Target the list item containing the product heading
  const productItem = this.page.locator(`li:has(h4:has-text("${productName}"))`);
  await expect(productItem).toBeVisible({ timeout: 30000 });
  
  // Get price from the paragraph element
  const priceText = await productItem.locator('p').textContent();
  return parseFloat(priceText?.replace('$', '') || '0');
}
 async goToCart(): Promise<void> {
    await this.clickElement(this.cartLink);
    await this.waitForPageLoad();
  }
}
