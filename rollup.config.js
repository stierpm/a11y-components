import { defineConfig } from 'rollup';
import { babel } from '@rollup/plugin-babel';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default defineConfig([
  // ES Module build
  {
    input: 'src/index.js',
    output: {
      file: 'dist/a11y-components.esm.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          ['@babel/preset-env', {
            targets: {
              browsers: ['> 1%', 'last 2 versions', 'not ie <= 8']
            }
          }]
        ]
      }),
    ],
    external: [],
  },
  // UMD build
  {
    input: 'src/index.js',
    output: {
      file: 'dist/a11y-components.umd.js',
      format: 'umd',
      name: 'A11yComponents',
      sourcemap: true,
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          ['@babel/preset-env', {
            targets: {
              browsers: ['> 1%', 'last 2 versions', 'not ie <= 8']
            }
          }]
        ]
      }),
    ],
    external: [],
  },
  // Minified UMD build
  {
    input: 'src/index.js',
    output: {
      file: 'dist/a11y-components.umd.min.js',
      format: 'umd',
      name: 'A11yComponents',
      sourcemap: true,
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          ['@babel/preset-env', {
            targets: {
              browsers: ['> 1%', 'last 2 versions', 'not ie <= 8']
            }
          }]
        ]
      }),
      terser(),
    ],
    external: [],
  },
]);
