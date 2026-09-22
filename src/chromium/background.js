/* Подключает общий файл настроек в service worker Chromium. В Firefox он подключается manifest-файлом. */
if (typeof importScripts === "function") {
  try {
    importScripts("settings.js");
  } catch (error) {
    // Если настройки не загрузились, ниже используется резервный список порталов.
  }
}

/* Порталы, с которых расширению разрешено открывать новые вкладки. */
const settings = typeof B24QL_SETTINGS !== "undefined" ? B24QL_SETTINGS : {};
const portalHosts = Array.isArray(settings.portalHosts) && settings.portalHosts.length > 0
  ? settings.portalHosts
  : [
    "bitrix24.ostec-group.ru",
    "bitrix24test.ostec-group.ru",
    "bitrix24develop.ostec-group.ru"
  ];
const ALLOWED_ORIGINS = new Set(portalHosts.map(function (host) {
  return "https://" + host;
}));

/* Единый слой для Chromium-браузеров и Firefox. */
const extensionApi = typeof browser !== "undefined" && browser.runtime
  ? browser
  : (typeof chrome !== "undefined" && chrome.runtime ? chrome : null);

/* Обработка запроса из content.js: открыть безопасную ссылку Bitrix24 в новой вкладке. */
if (extensionApi && extensionApi.runtime && extensionApi.tabs) {
  extensionApi.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (!message || (message.type !== "b24ql-open-tab" && message.type !== "b24ql-open-tabs")) {
      return false;
    }

    let responded = false;
    const respond = function (response) {
      if (!responded) {
        responded = true;
        sendResponse(response);
      }
    };

    const rawUrls = message.type === "b24ql-open-tabs" ? message.urls : [message.url];
    if (!Array.isArray(rawUrls) || rawUrls.length === 0 || rawUrls.some(function (url) {
      return typeof url !== "string";
    })) {
      respond({ ok: false, count: 0 });
      return false;
    }

    let urls;
    try {
      urls = rawUrls.map(function (rawUrl) {
        return new URL(rawUrl);
      });
      if (urls.some(function (url) { return !ALLOWED_ORIGINS.has(url.origin); })) {
        respond({ ok: false });
        return false;
      }
    } catch (error) {
      respond({ ok: false, count: 0 });
      return false;
    }

    const usesPromiseApi = typeof browser !== "undefined" && extensionApi === browser;
    let opened = 0;
    const openNext = function () {
      if (opened === urls.length) {
        respond({ ok: true, count: opened });
        return;
      }

      let finished = false;
      const finish = function (ok) {
        if (finished) {
          return;
        }
        finished = true;
        if (!ok) {
          respond({ ok: false, count: opened });
          return;
        }
        opened += 1;
        openNext();
      };

      try {
        const options = { url: urls[opened].href };
        if (message.type === "b24ql-open-tabs") {
          options.active = false;
        }
        const result = usesPromiseApi
          ? extensionApi.tabs.create(options)
          : extensionApi.tabs.create(options, function () {
            finish(!extensionApi.runtime.lastError);
          });
        if (result && typeof result.then === "function") {
          result.then(function () { finish(true); }, function () { finish(false); });
        }
      } catch (error) {
        finish(false);
      }
    };

    openNext();

    return true;
  });
}
