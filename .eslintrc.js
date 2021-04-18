module.exports = {
  extends: 'standard-with-typescript',
  parserOptions: {
    project: './tsconfig.json',
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        '@typescript-eslint/strict-boolean-expressions': ['off'],
        '@typescript-eslint/explicit-function-return-type': ['off'],
      },
    },
  ],
  extends: ['plugin:prettier/recommended'],
}
