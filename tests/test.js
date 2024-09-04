import { expect, test } from '@playwright/test';

test.describe('Login page', () => {
	test('Should have correct metadata and elements', async ({ page }) => {
		await page.goto('http://localhost:5173/login');
		await expect(page).toHaveTitle('Login Page');
	});
});
