"use strict";

const extensionApi = typeof browser !== "undefined" && browser.runtime
  ? browser
  : (typeof chrome !== "undefined" && chrome.runtime ? chrome : null);
const usesPromiseApi = typeof browser !== "undefined" && extensionApi === browser;
const ENABLED_ORIGINS_KEY = "b24ql-enabled-origins-v1";
const CONTENT_SCRIPT_PREFIX = "b24ql-portal-";
const MAIN_SCRIPT_FILES = [
  "vendor/bxui-init.js",
  "vendor/ui.buttons.bundle.isolated.js",
  "vendor/bxui-button-bridge.js"
];
const CONTENT_SCRIPT_FILES = ["settings.js", "content.js"];
const CONTENT_STYLE_FILES = [
  "vendor/ui.buttons.bundle.min.css",
  "vendor/ui.forms.min.css",
  "vendor/ui.counter.min.css",
  "vendor/ui.label.bundle.min.css",
  "vendor/ui.alerts.min.css",
  "styles.css",
  "bxui-skin.css"
];

function normalizeOrigin(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.origin !== value) {
      return null;
    }
    return url.origin;
  } catch (error) {
    return null;
  }
}

function getOriginPattern(origin) {
  return origin + "/*";
}

function getScriptId(origin, suffix) {
  let hash = 2166136261;
  for (let index = 0; index < origin.length; index += 1) {
    hash ^= origin.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return CONTENT_SCRIPT_PREFIX + (hash >>> 0).toString(36) + "-" + suffix;
}

function getStorage(keys) {
  if (usesPromiseApi) {
    return extensionApi.storage.local.get(keys);
  }
  return new Promise(function (resolve) {
    extensionApi.storage.local.get(keys, function (items) {
      resolve(items || {});
    });
  });
}

function setStorage(items) {
  if (usesPromiseApi) {
    return extensionApi.storage.local.set(items);
  }
  return new Promise(function (resolve) {
    extensionApi.storage.local.set(items, resolve);
  });
}

async function getEnabledOrigins() {
  const items = await getStorage([ENABLED_ORIGINS_KEY]);
  return Array.isArray(items[ENABLED_ORIGINS_KEY])
    ? items[ENABLED_ORIGINS_KEY].map(normalizeOrigin).filter(Boolean)
    : [];
}

async function saveEnabledOrigins(origins) {
  const payload = {};
  payload[ENABLED_ORIGINS_KEY] = Array.from(new Set(origins.map(normalizeOrigin).filter(Boolean))).sort();
  await setStorage(payload);
}

async function hasOriginPermission(origin) {
  return extensionApi.permissions.contains({ origins: [getOriginPattern(origin)] });
}

async function unregisterOriginScripts(origin) {
  const ids = [getScriptId(origin, "main"), getScriptId(origin, "content")];
  const registered = await extensionApi.scripting.getRegisteredContentScripts();
  const registeredIds = new Set(registered.map(function (script) { return script.id; }));
  const existingIds = ids.filter(function (id) { return registeredIds.has(id); });
  if (existingIds.length > 0) {
    await extensionApi.scripting.unregisterContentScripts({ ids: existingIds });
  }
}

async function registerOriginScripts(origin) {
  await unregisterOriginScripts(origin);
  const matches = [getOriginPattern(origin)];
  await extensionApi.scripting.registerContentScripts([
    {
      id: getScriptId(origin, "main"),
      matches: matches,
      js: MAIN_SCRIPT_FILES,
      runAt: "document_idle",
      allFrames: false,
      persistAcrossSessions: true,
      world: "MAIN"
    },
    {
      id: getScriptId(origin, "content"),
      matches: matches,
      css: CONTENT_STYLE_FILES,
      js: CONTENT_SCRIPT_FILES,
      runAt: "document_idle",
      allFrames: false,
      persistAcrossSessions: true
    }
  ]);
}

async function injectCurrentTab(tabId) {
  await extensionApi.scripting.executeScript({
    target: { tabId: tabId },
    files: MAIN_SCRIPT_FILES,
    world: "MAIN"
  });
  await extensionApi.scripting.insertCSS({
    target: { tabId: tabId },
    files: CONTENT_STYLE_FILES
  });
  await extensionApi.scripting.executeScript({
    target: { tabId: tabId },
    files: CONTENT_SCRIPT_FILES
  });
}

async function enableOrigin(origin, tabId) {
  const normalizedOrigin = normalizeOrigin(origin);
  if (!normalizedOrigin || !Number.isInteger(tabId) || !await hasOriginPermission(normalizedOrigin)) {
    return { ok: false, reason: "permission" };
  }

  const origins = await getEnabledOrigins();
  if (!origins.includes(normalizedOrigin)) {
    origins.push(normalizedOrigin);
    await saveEnabledOrigins(origins);
  }
  await registerOriginScripts(normalizedOrigin);
  await injectCurrentTab(tabId);
  return { ok: true, origin: normalizedOrigin };
}

async function getOriginStatus(origin) {
  const normalizedOrigin = normalizeOrigin(origin);
  if (!normalizedOrigin || !await hasOriginPermission(normalizedOrigin)) {
    return { ok: true, enabled: false };
  }
  const origins = await getEnabledOrigins();
  return { ok: true, enabled: origins.includes(normalizedOrigin) };
}

async function reconcileOriginScripts() {
  const origins = await getEnabledOrigins();
  const permittedOrigins = [];

  for (const origin of origins) {
    if (await hasOriginPermission(origin)) {
      await registerOriginScripts(origin);
      permittedOrigins.push(origin);
    } else {
      await unregisterOriginScripts(origin);
    }
  }

  if (permittedOrigins.length !== origins.length) {
    await saveEnabledOrigins(permittedOrigins);
  }
}

async function openRequestedTabs(message, sender) {
  const rawUrls = message.type === "b24ql-open-tabs" ? message.urls : [message.url];
  if (!Array.isArray(rawUrls) || rawUrls.length === 0 || rawUrls.some(function (url) {
    return typeof url !== "string";
  })) {
    return { ok: false, count: 0 };
  }

  let senderOrigin;
  let urls;
  try {
    senderOrigin = new URL(sender && sender.tab && sender.tab.url).origin;
    urls = rawUrls.map(function (rawUrl) { return new URL(rawUrl); });
  } catch (error) {
    return { ok: false, count: 0 };
  }

  if (!normalizeOrigin(senderOrigin) || urls.some(function (url) {
    return url.protocol !== "https:" || url.origin !== senderOrigin;
  })) {
    return { ok: false, count: 0 };
  }

  let opened = 0;
  for (const url of urls) {
    try {
      const options = { url: url.href };
      if (message.type === "b24ql-open-tabs") {
        options.active = false;
      }
      await createTab(options);
      opened += 1;
    } catch (error) {
      return { ok: false, count: opened };
    }
  }
  return { ok: true, count: opened };
}

function createTab(options) {
  if (usesPromiseApi) {
    return extensionApi.tabs.create(options);
  }
  return new Promise(function (resolve, reject) {
    extensionApi.tabs.create(options, function (tab) {
      if (extensionApi.runtime.lastError) {
        reject(extensionApi.runtime.lastError);
        return;
      }
      resolve(tab);
    });
  });
}

if (extensionApi) {
  extensionApi.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    let task = null;
    if (message && message.type === "b24ql-enable-origin") {
      task = enableOrigin(message.origin, message.tabId);
    } else if (message && message.type === "b24ql-origin-status") {
      task = getOriginStatus(message.origin);
    } else if (message && (message.type === "b24ql-open-tab" || message.type === "b24ql-open-tabs")) {
      task = openRequestedTabs(message, sender);
    }

    if (!task) {
      return false;
    }

    Promise.resolve(task).then(sendResponse, function () {
      sendResponse({ ok: false, count: 0 });
    });
    return true;
  });

  if (extensionApi.runtime.onInstalled) {
    extensionApi.runtime.onInstalled.addListener(function () {
      reconcileOriginScripts().catch(function () {});
    });
  }
  if (extensionApi.runtime.onStartup) {
    extensionApi.runtime.onStartup.addListener(function () {
      reconcileOriginScripts().catch(function () {});
    });
  }
  if (extensionApi.permissions && extensionApi.permissions.onRemoved) {
    extensionApi.permissions.onRemoved.addListener(function () {
      reconcileOriginScripts().catch(function () {});
    });
  }
}
