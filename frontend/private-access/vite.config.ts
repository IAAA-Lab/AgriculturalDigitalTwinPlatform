// vite.config.js
import { defineConfig, loadEnv } from "vite";

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    base: process.env.VITE_BASE_URL || "/",
    server: {
      port: parseInt(process.env.VITE_PORT) ?? "5174",
    },
    // For absolute imports https://dev.to/abdeldjalilhachimi/how-to-avoid-long-path-import-using-react-with-ts-and-vite-4e2h
    resolve: {
      alias: {
        src: `${__dirname}/src`,
      },
    },
  });
};
