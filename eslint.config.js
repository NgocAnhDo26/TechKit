import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
    pluginJs.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.node,
                document: 'readonly',
                window: 'readonly',
            },
            ecmaVersion: 'latest',
        },
        rules: {
            'no-unused-vars': 'warn',
            'no-undef': 'warn',
            'arrow-body-style': ['warn', 'as-needed'],
            'capitalized-comments': [
                'warn',
                'always',
                { ignoreConsecutiveComments: true },
            ],
        },
    },
];
