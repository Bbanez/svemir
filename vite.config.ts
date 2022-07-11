import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import configRouterPlugin from 'vite-plugin-vue-router';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), configRouterPlugin()],
  optimizeDeps: {
    include: ['three'],
  },
});
