import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		port: 3000
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@import 'src/lib/assets/scss/app.scss';`
			}
		}
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
