const path = require("node:path");
const fs = require("node:fs");
const assert = require("node:assert/strict");
const { chromium } = require("playwright");
let activeBrowser;

const browserCandidates = [
  process.env.CHROME_BIN,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  "/Applications/Chromium.app/Contents/MacOS/Chromium"
].filter(Boolean);
const executablePath = browserCandidates.find(candidate => fs.existsSync(candidate));

(async function () {
  const extensionPath = path.resolve(__dirname, "../../src/chromium");
  const browser = await chromium.launch({
    headless: true,
    ...(executablePath ? { executablePath } : {})
  });
  activeBrowser = browser;
  const context = await browser.newContext({ colorScheme: "light", viewport: { width: 1440, height: 900 } });
  const errors = [];

  await context.route("**/*", async function (route) {
    if (route.request().resourceType() === "document") {
      await route.fulfill({
        status: 200,
        contentType: "text/html",
        body: route.request().url().includes("/auth/")
          ? '<!doctype html><html><body><form><input name="login"><input name="password" type="password"></form></body></html>'
          : '<!doctype html><html><head><style>:root{--ui-font-family-primary:Arial,sans-serif;--ui-border-radius-2xs:4px;--ui-color-on-primary:#fff;--ui-field-color-border-default:190,200,210;--ui-color-palette-white-base:#fff;--ui-color-palette-black-base:#222;--ui-field-size-md:40px;--ui-size-lg2:24px;--ui-size-xl2:30px;--ui-size-3xl:32px;--ui-size-5xl:39px}body{margin:0;background:#e9f0f6}.menu-items{width:260px;height:620px;margin:0;padding:10px}.menu-items>li{display:block;height:42px;color:#333}</style></head><body><ul class="menu-items"><li>Лента</li><li>CRM</li><li>Задачи</li></ul></body></html>'
      });
      return;
    }
    await route.abort();
  });

  const page = await context.newPage();
  page.on("pageerror", function (error) { errors.push(error.message); });
  await page.goto("https://bitrix24test.ostec-group.ru/stream/");
  await page.addScriptTag({
    content: "globalThis.B24QL_RUNTIME_OPTIONS = { destroyModalOnClose: true, leanLayoutWatcher: true };"
  });
  for (const css of [
    "vendor/ui.buttons.bundle.min.css",
    "vendor/ui.forms.min.css",
    "vendor/ui.counter.min.css",
    "vendor/ui.label.bundle.min.css",
    "vendor/ui.alerts.min.css",
    "styles.css",
    "bxui-skin.css"
  ]) {
    await page.addStyleTag({ path: path.join(extensionPath, css) });
  }
  await page.addScriptTag({ path: path.join(extensionPath, "settings.js") });
  await page.addScriptTag({ path: path.join(extensionPath, "content.js") });

  const idleMenuMutations = await page.evaluate(function () {
    return new Promise(function (resolve) {
      const menuItem = document.getElementById("b24ql-menu-item");
      let mutationCount = 0;
      const observer = new MutationObserver(function (mutations) {
        mutationCount += mutations.length;
      });
      observer.observe(menuItem, { attributes: true, childList: true, subtree: true });
      window.setTimeout(function () {
        observer.disconnect();
        resolve(mutationCount);
      }, 250);
    });
  });
  assert.equal(idleMenuMutations, 0, `idle extension menu mutations: ${idleMenuMutations}`);

  const unrelatedMenuMutations = await page.evaluate(function () {
    return new Promise(function (resolve) {
      const menuItem = document.getElementById("b24ql-menu-item");
      const unrelatedNode = document.createElement("div");
      let mutationCount = 0;
      const observer = new MutationObserver(function (mutations) {
        mutationCount += mutations.length;
      });
      observer.observe(menuItem, { attributes: true, childList: true, subtree: true });
      document.body.appendChild(unrelatedNode);
      for (let index = 0; index < 100; index += 1) {
        unrelatedNode.className = `portal-update-${index}`;
        unrelatedNode.textContent = String(index);
      }
      window.setTimeout(function () {
        observer.disconnect();
        unrelatedNode.remove();
        resolve(mutationCount);
      }, 250);
    });
  });
  assert.equal(unrelatedMenuMutations, 0, `unrelated page mutations changed extension menu: ${unrelatedMenuMutations}`);

  const repeatedOpenCloseLayoutChecks = await page.evaluate(async function () {
    const menu = document.querySelector(".menu-items");
    const originalGetBoundingClientRect = menu.getBoundingClientRect.bind(menu);
    let layoutChecks = 0;
    menu.getBoundingClientRect = function () {
      layoutChecks += 1;
      return originalGetBoundingClientRect();
    };

    for (let index = 0; index < 20; index += 1) {
      document.getElementById("b24ql-menu-button").click();
      await new Promise(function (resolve) { window.setTimeout(resolve, 20); });
      document.querySelector("#b24ql-modal > .b24ql-panel .b24ql-close").click();
      await new Promise(function (resolve) { window.setTimeout(resolve, 20); });
    }

    menu.getBoundingClientRect = originalGetBoundingClientRect;
    return layoutChecks;
  });
  assert.ok(
    repeatedOpenCloseLayoutChecks <= 24,
    `open/close cycles caused ${repeatedOpenCloseLayoutChecks} left-menu layout scans`
  );
  assert.equal(await page.locator("#b24ql-modal").count(), 0);
  assert.equal(
    await page.locator("[id^='b24ql'], [class*='b24ql']").count() <= 8,
    true,
    "closed Safari modal retained extension DOM"
  );

  await page.evaluate(function () {
    const currentMenu = document.querySelector(".menu-items");
    const replacementMenu = currentMenu.cloneNode(true);
    replacementMenu.querySelector("#b24ql-menu-item")?.remove();
    currentMenu.replaceWith(replacementMenu);
  });
  await page.locator(".menu-items > #b24ql-menu-item").waitFor();
  assert.equal(await page.locator(".menu-items > #b24ql-menu-item").count(), 1);

  const loginPage = await context.newPage();
  await loginPage.goto("https://bitrix24test.ostec-group.ru/auth/");
  await loginPage.addScriptTag({ path: path.join(extensionPath, "settings.js") });
  await loginPage.addScriptTag({ path: path.join(extensionPath, "content.js") });
  assert.equal(await loginPage.locator("#b24ql-menu-button").count(), 0);
  await loginPage.close();

  const promiseStoragePage = await context.newPage();
  await promiseStoragePage.goto("https://bitrix24test.ostec-group.ru/stream/");
  await promiseStoragePage.evaluate(function () {
    window.__storageCalls = { get: 0, set: 0 };
    window.browser = {
      storage: {
        local: {
          get() {
            if (arguments.length !== 1) throw new Error("Promise storage.get received a callback");
            window.__storageCalls.get += 1;
            return Promise.resolve({ "b24ql-theme-v2": "dark" });
          },
          set() {
            if (arguments.length !== 1) throw new Error("Promise storage.set received a callback");
            window.__storageCalls.set += 1;
            return Promise.resolve();
          }
        }
      }
    };
  });
  await promiseStoragePage.addScriptTag({ path: path.join(extensionPath, "settings.js") });
  await promiseStoragePage.addScriptTag({ path: path.join(extensionPath, "content.js") });
  await promiseStoragePage.locator("#b24ql-menu-button").click();
  await promiseStoragePage.waitForFunction(() =>
    document.querySelector("#b24ql-modal")?.dataset.b24qlEffectiveTheme === "dark");
  assert.equal(await promiseStoragePage.evaluate(() => window.__storageCalls.get), 1);
  await promiseStoragePage.close();

  const firefoxStoragePage = await context.newPage();
  await firefoxStoragePage.goto("https://bitrix24test.ostec-group.ru/stream/");
  await firefoxStoragePage.evaluate(function () {
    window.__firefoxStorageCalls = [];
    localStorage.setItem("b24ql-theme-v2", "dark");
    window.browser = {
      runtime: {
        sendMessage(message) {
          window.__firefoxStorageCalls.push(message);
          return Promise.resolve({ ok: true });
        }
      }
    };
  });
  await firefoxStoragePage.addScriptTag({ path: path.resolve(__dirname, "../../src/firefox/settings.js") });
  await firefoxStoragePage.addScriptTag({ path: path.resolve(__dirname, "../../src/firefox/recovery-settings.js") });
  await firefoxStoragePage.addScriptTag({ path: path.resolve(__dirname, "../../src/firefox/content.js") });
  await firefoxStoragePage.locator("#b24ql-menu-button").click();
  await firefoxStoragePage.waitForFunction(() =>
    document.querySelector("#b24ql-modal")?.dataset.b24qlEffectiveTheme === "dark");
  const firefoxStorageCalls = await firefoxStoragePage.evaluate(() => window.__firefoxStorageCalls);
  assert.equal(firefoxStorageCalls.length, 0);
  assert.equal(await firefoxStoragePage.evaluate(() => localStorage.getItem("b24ql-theme-v2")), "dark");
  assert.equal(await firefoxStoragePage.evaluate(() => Boolean(localStorage.getItem("b24ql-custom-sections-v1"))), true);
  await firefoxStoragePage.close();

  await page.locator("#b24ql-menu-button").click();
  await page.locator("#b24ql-modal:not(.b24ql-hidden)").waitFor();
  await page.waitForTimeout(450);
  assert.equal(await page.locator(".b24ql-main-content .b24ql-search.ui-ctl").count(), 1);
  assert.equal(await page.locator(".b24ql-section-count.ui-counter").count() > 0, true);
  assert.equal(await page.locator(".b24ql-notes-input.ui-ctl-element").count(), 1);
  const mainPanelBox = await page.locator("#b24ql-modal > .b24ql-panel").boundingBox();
  assert.equal(mainPanelBox.height >= 850, true);
  assert.equal(mainPanelBox.x >= 300, true);
  assert.equal(mainPanelBox.x + mainPanelBox.width >= 1439, true, JSON.stringify(mainPanelBox));
  assert.equal(await page.locator("#b24ql-modal > .b24ql-panel").evaluate(panel => getComputedStyle(panel).animationName), "b24ql-slide-up");
  const mainCloseBox = await page.locator(".b24ql-header-actions .b24ql-close").boundingBox();
  const mainSettingsBox = await page.locator(".b24ql-header-actions .b24ql-settings-open").boundingBox();
  assert.equal(Math.abs(mainCloseBox.x + mainCloseBox.width - mainPanelBox.x) < 1, true);
  assert.equal(mainCloseBox.x, mainSettingsBox.x);
  assert.equal(mainCloseBox.width, mainSettingsBox.width);
  assert.equal(await page.locator(".b24ql-header-actions .b24ql-settings-open").evaluate(button => getComputedStyle(button).marginLeft), "0px");
  assert.equal(mainCloseBox.y + mainCloseBox.height < mainSettingsBox.y, true);
  const bottomGap = async (outer, inner) => {
    const outerBox = await outer.boundingBox();
    const innerBox = await inner.boundingBox();
    return outerBox.y + outerBox.height - innerBox.y - innerBox.height;
  };
  const notesGap = await bottomGap(
    page.locator(".b24ql-notes-section"),
    page.locator(".b24ql-notes-input")
  );
  assert.equal(notesGap <= 18, true, `notes bottom gap: ${notesGap}`);
  const collapsedSection = page.locator(".b24ql-source-section.b24ql-section-collapsed").first();
  const collapsedGap = await bottomGap(collapsedSection, collapsedSection.locator(".b24ql-section-heading"));
  assert.equal(collapsedGap <= 2, true, `collapsed bottom gap: ${collapsedGap}`);
  const expandedSection = page.locator(".b24ql-source-section:not(.b24ql-section-collapsed)").first();
  const expandedGap = await bottomGap(expandedSection, expandedSection.locator(".b24ql-link-shell").last());
  assert.equal(expandedGap <= 18, true, `expanded bottom gap: ${expandedGap}`);
  assert.equal(await page.locator("#b24ql-modal > .b24ql-panel").evaluate(panel =>
    panel.getAnimations()[0].effect.getKeyframes()[0].transform.includes("translateY")), true);
  await page.screenshot({ path: "/private/tmp/b24ql-light.png" });

  const notes = page.locator(".b24ql-notes-input");
  await notes.fill("Проверка заметок");
  assert.equal(await notes.textContent(), "Проверка заметок");
  const noteListStyles = await notes.evaluate(editor => {
    editor.innerHTML = "<ol><li>Первый</li><li>Второй<ol><li>Вложенный<ol><li>Третий уровень</li></ol></li></ol></li></ol><div><ol><li>Новый список</li></ol></div>";
    const rootItems = [...editor.querySelectorAll("ol")].filter(list => !list.parentElement.closest("ol"));
    const secondItem = rootItems[1].querySelector("li");
    const nestedItem = rootItems[0].querySelector("li > ol > li");
    const thirdItem = rootItems[0].querySelector("li > ol > li > ol > li");
    return {
      rootCount: rootItems.length,
      rootMarker: getComputedStyle(secondItem, "::before").content,
      nestedMarker: getComputedStyle(nestedItem, "::before").content,
      thirdMarker: getComputedStyle(thirdItem, "::before").content,
      rootIndent: getComputedStyle(rootItems[0]).paddingLeft,
      secondIndent: getComputedStyle(rootItems[1]).paddingLeft
    };
  });
  assert.equal(noteListStyles.rootCount, 2);
  assert.equal(noteListStyles.rootMarker.includes("level-1"), true, JSON.stringify(noteListStyles));
  assert.equal(noteListStyles.rootMarker.includes("level-2"), false, JSON.stringify(noteListStyles));
  assert.equal(noteListStyles.nestedMarker.includes("level-2"), true, JSON.stringify(noteListStyles));
  assert.equal(noteListStyles.nestedMarker.includes("level-3"), false, JSON.stringify(noteListStyles));
  assert.equal(noteListStyles.thirdMarker.includes("level-3"), true, JSON.stringify(noteListStyles));
  assert.equal(noteListStyles.secondIndent, noteListStyles.rootIndent);
  await notes.fill("");

  const search = page.locator("#b24ql-search");
  await search.fill("контакт");
  assert.ok((await page.locator("#b24ql-search-results-grid .b24ql-link-label").allTextContents()).some(text => /контакт/i.test(text)));
  await search.fill("");

  const projectSection = page.locator('.b24ql-source-section[data-section-title="Проекты"]');
  await projectSection.locator(".b24ql-favorite-toggle").first().click();
  assert.equal(await page.locator("#b24ql-favorites-grid .b24ql-link").count() > 0, true);

  const dealGroup = page.locator('.b24ql-source-section[data-section-title="CRM"] .b24ql-link-group', { hasText: "Сделки" });
  await dealGroup.click();
  assert.equal(await page.locator("#b24ql-submodal:not(.b24ql-hidden) .b24ql-link").count() > 0, true);
  await page.waitForTimeout(320);
  const subPanelBox = await page.locator("#b24ql-submodal .b24ql-subpanel").boundingBox();
  assert.equal(subPanelBox.width < mainPanelBox.width, true);
  const subCloseBox = await page.locator("#b24ql-submodal .b24ql-subactions .b24ql-close").boundingBox();
  assert.equal(Math.abs(subCloseBox.x + subCloseBox.width - subPanelBox.x) < 1, true);
  const subContent = page.locator("#b24ql-submodal .b24ql-subcontent");
  const subGridBox = await subContent.locator(".b24ql-link-grid").boundingBox();
  const firstSubLinkBox = await subContent.locator(".b24ql-link-shell .b24ql-link").first().boundingBox();
  const firstSubFavoriteBox = await subContent.locator(".b24ql-link-shell .b24ql-favorite-toggle").first().boundingBox();
  assert.equal(subGridBox.height < 240, true);
  assert.equal(firstSubFavoriteBox.y >= firstSubLinkBox.y, true);
  assert.equal(firstSubFavoriteBox.y + firstSubFavoriteBox.height <= firstSubLinkBox.y + firstSubLinkBox.height, true);
  await page.screenshot({ path: "/private/tmp/b24ql-subpanel.png" });
  await page.locator("#b24ql-submodal .b24ql-close").click();

  const templateSection = page.locator('.b24ql-source-section[data-section-title="Открыть по ID"]');
  await templateSection.locator(".b24ql-link-template", { hasText: "Задача" }).click();
  await page.locator("#b24ql-template-modal:not(.b24ql-hidden)").waitFor();
  await page.waitForTimeout(320);
  await page.screenshot({ path: "/private/tmp/b24ql-template.png" });
  assert.equal(await page.locator(".b24ql-template-input.ui-ctl-element").count(), 1);
  const templatePanelBox = await page.locator("#b24ql-template-modal .b24ql-template-panel").boundingBox();
  const templateCloseBox = await page.locator("#b24ql-template-modal .b24ql-close").boundingBox();
  assert.equal(Math.abs(templateCloseBox.x + templateCloseBox.width - templatePanelBox.x) < 1, true);
  await page.locator("#b24ql-template-open").click();
  assert.equal(await page.locator(".b24ql-template-error:not(.b24ql-hidden) .ui-alert-message").count(), 1);
  await page.locator("#b24ql-template-modal .b24ql-close").click();

  await page.locator(".b24ql-settings-open").click();
  await page.locator("#b24ql-settings-modal:not(.b24ql-hidden)").waitFor();
  await page.waitForTimeout(320);
  const settingsPanelBox = await page.locator("#b24ql-settings-modal .b24ql-settings-panel").boundingBox();
  const settingsCloseBox = await page.locator("#b24ql-settings-modal .b24ql-subactions .b24ql-close").boundingBox();
  assert.equal(Math.abs(settingsCloseBox.x + settingsCloseBox.width - settingsPanelBox.x) < 1, true);
  const settingsRowBox = await page.locator(".b24ql-settings-main-view .b24ql-settings-row").first().boundingBox();
  assert.equal(settingsRowBox.height < 85, true);
  assert.equal(await page.locator('input[name="b24ql-theme"][type="radio"]').count(), 3);
  assert.equal(await page.locator('input[name="b24ql-theme"][value="auto"]').isChecked(), true);
  await page.locator('.b24ql-theme-choice[value="dark"]').check();
  assert.equal(await page.locator("#b24ql-modal").getAttribute("data-b24ql-effective-theme"), "dark");
  await page.waitForTimeout(450);
  const settingsAction = page.locator(".b24ql-settings-main-view .b24ql-ui-action").first();
  assert.equal(await settingsAction.evaluate(button => getComputedStyle(button).color), "rgb(231, 238, 246)");
  await page.screenshot({ path: "/private/tmp/b24ql-dark-settings.png" });
  await page.locator(".b24ql-settings-main-view button", { hasText: "Настроить" }).first().click();
  const collapsedSwitch = page.locator(".b24ql-collapsed-sections-view .b24ql-switch-option").first();
  const originalCollapsed = await collapsedSwitch.locator('input[role="switch"]').isChecked();
  await page.screenshot({ path: "/private/tmp/b24ql-switches.png" });
  await collapsedSwitch.click();
  assert.equal(await collapsedSwitch.locator('input[role="switch"]').isChecked(), !originalCollapsed);
  await collapsedSwitch.click();
  await page.locator(".b24ql-collapsed-sections-view").getByRole("button", { name: "Назад" }).click();
  await page.locator(".b24ql-settings-main-view button", { hasText: "Настроить" }).nth(1).click();
  assert.equal(await page.locator('.b24ql-open-all-view input[role="switch"]').count() > 0, true);
  await page.locator(".b24ql-open-all-view").getByRole("button", { name: "Назад" }).click();
  await page.locator(".b24ql-settings-main-view button", { hasText: "Редактировать" }).click();
  assert.equal(await page.locator(".b24ql-editor-input.ui-ctl-element").count() > 0, true);
  assert.equal(await page.locator(".b24ql-editor-control.ui-ctl").count() > 0, true);
  const editorActions = page.locator(".b24ql-editor-row-actions").first();
  assert.equal(await editorActions.locator(".ui-btn-light-border").count(), 3);
  assert.equal(await editorActions.locator(".ui-btn-danger", { hasText: "Удалить" }).count(), 1);
  assert.equal(await editorActions.locator(".ui-btn-danger").evaluate(button => getComputedStyle(button).backgroundColor), "rgb(241, 54, 26)");
  await page.screenshot({ path: "/private/tmp/b24ql-editor.png" });
  await editorActions.getByRole("button", { name: "Настроить" }).click();
  const firstLinkRow = page.locator(".b24ql-editor-row").first();
  const linkFieldsBox = await firstLinkRow.locator(".b24ql-editor-fields").boundingBox();
  const linkActionsBox = await firstLinkRow.locator(".b24ql-editor-row-actions").boundingBox();
  assert.equal(
    linkFieldsBox.x + linkFieldsBox.width <= linkActionsBox.x ||
      linkFieldsBox.y + linkFieldsBox.height <= linkActionsBox.y,
    true
  );
  await page.screenshot({ path: "/private/tmp/b24ql-editor-links.png" });
  await page.locator(".b24ql-links-editor-toolbar .b24ql-ui-action").click();
  await page.locator(".b24ql-links-editor-toolbar .b24ql-ui-action").click();
  await page.locator('.b24ql-theme-choice[value="light"]').check();
  await page.waitForTimeout(450);
  await page.locator(".b24ql-settings-main-view button", { hasText: "Редактировать" }).click();
  await page.screenshot({ path: "/private/tmp/b24ql-editor-light.png" });
  const firstRow = page.locator(".b24ql-editor-row").first();
  await firstRow.locator(".ui-btn-danger").click();
  assert.equal(await page.locator("#b24ql-confirm-modal:not(.b24ql-hidden)").count(), 1);
  await page.waitForTimeout(320);
  const confirmPanelBox = await page.locator("#b24ql-confirm-modal .b24ql-confirm-panel").boundingBox();
  const confirmCloseBox = await page.locator("#b24ql-confirm-modal .b24ql-close").boundingBox();
  assert.equal(Math.abs(confirmCloseBox.x + confirmCloseBox.width - confirmPanelBox.x) < 1, true);
  await page.locator("#b24ql-confirm-modal").getByRole("button", { name: "Отмена" }).click();
  assert.equal(await page.locator(".b24ql-editor-row").count() > 0, true);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "/private/tmp/b24ql-mobile-editor.png" });
  const mobileEditorFields = await page.locator(".b24ql-editor-fields").first().boundingBox();
  assert.equal(mobileEditorFields.x + mobileEditorFields.width <= 390, true);
  await page.locator("#b24ql-settings-modal .b24ql-close").click();
  const mobilePanelBox = await page.locator("#b24ql-modal > .b24ql-panel").boundingBox();
  assert.equal(mobilePanelBox.width, 390);
  const mobileCloseBox = await page.locator(".b24ql-header-actions .b24ql-close").boundingBox();
  const mobileSettingsBox = await page.locator(".b24ql-header-actions .b24ql-settings-open").boundingBox();
  assert.equal(mobileCloseBox.x >= 0, true);
  assert.equal(mobileSettingsBox.x + mobileSettingsBox.width <= 390, true);
  assert.equal(mobileCloseBox.x + mobileCloseBox.width <= mobileSettingsBox.x, true);
  await page.screenshot({ path: "/private/tmp/b24ql-mobile.png" });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(function () {
    window.__runtimeMessages = [];
    window.browser = {
      runtime: {
        sendMessage(message) {
          window.__runtimeMessages.push(message);
          return Promise.resolve({ ok: true, count: Array.isArray(message.urls) ? message.urls.length : 1 });
        }
      }
    };
  });
  await templateSection.locator(".b24ql-link-template", { hasText: "Задача" }).click();
  await page.locator(".b24ql-template-input").fill("1");
  await page.locator("#b24ql-template-open").click();
  await page.waitForFunction(() => window.__runtimeMessages.length === 1);
  assert.equal(await page.evaluate(() => window.__runtimeMessages[0].type), "b24ql-open-tab");

  await page.locator(".b24ql-settings-open").click();
  await page.locator(".b24ql-settings-main-view button", { hasText: "Настроить" }).nth(1).click();
  await page.locator(".b24ql-open-all-settings-row", { hasText: "Сотрудники" }).locator("label").click();
  await page.locator(".b24ql-open-all-view").getByRole("button", { name: "Назад" }).click();
  await page.locator("#b24ql-settings-modal .b24ql-close").click();
  await page.locator('.b24ql-source-section[data-section-title="Сотрудники"] .b24ql-section-open-all').click();
  await page.waitForFunction(() => window.__runtimeMessages.length === 2);
  const batchMessage = await page.evaluate(() => window.__runtimeMessages[1]);
  assert.equal(batchMessage.type, "b24ql-open-tabs");
  assert.equal(batchMessage.urls.length, 4);
  assert.equal(batchMessage.urls.every(url => url.startsWith("https://bitrix24test.ostec-group.ru/")), true);

  assert.deepEqual(errors, []);
  await browser.close();
  activeBrowser = null;
  process.stdout.write("BX.UI smoke test passed\n");
})().catch(async function (error) {
  if (activeBrowser) {
    await activeBrowser.close();
  }
  process.stderr.write(error.stack + "\n");
  process.exitCode = 1;
});
