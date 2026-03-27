module.exports = {
  extends: ['stylelint-config-standard'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen'],
      },
    ],
    'declaration-block-trailing-semicolon': null,
    'no-descending-specificity': null,
    'custom-property-empty-line-before': null,
    'declaration-empty-line-before': null,
    'comment-empty-line-before': null,
    'custom-property-pattern': null,
    'selector-class-pattern': null,
    'value-keyword-case': null,
  },
};
