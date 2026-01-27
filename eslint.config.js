import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default defineConfig([
    {
        ignores: ['dist/**', 'coverage/**', 'node_modules/**'],
    },
    {
        files: ['src/**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        plugins: { prettier },
        extends: [js.configs.recommended, prettierConfig],
        rules: {
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            eqeqeq: 'warn',
            'prettier/prettier': 'warn',
            'no-prototype-builtins': 'off',
        },
    },
    {
        files: ['tests/**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.jest,
                ...globals.node,
            },
        },
    },
    {
        files: ['**/*.cjs'],
        languageOptions: {
            globals: globals.node,
            sourceType: 'commonjs',
        },
        plugins: { prettier },
        extends: [js.configs.recommended, prettierConfig],
        rules: {
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            eqeqeq: 'warn',
            'prettier/prettier': 'warn',
        },
    },
    {
        files: ['*.config.js', 'scripts/**/*.js'],
        languageOptions: {
            globals: globals.node,
            sourceType: 'module',
        },
    },
])
