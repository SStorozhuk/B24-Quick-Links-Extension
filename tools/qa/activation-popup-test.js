"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "../..");
const extensionDir = path.join(root, "src/chromium");
const html = fs.readFileSync(path.join(extensionDir, "activate.html"), "utf8")
  .replace('<script src="activate.js"></script>', "");
const browserCandidates = [
  process.env.CHROME_BIN,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/Applications/Chromium.app/Contents/MacOS/Chromium"
].filter(Boolean);
const executablePath = browserCandidates.find(function (candidate) { return fs.existsSync(candidate); });

async function preparePage(context, isPortal) {
  const page = await context.newPage();
  await page.setContent(html);
  await page.evaluate(function (portalDetected) {
    window.__activationMessages = [];
    window.chrome = {
      runtime: {
        sendMessage(message, callback) {
          window.__activationMessages.push(message);
          callback(message.type === "b24ql-enable-origin"
            ? { ok: true, origin: message.origin }
            : { ok: true, enabled: false });
        }
      },
      tabs: {
        query(_query, callback) {
          callback([{ id: 7, url: "https://crm.example.org/stream/" }]);
        }
      },
      permissions: {
        contains(_permissions, callback) { callback(false); },
        request(_permissions, callback) { callback(true); }
      },
      scripting: {
        executeScript() { return Promise.resolve([{ result: portalDetected }]); }
      }
    };
  }, isPortal);
  await page.addScriptTag({ path: path.join(extensionDir, "activate.js") });
  return page;
}

(async function () {
  const browser = await chromium.launch({
    headless: true,
    ...(executablePath ? { executablePath: executablePath } : {})
  });
  const context = await browser.newContext();

  const portalPage = await preparePage(context, true);
  await portalPage.waitForFunction(() => !document.getElementById("activation-button").disabled);
  assert.equal(await portalPage.locator("#activation-host").textContent(), "crm.example.org");
  assert.match(await portalPage.locator("#activation-status").textContent(), /Bitrix24 обнаружен/);
  await portalPage.locator("#activation-button").click();
  assert.match(await portalPage.locator("#activation-status").textContent(), /активировано/);
  assert.equal(await portalPage.evaluate(() => window.__activationMessages.some(message =>
    message.type === "b24ql-enable-origin" && message.origin === "https://crm.example.org")), true);

  const regularPage = await preparePage(context, false);
  await regularPage.waitForFunction(() =>
    document.getElementById("activation-status").textContent.includes("Войдите в Bitrix24"));
  assert.equal(await regularPage.locator("#activation-button").isDisabled(), true);

  await browser.close();
  process.stdout.write("Portal activation popup tests passed\n");
})().catch(function (error) {
  process.stderr.write(error.stack + "\n");
  process.exitCode = 1;
});
