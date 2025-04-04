import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser'; // Corrected import

export default {
  input: 'src/range-slider-card.ts',
  output: {
    file: 'dist/range-slider-card.js',
    format: 'es', // ES module format for modern browsers and HA frontend
    sourcemap: false, // Disable sourcemap for production build
    inlineDynamicImports: true, // Bundle dynamic imports into the main file
  },
  plugins: [
    resolve(), // Resolves node modules
    typescript({ // Compiles TypeScript
      tsconfig: './tsconfig.json', // Ensure it uses the correct tsconfig
      declaration: false, // Don't generate .d.ts files for the bundle
      sourceMap: false, // Disable sourcemaps within TS plugin as well
      inlineSources: false, // Don't include source code in sourcemaps
    }),
    terser({ // Minifies the output
      output: { comments: false } // Remove comments from the output
    }),
  ],
  // External dependencies that should not be bundled
  // 'lit' and 'custom-card-helpers' are usually provided by Home Assistant or other cards
  // However, bundling them often leads to fewer issues with version conflicts.
  // If you encounter issues, you might need to mark them as external:
  // external: ['lit', 'lit/decorators.js', 'custom-card-helpers']
};
