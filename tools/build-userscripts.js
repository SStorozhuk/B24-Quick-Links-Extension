#!/usr/bin/env node

"use strict";

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const chromiumDir = path.join(root, "src", "chromium");
const outputDir = path.join(root, "releases", "1.0", "safari");

const PORTALS = [
  "https://bitrix24.ostec-group.ru/*",
  "https://bitrix24test.ostec-group.ru/*",
  "https://bitrix24develop.ostec-group.ru/*",
  "https://bitrix24.selectica.ru/*",
  "https://bitrix24test.selectica.ru/*",
  "https://bitrix24develop.selectica.ru/*"
];
const VERSION = "1.0.4";

const cssFiles = [
  "vendor/ui.buttons.bundle.min.css",
  "vendor/ui.forms.min.css",
  "vendor/ui.counter.min.css",
  "vendor/ui.label.bundle.min.css",
  "vendor/ui.alerts.min.css",
  "styles.css",
  "bxui-skin.css"
];

const pageScriptFiles = [
  "../safari-userscripts/bxui-page-bridge.js"
];

// Userscripts injects the extension into the portal document, where Bitrix can
// append another copy of its UI button styles after the userscript has loaded.
// Keep this Safari-only layer last so the extension-owned controls retain their
// intended geometry without changing the Chromium and Firefox packages.
const SAFARI_STYLE_OVERRIDES = `
.b24ql-modal .b24ql-link.ui-btn {
  box-sizing: border-box !important;
  position: relative !important;
  display: flex !important;
  width: 100% !important;
  height: auto !important;
  min-height: 46px !important;
  margin: 0 !important;
  padding: 9px 42px 9px 12px !important;
  border: 1px solid var(--b24ql-accent) !important;
  border-radius: 5px !important;
  background: var(--b24ql-link-bg) !important;
  color: var(--b24ql-text) !important;
  font: 400 15px/1.25 var(--ui-font-family-primary, "Helvetica Neue", Arial, sans-serif) !important;
  justify-content: flex-start !important;
  text-align: left !important;
  text-transform: none !important;
  white-space: normal !important;
}

.b24ql-modal .b24ql-link.ui-btn:hover,
.b24ql-modal .b24ql-link.ui-btn:focus,
.b24ql-modal .b24ql-link.ui-btn.b24ql-link-search-selected,
.b24ql-modal .b24ql-link.ui-btn.b24ql-link-active {
  border-color: var(--b24ql-accent) !important;
  background: var(--b24ql-accent-soft) !important;
}

.b24ql-modal button.b24ql-close.ui-btn,
.b24ql-modal button.b24ql-settings-open.ui-btn,
.b24ql-modal button.b24ql-section-toggle.ui-btn,
.b24ql-modal button.b24ql-section-open-all.ui-btn,
.b24ql-modal button.b24ql-favorite-toggle.ui-btn {
  box-sizing: border-box !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin: 0 !important;
  padding: 0 !important;
  text-align: center !important;
  text-transform: none !important;
  flex-shrink: 0 !important;
}

.b24ql-modal button.b24ql-close.ui-btn::before,
.b24ql-modal button.b24ql-close.ui-btn::after,
.b24ql-modal button.b24ql-settings-open.ui-btn::before,
.b24ql-modal button.b24ql-settings-open.ui-btn::after,
.b24ql-modal button.b24ql-section-toggle.ui-btn::before,
.b24ql-modal button.b24ql-section-toggle.ui-btn::after,
.b24ql-modal button.b24ql-section-open-all.ui-btn::before,
.b24ql-modal button.b24ql-section-open-all.ui-btn::after,
.b24ql-modal button.b24ql-favorite-toggle.ui-btn::before,
.b24ql-modal button.b24ql-favorite-toggle.ui-btn::after {
  content: none !important;
  display: none !important;
}

.b24ql-modal .b24ql-header-actions,
.b24ql-modal .b24ql-subactions {
  position: absolute !important;
  top: 18px !important;
  right: auto !important;
  left: 0 !important;
  z-index: 3 !important;
  display: flex !important;
  width: 44px !important;
  align-items: stretch !important;
  flex-direction: column !important;
  gap: 7px !important;
  transform: translateX(-100%) !important;
}

.b24ql-modal .b24ql-header-actions .ui-btn,
.b24ql-modal .b24ql-subactions .ui-btn,
.b24ql-modal .b24ql-template-header .b24ql-close.ui-btn,
.b24ql-modal .b24ql-confirm-header .b24ql-close.ui-btn {
  width: 44px !important;
  min-width: 44px !important;
  max-width: 44px !important;
  height: 36px !important;
  min-height: 36px !important;
  max-height: 36px !important;
  border: 0 !important;
  border-radius: 9px 0 0 9px !important;
  background: #1ba9e5 !important;
  color: #fff !important;
  line-height: 36px !important;
}

.b24ql-modal .b24ql-template-header .b24ql-close.ui-btn,
.b24ql-modal .b24ql-confirm-header .b24ql-close.ui-btn {
  position: absolute !important;
  top: 18px !important;
  right: auto !important;
  bottom: auto !important;
  left: -44px !important;
}

.b24ql-modal .b24ql-template-panel,
.b24ql-modal .b24ql-template-form,
.b24ql-modal .b24ql-template-fields,
.b24ql-modal .b24ql-template-field,
.b24ql-modal .b24ql-template-input,
.b24ql-modal .b24ql-template-actions {
  box-sizing: border-box !important;
  min-width: 0 !important;
}

.b24ql-modal .b24ql-template-form {
  width: 100% !important;
  padding: 24px !important;
}

.b24ql-modal .b24ql-template-fields,
.b24ql-modal .b24ql-template-field,
.b24ql-modal .b24ql-template-input,
.b24ql-modal .b24ql-template-actions {
  width: 100% !important;
}

.b24ql-modal .b24ql-template-actions {
  flex-wrap: wrap !important;
}

.b24ql-modal .b24ql-switch-track {
  box-sizing: border-box !important;
  display: inline-block !important;
  width: 54px !important;
  min-width: 54px !important;
  max-width: 54px !important;
  height: 22px !important;
  min-height: 22px !important;
  max-height: 22px !important;
  margin: 0 !important;
  padding: 0 !important;
  border: 0 !important;
  border-radius: 12px !important;
  line-height: normal !important;
  flex: 0 0 54px !important;
}

.b24ql-modal label.b24ql-switch-option > .b24ql-switch-track::before {
  box-sizing: border-box !important;
  display: block !important;
  top: 5px !important;
  left: 19px !important;
  width: auto !important;
  height: 12px !important;
  margin: 0 !important;
  padding: 0 !important;
  border: 0 !important;
  font-family: var(--ui-font-family-primary, "Helvetica Neue", Arial, sans-serif) !important;
  font-size: 8px !important;
  font-style: normal !important;
  font-weight: 400 !important;
  line-height: 12px !important;
  letter-spacing: 0 !important;
  text-transform: none !important;
  transform: none !important;
}

.b24ql-modal label.b24ql-switch-option > .b24ql-switch-track::after {
  box-sizing: border-box !important;
  display: block !important;
  top: 3px !important;
  left: 3px !important;
  width: 16px !important;
  height: 16px !important;
  margin: 0 !important;
  padding: 0 !important;
  border: 0 !important;
}

.b24ql-modal .b24ql-switch-option input:checked + .b24ql-switch-track::before {
  left: 8px !important;
}

.b24ql-modal .b24ql-switch-option input:checked + .b24ql-switch-track::after {
  transform: translateX(32px) !important;
}

.b24ql-modal .b24ql-header-actions .ui-btn:hover,
.b24ql-modal .b24ql-subactions .ui-btn:hover,
.b24ql-modal .b24ql-template-header .b24ql-close.ui-btn:hover,
.b24ql-modal .b24ql-confirm-header .b24ql-close.ui-btn:hover {
  background: #168fc7 !important;
  color: #fff !important;
}

.b24ql-modal .b24ql-header-actions svg,
.b24ql-modal .b24ql-subactions svg,
.b24ql-modal .b24ql-template-header .b24ql-close svg,
.b24ql-modal .b24ql-confirm-header .b24ql-close svg {
  display: block !important;
  width: 18px !important;
  min-width: 18px !important;
  max-width: 18px !important;
  height: 18px !important;
  min-height: 18px !important;
  max-height: 18px !important;
  flex: 0 0 18px !important;
}

.b24ql-modal button.b24ql-section-toggle.ui-btn,
.b24ql-modal button.b24ql-section-open-all.ui-btn {
  width: 24px !important;
  min-width: 24px !important;
  max-width: 24px !important;
  height: 24px !important;
  min-height: 24px !important;
  max-height: 24px !important;
  border: 0 !important;
  border-radius: 6px !important;
  background: transparent !important;
  color: var(--b24ql-control) !important;
  line-height: 24px !important;
}

/* Safari loads Bitrix button styles after the userscript. Keep disabled
 * section actions hidden even though their base button rule uses !important. */
.b24ql-modal button.b24ql-section-open-all.ui-btn.b24ql-hidden {
  display: none !important;
}

.b24ql-modal .b24ql-section-open-all-icon {
  display: block !important;
  width: 17px !important;
  min-width: 17px !important;
  max-width: 17px !important;
  height: 17px !important;
  min-height: 17px !important;
  max-height: 17px !important;
  flex: 0 0 17px !important;
}

.b24ql-modal .b24ql-section-toggle-icon {
  display: block !important;
  width: 0 !important;
  min-width: 0 !important;
  max-width: 0 !important;
  height: 0 !important;
  min-height: 0 !important;
  max-height: 0 !important;
  border-right: 5px solid transparent !important;
  border-bottom: 0 !important;
  border-left: 5px solid transparent !important;
  border-top: 6px solid currentColor !important;
  background: transparent !important;
}

.b24ql-modal button.b24ql-favorite-toggle.ui-btn {
  position: absolute !important;
  z-index: 2 !important;
  top: 50% !important;
  right: 8px !important;
  bottom: auto !important;
  left: auto !important;
  width: 26px !important;
  min-width: 26px !important;
  max-width: 26px !important;
  height: 26px !important;
  min-height: 26px !important;
  max-height: 26px !important;
  border: 0 !important;
  border-radius: 6px !important;
  background: transparent !important;
  color: var(--b24ql-muted) !important;
  line-height: 26px !important;
  transform: translateY(-50%) !important;
}

.b24ql-modal button.b24ql-favorite-toggle.ui-btn.b24ql-favorite-active {
  color: var(--b24ql-accent) !important;
}

.b24ql-modal .b24ql-favorite-toggle.ui-btn svg {
  display: block !important;
  width: 17px !important;
  min-width: 17px !important;
  max-width: 17px !important;
  height: 17px !important;
  min-height: 17px !important;
  max-height: 17px !important;
  flex: 0 0 17px !important;
}

@media (max-width: 700px) {
  .b24ql-modal .b24ql-header-actions,
  .b24ql-modal .b24ql-subactions {
    top: 18px !important;
    right: 16px !important;
    left: auto !important;
    width: auto !important;
    align-items: center !important;
    flex-direction: row !important;
    transform: none !important;
  }

  .b24ql-modal .b24ql-template-header .b24ql-close,
  .b24ql-modal .b24ql-confirm-header .b24ql-close {
    position: static !important;
  }

  .b24ql-modal .b24ql-header-actions .ui-btn,
  .b24ql-modal .b24ql-subactions .ui-btn,
  .b24ql-modal .b24ql-template-header .b24ql-close.ui-btn,
  .b24ql-modal .b24ql-confirm-header .b24ql-close.ui-btn {
    width: 36px !important;
    min-width: 36px !important;
    max-width: 36px !important;
    border-radius: 6px !important;
  }
}
`;

function read(relativePath) {
  return fs.readFileSync(path.join(chromiumDir, relativePath), "utf8");
}

function inlineCssAssets(css) {
  return css.replace(/url\((["']?)(vendor\/images\/[^)'"\s]+)\1\)/g, function (_match, _quote, relativePath) {
    const absolutePath = path.join(chromiumDir, relativePath);
    const extension = path.extname(absolutePath).slice(1).toLowerCase();
    const mimeType = extension === "svg" ? "image/svg+xml" : `image/${extension}`;
    const encoded = fs.readFileSync(absolutePath).toString("base64");
    return `url("data:${mimeType};base64,${encoded}")`;
  });
}

function metadata(lines) {
  return ["// ==UserScript==", ...lines.map((line) => `// ${line}`), "// ==/UserScript==", ""].join("\n");
}

function portalMatches() {
  return PORTALS.map((portal) => `@match        ${portal}`);
}

function buildMainScript() {
  const styles = inlineCssAssets(
    cssFiles.map((file) => `/* ${file} */\n${read(file)}`).join("\n\n")
  ) + `\n\n/* safari-userscripts-overrides */\n${SAFARI_STYLE_OVERRIDES}`;
  const settings = read("settings.js");
  const content = read("content.js");

  const header = metadata([
    "@name         Bitrix24 Быстрые ссылки (Safari)",
    "@namespace    https://github.com/SStorozhuk/B24-Quick-Links-Extension",
    `@version      ${VERSION}`,
    "@description  Быстрые ссылки Bitrix24 для порталов OSTEC.",
    ...portalMatches(),
    "@run-at       document-end",
    "@inject-into  content",
    "@weight       100",
    "@noframes",
    "@grant        GM.addStyle",
    "@grant        GM.getValue",
    "@grant        GM.setValue",
    "@grant        GM.openInTab"
  ]);

  const adapter = `
(function () {
  "use strict";

  const styles = ${JSON.stringify(styles)};
  Promise.resolve(GM.addStyle(styles)).catch(function (error) {
    console.warn("B24 Quick Links: styles could not be added.", error);
  });

  function normalizeKeys(keys) {
    if (Array.isArray(keys)) {
      return keys;
    }
    if (typeof keys === "string") {
      return [keys];
    }
    if (keys && typeof keys === "object") {
      return Object.keys(keys);
    }
    return [];
  }

  const userscriptsChrome = {
    storage: {
      local: {
        get: function (keys, callback) {
          const defaults = keys && !Array.isArray(keys) && typeof keys === "object" ? keys : {};
          Promise.all(normalizeKeys(keys).map(async function (key) {
            return [key, await GM.getValue(key, defaults[key])];
          })).then(function (entries) {
            const values = {};
            entries.forEach(function (entry) {
              if (entry[1] !== undefined) {
                values[entry[0]] = entry[1];
              }
            });
            callback(values);
          }).catch(function (error) {
            console.warn("B24 Quick Links: storage read failed.", error);
            callback({});
          });
        },
        set: function (values, callback) {
          Promise.all(Object.keys(values || {}).map(function (key) {
            return GM.setValue(key, values[key]);
          })).then(function () {
            if (typeof callback === "function") {
              callback();
            }
          }).catch(function (error) {
            console.warn("B24 Quick Links: storage write failed.", error);
            if (typeof callback === "function") {
              callback();
            }
          });
        }
      }
    },
    runtime: {
      sendMessage: function (message, callback) {
        const task = (async function () {
          if (!message || (message.type !== "b24ql-open-tab" && message.type !== "b24ql-open-tabs")) {
            return { ok: false, count: 0 };
          }

          const urls = message.type === "b24ql-open-tabs" ? message.urls : [message.url];
          let opened = 0;
          for (const url of urls || []) {
            if (typeof url !== "string" || !url.toLowerCase().startsWith("https://")) {
              continue;
            }
            try {
              await GM.openInTab(url, message.type === "b24ql-open-tabs");
              opened += 1;
            } catch (error) {
              return { ok: false, count: opened };
            }
          }
          return { ok: opened > 0, count: opened };
        })();

        task.then(function (result) {
          if (typeof callback === "function") {
            callback(result);
          }
        }).catch(function (error) {
          console.warn("B24 Quick Links: tab opening failed.", error);
          if (typeof callback === "function") {
            callback({ ok: false, count: 0 });
          }
        });
      }
    }
  };

  const chrome = userscriptsChrome;

  const __B24QL_SAFARI_RUNTIME__ = true;
  globalThis.B24QL_RUNTIME_OPTIONS = Object.freeze({
    destroyModalOnClose: true,
    leanLayoutWatcher: true
  });
  console.info("B24 Quick Links: Safari runtime ${VERSION} enabled");

${settings}

${content}
})();
`;

  return header + adapter.trimStart();
}

function buildPageBridgeScript() {
  const header = metadata([
    "@name         Bitrix24 Быстрые ссылки BX.UI bridge (Safari)",
    "@namespace    https://github.com/SStorozhuk/B24-Quick-Links-Extension",
    `@version      ${VERSION}`,
    "@description  Мост к компонентам BX.UI порталов Bitrix24.",
    ...portalMatches(),
    "@run-at       document-end",
    "@inject-into  page",
    "@weight       900",
    "@noframes",
    "@grant        none"
  ]);

  const body = pageScriptFiles.map((file) => `/* ${file} */\n${read(file)}`).join("\n\n");
  return `${header}${body}\n\n// Handles the rare case where the content script initialized first.\ndocument.dispatchEvent(new Event("b24ql-ui-render"));\n`;
}

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, "b24-quick-links-safari.user.js"), buildMainScript());
fs.writeFileSync(path.join(outputDir, "b24-quick-links-bxui-safari.user.js"), buildPageBridgeScript());

console.log(`Built Safari Userscripts files in ${path.relative(root, outputDir)}`);
