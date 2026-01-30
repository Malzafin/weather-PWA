import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  { ignores: ['node_modules/**', 'dist/**', 'build/**', '.idea/**'] },


  js.configs.recommended,

  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        caches: 'readonly',
        self: 'readonly',
      },
    },
    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'import/no-unresolved': ['error', { ignore: ['^https?://'] }],
      // traktuj brak zgodności z Prettier jako błąd
      'prettier/prettier': 'error',
    },
  },


  {
    files: ['sw.js'],
    languageOptions: {
      globals: {
        self: 'readonly',
        caches: 'readonly',
        clients: 'readonly',
        Response: 'readonly',
        Request: 'readonly',
      },
    },
    rules: { 'no-restricted-globals': 'off' },
  },
];
