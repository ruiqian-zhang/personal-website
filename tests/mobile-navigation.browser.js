// Run against a running site with Playwright CLI:
// playwright-cli open http://127.0.0.1:3000
// playwright-cli run-code --filename tests/mobile-navigation.browser.js
async page => {
  const origin = new URL(page.url()).origin;
  const check = (condition, message) => { if (!condition) throw new Error(message); };
  const toggle = () => page.getByRole('button', { name: 'Open navigation', exact: true });
  const dialog = () => page.getByRole('dialog', { name: 'Site navigation' });
  const navigation = () => dialog().getByRole('navigation', { name: 'Main navigation' });

  for (const width of [320, 375, 600]) {
    await page.setViewportSize({ width, height: 812 });
    await page.goto(origin, { waitUntil: 'domcontentloaded' });
    await page.locator('.site-footer button[aria-pressed="true"]').waitFor({ state: 'attached' });
    check(await toggle().isVisible(), `No menu button at ${width}px`);
    check(!await dialog().isVisible(), `Closed navigation is exposed at ${width}px`);
    const before = await page.locator('main').boundingBox();
    const scrollBefore = await page.evaluate(() => scrollY);
    await toggle().click();
    await dialog().waitFor({ state: 'visible' });
    check(await page.locator('#mobile-navigation').evaluate(element => element.matches(':modal')), 'Menu is not modal');
    const after = await page.locator('main').boundingBox();
    check(Math.abs(after.y - before.y) < 1, 'Opening the menu moved the page');
    check(await navigation().isVisible(), 'Open menu is hidden');
    const targets = await navigation().getByRole('link').evaluateAll(links => links.map(link => {
      const rect = link.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    }));
    check(targets.length === 4 && targets.every(r => r.width >= 44 && r.height >= 44), 'Menu links are too small');
    await page.mouse.wheel(0, 600);
    check(await page.evaluate(() => scrollY) === scrollBefore, 'Background scrolled behind menu');
    await dialog().getByRole('link', { name: 'Ruiqian Zhang, home' }).focus();
    await page.keyboard.press('Shift+Tab');
    check(await dialog().getByRole('link', { name: 'Ruiqian Zhang on LinkedIn' }).evaluate(link => link === document.activeElement), 'Focus escaped the menu backwards');
    await page.keyboard.press('Tab');
    check(await dialog().getByRole('link', { name: 'Ruiqian Zhang, home' }).evaluate(link => link === document.activeElement), 'Focus escaped the menu forwards');
    await page.keyboard.press('Escape');
    check(await toggle().getAttribute('aria-expanded') === 'false', 'Escape did not close menu');
    check(await toggle().evaluate(button => button === document.activeElement), 'Escape lost keyboard focus');
    await page.keyboard.press('Enter');
    check(await navigation().isVisible(), 'Keyboard did not open menu');
    await page.keyboard.press('Tab');
    check(await navigation().getByRole('link', { name: 'About', exact: true }).evaluate(link => link === document.activeElement), 'Keyboard order skipped the first link');
    await page.keyboard.press('Escape');
    await toggle().click();
    await dialog().getByRole('button', { name: 'Close navigation' }).click();
    check(!await dialog().isVisible(), 'Close button did not close menu');
    check(await page.evaluate(() => getComputedStyle(document.documentElement).overflow !== 'hidden'), 'Scroll lock remained after closing');
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal overflow at ${width}px`);
  }

  await toggle().click();
  await navigation().getByRole('link', { name: 'Projects', exact: true }).click();
  await page.waitForURL(`${origin}/projects/`, { waitUntil: 'domcontentloaded' });
  check(!await navigation().isVisible(), 'Menu stayed open after navigation');
  await page.goto(`${origin}/projects/mepad/`, { waitUntil: 'domcontentloaded' });
  await page.locator('.site-footer button[aria-pressed="true"]').waitFor({ state: 'attached' });
  await toggle().click();
  check(await navigation().getByRole('link', { name: 'Projects', exact: true }).getAttribute('aria-current') === 'location', 'Nested project lost its current section');
  await dialog().getByRole('button', { name: 'Use dark theme' }).click();
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark');
  check(await page.locator('.site-footer button[aria-label="Use dark theme"]').getAttribute('aria-pressed') === 'true', 'Footer theme did not synchronize');
  await page.setViewportSize({ width: 601, height: 812 });
  check(!await toggle().isVisible(), 'Mobile button visible on desktop');
  check(await page.locator('.header-right nav').isVisible(), 'Desktop navigation hidden');
  check(!await page.locator('#mobile-navigation').evaluate(element => element.open), 'Modal remained open on desktop');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForFunction(() => document.querySelector('.menu-toggle')?.getAttribute('aria-expanded') === 'false');
  check(!await dialog().isVisible(), 'Menu reopened after resizing to mobile');
  await page.setViewportSize({ width: 320, height: 360 });
  await toggle().click();
  await dialog().getByRole('button', { name: 'Use light theme' }).scrollIntoViewIfNeeded();
  await dialog().getByRole('button', { name: 'Use light theme' }).click();
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'light');
  const closeBox = await dialog().getByRole('button', { name: 'Close navigation' }).boundingBox();
  check(closeBox.y >= 0 && closeBox.y + closeBox.height <= 360, 'Close button escaped short-screen viewport');
  await page.keyboard.press('Escape');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await toggle().click();
  check(await dialog().evaluate(element => getComputedStyle(element).animationDuration) === '0s', 'Menu ignored reduced motion');
  await page.keyboard.press('Escape');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  return { result: 'passed', phoneWidths: [320, 375, 600], shortScreen: '320x360', desktopBreakpoint: 601, checks: ['modal isolation', 'no page movement', 'scroll lock', 'focus trap', 'keyboard', 'Escape focus', 'close button', 'navigation close', 'nested section', 'theme synchronization', 'resize', 'reduced motion', 'overflow'] };
}
