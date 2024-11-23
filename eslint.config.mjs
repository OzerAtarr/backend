import globals from "globals";
import pluginJs from "@eslint/js";


// /** @type {import('eslint').Linter.Config[]} */
// export default [
//   {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
//   {languageOptions: { globals: globals.browser }},
//   {rules: {
//     "no-unused-vars": ["off"]
//   }},
//   pluginJs.configs.recommended,
// ];

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Ortak yapılandırmalar
  {
    files: ["**/*.js"], // Tüm .js dosyaları için geçerli
    languageOptions: {
      sourceType: "commonjs", // CommonJS modülü
      globals: globals.browser // Tarayıcı global değişkenleri
    },
    rules: {
      "no-unused-vars": "off", // no-unused-vars kuralını devre dışı bırak
    }
  },
  pluginJs.configs.recommended, // eslint'in önerilen kuralları
];