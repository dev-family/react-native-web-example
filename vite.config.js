// vite.config.js
import reactNativeWeb from "vite-plugin-react-native-web";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import commonjs from "vite-plugin-commonjs";

export default defineConfig({
  commonjsOptions: { transformMixedEsModules: true },
  plugins: [
    reactNativeWeb(),
    react({
      babel: {
        plugins: [
          "react-native-reanimated/plugin",
          "@babel/plugin-proposal-class-properties",
          "@babel/plugin-proposal-export-namespace-from",
        ],
      },
    }),
    commonjs(),
  ],
});
