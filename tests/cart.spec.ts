import { test, expect } from '@playwright/test';
import { HomePage } from '../pageobjects/HomePage';
import { ShopPage } from '../pageobjects/ShopPage';
import { CartPage } from '../pageobjects/CartPage';
import { TestData } from '../utils/TestData';

test.describe('Shopping Cart Tests', () => {
  test('Test Case 3: Cart calculations and product verification', async ({ page }) => {
    const homePage = new HomePage(page);
    const shopPage = new ShopPage(page);
    const cartPage = new CartPage(page);

    // Navigate to shop page
    await homePage.navigate();
    await homePage.goToShopPage();

    // Store product prices before adding to cart
    const frogPrice = await shopPage.getProductPrice(TestData.PRODUCTS.STUFFED_FROG.name);
    const bunnyPrice = await shopPage.getProductPrice(TestData.PRODUCTS.FLUFFY_BUNNY.name);
    const bearPrice = await shopPage.getProductPrice(TestData.PRODUCTS.VALENTINE_BEAR.name);

    // 1. Buy 2 Stuffed Frog, 5 Fluffy Bunny, 3 Valentine Bear
    await shopPage.addProductToCart(
      TestData.PRODUCTS.STUFFED_FROG.name,
      TestData.PRODUCTS.STUFFED_FROG.quantity
    );
    
    await shopPage.addProductToCart(
      TestData.PRODUCTS.FLUFFY_BUNNY.name,
      TestData.PRODUCTS.FLUFFY_BUNNY.quantity
    );
    
    await shopPage.addProductToCart(
      TestData.PRODUCTS.VALENTINE_BEAR.name,
      TestData.PRODUCTS.VALENTINE_BEAR.quantity
    );

    // 2. Go to the cart page
    await shopPage.goToCart();

    // 3. Verify the subtotal for each product is correct
    // 4. Verify the price for each product
    await cartPage.verifyProductInCart(
      TestData.PRODUCTS.STUFFED_FROG.name,
      TestData.PRODUCTS.STUFFED_FROG.quantity,
      frogPrice
    );
    
    await cartPage.verifyProductInCart(
      TestData.PRODUCTS.FLUFFY_BUNNY.name,
      TestData.PRODUCTS.FLUFFY_BUNNY.quantity,
      bunnyPrice
    );
    
    await cartPage.verifyProductInCart(
      TestData.PRODUCTS.VALENTINE_BEAR.name,
      TestData.PRODUCTS.VALENTINE_BEAR.quantity,
      bearPrice
    );

    // 5. Verify that total = sum(sub totals)
    await cartPage.verifyCartCalculations();
  });
});
