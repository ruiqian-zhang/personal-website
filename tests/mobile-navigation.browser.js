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
    const stampBefore = await page.locator('.site-header > .wordmark').boundingBox();
    const scrollBefore = await page.evaluate(() => scrollY);
    await toggle().click();
    await dialog().waitFor({ state: 'visible' });
    check(await page.locator('#mobile-navigation').evaluate(element => element.matches(':modal')), 'Menu is not modal');
    const after = await page.locator('main').boundingBox();
    check(Math.abs(after.y - before.y) < 1, 'Opening the menu moved the page');
    check(await navigation().isVisible(), 'Open menu is hidden');
    const stampAfter = await dialog().getByRole('link', { name: 'Ruiqian Zhang, home' }).boundingBox();
    check(['x', 'y', 'width', 'height'].every(key => Math.abs(stampBefore[key] - stampAfter[key]) < 1), 'Stamp moved when opening menu');
    check(await dialog().evaluate(element => getComputedStyle(element).animationName) === 'none', 'Menu panel still animates');
    check(await dialog().getByRole('button', { name: 'Close navigation' }).innerText() === '', 'Close button has visible text');
    check(await dialog().locator('.menu-icon-line').count() === 2, 'Menu icon does not have two strokes');
    const targets = await navigation().getByRole('link').evaluateAll(links => links.map(link => {
      const rect = link.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    }));
    check(targets.length === 4 && targets.every(r => r.width >= 44 && r.height >= 44), 'Menu links are too small');
    await page.mouse.wheel(0, 600);
    check(await page.evaluate(() => scrollY) === scrollBefore, 'Background scrolled behind menu');
    await dialog().getByRole('link', { name: 'Ruiqian Zhang, home' }).focus();
    await page.keyboard.press('Shift+Tab');
    check(await dialog().getByRole('button', { name: 'Use dark theme' }).evaluate(button => button === document.activeElement), 'Focus escaped the menu backwards');
    await page.keyboard.press('Tab');
    check(await dialog().getByRole('link', { name: 'Ruiqian Zhang, home' }).evaluate(link => link === document.activeElement), 'Focus escaped the menu forwards');
    await page.keyboard.press('Escape');
    check(await toggle().getAttribute('aria-expanded') === 'false', 'Escape did not close menu');
    check(await toggle().evaluate(button => button === document.activeElement), 'Escape lost keyboard focus');
    const closedTransform = await toggle().locator('.menu-icon-top').evaluate(async element => {
      await Promise.all(element.getAnimations().map(animation => animation.finished));
      return getComputedStyle(element).transform;
    });
    check(closedTransform === 'none', 'Menu icon did not return to horizontal lines');
    check(await toggle().innerText() === '', 'Menu button has visible text');
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
  await page.waitForFunction(() => !document.querySelector('#mobile-navigation')?.open);
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
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`${origin}/resume/`, { waitUntil: 'domcontentloaded' });
  const preview = page.locator('.resume-mobile-preview img');
  await preview.waitFor({ state: 'visible' });
  await page.waitForFunction(() => { const image = document.querySelector('.resume-mobile-preview img'); return image?.complete && image.naturalWidth > 0; });
  check(await page.locator('.resume-mobile-preview').getAttribute('href') === `${new URL(origin).pathname.replace(/\/$/, '')}/Ruiqian_Zhang_Resume.pdf`, 'Mobile preview does not open the PDF');
  check(!await page.locator('.site-footer .theme-selector').isVisible(), 'Theme controls remain in mobile footer');
  const centeredFooter = await page.locator('.site-footer').evaluate(footer => {
    const links = [...footer.querySelectorAll('.social-links a')].map(link => link.getBoundingClientRect());
    const social = footer.querySelector('.social-links').getBoundingClientRect();
    const location = footer.querySelector('.footer-location').getBoundingClientRect();
    const copyright = footer.querySelector('.footer-copyright').getBoundingClientRect();
    return links.length === 4 && links.every(rect => Math.abs(rect.y - links[0].y) < 1) && Math.abs(social.x + social.width / 2 - innerWidth / 2) < 1 && Math.abs(location.x + location.width / 2 - innerWidth / 2) < 1 && copyright.y > location.y && getComputedStyle(footer.querySelector('.footer-copyright')).textAlign === 'center';
  });
  check(centeredFooter, 'Mobile footer is not centered in the requested order');
  await page.setViewportSize({ width: 768, height: 900 });
  check(await page.locator('.resume-preview').isVisible(), 'Desktop PDF preview missing');
  check(!await page.locator('.resume-mobile-preview').isVisible(), 'Mobile preview is visible on desktop');
  check(await page.locator('.site-footer .theme-selector').isVisible(), 'Desktop theme controls missing');
  return { result: 'passed', phoneWidths: [320, 375, 600], shortScreen: '320x360', desktopBreakpoint: 601, checks: ['static stamp', 'two-stroke icon', 'no visible menu labels', 'no panel animation', 'mobile PDF preview', 'centered mobile footer', 'modal isolation', 'no page movement', 'scroll lock', 'focus trap', 'keyboard', 'Escape focus', 'close button', 'navigation close', 'nested section', 'theme synchronization', 'resize', 'reduced motion', 'overflow'] };
}
