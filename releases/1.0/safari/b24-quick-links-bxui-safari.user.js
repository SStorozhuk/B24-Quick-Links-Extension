// ==UserScript==
// @name         Bitrix24 Быстрые ссылки BX.UI bridge (Safari)
// @namespace    https://github.com/SStorozhuk/B24-Quick-Links-Extension
// @version      1.0.4
// @description  Мост к компонентам BX.UI порталов Bitrix24.
// @match        https://bitrix24.ostec-group.ru/*
// @match        https://bitrix24test.ostec-group.ru/*
// @match        https://bitrix24develop.ostec-group.ru/*
// @match        https://bitrix24.selectica.ru/*
// @match        https://bitrix24test.selectica.ru/*
// @match        https://bitrix24develop.selectica.ru/*
// @run-at       document-end
// @inject-into  page
// @weight       900
// @noframes
// @grant        none
// ==/UserScript==
/* ../safari-userscripts/bxui-page-bridge.js */
(function () {
  "use strict";

  const hostId = "b24ql-ui-button-host";
  let activeButton = null;
  let activeHost = null;
  let buttonExtensionPromise = null;

  function disposeButton() {
    if (activeButton && typeof activeButton.destroy === "function") {
      try {
        activeButton.destroy();
      } catch (error) {
        console.debug("B24 Quick Links: BX.UI button cleanup failed.", error);
      }
    }
    if (activeHost) {
      activeHost.replaceChildren();
      activeHost.classList.add("b24ql-hidden");
    }
    activeButton = null;
    activeHost = null;
  }

  function getButtonApi() {
    return window.BX && BX.UI && BX.UI.Button ? BX.UI : null;
  }

  function loadButtonExtension() {
    if (!window.BX || !BX.Runtime || typeof BX.Runtime.loadExtension !== "function") {
      return Promise.resolve(false);
    }
    if (!buttonExtensionPromise) {
      buttonExtensionPromise = BX.Runtime.loadExtension("ui.buttons").then(function () {
        return Boolean(getButtonApi());
      }).catch(function () {
        return false;
      });
    }
    return buttonExtensionPromise;
  }

  function renderButton() {
    const host = document.getElementById(hostId);
    const form = host && host.closest("form");
    const fallback = form && form.querySelector("#b24ql-template-open");
    disposeButton();
    if (fallback) {
      fallback.classList.remove("b24ql-hidden");
    }
    if (!host || host.dataset.active !== "true" || !form) {
      return;
    }

    const ui = getButtonApi();
    if (!ui) {
      loadButtonExtension().then(function (loaded) {
        if (loaded && host.isConnected && host.dataset.active === "true") {
          renderButton();
        }
      });
      return;
    }

    try {
      const button = new ui.Button({
        text: host.dataset.text || "Открыть",
        color: ui.ButtonColor.PRIMARY,
        size: ui.ButtonSize.MEDIUM,
        noCaps: true
      });
      button.renderTo(host);
      const node = button.getContainer();
      node.type = "button";
      node.dataset.b24qlNative = "true";
      node.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        form.requestSubmit();
      });
      activeButton = button;
      activeHost = host;
      host.classList.remove("b24ql-hidden");
      fallback.classList.add("b24ql-hidden");
    } catch (error) {
      disposeButton();
      console.warn("B24 Quick Links: native BX.UI button could not render; using fallback.", error);
    }
  }

  function cleanup() {
    disposeButton();
    document.removeEventListener("b24ql-ui-render", renderButton);
    document.removeEventListener("b24ql-ui-dispose", disposeButton);
  }

  document.addEventListener("b24ql-ui-render", renderButton);
  document.addEventListener("b24ql-ui-dispose", disposeButton);
  window.addEventListener("pagehide", cleanup, { once: true });
  document.dispatchEvent(new Event("b24ql-ui-ready"));
})();


// Handles the rare case where the content script initialized first.
document.dispatchEvent(new Event("b24ql-ui-render"));
