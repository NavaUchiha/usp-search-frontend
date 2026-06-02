import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJs from 'vite-plugin-css-injected-by-js';

// Single-file UMD bundle for <script src> drop-in via jsDelivr.
//   - React + ReactDOM bundled in (no host-page deps required)
//   - CSS injected into the page by JS at runtime (one file output)
//   - Output: dist/usp-search.umd.js
export default defineConfig({
  plugins: [react(), cssInjectedByJs()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    lib: {
      entry: 'src/main.jsx',
      name: 'USPSearch',
      formats: ['umd'],
      fileName: () => 'usp-search.umd.js',
    },
    sourcemap: true,
  },
});
