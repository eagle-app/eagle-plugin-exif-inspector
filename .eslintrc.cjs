/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
    root: true,
    extends: [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
        '@vue/eslint-config-prettier/skip-formatting'
    ],
    parserOptions: {
        ecmaVersion: 'latest'
    },
    globals: {
        eagle: 'readonly',
        i18next: 'readonly'
    }
    rules: {
    //     'vue/comment-directive': 'off',
        'no-undef': 'off',
    //     'no-unused-vars': 'off',
    //     'no-debugger': 'off'
    }
}
