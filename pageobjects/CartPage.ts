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
  // Wait for the table to be loaded
  await this.page.waitForSelector('table');
  // specific selector - target the main cart table directly
  const productRows = this.page.locator('table tbody tr').filter({ has: this.page.locator('img') });
  const count = await productRows.count();
  //console.log(`Found ${count} product rows`);
  for (let i = 0; i < count; i++) {
    const row = productRows.nth(i);
    
    // Extract name - try multiple approaches
    let name = '';
    const nameCell = row.locator('td').first();
    
    // Method 1: Get all text content from the cell
    const cellText = await nameCell.textContent();
    if (cellText && cellText.trim()) {
      name = cellText.trim();
    }
    
    // Method 2: If still empty, try innerText
    if (!name) {
      try {
        const innerText = await nameCell.innerText();
        if (innerText && innerText.trim()) {
          name = innerText.trim();
        }
      } catch (e) {
        console.warn(`innerText failed for row ${i}:`, e);
      }
    }
    
    // Method 3: If still empty, try to get text specifically
    if (!name) {
      try {
        const textElements = await nameCell.locator('text').all();
        for (const textEl of textElements) {
          const text = await textEl.textContent();
          if (text && text.trim()) {
            name = text.trim();
            break;
          }
        }
      } catch (e) {
        console.warn(`text locator failed for row ${i}:`, e);
      }
    }
    
    const priceText = await row.locator('td').nth(1).textContent() || '';
    const quantityText = await row.locator('td').nth(2).locator('input').getAttribute('value') || '';
    //const quantityText = await row.locator('td').nth(2).textContent() || '';
    const subtotalText = await row.locator('td').nth(3).textContent() || '';

    const price = parseFloat(priceText.replace('$', ''));
    //const quantity = parseInt(quantityText);
    const quantity = parseInt(quantityText) || parseInt(await row.locator('td').nth(2).locator('input').getAttribute('value') || '0');
    const subtotal = parseFloat(subtotalText.replace('$', ''));

    //console.log(`Row ${i}: name="${name}", price="${priceText}", quantity="${quantityText}", subtotal="${subtotalText}"`);

    // Only add items with valid names
    if (name) {
      items.push({ name, price, quantity, subtotal });
    } else {
      console.warn(`Could not extract name from row ${i}`);
    }
  }

  //console.log(`Final items array:`, items);
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
  //console.log('Available items:', items.map(i => i.name));
  //console.log('Searching for:', productName);
  
  const item = items.find(i => i.name.includes(productName));
  
  if (!item) {
    throw new Error(`Product "${productName}" not found in cart. Available products: ${items.map(i => i.name).join(', ')}`);
  }
  
  expect(item).toBeDefined();
  expect(item.quantity).toBe(expectedQuantity);
  expect(item.price).toBeCloseTo(expectedPrice, 2);
}

}
