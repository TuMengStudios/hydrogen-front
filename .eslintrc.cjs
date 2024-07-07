module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:vue/vue3-recommended', 'prettier'],
  overrides: [],
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: '@typescript-eslint/parser'
  },
  plugins: ['vue', 'prettier'],
  rules: {
    'vue/comment-directive': 'off', // 忽略代码检查  https://eslint.vuejs.org/rules/comment-directive.html
    'vue/multi-word-component-names': 'off',
    'vue/no-v-model-argument': 'off',
    'no-undef': 'off',
    'prettier/prettier': 'error',
    'quotes': ['error', 'double'], //要求引号类型 `` ' ''
    'semi': ['error', 'always'], //语句强制分号结尾
  },
  globals: { $ref: 'readonly', $computed: 'readonly', $shallowRef: 'readonly', $customRef: 'readonly', $toRef: 'readonly' },
};
