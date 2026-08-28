import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { cloudflare } from '@cloudflare/vite-plugin';
import { fileURLToPath, URL } from 'node:url';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import wasm from 'vite-plugin-wasm';
import { VitePWA } from 'vite-plugin-pwa';

// Vite + Cloudflare — unified dev: SPA + Worker + Assets
// Root vite ini membungkus frontend/ sebagai SPA dan worker/src/worker.ts sebagai Worker.
// `pnpm dev` → single vite dengan HMR untuk Vue + Worker reload.
// Build produksi tetap via `pnpm --filter frontend build:pages` + wrangler deploy (wrangler.jsonc).
export default defineConfig({
  // frontend sebagai root untuk Vite dev
  root: fileURLToPath(new URL('./frontend', import.meta.url)),
  build: {
    outDir: fileURLToPath(new URL('./frontend/dist', import.meta.url)),
    emptyOutDir: true,
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: true,
  },
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    legalComments: 'none',
  },
  plugins: [
    vue(),
    wasm(),
    AutoImport({
      imports: [
        'vue',
        {
          'naive-ui': ['useMessage', 'useNotification', 'NButton', 'NPopconfirm', 'NIcon'],
        },
      ],
    }),
    Components({
      resolvers: [NaiveUiResolver()],
    }),
    VitePWA({
      registerType: null,
      devOptions: { enabled: false },
      workbox: {
        disableDevLogs: true,
        globPatterns: [],
        runtimeCaching: [],
        navigateFallback: null,
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: 'BITS Mail Cloudflare',
        short_name: 'BITS Mail',
        description: 'BITS Mail Cloudflare - Temporary Email',
        theme_color: '#ffffff',
        icons: [{ src: '/logo.png', sizes: '192x192', type: 'image/png' }],
      },
    }),
    // Cloudflare dev — hubungkan ke wrangler.jsonc yang digenerate
    cloudflare({
      configPath: fileURLToPath(new URL('./wrangler.jsonc', import.meta.url)),
      viteEnvironment: { name: 'ssr' },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./frontend/src', import.meta.url)),
    },
  },
  define: {
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(process.env.npm_package_version),
  },
});
