"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "../..");
const mainPath = path.join(root, "releases/1.0/safari/b24-quick-links-safari.user.js");
const bridgePath = path.join(root, "releases/1.0/safari/b24-quick-links-bxui-safari.user.js");
const main = fs.readFileSync(mainPath, "utf8");
const bridge = fs.readFileSync(bridgePath, "utf8");

assert.match(main, /@match\s+https:\/\/bitrix24test\.ostec-group\.ru\/\*/);
assert.match(main, /@match\s+https:\/\/bitrix24\.ostec-group\.ru\/\*/);
assert.match(main, /@match\s+https:\/\/bitrix24develop\.ostec-group\.ru\/\*/);
assert.match(main, /@inject-into\s+content/);
assert.match(main, /@grant\s+GM\.getValue/);
assert.match(main, /@grant\s+GM\.openInTab/);
assert.match(main, /const chrome = userscriptsChrome/);
assert.match(main, /Быстрые ссылки/);
assert.match(main, /b24ql-menu-button/);
assert.match(main, /safari-userscripts-overrides/);
assert.match(main, /\.b24ql-modal \.b24ql-link\.ui-btn \{/);
assert.match(main, /position: absolute !important/);
assert.match(main, /\.b24ql-modal \.b24ql-template-form \{[\s\S]*?padding: 24px !important/);
assert.match(main, /\.b24ql-modal \.b24ql-template-actions \{[\s\S]*?flex-wrap: wrap !important/);
assert.match(main, /\.b24ql-modal label\.b24ql-switch-option > \.b24ql-switch-track::before \{[\s\S]*?font-size: 8px !important[\s\S]*?line-height: 12px !important/);
assert.match(main, /\.b24ql-modal \.b24ql-switch-option input:checked \+ \.b24ql-switch-track::after \{[\s\S]*?translateX\(32px\) !important/);
assert.match(main, /data:image\/svg\+xml;base64,/);
assert.doesNotMatch(main, /url\(\\?"vendor\/images\/search\.svg\\?"\)/);

assert.match(bridge, /@inject-into\s+page/);
assert.match(bridge, /@grant\s+none/);
assert.match(bridge, /@match\s+https:\/\/bitrix24\.ostec-group\.ru\/\*/);
assert.match(bridge, /@match\s+https:\/\/bitrix24test\.ostec-group\.ru\/\*/);
assert.match(bridge, /@match\s+https:\/\/bitrix24develop\.ostec-group\.ru\/\*/);
assert.match(bridge, /b24ql-ui-render/);
assert.match(bridge, /BXQLBX\.UI\.Button/);

const adapterStart = main.indexOf("function normalizeKeys");
const adapterEndMarker = "const chrome = userscriptsChrome;";
const adapterEnd = main.indexOf(adapterEndMarker, adapterStart);
assert.ok(adapterStart >= 0 && adapterEnd > adapterStart);

const values = new Map();
const openedTabs = [];
const context = {
  console,
  GM: {
    async getValue(key, defaultValue) {
      return values.has(key) ? values.get(key) : defaultValue;
    },
    async setValue(key, value) {
      values.set(key, value);
    },
    async openInTab(url, background) {
      openedTabs.push({ url, background });
      return { id: openedTabs.length };
    }
  }
};

const adapterSource = main
  .slice(adapterStart, adapterEnd + adapterEndMarker.length)
  .replace(adapterEndMarker, "globalThis.chrome = userscriptsChrome;");
vm.runInNewContext(adapterSource, context);

function setStorage(payload) {
  return new Promise(function (resolve) {
    context.chrome.storage.local.set(payload, resolve);
  });
}

function getStorage(keys) {
  return new Promise(function (resolve) {
    context.chrome.storage.local.get(keys, resolve);
  });
}

function sendMessage(message) {
  return new Promise(function (resolve) {
    context.chrome.runtime.sendMessage(message, resolve);
  });
}

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

(async function () {
  await setStorage({ notes: "Тест", theme: "dark" });
  assert.deepEqual(plain(await getStorage(["notes", "theme"])), { notes: "Тест", theme: "dark" });

  assert.deepEqual(
    plain(await sendMessage({ type: "b24ql-open-tab", url: "https://bitrix24test.ostec-group.ru/crm/" })),
    { ok: true, count: 1 }
  );
  assert.deepEqual(openedTabs[0], {
    url: "https://bitrix24test.ostec-group.ru/crm/",
    background: false
  });

  const urls = [
    "https://bitrix24test.ostec-group.ru/company/",
    "https://bitrix24test.ostec-group.ru/tasks/"
  ];
  assert.deepEqual(plain(await sendMessage({ type: "b24ql-open-tabs", urls })), { ok: true, count: 2 });
  assert.equal(openedTabs.slice(1).every(function (tab) { return tab.background === true; }), true);

  process.stdout.write("Safari Userscripts build tests passed\n");
})().catch(function (error) {
  process.stderr.write(error.stack + "\n");
  process.exitCode = 1;
});
