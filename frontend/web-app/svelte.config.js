import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { importAssets } from 'svelte-preprocess-import-assets';
import sveltePreprocess from 'svelte-preprocess';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

/** @type {import('@sveltejs/kit').Config} */

const filePath = dirname(fileURLToPath(import.meta.url));
const sassPath = `${filePath}/static/scss`;

const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	onwarn: (warning, handler) => {
		if (warning.code === 'css-unused-selector') return;
		handler(warning);
	},
	preprocess: [
		vitePreprocess(),
		importAssets(),
		sveltePreprocess({
			scss: {
				prependData: `@import '${sassPath}/style.scss';`
			}
		})
	],
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.

		adapter: adapter()
	}
};

export default config;
