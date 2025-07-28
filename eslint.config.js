/**
 * @type {import("eslint").FlatConfigItem[]}
 */
module.exports = [
  // Global configuration for all files.
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    plugins: {
      // Plugin for integrating Prettier.
      prettier: require('eslint-plugin-prettier'),
    },
    rules: {
      // Enforce Prettier formatting.
      'prettier/prettier': [
        'error',
        {
          // Prettier options (adjust as needed for your team’s style).
          printWidth: 80,
          tabWidth: 2,
          useTabs: false,
          semi: true,
          singleQuote: true,
          trailingComma: 'es5',
          bracketSpacing: true,
          arrowParens: 'always',
          endOfLine: 'lf',
        },
      ],
      'no-console': 'warn', // Warn on console usage.
    },
  },
  // Configuration specific to TypeScript files.
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    },
    rules: {
      // Use recommended rules for TypeScript.
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      // Add additional TypeScript-specific rules as needed.
    },
  },
  // (Optional) Additional configuration for JavaScript files.
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      // If you have any JS-specific rules, add them here.
    },
  },
];
