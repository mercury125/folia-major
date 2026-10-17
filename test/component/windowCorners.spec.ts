import { test, expect } from './fixtures';
// test/component/windowCorners.spec.ts

for (const platform of ['win32', 'darwin']) {
    for (const initialFullscreen of [false, true]) {
        test(`${platform}, initially fullscreen=${initialFullscreen}: fullscreen removes corners and exit restores them`, async ({ page, mount }) => {
            await page.addInitScript(({ platform, initialFullscreen }) => {
                window.electron = {
                    platform,
                    isWindowMaximized: async () => false,
                    isWindowFullscreen: async () => initialFullscreen,
                    onWindowFullscreenChanged: (callback: (value: boolean) => void) => {
                        const listener = (event: Event) => callback((event as CustomEvent<boolean>).detail);
                        window.addEventListener('test-fullscreen', listener);
                        return () => window.removeEventListener('test-fullscreen', listener);
                    },
                } as unknown as NonNullable<typeof window.electron>;
            }, { platform, initialFullscreen });
            await mount('windowCorners');
            const shell = page.getByTestId('window-content').locator('..');
            const radius = platform === 'win32' ? '8px' : '18px';
            await expect(shell).toHaveCSS('border-top-left-radius', initialFullscreen ? '0px' : radius);
            await page.evaluate(() => window.dispatchEvent(new CustomEvent('test-fullscreen', { detail: true })));
            await expect(shell).toHaveCSS('border-top-left-radius', '0px');
            await page.evaluate(() => window.dispatchEvent(new CustomEvent('test-fullscreen', { detail: false })));
            await expect(shell).toHaveCSS('border-top-left-radius', radius);
        });
    }
}

test('an initial fullscreen IPC response cannot override a newer native event', async ({ page, mount }) => {
    await page.addInitScript(() => {
        window.electron = {
            platform: 'win32',
            isWindowMaximized: async () => false,
            isWindowFullscreen: () => new Promise<boolean>(resolve => {
                window.addEventListener('test-initial-response', () => resolve(false), { once: true });
            }),
            onWindowFullscreenChanged: (callback: (value: boolean) => void) => {
                const listener = () => callback(true);
                window.addEventListener('test-fullscreen', listener);
                return () => window.removeEventListener('test-fullscreen', listener);
            },
        } as unknown as NonNullable<typeof window.electron>;
    });
    await mount('windowCorners');
    const shell = page.getByTestId('window-content').locator('..');
    await expect(shell).toHaveCSS('border-top-left-radius', '8px');
    await page.evaluate(() => {
        window.dispatchEvent(new Event('test-fullscreen'));
        window.dispatchEvent(new Event('test-initial-response'));
    });
    await expect(shell).toHaveCSS('border-top-left-radius', '0px');
});
