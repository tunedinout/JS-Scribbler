import imp from "eslint-plugin-import";
import unused from "eslint-plugin-unused-imports";
import prettier from "eslint-plugin-prettier";
import security from "eslint-plugin-security";
import promise from "eslint-plugin-promise";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
  {
    files: ["**/*.js", "**/*.jsx"],
    ignores: ["node_modules/**", "build/**", "*.config.js", "src/workers/worker-*.js"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    plugins: {
      import: imp,
      "unused-imports": unused,
      prettier,
      promise,
      security,
      react,
      "react-hooks": reactHooks,
    },

    rules: {
      // Import rules
      // "import/extensions": [
      //   "error",
      //   "ignorePackages",
      //   {
      //     js: "always",
      //     jsx: "always",
      //     json: "always",
      //   },
      // ],
      "import/no-unresolved": "error",

      // Unused imports/vars
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
      "no-undef": "error",

      // React-specific rules
      "react/jsx-uses-react": "off", // not needed with React 17+
      "react/react-in-jsx-scope": "off", // not needed with React 17+
      "react/jsx-no-undef": "error",
      "react/prop-types": "off", // optional if using TypeScript or prefer not to use PropTypes
      "react-hooks/rules-of-hooks": "error",
      'react/jsx-uses-vars': 'error',
      "react-hooks/exhaustive-deps": "warn",

      // Formatting via Prettier
      indent: "off",
      quotes: "off",
      semi: "off",
      "prettier/prettier": [
        "error",
        {
          singleQuote: true,
          tabWidth: 2,
          semi: false,
          bracketSpacing: true,
          jsxSingleQuote: false,
        },
      ],
    },

    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        alias: {
          map: [
            ["@src", "./src"],
            ["@auth", "./src/auth"],
            ["@components", "./src/components"],
            ["@core-components", "./src/core-components"],
            ["@hooks", "./src/hooks"],
            ["@workers", "./src/workers"],
            ["@pages", "./src/pages"],
            ["@constants", "./src/constants.js"],
          ],
          extensions: [".js", ".jsx", ".json"],
        },
        node: {
          extensions: [".js", ".jsx", ".json"],
        },
      },
    },
  },
];
