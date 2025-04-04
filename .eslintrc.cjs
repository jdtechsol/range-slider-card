module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'prettier'
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-explicit-any': 'off', // Allow 'any' type for flexibility in HA context
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Not strictly necessary for custom cards
  },
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  ignorePatterns: ['dist/**/*', 'node_modules/**/*', '*.cjs', '*.js'], // Ignore build output, node_modules, and config files
};
