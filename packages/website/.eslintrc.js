module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2020,
    sourceType: "module"
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  extends: [
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  ignorePatterns: [
    "*config.js",
    "node_modules/",
    ".cache/",
    "src/**/lib/",
    "public",
    "src/**/*.d.ts"
  ],
  rules: {
    "@typescript-eslint/ban-ts-ignore": 0,
    "@typescript-eslint/no-empty-function": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
    "react/prop-types": [0], // Don't require prop type validation since we're using typescript
    "react/display-name": 0,
    "prettier/prettier": [
      "error",
      { arrowParens: "avoid", trailingComma: "none" }
    ]
  }
};
