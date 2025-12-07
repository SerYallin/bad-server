import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import svgr from "vite-plugin-svgr";
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ svgr(), react(), tsconfigPaths({root: __dirname})],
  resolve: {
    alias: {
      $fonts: resolve('./src/vendor/fonts'),
      $assets: resolve('./src/assets'),
    }
  },
  build: {
    assetsInlineLimit:0,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "${resolve(__dirname, 'src/scss/variables')}" as *;
          @use "${resolve(__dirname, 'src/scss/mixins')}";
        `,
      },
    }
  },
  server: {
    port: 80,
    strictPort: true,
    origin: 'http://localhost',
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // замените на ваш адрес бекенда
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // если нужно убрать /api из пути
      },
    }
  }
})
