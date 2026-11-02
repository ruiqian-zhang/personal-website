// Run against a running site with Playwright CLI:
// playwright-cli open http://127.0.0.1:3000
// playwright-cli run-code --filename tests/mobile-navigation.browser.js
async page => {
  const origin = new URL(page.url()).origin;
  const check = (condition, message) => { if (!condition) throw new Error(message); };
  const toggle = () => page.getByRole('button', { name: /navigation/ });
  const navigation = () => page.getByRole('navigation', { name: 'Main navigation' });

  for (const width of [320, 375, 600]) {
    await page.setViewportSize({ width, height: 812 });
    await page.goto(origin, { waitUntil: 'domcontentloaded' });
    check(await toggle().isVisible(), `No menu button at ${width}px`);
    check(!await navigation().isVisible(), `Closed navigation is exposed at ${width}px`);
    await toggle().click();
    check(await toggle().getAttribute('aria-expanded') === 'true', 'Expanded state missing');
    check(await navigation().isVisible(), 'Open menu is hidden');
    const targets = await navigation().getByRole('link').evaluateAll(links => links.map(link => {
      const rect = link.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    }));
    check(targets.length === 4 && targets.every(r => r.width >= 44 && r.height >= 44), 'Menu links are too small');
    await page.keyboard.press('Escape');
    check(await toggle().getAttribute('aria-expanded') === 'false', 'Escape did not close menu');
    check(await toggle().evaluate(button => button === document.activeElement), 'Escape lost keyboard focus');
    await page.keyboard.press('Enter');
    check(await navigation().isVisible(), 'Keyboard did not open menu');
    await page.keyboard.press('Tab');
    check(await navigation().getByRole('link', { name: 'About', exact: true }).evaluate(link => link === document.activeElement), 'Keyboard order skipped the first link');
    await page.keyboard.press('Escape');
    await toggle().click();
    await page.locator('main').click({ position: { x: 8, y: 8 } });
    check(!await navigation().isVisible(), 'Outside press did not close menu');
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal overflow at ${width}px`);
  }

  await toggle().click();
  await navigation().getByRole('link', { name: 'Projects', exact: true }).click();
  await page.waitForURL(`${origin}/projects/`, { waitUntil: 'domcontentloaded' });
  check(!await navigation().isVisible(), 'Menu stayed open after navigation');
  await page.goto(`${origin}/projects/mepad/`, { waitUntil: 'domcontentloaded' });
  await toggle().click();
  check(await navigation().getByRole('link', { name: 'Projects', exact: true }).getAttribute('aria-current') === 'location', 'Nested project lost its current section');
  await page.setViewportSize({ width: 601, height: 812 });
  check(!await toggle().isVisible(), 'Mobile button visible on desktop');
  check(await navigation().isVisible(), 'Desktop navigation hidden');
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForFunction(() => document.querySelector('.menu-toggle')?.getAttribute('aria-expanded') === 'false');
  check(!await navigation().isVisible(), 'Menu reopened after resizing to mobile');
  return { result: 'passed', phoneWidths: [320, 375, 600], desktopBreakpoint: 601, checks: ['toggle', 'keyboard', 'Escape focus', 'outside press', 'navigation close', 'nested section', 'resize', 'overflow'] };
}
