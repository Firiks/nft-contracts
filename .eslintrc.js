module.exports = {
  root: true,
  env: {
    browser: false,
    es2021: true,
    mocha: true,
    node: true,
    commonjs: true
  },
  globals: {
    
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    'no-console': 'off',
  }
}
