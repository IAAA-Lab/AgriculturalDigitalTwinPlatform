import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      onwarn: (warning, handler) => {
        const { code, frame } = warning;
        if (code === "css-unused-selector") return;

        handler(warning);
      },
      emitCss: true,
    }),
  ],
  // For absolute imports https://dev.to/abdeldjalilhachimi/how-to-avoid-long-path-import-using-react-with-ts-and-vite-4e2h
  resolve: {
    alias: {
      "@/src": `${__dirname}/src`,
    },
  },
});
