import svelte from "rollup-plugin-svelte";

export default {
  root: "web",
  base: './',
  plugins: [svelte()],
  build: {
    outDir: "../app/dist",
    rollupOptions: {
    },
  },
};
