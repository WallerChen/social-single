// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,

  // https://github.com/airbnb/javascript
  extends: 'airbnb-base',

  globals: {
    // App related.
    App: false,
    // Global object.
    wx: false,
    // Page related.
    Page: false,
    // Global functions.
    getApp: false,
    getCurrentPages: false,
    // Component related.
    Component: false,
    requirePlugin: false
  },

  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    presets: [
      '@babel/preset-env'
    ]
  },
  // https://eslint.org/docs/rules/
  rules: {
    semi: ['error', 'never'],
    'no-unused-vars': 'warn',
    'import/no-unresolved': 'off',
    'no-restricted-syntax': 0,
    'prefer-destructuring': 'off',
    'no-console': 'off',
    'func-names': ['warn', 'as-needed'],
    'object-shorthand': 'off',
    'comma-dangle': ['error', 'never'],
    'lines-around-comment': ['error', {
      beforeBlockComment: true
    }],
    'lines-between-class-members': ['error', 'always'],
    'no-underscore-dangle': ['error', {
      allowAfterThis: true,
      allowAfterSuper: true
    }],
    'vars-on-top': 'off',
    'prefer-template': 'off',
    'no-plusplus': 'off',
    'no-continue': 'off',
    'no-loop-func': 'off',
    // Limited by mini program development tools.
    'space-before-function-paren': ['error', 'never'],
    'eol-last': ['error', 'never'],
    'operator-linebreak': ['error', 'after'],
    'max-len': 'off',
    'max-lines': 'off',
    'no-else-return': 'off',
    'no-param-reassign': 'off',
    'no-unused-expressions': 'off',
    'consistent-return': 'off'
  }
}