import { chromium, devices } from 'playwright';
import path from 'path';

import fs from 'fs';

const ARTIFACTS_DIR = process.env.ARTIFACTS_DIR || path.join(process.cwd(), 'screenshots');
if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

async function run() {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true
  });

  const iphone = devices['iPhone 13']; // 390 x 844
  const context = await browser.newContext({
    ...iphone,
    deviceScaleFactor: 2
  });

  const page = await context.newPage();
  
  // 1. First visit - disclaimer modal
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '01_mobile_disclaimer.png') });
  console.log('1. Captured disclaimer modal');

  // Dismiss disclaimer
  const agreeBtn = page.locator('button:has-text("I Understand & Agree")');
  if (await agreeBtn.isVisible()) {
    await agreeBtn.click();
    await page.waitForTimeout(600);
  }

  // 2. Main Routes View (Planner Tab)
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '02_mobile_routes_view.png') });
  console.log('2. Captured mobile routes view');

  // Measure header bounding box
  const headerBox = await page.locator('.pompom-header').boundingBox();
  console.log('Header bounding box:', headerBox);

  // 3. Scroll down slightly to view route cards
  const routeCard = page.locator('.route-card').first();
  if (await routeCard.isVisible()) {
    await routeCard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '03_mobile_route_cards.png') });
    console.log('3. Captured mobile route cards with View on Map button');

    // Click "View on Map"
    const viewMapBtn = page.locator('button:has-text("View on Map")').first();
    if (await viewMapBtn.isVisible()) {
      await viewMapBtn.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, '04_mobile_map_view.png') });
      console.log('4. Captured mobile full-screen map with floating route bar');
    }
  }

  // 5. Test switching back to Routes view via floating bar "Steps" button
  const stepsBtn = page.locator('button:has-text("Steps")');
  if (await stepsBtn.isVisible()) {
    await stepsBtn.click();
    await page.waitForTimeout(500);
  }

  // 6. Test Hospital Duties View
  const dutiesTabBtn = page.locator('button.nav-pill-btn:has-text("Duties")');
  if (await dutiesTabBtn.isVisible()) {
    await dutiesTabBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '05_mobile_duties_view.png') });
    console.log('5. Captured mobile hospital duty guide');

    // Click "Get Route" on first hospital
    const getRouteBtn = page.locator('button:has-text("Get Route")').first();
    if (await getRouteBtn.isVisible()) {
      await getRouteBtn.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, '06_mobile_get_route_transition.png') });
      console.log('6. Captured transition after clicking Get Route');
    }
  }

  // 7. Test open dropdown
  const dropdownInput = page.locator('input.dropdown-search-input').first();
  if (await dropdownInput.isVisible()) {
    await dropdownInput.click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '07_mobile_dropdown_open.png') });
    console.log('7. Captured mobile dropdown open');
  }

  // Check horizontal overflowing elements
  const overflowing = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const all = document.querySelectorAll('*');
    const list = [];
    for (const el of all) {
      if (el.closest('.leaflet-container')) continue;
      const rect = el.getBoundingClientRect();
      if (rect.right > docWidth + 2 || rect.left < -2) {
        list.push({
          tag: el.tagName,
          className: (el.className && typeof el.className === 'string') ? el.className.slice(0, 50) : '',
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          docWidth
        });
      }
    }
    return list;
  });
  console.log('Overflowing elements:', JSON.stringify(overflowing, null, 2));

  // Desktop check
  const desktopContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  const desktopAgree = desktopPage.locator('button:has-text("I Understand & Agree")');
  if (await desktopAgree.isVisible()) await desktopAgree.click();
  await desktopPage.waitForTimeout(1000);
  await desktopPage.screenshot({ path: path.join(ARTIFACTS_DIR, 'desktop_view_new.png') });
  console.log('Captured desktop view screenshot');

  await browser.close();
  console.log('All tests completed successfully!');
}

run().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
