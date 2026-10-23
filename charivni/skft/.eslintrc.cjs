module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'src/components/AuthPage/RegistrationForm/', 'src/components/CabinetPage/AddArticleModalWindow/', 'src/components/CabinetPage/AddProductsModalWindow/', 'src/components/CabinetPage/ArticleModalWindow/', 'src/components/CabinetPage/ProductsModalWindow/', 'src/components/CabinetPage/PrivateCabinet/'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
