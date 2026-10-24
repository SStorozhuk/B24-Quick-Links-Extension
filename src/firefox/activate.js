"use strict";

const extensionApi = typeof browser !== "undefined" && browser.runtime
  ? browser
  : chrome;
const usesPromiseApi = typeof browser !== "undefined" && extensionApi === browser;
const statusNode = document.getElementById("activation-status");
const hostNode = document.getElementById("activation-host");
const activateButton = document.getElementById("activation-button");
let activeTab = null;
let activeOrigin = null;
let activeOriginPermissionGranted = false;

function queryActiveTab() {
  if (usesPromiseApi) {
    return extensionApi.tabs.query({ active: true, currentWindow: true }).then(function (tabs) {
      return tabs[0] || null;
    });
  }
  return new Promise(function (resolve) {
    extensionApi.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      resolve(tabs && tabs[0] ? tabs[0] : null);
    });
  });
}

function containsPermission(pattern) {
  if (usesPromiseApi) {
    return extensionApi.permissions.contains({ origins: [pattern] });
  }
  return new Promise(function (resolve) {
    extensionApi.permissions.contains({ origins: [pattern] }, resolve);
  });
}

function requestPermission(pattern) {
  if (usesPromiseApi) {
    return extensionApi.permissions.request({ origins: [pattern] });
  }
  return new Promise(function (resolve) {
    extensionApi.permissions.request({ origins: [pattern] }, resolve);
  });
}

function sendRuntimeMessage(message) {
  if (usesPromiseApi) {
    return extensionApi.runtime.sendMessage(message);
  }
  return new Promise(function (resolve) {
    extensionApi.runtime.sendMessage(message, resolve);
  });
}

function inspectBitrix24Page() {
  const menuSelectors = [
    "#left-menu .menu-items",
    ".menu-items",
    "#left-menu-list",
    "#bx_left_menu_menu_container",
    "[data-role='left-menu']",
    ".menu-items-block",
    ".menu-items-body-inner",
    ".intranet-left-menu",
    ".bitrix24-left-menu",
    ".main-buttons",
    "#air-header-menu"
  ];
  const hasPortalMenu = menuSelectors.some(function (selector) {
    return Boolean(document.querySelector(selector));
  });
  const hasBitrixAssets = Boolean(document.querySelector(
    "script[src*='/bitrix/js/'], link[href*='/bitrix/'], [data-bx-app-layout], .bitrix24-light-theme"
  ));
  return hasPortalMenu && hasBitrixAssets;
}

async function executePortalInspection(tabId) {
  const results = await extensionApi.scripting.executeScript({
    target: { tabId: tabId },
    func: inspectBitrix24Page
  });
  return Boolean(results && results[0] && results[0].result);
}

function showStatus(message, host, enabled, active) {
  statusNode.textContent = message;
  hostNode.textContent = host || "";
  hostNode.hidden = !host;
  activateButton.disabled = !enabled;
  activateButton.textContent = active ? "Портал активирован" : "Активировать на портале";
}

async function initialize() {
  activeTab = await queryActiveTab();
  if (!activeTab || !Number.isInteger(activeTab.id) || typeof activeTab.url !== "string") {
    showStatus("Не удалось определить открытую страницу.", "", false, false);
    return;
  }

  let url;
  try {
    url = new URL(activeTab.url);
  } catch (error) {
    showStatus("Откройте портал Bitrix24 в обычной вкладке.", "", false, false);
    return;
  }
  if (url.protocol !== "https:") {
    showStatus("Поддерживаются только порталы с защищенным HTTPS-подключением.", url.hostname, false, false);
    return;
  }

  activeOrigin = url.origin;
  const pattern = activeOrigin + "/*";
  activeOriginPermissionGranted = await containsPermission(pattern);
  if (activeOriginPermissionGranted) {
    const status = await sendRuntimeMessage({ type: "b24ql-origin-status", origin: activeOrigin });
    if (status && status.enabled) {
      showStatus("Расширение уже работает на этом портале.", url.hostname, false, true);
      return;
    }
  }

  let isPortal = false;
  try {
    isPortal = await executePortalInspection(activeTab.id);
  } catch (error) {
    isPortal = false;
  }

  if (!isPortal) {
    showStatus("Войдите в Bitrix24 и откройте страницу с левым меню.", url.hostname, false, false);
    return;
  }
  showStatus("Bitrix24 обнаружен. Разрешите работу на этом адресе.", url.hostname, true, false);
}

activateButton.addEventListener("click", async function () {
  if (!activeOrigin || !activeTab) {
    return;
  }
  activateButton.disabled = true;
  const granted = activeOriginPermissionGranted || await requestPermission(activeOrigin + "/*");
  if (!granted) {
    showStatus("Доступ не предоставлен.", new URL(activeOrigin).hostname, true, false);
    return;
  }
  activeOriginPermissionGranted = true;

  const response = await sendRuntimeMessage({
    type: "b24ql-enable-origin",
    origin: activeOrigin,
    tabId: activeTab.id
  });
  if (!response || response.ok !== true) {
    showStatus("Не удалось активировать портал. Обновите страницу и повторите.", new URL(activeOrigin).hostname, true, false);
    return;
  }
  showStatus("Расширение активировано. Кнопка добавлена в левое меню.", new URL(activeOrigin).hostname, false, true);
});

initialize().catch(function () {
  showStatus("Не удалось проверить открытую страницу.", "", false, false);
});
