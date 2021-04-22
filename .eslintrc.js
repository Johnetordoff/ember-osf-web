/*
👋 Hi! This file was autogenerated by tslint-to-eslint-config.
https://github.com/typescript-eslint/tslint-to-eslint-config

It represents the closest reasonable ESLint configuration to this
project"s original TSLint configuration.

We recommend eventually switching this configuration to extend from
the recommended rulesets in typescript-eslint.
https://github.com/typescript-eslint/tslint-to-eslint-config/blob/master/docs/FAQs.md

Happy linting! 💖
*/
module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:ember/recommended",
        "plugin:@typescript-eslint/recommended",
        // "ember-concurrency", nice to have
        // "@centerforopenscience/eslint-config/ember", needs deps upgraded
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "sourceType": "module"
    },
    "plugins": [
        "es",
        "ember",
        "eslint-plugin-import",
        "@typescript-eslint",
        "@typescript-eslint/tslint"
    ],
    "rules": {
        "@typescript-eslint/array-type": [
            "error",
            {
                "default": "array-simple"
            }
        ],
        "@typescript-eslint/ban-types": [
            "off",
            {
                "types": {
                    "Object": {
                        "message": "Avoid using the `Object` type. Did you mean `object`?"
                    },
                    "Function": {
                        "message": "Avoid using the `Function` type. Prefer a specific function type, like `() => void`."
                    },
                    "Boolean": {
                        "message": "Avoid using the `Boolean` type. Did you mean `boolean`?"
                    },
                    "Number": {
                        "message": "Avoid using the `Number` type. Did you mean `number`?"
                    },
                    "String": {
                        "message": "Avoid using the `String` type. Did you mean `string`?"
                    },
                    "Symbol": {
                        "message": "Avoid using the `Symbol` type. Did you mean `symbol`?"
                    }
                }
            }
        ],
        "@typescript-eslint/consistent-type-assertions": "error",
        "@typescript-eslint/consistent-type-definitions": "error",
        "@typescript-eslint/dot-notation": "error",
        "@typescript-eslint/explicit-member-accessibility": [
            "off",
            {
                "accessibility": "explicit"
            }
        ],
        "@typescript-eslint/indent": [
            "off", // currently broken: https://github.com/typescript-eslint/typescript-eslint/issues/1824
            4,
            {
                "FunctionDeclaration": {
                    "parameters": "first"
                },
                "FunctionExpression": {
                    "parameters": "first"
                }
            }
        ],
        "@typescript-eslint/member-delimiter-style": [
            "error",
            {
                "multiline": {
                    "delimiter": "semi",
                    "requireLast": true
                },
                "singleline": {
                    "delimiter": "semi",
                    "requireLast": false
                }
            }
        ],
        "@typescript-eslint/member-ordering": "off",
        "@typescript-eslint/naming-convention": "off",
        "@typescript-eslint/no-empty-function": "error",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-parameter-properties": "off",
        "@typescript-eslint/no-shadow": [
            "error",
            {
                "hoist": "all"
            }
        ],
        "@typescript-eslint/no-unused-expressions": "error",
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/prefer-optional-chain": "off",
        "@typescript-eslint/prefer-for-of": "error",
        "@typescript-eslint/prefer-function-type": "error",
        "@typescript-eslint/quotes": [
            "error",
            "single",
            {
                "avoidEscape": true
            }
        ],
        "@typescript-eslint/semi": [
            "error",
            "always"
        ],
        "@typescript-eslint/triple-slash-reference": [
            "error",
            {
                "path": "always",
                "types": "prefer-import",
                "lib": "always"
            }
        ],
        "@typescript-eslint/unified-signatures": "error",
        "arrow-body-style": "error",
        "arrow-parens": [
            "error",
            "as-needed"
        ],
        "brace-style": [
            "error",
            "1tbs"
        ],
        "comma-dangle": [
            "error",
            "always-multiline"
        ],
        "complexity": "off",
        "constructor-super": "error",
        "curly": "error",
        "eol-last": "error",
        "eqeqeq": [
            "error",
            "smart"
        ],
        "guard-for-in": "error",
        "id-blacklist": [
            "error",
            "any",
            "Number",
            "number",
            "String",
            "string",
            "Boolean",
            "boolean",
            "Undefined",
            "undefined"
        ],
        "id-match": "error",
        "import/order": "error",
        "max-classes-per-file": "off",
        "max-len": ["error", { code: 120 }],
        "new-parens": "error",
        "no-bitwise": "error",
        "no-caller": "error",
        "no-cond-assign": "error",
        "no-console": "error",
        "no-debugger": "error",
        "no-empty": "error",
        "no-eval": "error",
        "no-fallthrough": "off",
        "no-invalid-this": "off",
        "no-multiple-empty-lines": "error",
        "no-new-wrappers": "error",
        "no-throw-literal": "error",
        "no-trailing-spaces": "error",
        "no-undef-init": "error",
        "no-unsafe-finally": "error",
        "no-unused-labels": "error",
        "no-var": "error",
        "object-shorthand": "error",
        "one-var": [
            "error",
            "never"
        ],
        "prefer-const": "error",
        "quote-props": [
            "error",
            "as-needed"
        ],
        "radix": "error",
        "spaced-comment": [
            "error",
            "always",
            {
                "markers": [
                    "/"
                ]
            }
        ],
        "use-isnan": "error",
        "valid-typeof": "off",
        "@typescript-eslint/tslint/config": [
            "error",
            {
                "rules": {
                    "import-spacing": true,
                    "whitespace": [
                        true,
                        "check-branch",
                        "check-decl",
                        "check-operator",
                        "check-separator",
                        "check-type",
                        "check-typecast"
                    ]
                }
            }
        ],
        // lifted
        "ember/no-test-support-import": "off",
        "@typescript-eslint/interface-name-prefix": "off",
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
        // old rules
        strict: "off",
        indent: ["error", 4],
        "class-methods-use-this": "off",
        "function-paren-newline": ["error", "consistent"],
        "prefer-rest-params": "error",
        "generator-star-spacing": ["error", "before"],
        "object-curly-newline": ["error", {
            ObjectExpression: { multiline: true, consistent: true },
            ObjectPattern: { multiline: true, consistent: true },
            ImportDeclaration: { multiline: true, consistent: true },
            ExportDeclaration: { multiline: true, consistent: true }
        }],
        "ember/named-functions-in-promises": "off",
        "ember/new-module-imports": "error",
        "ember/no-attrs-in-components": "error",
        "ember/no-old-shims": "error",
        "ember/routes-segments-snake-case": "off",
        "import/export": "off",
        "import/prefer-default-export": "off",
        "no-restricted-globals": "off",
        "space-before-function-paren": ["error", {
            anonymous: "never",
            named: "never",
            asyncArrow: "always"
        }],
        "no-underscore-dangle": "off",
        "linebreak-style": ["error", (process.platform === "win32" ? "windows" : "unix")],
        "lines-between-class-members": "off",
        "ember/no-jquery": "off",
        "ember-concurrency/no-perform-without-catch": "off",
        "ember-concurrency/require-task-name-suffix": "off",
        "ember-concurrency/no-native-promise-helpers": "off"
    },
    overrides: [
        {
            files: ["**/config/environment.d.ts"],
            rules: {
                indent: "off",
                "indent-legacy": "error"
            }
        },
        {
            files: ["**/*.ts"],
            rules: {
                // Better enforced by TS
                "no-undef": "off",
                "no-unused-vars": "off",
                "ember/no-attrs-snapshot": "off"
            }
        },
        {
            files: ["**/*.d.ts"],
            rules: {
                "no-useless-constructor": "off",
                "space-infix-ops": "off",
                "no-shadow": "off",
                "@typescript-eslint/no-unused-vars": "off",
                "@typescript-eslint/member-delimiter-style": "off",
                "@typescript-eslint/member-ordering": "off"
            }
        },
        {
            files: ["app/locales/*/translations.ts"],
            rules: {
                "max-len": "off",
            }
        },
        {
            files: ["tests/**/*"],
            rules: {
                "no-await-in-loop": "off",
                "ember/avoid-leaking-state-in-components": "off",
                "ember/avoid-leaking-state-in-ember-objects": "off"
            }
        },
        {
            files: ["mirage/**/*"],
            rules: {
                "ember/avoid-leaking-state-in-ember-objects": "off"
            }
        },
        {
            files: ["lib/*/index.js"],
            rules: {
                "ember/avoid-leaking-state-in-ember-objects": "off"
            }
        },
        {
            files: ["lib/*/addon/engine.js"],
            rules: {
                "ember/avoid-leaking-state-in-ember-objects": "off"
            }
        }
    ]
};
