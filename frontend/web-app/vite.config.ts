import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const filePath = dirname(fileURLToPath(import.meta.url));
const sassPath = `${filePath}/src/lib/assets/scss`;

export default defineConfig({
	server: {
		port: 3000
	},
	plugins: [sveltekit()],
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@import '${sassPath}/style.scss';`
			}
		}
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
