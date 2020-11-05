module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/recommended',
    'plugin:prettier/recommended',
    'prettier',
    'prettier/vue',
  ],
  plugins: ['vue'],
  rules: {
    semi: ['error', 'always'],
    indent: ['error', 2, { SwitchCase: 1 }],
    '@typescript-eslint/indent': ['error', 2],
    'max-len': ['error', { code: 100 }],
    'no-restricted-imports': ['error', { patterns: ['../'] }],
    'comma-dangle': ['error', 'only-multiline'],
  },
};
