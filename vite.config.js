import svelte from "rollup-plugin-svelte";
import autoPreprocess from "svelte-preprocess";

export default {
  root: "web",
  base: "./",
  plugins: [
    svelte({
      preprocess: autoPreprocess(),
    }),
  ],
  build: {
    outDir: "../app/dist",
    rollupOptions: {},
  },
};
