module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-case-declarations': [0, 'never'],
    '@typescript-eslint/no-inferrable-types': [0, 'never'],
    '@typescript-eslint/interface-name-prefix': [0, 'never'],
    '@typescript-eslint/no-empty-function': [0, 'never'],
    semi: [2, 'never'],
  },
}
