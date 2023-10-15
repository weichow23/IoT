const ignoreNames = ['Window', '__dirname', '__filename', '[A-Z][a-z]+Actions']
const ignoreFilter = {
  regex: `^(${ignoreNames.join('|')})$`,
  match: false,
}

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  root: true,
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:promise/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-hooks',
    '@typescript-eslint',
    'promise',
    'prettier',
  ],
  rules: {
    'import/no-named-default': 'off',
    'react/prop-types': 'off',
    // worker
    'no-restricted-globals': ['warn'],
    // eslint promise
    'promise/catch-or-return': ['error', { allowFinally: true }],
    'import/no-named-as-default-member': 'off',
    'import/first': 'off',
    'import/no-commonjs': 'off',
    'react/jsx-uses-react': 'off',
    'react-hooks/rules-of-hooks': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    // suppress errors for missing 'import React' in files
    'react/react-in-jsx-scope': 'off',
    // allow jsx syntax in js files (for next.js project)
    'react/jsx-filename-extension': [
      1,
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    ],
    'react/no-unescaped-entities': 'off',
    // 通用规范开始
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'default',
        format: ['camelCase'],
        filter: ignoreFilter,
      },
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        filter: ignoreFilter,
      },
      {
        selector: 'function',
        format: ['camelCase', 'PascalCase'],
        filter: ignoreFilter,
      },
      {
        selector: 'parameter',
        format: ['camelCase', 'PascalCase'],
        leadingUnderscore: 'allow',
        filter: ignoreFilter,
      },
      {
        selector: 'memberLike',
        modifiers: ['private'],
        format: ['camelCase'],
        leadingUnderscore: 'allow',
        filter: ignoreFilter,
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
        filter: ignoreFilter,
      },
      {
        selector: 'objectLiteralProperty',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase', 'snake_case'],
        leadingUnderscore: 'allow',
        filter: ignoreFilter,
      },
      {
        selector: 'typeProperty',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase', 'snake_case'],
        leadingUnderscore: 'allow',
        filter: ignoreFilter,
      },
      {
        selector: 'enumMember',
        format: ['PascalCase', 'camelCase'],
        filter: ignoreFilter,
      },
      {
        selector: 'interface',
        format: ['PascalCase'],
        filter: {
          regex: `^(${ignoreNames.join('|')})$`,
          match: false,
        },
        custom: {
          regex: '^I[A-Z]',
          match: true,
        },
      },
    ], // 强制各类命名规范
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': [
      'warn',
      {
        fixToUnknown: false,
        ignoreRestArgs: true,
      },
    ], // 禁止使用除了...args之外的any 并修复为unknown
    '@typescript-eslint/semi': ['error', 'never'],
    'spaced-comment': [
      'error',
      'always',
      {
        line: {
          markers: ['/'],
          exceptions: ['-', '+'],
        },
        block: {
          markers: ['!'],
          exceptions: ['*'],
          balanced: true,
        },
      },
    ], // 强制注释规范
    'no-console': 'off', // 禁止控制台输出
    '@typescript-eslint/explicit-member-accessibility': ['off'], // 强制规范类成员访问修饰符
    '@typescript-eslint/no-var-requires': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
