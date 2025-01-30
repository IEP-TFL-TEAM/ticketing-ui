import { expect, test } from '@playwright/test';

const baseUrl = 'http://localhost:5173';

// Group related tests in a describe block

test.describe('Login Page', () => {
	test('Should have correct metadata and elements', async ({ page }) => {
		await page.goto(`${baseUrl}/login`);

		await expect(page).toHaveTitle('Ticketing System Login');

		await expect(
			page.getByRole('heading', {
				name: 'NOC Ticketing Portal'
			})
		).toBeVisible();
	});
});
