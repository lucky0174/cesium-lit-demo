import {defineConfig} from 'vite';
import babel from 'vite-plugin-babel';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    babel({
      babelConfig: {
        babelrc: false,
        configFile: false,
        plugins: [
          ['@babel/plugin-proposal-decorators', {decoratorsBeforeExport: true}],
          ['@babel/plugin-proposal-class-properties', {loose: true}],
        ],
      },
    }),
  ],
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
