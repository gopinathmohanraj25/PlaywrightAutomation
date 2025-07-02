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

  /*async addProductToCart(productName: string, quantity: number): Promise<void> {
    const productRow = this.page.locator(`tr:has-text("${productName}")`);
    const priceCell = productRow.locator('td:nth-child(2)');
    const quantityField = productRow.locator('input[name="quantity"]');
    const buyButton = productRow.locator('a[class*="btn-success"]');

    // Set quantity and click buy
    await this.fillField(quantityField, quantity.toString());
    await this.clickElement(buyButton);
    
    // Wait a moment for the cart to update
    await this.page.waitForTimeout(1000);
  }*/

    async addProductToCart(productName: string, quantity: number): Promise<void> {
  // Update to use list item structure
  const productItem = this.page.locator(`li:has(h4:has-text("${productName}"))`);
  
  // Note: Based on the snapshot, there's no quantity input field visible
  // Only a "Buy" button is present. You may need to click the buy button multiple times
  // or check if quantity selection appears after clicking buy
  const buyButton = productItem.locator('a:has-text("Buy")');
  
  for (let i = 0; i < quantity; i++) {
    await this.clickElement(buyButton);
    await this.page.waitForTimeout(500); // Brief pause between clicks
  }
  
  await this.page.waitForTimeout(1000);
}



  /*async getProductPrice(productName: string): Promise<number> {
     //await this.page.waitForSelector('table', { timeout: 30000 });
    //const productRow = this.page.locator(`tr:has-text("${productName}")`);
    //const priceText = await productRow.locator('td:nth-child(2)').textContent({ timeout: 60000 });
    //return parseFloat(priceText?.replace('$', '') || '0');
    await this.page.waitForLoadState('networkidle');
   // await this.page.waitForSelector('table', { state: 'visible' });
    const productRow = this.page.locator(`tr:has-text("${productName}")`);
    await expect(productRow).toBeVisible({ timeout: 30000 });
    const priceText = await productRow.locator('td:nth-child(2)').textContent();
    return parseFloat(priceText?.replace('$', '') || '0');

  }*/

 

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
