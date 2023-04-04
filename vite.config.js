import {defineConfig} from 'vite';
import cesium from 'vite-plugin-cesium';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [cesium()],
  build: {
    // comment-out building the lib, build dist
    // lib: {
    //   entry: 'src/my-element.js',
    //   formats: ['es']
    // },
    // rollupOptions: {
    //   external: /^lit/
    // }
  },
  server: {
    open: '/index.html',
    host: '0.0.0.0',
  },
});
