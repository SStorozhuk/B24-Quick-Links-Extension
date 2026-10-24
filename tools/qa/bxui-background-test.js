"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.resolve(__dirname, "../../src/chromium/background.js"), "utf8");

function createHarness(promiseApi, failAt) {
  const calls = [];
  const registrations = [];
  const injections = [];
  const storage = {};
  let listener;
  const runtime = {
    lastError: null,
    onMessage: { addListener(callback) { listener = callback; } },
    onInstalled: { addListener() {} },
    onStartup: { addListener() {} }
  };
  const tabs = {
    create(options, callback) {
      calls.push(options);
      const fails = calls.length === failAt;
      if (promiseApi) {
        return fails ? Promise.reject(new Error("tab failed")) : Promise.resolve({ id: calls.length });
      }
      queueMicrotask(function () {
        runtime.lastError = fails ? new Error("tab failed") : null;
        callback({ id: calls.length });
        runtime.lastError = null;
      });
      return undefined;
    }
  };
  const storageApi = {
    get(keys, callback) {
      const result = {};
      (keys || []).forEach(function (key) {
        if (Object.prototype.hasOwnProperty.call(storage, key)) result[key] = storage[key];
      });
      if (promiseApi) return Promise.resolve(result);
      queueMicrotask(function () { callback(result); });
      return undefined;
    },
    set(values, callback) {
      Object.assign(storage, values || {});
      if (promiseApi) return Promise.resolve();
      queueMicrotask(function () { if (callback) callback(); });
      return undefined;
    }
  };
  const scripting = {
    async getRegisteredContentScripts() { return registrations.slice(); },
    async unregisterContentScripts({ ids }) {
      for (let index = registrations.length - 1; index >= 0; index -= 1) {
        if (ids.includes(registrations[index].id)) registrations.splice(index, 1);
      }
    },
    async registerContentScripts(scripts) { registrations.push.apply(registrations, scripts); },
    async executeScript(options) { injections.push({ type: "js", options }); },
    async insertCSS(options) { injections.push({ type: "css", options }); }
  };
  const permissions = {
    async contains() { return true; },
    onRemoved: { addListener() {} }
  };
  const api = { runtime, tabs, storage: { local: storageApi }, scripting, permissions };
  const globals = promiseApi
    ? { browser: api, chrome: { runtime: {} }, URL, Set, Math, Promise }
    : { chrome: api, URL, Set, Math, Promise };
  vm.runInNewContext(source, globals);

  return {
    calls,
    registrations,
    injections,
    storage,
    send(message, senderUrl) {
      return new Promise(function (resolve) {
        const sender = senderUrl ? { tab: { url: senderUrl } } : {};
        assert.equal(listener(message, sender, resolve), true);
      });
    }
  };
}

(async function () {
  for (const promiseApi of [false, true]) {
    const origin = promiseApi ? "https://sstorozhuk.bitrix24.ru" : "https://crm.example.org";
    const testUrls = [
      origin + "/company/",
      origin + "/hr/structure/",
      origin + "/timeman/",
      origin + "/conference/"
    ];

    const harness = createHarness(promiseApi);
    const result = await harness.send(
      { type: "b24ql-open-tabs", urls: testUrls },
      origin + "/stream/"
    );
    assert.deepEqual(JSON.parse(JSON.stringify(result)), { ok: true, count: 4 });
    assert.deepEqual(harness.calls.map(function (call) { return call.url; }), testUrls);
    assert.equal(harness.calls.every(function (call) { return call.active === false; }), true);

    const single = createHarness(promiseApi);
    const singleResult = await single.send(
      { type: "b24ql-open-tab", url: testUrls[0] },
      origin + "/stream/"
    );
    assert.equal(singleResult.ok, true);
    assert.equal(single.calls[0].active, undefined);

    const invalid = createHarness(promiseApi);
    const invalidResult = await invalid.send(
      { type: "b24ql-open-tabs", urls: [testUrls[0], "https://example.com/"] },
      origin + "/stream/"
    );
    assert.equal(invalidResult.ok, false);
    assert.equal(invalid.calls.length, 0);

    const failed = createHarness(promiseApi, 2);
    const failedResult = await failed.send(
      { type: "b24ql-open-tabs", urls: testUrls },
      origin + "/stream/"
    );
    assert.equal(failedResult.ok, false);
    assert.equal(failedResult.count, 1);

    const activation = createHarness(promiseApi);
    const activationResult = await activation.send({
      type: "b24ql-enable-origin",
      origin: origin,
      tabId: 42
    });
    assert.equal(activationResult.ok, true);
    assert.equal(activation.registrations.length, 2);
    assert.equal(activation.registrations.every(function (script) {
      return script.matches[0] === origin + "/*";
    }), true);
    assert.equal(activation.injections.length, 3);
    assert.deepEqual(
      JSON.parse(JSON.stringify(activation.storage["b24ql-enabled-origins-v1"])),
      [origin]
    );
    const status = await activation.send({ type: "b24ql-origin-status", origin: origin });
    assert.equal(status.enabled, true);
  }

  process.stdout.write("Background and portal activation tests passed\n");
})().catch(function (error) {
  process.stderr.write(error.stack + "\n");
  process.exitCode = 1;
});
