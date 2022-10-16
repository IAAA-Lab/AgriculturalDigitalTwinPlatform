import sveltePreprocess from "svelte-preprocess";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const filePath = dirname(fileURLToPath(import.meta.url));
const sassPath = `${filePath}/src`;

export default {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: sveltePreprocess({
    scss: {
      // Imports global scss files
      prependData: `@import '${sassPath}/globals.scss';`,
    },
  }),
};
