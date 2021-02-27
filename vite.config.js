import svelte from "rollup-plugin-svelte";

export default {
  root: "web",
  plugins: [svelte()],
  build: {
    rollupOptions: {
      external: "electron-better-ipc",
    },
  },
};
