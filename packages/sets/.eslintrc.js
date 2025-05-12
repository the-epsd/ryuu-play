// Use the same eslint config as ptcg-common
module.exports = {
  ...require('../common/.eslintrc'),
  rules: {
    ...require('../common/.eslintrc').rules,
    '@typescript-eslint/no-unused-expressions': 'off'
  }
};
