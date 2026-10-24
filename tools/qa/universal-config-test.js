"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "../..");

for (const browserName of ["chromium", "firefox"]) {
  const sourceDir = path.join(root, "src", browserName);
  const manifest = JSON.parse(fs.readFileSync(path.join(sourceDir, "manifest.json"), "utf8"));
  assert.equal(manifest.version, "1.1.0");
  assert.deepEqual(manifest.optional_host_permissions, ["https://*/*"]);
  assert.equal(Object.prototype.hasOwnProperty.call(manifest, "host_permissions"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(manifest, "content_scripts"), false);
  assert.equal(manifest.action.default_popup, "activate.html");
  assert.ok(manifest.permissions.includes("activeTab"));
  assert.ok(manifest.permissions.includes("scripting"));
  assert.ok(manifest.permissions.includes("storage"));
}

const settingsSource = fs.readFileSync(path.join(root, "src/chromium/settings.js"), "utf8");
const context = {};
vm.runInNewContext(settingsSource, context);
const settings = JSON.parse(JSON.stringify(context.B24QL_SETTINGS));
assert.deepEqual(settings.sections.map(function (section) { return section.title; }), [
  "Открыть по ID",
  "CRM",
  "Работа",
  "Сотрудники",
  "Настройки"
]);
assert.equal(settings.sections.some(function (section) { return section.title === "Проекты"; }), false);
assert.equal(settings.sections.some(function (section) { return section.title === "Локальные приложения"; }), false);

const destinations = [];
function collectLinks(links) {
  links.forEach(function (link) {
    if (typeof link.url === "string") destinations.push(link.url);
    if (link.template && typeof link.template.url === "string") destinations.push(link.template.url);
    if (Array.isArray(link.links)) collectLinks(link.links);
  });
}
settings.sections.forEach(function (section) { collectLinks(section.links); });
assert.ok(destinations.length > 10);
assert.equal(destinations.every(function (destination) { return destination.startsWith("/"); }), true);
assert.equal(destinations.some(function (destination) { return destination.includes("ostec-group"); }), false);
assert.equal(destinations.some(function (destination) { return destination.includes("selectica"); }), false);

const contentSource = fs.readFileSync(path.join(root, "src/chromium/content.js"), "utf8");
assert.match(contentSource, /new URL\(url, window\.location\.origin\)/);
assert.match(contentSource, /PORTAL_STORAGE_PREFIX/);
assert.doesNotMatch(contentSource, /PRODUCTION_PORTAL_HOST/);

const activationSource = fs.readFileSync(path.join(root, "src/chromium/activate.js"), "utf8");
assert.match(activationSource, /"\.menu-items"/);
assert.match(activationSource, /"\.main-buttons"/);
assert.match(activationSource, /"#air-header-menu"/);
assert.equal(
  activationSource,
  fs.readFileSync(path.join(root, "src/firefox/activate.js"), "utf8")
);

process.stdout.write("Universal portal configuration tests passed\n");
