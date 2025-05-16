module.exports = {
    'env': {
        'browser': true,
        'es2021': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module'
    },
    'plugins': [
        '@typescript-eslint'
    ],
    'rules': {
        'indent': 'off',
        'linebreak-style': 'off',
        'prefer-rest-params': 'off',
        'require-yield': 'off',
        'quotes': 'off',
        'semi': 'off',
        '@typescript-eslint/no-unused-vars': ['error',
            {
              'vars': 'all',
              'args': 'none',
              'caughtErrors': 'none',
              'ignoreRestSiblings': false
            }
        ],
        '@typescript-eslint/no-unsafe-function-type': 'off',
        '@typescript-eslint/no-wrapper-object-types': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-empty-function': 'off'
    }
};
