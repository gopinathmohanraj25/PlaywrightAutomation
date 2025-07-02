import { test, expect, type Page } from '@playwright/test';

test('Launch link', async ({ page }) => {
  await page.goto('https://jupiter.cloud.planittesting.com/#/home');
  
});
