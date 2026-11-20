import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: ['dist/**', 'node_modules/**', 'coverage/**', '*.d.ts'],
    },
    {
        files: ['**/*.{js,ts,vue}'],
        extends: [eslint.configs.recommended, ...tseslint.configs.recommended, ...eslintPluginVue.configs['flat/recommended']],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser,
            },
            parserOptions: {
                parser: tseslint.parser,
            },
        },
        rules: {
            eqeqeq: ['error'],
            'object-shorthand': 'error',
            'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
            '@typescript-eslint/no-explicit-any': 'warn',
            'vue/singleline-html-element-content-newline': [
                'error',
                {
                    ignoreWhenNoAttributes: true,
                    ignoreWhenEmpty: true,
                    ignores: ['pre', 'textarea'],
                },
            ],
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],
            'max-len': [
                'error',
                {
                    code: 140,
                    tabWidth: 4,
                    ignoreUrls: true,
                    ignoreStrings: true,
                    ignoreTemplateLiterals: true,
                    ignoreRegExpLiterals: true,
                },
            ],
            'vue/html-indent': ['error', 4],
            'vue/max-attributes-per-line': [
                'error',
                {
                    singleline: 3,
                    multiline: 1,
                },
            ],
            'vue/no-unused-vars': 'error',
            'vue/require-default-prop': 'off',
            'vue/prefer-true-attribute-shorthand': 'error',
        },
    },
    eslintConfigPrettier,
);
