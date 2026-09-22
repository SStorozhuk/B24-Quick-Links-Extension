const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.resolve(__dirname, "../../src/chromium/background.js"), "utf8");
const testUrls = [
  "https://bitrix24test.ostec-group.ru/company/",
  "https://bitrix24test.ostec-group.ru/hr/structure/",
  "https://bitrix24test.ostec-group.ru/timeman/",
  "https://bitrix24test.ostec-group.ru/conference/"
];

function createHarness(promiseApi, failAt) {
  const calls = [];
  let listener;
  const runtime = {
    lastError: null,
    onMessage: {
      addListener(callback) { listener = callback; }
    }
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
        callback();
        runtime.lastError = null;
      });
      return undefined;
    }
  };
  const api = { runtime, tabs };
  const globals = promiseApi
    ? { browser: api, chrome: { runtime: {}, tabs: {} }, URL, Set }
    : { chrome: api, URL, Set };
  vm.runInNewContext(source, globals);
  return {
    calls,
    send(message) {
      return new Promise(function (resolve) {
        assert.equal(listener(message, {}, resolve), true);
      });
    }
  };
}

(async function () {
  for (const promiseApi of [false, true]) {
    const harness = createHarness(promiseApi);
    const result = await harness.send({ type: "b24ql-open-tabs", urls: testUrls });
    assert.equal(result.ok, true);
    assert.equal(result.count, 4);
    assert.deepEqual(harness.calls.map(function (call) { return call.url; }), testUrls);
    assert.equal(harness.calls.every(function (call) { return call.active === false; }), true);

    const single = createHarness(promiseApi);
    const singleResult = await single.send({ type: "b24ql-open-tab", url: testUrls[0] });
    assert.equal(singleResult.ok, true);
    assert.equal(single.calls[0].active, undefined);

    for (const host of ["bitrix24.ostec-group.ru", "bitrix24develop.ostec-group.ru"]) {
      const portal = createHarness(promiseApi);
      const url = "https://" + host + "/company/";
      const result = await portal.send({ type: "b24ql-open-tab", url });
      assert.equal(result.ok, true);
      assert.equal(portal.calls[0].url, url);
    }

    const failed = createHarness(promiseApi, 2);
    const failedResult = await failed.send({ type: "b24ql-open-tabs", urls: testUrls });
    assert.equal(failedResult.ok, false);
    assert.equal(failedResult.count, 1);
    assert.equal(failed.calls.length, 2);

    const invalid = createHarness(promiseApi);
    const invalidResult = await invalid.send({
      type: "b24ql-open-tabs",
      urls: [testUrls[0], "https://example.com/"]
    });
    assert.equal(invalidResult.ok, false);
    assert.equal(invalid.calls.length, 0);
  }

  process.stdout.write("Background tab tests passed\n");
})().catch(function (error) {
  process.stderr.write(error.stack + "\n");
  process.exitCode = 1;
});
