import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import simpleImportSort from "eslint-plugin-simple-import-sort";
import eslintPluginQuery from "eslint-plugin-query";

export default defineConfig([
  globalIgnores(['dist', '**/routeTree.gen.ts']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      "simple-import-sort": simpleImportSort,
      "eslint-plugin-query": eslintPluginQuery,
    },
    rules: {
      'react-refresh/only-export-components': [
        'warn'
      ],
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
])
