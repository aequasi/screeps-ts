const {resolve} = require('path');

module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
    ],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        project: 'tsconfig.json'
    },
    ignorePatterns: [
        '*.d.ts',
    ],
    settings: {
        "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx"]
        },
        'import/resolver': {
            "typescript": {
                "alwaysTryTypes": true // always try to resolve types under `<roo/>types` directory even it doesn't contain any source code, like `types/unist`
            },
        },
        'import/external-module-folders': ['node_modules', 'node_modules/types']
    },
    plugins: [
        '@typescript-eslint',
        'import',
    ],
    env: {
        browser: true,
        node: true,
    },
    rules: {
        'indent': [
            'error',
            4,
            {'flatTernaryExpressions': true, 'SwitchCase': 1},
        ],
        'eol-last': ['error', 'always'],
        'camelcase': 'off',
        'max-classes-per-file': 'off',
        'no-multiple-empty-lines': ['error', {max: 1, maxEOF: 1, maxBOF: 0}],
        '@typescript-eslint/semi': ['error'],
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/explicit-member-accessibility': ['error'],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-object-literal-type-assertion': 'off',
        '@typescript-eslint/indent': 'off',

        'key-spacing': [
            2,
            {
                afterColon: true,
                align: 'value',
                beforeColon: false,
                mode: 'minimum',
            },
        ],
        'comma-dangle': [2, 'always-multiline'],
        'import/default': 'off',
        'import/named': 'off',
        'import/no-unresolved': 'off',
        'import/namespace': 'off',
        'import/no-named-as-default': 'off',
        'import/no-named-as-default-member': 'off',
        'import/order': [
            2,
            {
                /*, 'alphabetize': {order: 'asc'}*/
                'newlines-between': 'always',
                groups: [
                    ['builtin', 'external'],
                    'internal',
                    'parent',
                    'sibling',
                    'index',
                ],
            },
        ],
        'func-style': ['error', 'declaration'],
    },
};
