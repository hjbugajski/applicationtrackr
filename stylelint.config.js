module.exports = {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-clean-order'],
  rules: {
    'max-nesting-depth': null,
    'no-descending-specificity': null,
    'order/properties-alphabetical-order': null,
    'property-no-vendor-prefix': null,
    'scss/dollar-variable-empty-line-before': null,
    'selector-class-pattern': null,
    'selector-pseudo-element-no-unknown': null,
    'scss/dollar-variable-colon-space-after': null,
  },
};
