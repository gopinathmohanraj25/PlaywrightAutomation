import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export class CartPage extends BasePage {
  private readonly cartTable: Locator;
  private readonly totalElement: Locator;

  constructor(page: Page) {
    super(page, '/cart');
    this.cartTable = page.locator('table');
    this.totalElement = page.locator('.total');
  }
  async getCartItems(): Promise<CartItem[]> {
    const items: CartItem[] = [];
    const rows = this.cartTable.locator('tbody tr');
    const count = await rows.count();

    for (let i = 0; i < count; i++) {
      const row = rows.nth(i);
      const name = await row.locator('td:nth-child(1)').textContent() || '';
      const priceText = await row.locator('td:nth-child(2)').textContent() || '';
      const quantityText = await row.locator('td:nth-child(3)').textContent() || '';
      const subtotalText = await row.locator('td:nth-child(4)').textContent() || '';

      const price = parseFloat(priceText.replace('$', ''));
      const quantity = parseInt(quantityText);
      const subtotal = parseFloat(subtotalText.replace('$', ''));

      items.push({ name, price, quantity, subtotal });
    }

    return items;
  }

  /*async getTotal(): Promise<number> {
    const totalText = await this.totalElement.textContent() || '';
    return parseFloat(totalText.replace(/[^0-9.]/g, ''));
  }*/

  async getTotal(): Promise<number> {
  const totalSelectors = [
    'strong:has-text("Total:")',
    'td:has-text("Total:")',
    '[class*="total"]',
    'tr:last-child td:last-child'
  ];
  
  for (const selector of totalSelectors) {
    try {
      const element = this.page.locator(selector);
      if (await element.count() > 0) {
        const totalText = await element.textContent() || '';
        const number = parseFloat(totalText.replace(/[^0-9.]/g, ''));
        if (!isNaN(number)) return number;
      }
    } catch (error) {
      continue;
    }
  }
  
  throw new Error('Could not find total element');
}

  async verifyCartCalculations(): Promise<void> {
    const items = await this.getCartItems();
    const total = await this.getTotal();

    // Verify subtotals
    for (const item of items) {
      const expectedSubtotal = item.price * item.quantity;
      expect(item.subtotal).toBeCloseTo(expectedSubtotal, 2);
    }

    // Verify total
    const expectedTotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    expect(total).toBeCloseTo(expectedTotal, 2);
  }

  async verifyProductInCart(productName: string, expectedQuantity: number, expectedPrice: number): Promise<void> {
    const items = await this.getCartItems();
    //const item = items.find(i => i.name.includes(productName));
    const normalizedProductName = productName.trim().toLowerCase();
    const item = items.find(i => i.name.trim().toLowerCase() === normalizedProductName);
    expect(item).toBeDefined();
    expect(item!.quantity).toBe(expectedQuantity);
    expect(item!.price).toBeCloseTo(expectedPrice, 2);
  }

}
