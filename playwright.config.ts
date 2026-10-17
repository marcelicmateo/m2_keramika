import { defineConfig, devices } from '@playwright/test';

// Tests run against an already-built dist/ (build it with: BASE=/m2_keramika npm run build).
const url = 'http://localhost:4321/m2_keramika/';

export default defineConfig({
  testDir: 'tests',
  use: { baseURL: url },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // --ignore-lock: Astro 7 otherwise refuses to start if another preview server is running.
    command: 'npm run preview -- --port 4321 --ignore-lock',
    env: { BASE: '/m2_keramika' }, // preview serves dist/ under the configured base
    url,
    reuseExistingServer: !process.env.CI,
  },
});
