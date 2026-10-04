import { test, expect } from '@playwright/test';

test('manifest URL serves JSON with usable local icons', async ({ page, request }) => {
  await page.goto('./');
  const href = await page.locator('link[rel="manifest"]').getAttribute('href');
  const url = new URL(href, page.url()).href;
  const response = await request.get(url);
  expect(response.ok()).toBeTruthy();
  expect(response.headers()['content-type']).toMatch(/json/);
  const manifest = await response.json();
  expect(manifest.name).toBe('GradeFlow');
  expect(manifest.start_url).toBe('./');
  for (const icon of manifest.icons) {
    const asset = await request.get(new URL(icon.src, url).href);
    expect(asset.ok()).toBeTruthy();
    expect(asset.headers()['content-type']).toContain('image/png');
  }
});

test('all screens render without runtime errors and survive login and reload', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('./');
  await expect(page.getByRole('heading', { name: 'Welcome back.' })).toBeVisible();
  await page.getByRole('link', { name: 'Create account' }).click();
  await expect(page.getByRole('heading', { name: 'Make room for growth.' })).toBeVisible();
  await page.getByLabel('Full name').fill('Test Student');
  await page.getByLabel('Email address').fill('student@example.test');
  await page.getByLabel('Password', { exact: true }).fill('local-test-password');
  await page.getByLabel('Confirm password').fill('local-test-password');
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page.getByRole('heading', { name: /Good .*, Test/ })).toBeVisible();
  await page.getByRole('link', { name: 'Calculator', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'GPA calculator.' })).toBeVisible();
  await page.getByLabel('Semester name').fill('Semester 01');
  for (let i = 0; i < 3; i++) await page.getByLabel('Subject name', { exact: true }).nth(i).fill(`Course ${i + 1}`);
  await page.getByRole('button', { name: 'Calculate GPA' }).click();
  await expect(page.locator('.result .gpa-number')).toContainText('4.00');
  await page.getByRole('button', { name: 'Save semester' }).click();
  await expect(page.getByRole('heading', { name: 'Semester history.' })).toBeVisible();
  await page.getByRole('link', { name: /Semester 01/ }).click();
  await expect(page.getByRole('heading', { name: 'Semester 01', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Edit semester' }).click();
  await expect(page.getByRole('heading', { name: 'Edit semester.' })).toBeVisible();
  await page.getByRole('link', { name: 'Planner', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Aim a little higher.' })).toBeVisible();
  await page.getByRole('button', { name: 'Calculate required GPA' }).click();
  await expect(page.locator('.result')).toBeVisible();
  await page.getByRole('link', { name: 'Home', exact: true }).click();
  await page.getByRole('link', { name: 'View CGPA details' }).click();
  await expect(page.getByRole('heading', { name: 'Your overall progress.' })).toBeVisible();
  await page.getByRole('link', { name: 'Profile', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Your profile.' })).toBeVisible();
  await page.getByRole('button', { name: 'Log out' }).click();
  await expect(page.getByRole('heading', { name: 'Welcome back.' })).toBeVisible();
  await page.getByLabel('Email address').fill('student@example.test');
  await page.getByLabel('Password', { exact: true }).fill('local-test-password');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByRole('heading', { name: /Good .*, Test/ })).toBeVisible();
  await expect(page.locator('.gpa-hero .gpa-number')).toContainText('4.00');
  await page.reload();
  await expect(page.getByRole('heading', { name: /Good .*, Test/ })).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
  await page.screenshot({ path: testInfo.outputPath('dashboard.png'), fullPage: true });
  if (testInfo.project.name.startsWith('production')) {
    const scope = await page.evaluate(async () => (await navigator.serviceWorker.ready).scope);
    expect(new URL(scope).pathname).toBe('/gradeflow/');
  }
  expect(errors).toEqual([]);
});
