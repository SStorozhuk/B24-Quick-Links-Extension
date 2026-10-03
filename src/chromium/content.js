(function () {
  "use strict";

  if (window.__b24QuickLinksInstalled) {
    return;
  }
  window.__b24QuickLinksInstalled = true;

  /* Постоянные идентификаторы и ключи хранилища для кнопки, окон и сохраненных настроек. */
  const BUTTON_ID = "b24ql-menu-button";
  const MENU_ITEM_ID = "b24ql-menu-item";
  const MODAL_ID = "b24ql-modal";
  const SUBMODAL_ID = "b24ql-submodal";
  const SETTINGS_MODAL_ID = "b24ql-settings-modal";
  const CONFIRM_MODAL_ID = "b24ql-confirm-modal";
  const SEARCH_INPUT_ID = "b24ql-search";
  const SUBSEARCH_INPUT_ID = "b24ql-subsearch";
  const STORAGE_KEY = "b24ql-menu-position";
  const COLLAPSED_SECTIONS_KEY = "b24ql-collapsed-sections";
  const THEME_KEY = "b24ql-theme-v2";
  const FAVORITE_LINKS_KEY = "b24ql-favorite-links-v1";
  const OPEN_ALL_SECTIONS_KEY = "b24ql-open-all-sections-v1";
  const CUSTOM_SECTIONS_KEY = "b24ql-custom-sections-v1";
  const CONFIG_SCHEMA_KEY = "b24ql-config-schema-v1";
  const CONFIG_SCHEMA_VERSION = 4;
  const TEMPLATE_MODAL_ID = "b24ql-template-modal";
  const POSITION_SCHEMA_VERSION = 5;
  const LEFT_MENU_SELECTORS = [
    "#left-menu .menu-items",
    ".menu-items",
    "#left-menu-list",
    "#bx_left_menu_menu_container",
    "[data-role='left-menu']",
    ".menu-items-block",
    ".menu-items-body-inner",
    ".intranet-left-menu",
    ".bitrix24-left-menu"
  ];
  const LEFT_MENU_SELECTOR = LEFT_MENU_SELECTORS.join(",");
  const PERSISTENT_STORAGE_KEYS = [
    STORAGE_KEY,
    COLLAPSED_SECTIONS_KEY,
    THEME_KEY,
    FAVORITE_LINKS_KEY,
    OPEN_ALL_SECTIONS_KEY,
    CUSTOM_SECTIONS_KEY,
    CONFIG_SCHEMA_KEY
  ];

  /* Настройки ссылок, порталов и свернутых блоков берутся из settings.js. */
  const settings = (typeof globalThis !== "undefined" && globalThis.B24QL_SETTINGS)
    || window.B24QL_SETTINGS
    || {};
  const runtimeOptions = (typeof globalThis !== "undefined" && globalThis.B24QL_RUNTIME_OPTIONS)
    || {};
  const isSafariUserscriptRuntime = typeof __B24QL_SAFARI_RUNTIME__ !== "undefined"
    && __B24QL_SAFARI_RUNTIME__ === true;
  const PORTAL_HOSTS = Array.isArray(settings.portalHosts) ? settings.portalHosts : [];
  const PRODUCTION_PORTAL_HOST = settings.defaultPortalHost || PORTAL_HOSTS[0] || window.location.hostname;
  const DEFAULT_COLLAPSED_SECTIONS = settings.defaultCollapsedSections || {};
  const DEFAULT_OPEN_ALL_SECTIONS = settings.defaultOpenAllSections || {};
  const DEFAULT_SECTIONS = Array.isArray(settings.sections) ? cloneJson(settings.sections) : [];
  const extensionApi = getExtensionApi();
  const extensionStorage = extensionApi && extensionApi.storage && extensionApi.storage.local
    ? extensionApi.storage.local
    : null;
  const usesPromiseStorage = typeof browser !== "undefined" && extensionApi === browser;
  const storageCache = readLegacyStorageSnapshot();
  const dirtyStorageKeys = new Set();
  let sections = readSectionsConfig();

  /* Текущее состояние интерфейса: перетаскивание, тема, свернутые блоки и "открыть все". */
  const dragReadyMenus = new WeakSet();
  let isDraggingQuickLink = false;
  let suppressNextButtonClick = false;
  let themePreference = readThemePreference();
  let linksEditorMode = "blocks";
  let linksEditorSectionIndex = null;
  let linksEditorPath = [];
  let linksEditorDraftSections = null;
  let linksEditorDraftCollapsedSections = null;
  let linksEditorDraftOpenAllSections = null;
  let linksEditorDraftFavoriteLinkIds = null;
  let linksEditorDirty = false;
  let linksEditorNoticeTimer = null;
  let subModalStack = [];
  let favoriteLinkIds = readFavoriteLinkIds();
  let templateOpenInNewTab = false;
  let searchOptionCounter = 0;
  const searchSelectionIndexes = new WeakMap();
  const browserThemeQuery = typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-color-scheme: light)")
    : null;

  const collapsedSections = readCollapsedSections();
  const sessionCollapsedSections = Object.assign({}, collapsedSections);
  const openAllSections = readOpenAllSections();

  /* Сохранение состояния окна: свернутые блоки, тема, редактор ссылок и кнопки "открыть все". */
  function cloneJson(value) {
    try {
      return JSON.parse(JSON.stringify(value));
    } catch (error) {
      return [];
    }
  }

  function getExtensionApi() {
    if (typeof chrome !== "undefined" && chrome.storage) {
      return chrome;
    }

    if (typeof browser !== "undefined" && browser.storage) {
      return browser;
    }

    return null;
  }

  function readLegacyStorageSnapshot() {
    const snapshot = {};
    PERSISTENT_STORAGE_KEYS.forEach(function (key) {
      const value = readLegacyStorageValue(key);
      if (value !== undefined) {
        snapshot[key] = value;
      }
    });
    return snapshot;
  }

  function readLegacyStorageValue(key) {
    try {
      const rawValue = window.localStorage.getItem(key);
      if (rawValue === null) {
        return undefined;
      }

      if (key === THEME_KEY) {
        return rawValue;
      }

      return JSON.parse(rawValue);
    } catch (error) {
      return undefined;
    }
  }

  function writeLegacyStorageValue(key, value) {
    try {
      window.localStorage.setItem(key, key === THEME_KEY ? String(value) : JSON.stringify(value));
    } catch (error) {
      // Если storage расширения недоступен, состояние работает только до перезагрузки страницы.
    }
  }

  function hasStoredValue(key) {
    return Object.prototype.hasOwnProperty.call(storageCache, key);
  }

  function getStoredValue(key) {
    return hasStoredValue(key) ? storageCache[key] : undefined;
  }

  function setStoredValue(key, value) {
    storageCache[key] = value;
    dirtyStorageKeys.add(key);

    if (!extensionStorage) {
      writeLegacyStorageValue(key, value);
      return;
    }

    try {
      const payload = {};
      payload[key] = value;
      const result = usesPromiseStorage
        ? extensionStorage.set(payload)
        : extensionStorage.set(payload, function () {});
      if (result && typeof result.catch === "function") {
        result.catch(function () {
          writeLegacyStorageValue(key, value);
        });
      }
    } catch (error) {
      writeLegacyStorageValue(key, value);
    }
  }

  function loadExtensionStorage() {
    if (!extensionStorage) {
      return Promise.resolve();
    }

    return new Promise(function (resolve) {
      const finish = function (items) {
        applyLoadedStorage(items || {});
        resolve();
      };

      try {
        if (usesPromiseStorage) {
          extensionStorage.get(PERSISTENT_STORAGE_KEYS).then(finish, function () { resolve(); });
          return;
        }

        extensionStorage.get(PERSISTENT_STORAGE_KEYS, finish);
      } catch (error) {
        resolve();
      }
    });
  }

  function applyLoadedStorage(items) {
    const migrationPayload = {};

    PERSISTENT_STORAGE_KEYS.forEach(function (key) {
      if (Object.prototype.hasOwnProperty.call(items, key)) {
        if (!dirtyStorageKeys.has(key)) {
          storageCache[key] = items[key];
        }
        return;
      }

      if (hasStoredValue(key)) {
        migrationPayload[key] = storageCache[key];
      }
    });

    if (Object.keys(migrationPayload).length > 0) {
      try {
        if (usesPromiseStorage) {
          extensionStorage.set(migrationPayload).catch(function () {});
        } else {
          extensionStorage.set(migrationPayload, function () {});
        }
      } catch (error) {
        // Миграция не критична: данные уже есть в кэше текущей страницы.
      }
    }

    migrateStoredConfiguration();
    applyStoredState();
  }

  function applyStoredState() {
    sections = readSectionsConfig();
    replaceObjectContents(collapsedSections, readCollapsedSections());
    replaceObjectContents(sessionCollapsedSections, collapsedSections);
    replaceObjectContents(openAllSections, readOpenAllSections());
    favoriteLinkIds = readFavoriteLinkIds();
    themePreference = readThemePreference();
    const modal = document.getElementById(MODAL_ID);
    if (modal) {
      applyModalTheme(modal);
      refreshMainContent();
      refreshSettingsLists();
    }

    mountButton(true);
  }

  function replaceObjectContents(target, source) {
    Object.keys(target).forEach(function (key) {
      delete target[key];
    });
    Object.assign(target, source);
  }

  function readSectionsConfig() {
    try {
      const savedSections = getStoredValue(CUSTOM_SECTIONS_KEY);
      if (savedSections === undefined) {
        return sanitizeSections(DEFAULT_SECTIONS);
      }

      return sanitizeSections(savedSections);
    } catch (error) {
      return sanitizeSections(DEFAULT_SECTIONS);
    }
  }

  function saveSectionsConfig() {
    setStoredValue(CUSTOM_SECTIONS_KEY, sanitizeSections(sections));
  }

  function sanitizeSections(value) {
    const source = Array.isArray(value) ? value : DEFAULT_SECTIONS;

    return source.map(function (section) {
      if (!section || typeof section.title !== "string" || !Array.isArray(section.links)) {
        return null;
      }

      const title = section.title.trim();
      if (!title) {
        return null;
      }

      return {
        title: title,
        links: sanitizeLinks(section.links, [title])
      };
    }).filter(Boolean);
  }

  function sanitizeLinks(links, parentPath) {
    if (!Array.isArray(links)) {
      return [];
    }

    return links.map(function (link) {
      if (!link || typeof link.title !== "string") {
        return null;
      }

      const title = link.title.trim();
      if (!title) {
        return null;
      }

      const path = (parentPath || []).concat(title);
      const destinationSeed = typeof link.url === "string"
        ? link.url.trim()
        : (link.template && typeof link.template.url === "string" ? link.template.url.trim() : "group");
      const common = {
        id: getSanitizedLinkId(link.id, path.join("/") + "|" + destinationSeed),
        title: title
      };
      const keywords = sanitizeKeywords(link.keywords);
      if (keywords.length > 0) {
        common.keywords = keywords;
      }

      if (Array.isArray(link.links)) {
        common.links = sanitizeLinks(link.links, path);
        return common;
      }

      const template = sanitizeLinkTemplate(link.template);
      if (template) {
        common.template = template;
        return common;
      }

      if (typeof link.url === "string" && link.url.trim()) {
        common.url = link.url.trim();
        return common;
      }

      return null;
    }).filter(Boolean);
  }

  function sanitizeKeywords(value) {
    const source = Array.isArray(value)
      ? value
      : (typeof value === "string" ? value.split(",") : []);
    const seen = new Set();

    return source.map(function (keyword) {
      return String(keyword || "").replace(/\s+/g, " ").trim();
    }).filter(function (keyword) {
      const normalized = normalizeSearchValue(keyword);
      if (!normalized || seen.has(normalized)) {
        return false;
      }
      seen.add(normalized);
      return true;
    });
  }

  function sanitizeLinkTemplate(value) {
    if (!value || typeof value !== "object" || typeof value.url !== "string" || !value.url.trim()) {
      return null;
    }

    const fields = Array.isArray(value.fields) ? value.fields.map(function (field) {
      if (!field || typeof field.key !== "string" || !/^[a-zA-Z][a-zA-Z0-9_]*$/.test(field.key)) {
        return null;
      }

      const label = typeof field.label === "string" && field.label.trim()
        ? field.label.replace(/\s+/g, " ").trim()
        : field.key;
      return {
        key: field.key,
        label: label,
        placeholder: typeof field.placeholder === "string" ? field.placeholder.trim() : "",
        inputMode: field.inputMode === "text" ? "text" : "numeric"
      };
    }).filter(Boolean) : [];

    if (fields.length === 0) {
      return null;
    }

    return {
      url: value.url.trim(),
      fields: fields
    };
  }

  function getSanitizedLinkId(value, seed) {
    if (typeof value === "string" && /^[a-zA-Z0-9_-]{6,80}$/.test(value)) {
      return value;
    }

    return "b24ql-" + hashString(seed);
  }

  function createLinkId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return "b24ql-" + window.crypto.randomUUID();
    }

    return "b24ql-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
  }

  function hashString(value) {
    let hash = 2166136261;
    const text = String(value || "");
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
  }

  /* Однократное добавление новых системных шаблонов в ранее сохраненную структуру. */
  function migrateStoredConfiguration() {
    const storedVersion = Number(getStoredValue(CONFIG_SCHEMA_KEY)) || 0;
    if (storedVersion >= CONFIG_SCHEMA_VERSION) {
      return;
    }

    const savedSections = getStoredValue(CUSTOM_SECTIONS_KEY);
    if (Array.isArray(savedSections)) {
      const migratedSections = sanitizeSections(savedSections);
      if (storedVersion < 4) {
        addMissingDefaultTemplateLinks(migratedSections);
      }
      mergeDefaultLinkMetadata(migratedSections);
      setStoredValue(CUSTOM_SECTIONS_KEY, migratedSections);
    }

    /* До версии 3 ручное раскрытие ошибочно сохранялось как настройка по умолчанию. */
    if (storedVersion < 3) {
      const savedCollapsedSections = getStoredValue(COLLAPSED_SECTIONS_KEY);
      const migratedCollapsedSections = savedCollapsedSections &&
        typeof savedCollapsedSections === "object" &&
        !Array.isArray(savedCollapsedSections)
        ? Object.assign({}, savedCollapsedSections)
        : {};

      Object.keys(DEFAULT_COLLAPSED_SECTIONS).forEach(function (sectionTitle) {
        if (DEFAULT_COLLAPSED_SECTIONS[sectionTitle] === true) {
          migratedCollapsedSections[sectionTitle] = true;
        }
      });
      setStoredValue(COLLAPSED_SECTIONS_KEY, migratedCollapsedSections);
    }

    setStoredValue(CONFIG_SCHEMA_KEY, CONFIG_SCHEMA_VERSION);
  }

  function containsTemplateLinks(sectionList) {
    return (sectionList || []).some(function (section) {
      return section && Array.isArray(section.links) && section.links.some(linkContainsTemplate);
    });
  }

  function addMissingDefaultTemplateLinks(targetSections) {
    const defaultTemplateSection = sanitizeSections(DEFAULT_SECTIONS).find(function (section) {
      return containsTemplateLinks([section]);
    });
    if (!defaultTemplateSection) {
      return;
    }

    const targetSection = targetSections.find(function (section) {
      return normalizeSearchValue(section.title) === normalizeSearchValue(defaultTemplateSection.title);
    });
    if (!targetSection) {
      targetSections.unshift(defaultTemplateSection);
      return;
    }

    defaultTemplateSection.links.forEach(function (defaultLink) {
      const exists = targetSection.links.some(function (link) {
        return link.id === defaultLink.id ||
          normalizeSearchValue(link.title) === normalizeSearchValue(defaultLink.title);
      });
      if (!exists) {
        targetSection.links.push(defaultLink);
      }
    });
  }

  function linkContainsTemplate(link) {
    if (!link) {
      return false;
    }
    if (link.template) {
      return true;
    }
    return Array.isArray(link.links) && link.links.some(linkContainsTemplate);
  }

  function linkContainsOnlyTemplates(link) {
    if (!link) {
      return false;
    }
    if (link.template) {
      return true;
    }
    return Array.isArray(link.links) &&
      link.links.length > 0 &&
      link.links.every(linkContainsOnlyTemplates);
  }

  function mergeDefaultLinkMetadata(targetSections) {
    const defaultLinksById = new Map();
    sanitizeSections(DEFAULT_SECTIONS).forEach(function (section) {
      indexLinksById(section.links, defaultLinksById);
    });
    targetSections.forEach(function (section) {
      mergeLinkMetadataInList(section.links, defaultLinksById);
    });
  }

  function indexLinksById(links, result) {
    links.forEach(function (link) {
      result.set(link.id, link);
      if (Array.isArray(link.links)) {
        indexLinksById(link.links, result);
      }
    });
  }

  function mergeLinkMetadataInList(links, defaultsById) {
    links.forEach(function (link) {
      const defaultLink = defaultsById.get(link.id);
      if ((!link.keywords || link.keywords.length === 0) && defaultLink && defaultLink.keywords) {
        link.keywords = defaultLink.keywords.slice();
      }
      if (Array.isArray(link.links)) {
        mergeLinkMetadataInList(link.links, defaultsById);
      }
    });
  }

  function readCollapsedSections() {
    try {
      const parsed = getStoredValue(COLLAPSED_SECTIONS_KEY);
      const saved = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
      return Object.assign({}, DEFAULT_COLLAPSED_SECTIONS, saved);
    } catch (error) {
      return Object.assign({}, DEFAULT_COLLAPSED_SECTIONS);
    }
  }

  function readOpenAllSections() {
    try {
      const parsed = getStoredValue(OPEN_ALL_SECTIONS_KEY);
      const saved = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
      return Object.assign({}, DEFAULT_OPEN_ALL_SECTIONS, saved);
    } catch (error) {
      return Object.assign({}, DEFAULT_OPEN_ALL_SECTIONS);
    }
  }

  function saveOpenAllSections() {
    setStoredValue(OPEN_ALL_SECTIONS_KEY, Object.assign({}, openAllSections));
  }

  function saveCollapsedSections() {
    setStoredValue(COLLAPSED_SECTIONS_KEY, Object.assign({}, collapsedSections));
  }

  function readThemePreference() {
    try {
      const savedTheme = getStoredValue(THEME_KEY);
      return savedTheme === "dark" || savedTheme === "light" ? savedTheme : "auto";
    } catch (error) {
      return "auto";
    }
  }

  function saveThemePreference() {
    setStoredValue(THEME_KEY, themePreference);
  }

  /* Определение активной темы: авто, светлая или темная. */
  function getBrowserTheme() {
    return browserThemeQuery && browserThemeQuery.matches ? "light" : "dark";
  }

  function getEffectiveTheme() {
    return themePreference === "auto" ? getBrowserTheme() : themePreference;
  }

  function updateThemeControls(root) {
    const scope = root || document;
    Array.from(scope.querySelectorAll(".b24ql-theme-choice")).forEach(function (input) {
      input.checked = input.value === themePreference;
    });
  }

  function applyModalTheme(modal) {
    const targetModal = modal || document.getElementById(MODAL_ID);
    if (!targetModal) {
      return;
    }

    targetModal.dataset.b24qlTheme = themePreference;
    targetModal.dataset.b24qlEffectiveTheme = getEffectiveTheme();

    updateThemeControls(targetModal);
  }

  function setThemePreference(theme) {
    themePreference = theme === "dark" || theme === "light" ? theme : "auto";
    saveThemePreference();
    applyModalTheme();
  }

  /* Подмена домена в ссылках под текущий портал: prod, test или develop. */
  function getCurrentPortalHost() {
    return PORTAL_HOSTS.includes(window.location.hostname)
      ? window.location.hostname
      : PRODUCTION_PORTAL_HOST;
  }

  function getPortalUrl(url) {
    try {
      const targetUrl = new URL(url);
      if (targetUrl.hostname === PRODUCTION_PORTAL_HOST || PORTAL_HOSTS.includes(targetUrl.hostname)) {
        targetUrl.protocol = "https:";
        targetUrl.hostname = getCurrentPortalHost();
      }
      return targetUrl.href;
    } catch (error) {
      return url;
    }
  }

  /* Поиск и определение активной ссылки относительно текущей страницы. */
  function normalizeSearchValue(value) {
    return String(value || "").toLocaleLowerCase("ru-RU").replace(/\s+/g, " ").trim();
  }

  function getLinkSearchText(link) {
    const nestedText = Array.isArray(link.links)
      ? link.links.map(getLinkSearchText).join(" ")
      : "";
    const keywords = Array.isArray(link.keywords) ? link.keywords.join(" ") : "";
    const templateText = link.template
      ? [link.template.url].concat(link.template.fields.map(function (field) {
        return field.label;
      })).join(" ")
      : "";

    return normalizeSearchValue([link.title, link.url, keywords, templateText, nestedText].filter(Boolean).join(" "));
  }

  function linkMatchesSearch(link, query) {
    return !query || getLinkMatchScore(link, query, "") > 0;
  }

  function getLinkMatchScore(link, query, pathText) {
    const queries = getSearchQueryVariants(query);
    const title = normalizeSearchValue(link.title);
    const keywords = normalizeSearchValue(Array.isArray(link.keywords) ? link.keywords.join(" ") : "");
    const searchText = normalizeSearchValue([getLinkSearchText(link), pathText].filter(Boolean).join(" "));
    let bestScore = 0;

    queries.forEach(function (candidate) {
      if (!candidate) {
        return;
      }
      if (title === candidate) {
        bestScore = Math.max(bestScore, 1000);
      } else if (title.startsWith(candidate)) {
        bestScore = Math.max(bestScore, 900);
      } else if (title.includes(candidate)) {
        bestScore = Math.max(bestScore, 820);
      }
      if (keywords.includes(candidate)) {
        bestScore = Math.max(bestScore, 780);
      }
      if (searchText.includes(candidate)) {
        bestScore = Math.max(bestScore, 700);
      }

      const tokens = candidate.split(" ").filter(Boolean);
      if (tokens.length > 1 && tokens.every(function (token) {
        return searchText.includes(token);
      })) {
        bestScore = Math.max(bestScore, 650);
      }

      if (candidate.length >= 4 && isFuzzySearchMatch(title, candidate)) {
        bestScore = Math.max(bestScore, 420);
      }
    });

    return bestScore;
  }

  function getSearchQueryVariants(value) {
    const query = normalizeSearchValue(value);
    const variants = [query];
    const converted = convertKeyboardLayout(query);
    if (converted && converted !== query) {
      variants.push(converted);
    }
    return variants;
  }

  function convertKeyboardLayout(value) {
    const english = "qwertyuiop[]asdfghjkl;'zxcvbnm,.`";
    const russian = "йцукенгшщзхъфывапролджэячсмитьбюё";
    return String(value || "").split("").map(function (character) {
      const englishIndex = english.indexOf(character);
      if (englishIndex >= 0) {
        return russian[englishIndex];
      }
      const russianIndex = russian.indexOf(character);
      return russianIndex >= 0 ? english[russianIndex] : character;
    }).join("");
  }

  function isFuzzySearchMatch(title, query) {
    const titleWords = title.split(/[^a-zа-яё0-9]+/i).filter(Boolean);
    const queryWords = query.split(/[^a-zа-яё0-9]+/i).filter(Boolean);
    if (queryWords.length === 0) {
      return false;
    }

    return queryWords.every(function (queryWord) {
      const allowedDistance = queryWord.length >= 8 ? 2 : 1;
      return titleWords.some(function (titleWord) {
        return Math.abs(titleWord.length - queryWord.length) <= allowedDistance &&
          getEditDistance(titleWord, queryWord, allowedDistance) <= allowedDistance;
      });
    });
  }

  function getEditDistance(left, right, stopAfter) {
    let previous = Array.from({ length: right.length + 1 }, function (_, index) {
      return index;
    });
    let previousPrevious = null;

    for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
      const current = [leftIndex];
      for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
        const substitution = previous[rightIndex - 1] + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1);
        current[rightIndex] = Math.min(
          previous[rightIndex] + 1,
          current[rightIndex - 1] + 1,
          substitution
        );
        if (previousPrevious && leftIndex > 1 && rightIndex > 1 &&
          left[leftIndex - 1] === right[rightIndex - 2] &&
          left[leftIndex - 2] === right[rightIndex - 1]) {
          current[rightIndex] = Math.min(current[rightIndex], previousPrevious[rightIndex - 2] + 1);
        }
      }
      previousPrevious = previous;
      previous = current;
    }
    return Math.min(previous[right.length], stopAfter + 1);
  }

  function getComparableUrl(url) {
    try {
      const targetUrl = new URL(getPortalUrl(url), window.location.href);
      const path = targetUrl.pathname.replace(/\/+$/, "") || "/";
      return targetUrl.origin + path;
    } catch (error) {
      return "";
    }
  }

  function isCurrentPageUrl(url) {
    return getComparableUrl(url) === getComparableUrl(window.location.href);
  }

  function isGroupCurrentPage(group) {
    return Array.isArray(group.links) && group.links.some(function (link) {
      return Array.isArray(link.links) ? isGroupCurrentPage(link) : isCurrentPageUrl(link.url);
    });
  }

  /* Создание пункта "Быстрые ссылки" в стиле левого меню Bitrix24. */
  function createButton() {
    const button = document.createElement("a");
    button.id = BUTTON_ID;
    button.className = "b24ql-menu-button menu-item-link";
    button.href = "#";
    button.setAttribute("role", "button");
    button.draggable = false;
    button.title = "Быстрые ссылки";
    button.setAttribute("aria-label", "Открыть быстрые ссылки");
    button.innerHTML = [
      '<span class="menu-item-icon-box b24ql-menu-icon-box" aria-hidden="true">',
      '<span class="b24ql-menu-button-icon">',
      '<span></span><span></span><span></span>',
      "</span>",
      "</span>",
      '<span class="menu-item-link-text b24ql-menu-button-text">Быстрые ссылки</span>'
    ].join("");
    button.addEventListener("click", function (event) {
      event.preventDefault();
      if (suppressNextButtonClick) {
        event.stopPropagation();
        suppressNextButtonClick = false;
        return;
      }
      openModal();
    });
    return button;
  }

  /* Поиск реального контейнера левого меню, даже если Bitrix24 поменял DOM после загрузки. */
  function findLeftMenuContainer() {
    const candidates = [];

    for (const selector of LEFT_MENU_SELECTORS) {
      const elements = Array.from(document.querySelectorAll(selector));
      for (const element of elements) {
        if (isVisibleLeftMenu(element)) {
          candidates.push({
            element: element,
            score: getLeftMenuScore(element)
          });
        }
      }
    }

    candidates.sort(function (a, b) {
      return b.score - a.score;
    });

    return candidates.length > 0 ? candidates[0].element : null;
  }

  function isVisibleLeftMenu(element) {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);

    return (
      rect.width >= 30 &&
      rect.width <= 340 &&
      rect.height >= 160 &&
      rect.left <= 320 &&
      style.display !== "none" &&
      style.visibility !== "hidden"
    );
  }

  function getLeftMenuScore(element) {
    const className = typeof element.className === "string" ? element.className : "";
    let score = 0;

    if (element.tagName.toLowerCase() === "ul") {
      score += 40;
    }
    if (className.split(/\s+/).includes("menu-items")) {
      score += 60;
    }
    if (element.querySelectorAll(":scope > li").length > 0) {
      score += 35;
    }
    if (className.includes("menu-items-body-inner") || className.includes("menu-items-block")) {
      score -= 25;
    }

    return score;
  }

  /* Встраивание кнопки только в реальное левое меню портала Bitrix24. */
  function mountButton(forcePositionRestore) {
    if (!document.body) {
      return;
    }

    const leftMenu = findLeftMenuContainer();
    if (!leftMenu) {
      unmountButtonUntilMenuExists();
      return;
    }

    let button = document.getElementById(BUTTON_ID);
    if (!button) {
      button = createButton();
    }

    let menuItem = ensureMenuItemElement();

    const currentContainer = getCurrentMenuContainer(leftMenu, menuItem);
    const needsPositionRestore = forcePositionRestore || !currentContainer;
    if (!currentContainer) {
      leftMenu.appendChild(menuItem);
    }
    if (button.parentElement !== menuItem) {
      menuItem.appendChild(button);
    }

    menuItem.classList.toggle("b24ql-menu-item-native-parent", isNativeBitrixMenuList(menuItem.parentElement));
    setupMenuItemDrag(menuItem);
    setupMenuDropTargets(leftMenu);
    if (needsPositionRestore) {
      restoreMenuPosition(leftMenu, menuItem);
    }

    button.classList.add("b24ql-menu-button-inline");
    syncMenuItemColor(leftMenu, menuItem);
  }

  function unmountButtonUntilMenuExists() {
    const button = document.getElementById(BUTTON_ID);
    const menuItem = document.getElementById(MENU_ITEM_ID);

    if (button) {
      button.remove();
    }
    if (menuItem) {
      menuItem.remove();
    }
    closeModal(true);
  }

  function ensureMenuItemElement() {
    let menuItem = document.getElementById(MENU_ITEM_ID);

    if (!menuItem || menuItem.tagName.toLowerCase() !== "li") {
      const replacement = document.createElement("li");
      replacement.id = MENU_ITEM_ID;
      replacement.className = "menu-item-block b24ql-menu-item";

      if (menuItem) {
        while (menuItem.firstChild) {
          replacement.appendChild(menuItem.firstChild);
        }
        menuItem.replaceWith(replacement);
      }

      menuItem = replacement;
    }

    const expectedClassName = "menu-item-block b24ql-menu-item";
    if (menuItem.className !== expectedClassName) {
      menuItem.className = expectedClassName;
    }
    return menuItem;
  }

  function isNativeBitrixMenuList(element) {
    if (!element) {
      return false;
    }

    const className = typeof element.className === "string" ? element.className : "";
    return element.tagName.toLowerCase() === "ul" && className.split(/\s+/).includes("menu-items");
  }

  function getCurrentMenuContainer(leftMenu, menuItem) {
    const parent = menuItem.parentElement;
    if (!parent) {
      return null;
    }

    if (parent === leftMenu) {
      return leftMenu;
    }

    return leftMenu.contains(parent) && isMenuContainerElement(parent, leftMenu) ? parent : null;
  }

  /* Перетаскивание пункта меню и сохранение его позиции. */
  function setupMenuItemDrag(menuItem) {
    if (menuItem.dataset.b24qlDragReady === "true") {
      return;
    }

    menuItem.dataset.b24qlDragReady = "true";
    menuItem.draggable = true;
    menuItem.title = "Перетащите, чтобы изменить положение в меню";

    menuItem.addEventListener("dragstart", function (event) {
      const leftMenu = menuItem.parentElement;
      if (!leftMenu) {
        return;
      }

      isDraggingQuickLink = true;
      suppressNextButtonClick = true;
      menuItem.classList.add("b24ql-menu-item-dragging");
      document.documentElement.classList.add("b24ql-menu-is-dragging");

      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", MENU_ITEM_ID);
      }
    });

    menuItem.addEventListener("dragend", function () {
      isDraggingQuickLink = false;
      menuItem.classList.remove("b24ql-menu-item-dragging");
      document.documentElement.classList.remove("b24ql-menu-is-dragging");
      saveMenuPosition(menuItem);

      window.setTimeout(function () {
        suppressNextButtonClick = false;
      }, 80);
    });
  }

  /* Подготовка областей, куда можно перетащить пункт, включая группу "Совместная работа". */
  function setupMenuDropTargets(leftMenu) {
    findMenuDropContainers(leftMenu).forEach(setupMenuDropTarget);
  }

  function setupMenuDropTarget(container) {
    if (dragReadyMenus.has(container)) {
      return;
    }

    dragReadyMenus.add(container);

    container.addEventListener("dragover", function (event) {
      if (!isDraggingQuickLink) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "move";
      }

      const menuItem = document.getElementById(MENU_ITEM_ID);
      if (!menuItem) {
        return;
      }

      const groupTarget = getGroupDropTarget(container, event.target);
      const targetContainer = groupTarget ? groupTarget.container : container;

      if (menuItem.parentElement !== targetContainer) {
        targetContainer.appendChild(menuItem);
      }

      menuItem.classList.toggle("b24ql-menu-item-native-parent", isNativeBitrixMenuList(targetContainer));
      syncMenuItemColor(leftMenu, menuItem);

      if (groupTarget && groupTarget.afterElement && groupTarget.afterElement.parentElement === targetContainer) {
        targetContainer.insertBefore(menuItem, groupTarget.afterElement.nextElementSibling);
        return;
      }

      const nextElement = getDragAfterElement(targetContainer, event.clientY);
      if (nextElement) {
        targetContainer.insertBefore(menuItem, nextElement);
      } else {
        targetContainer.appendChild(menuItem);
      }
    });

    container.addEventListener("drop", function (event) {
      if (!isDraggingQuickLink) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      const menuItem = document.getElementById(MENU_ITEM_ID);
      if (menuItem) {
        saveMenuPosition(menuItem);
        syncMenuItemColor(leftMenu, menuItem);
      }
    });
  }

  function syncMenuItemColor(leftMenu, menuItem) {
    if (!leftMenu || !menuItem) {
      return;
    }

    const color = getDominantMenuTextColor(leftMenu);
    if (!color) {
      menuItem.style.removeProperty("--b24ql-menu-color");
      return;
    }

    if (menuItem.style.getPropertyValue("--b24ql-menu-color") !== color) {
      menuItem.style.setProperty("--b24ql-menu-color", color);
    }
  }

  function getDominantMenuTextColor(leftMenu) {
    const colors = new Map();

    Array.from(leftMenu.querySelectorAll(".menu-item-link-text, .menu-item-text, .menu-item-icon, .menu-item-icon-box")).forEach(function (element) {
      if (element.closest("#" + MENU_ITEM_ID) || !isVisibleMenuColorSource(element)) {
        return;
      }

      const color = window.getComputedStyle(element).color;
      if (!color || color === "transparent" || color === "rgba(0, 0, 0, 0)") {
        return;
      }

      colors.set(color, (colors.get(color) || 0) + 1);
    });

    return Array.from(colors.entries()).sort(function (a, b) {
      return b[1] - a[1];
    })[0]?.[0] || "";
  }

  function isVisibleMenuColorSource(element) {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);

    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      Number(style.opacity || "1") > 0.2
    );
  }

  function findMenuDropContainers(leftMenu) {
    const containers = [leftMenu];
    const selectors = [
      "ul.menu-items",
      "ul",
      "ol",
      "[role='list']",
      ".menu-item-group-items",
      ".menu-item-group-list",
      ".menu-item-group-content",
      ".menu-item-group-more-ul",
      ".menu-items-group",
      ".menu-items-group-list",
      ".menu-group-items",
      "[data-role='menu-items']",
      "[data-role='menu-group-items']"
    ];

    Array.from(leftMenu.querySelectorAll(selectors.join(","))).forEach(function (element) {
      if (element !== leftMenu && isMenuDropContainer(element, leftMenu) && !containers.includes(element)) {
        containers.push(element);
      }
    });

    findTeamworkGroupElements(leftMenu).forEach(function (groupElement) {
      const nestedContainer = findNestedMenuContainer(groupElement);
      if (nestedContainer && isMenuContainerElement(nestedContainer, leftMenu) && !containers.includes(nestedContainer)) {
        containers.push(nestedContainer);
      }
    });

    return containers;
  }

  function isMenuDropContainer(element, leftMenu) {
    if (!element || element === document.documentElement || element === document.body) {
      return false;
    }
    if (element === leftMenu) {
      return true;
    }
    if (!leftMenu.contains(element)) {
      return false;
    }

    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);

    return (
      rect.height >= 0 &&
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      style.position !== "fixed"
    );
  }

  function isMenuContainerElement(element, leftMenu) {
    if (!element || element === document.documentElement || element === document.body) {
      return false;
    }
    if (element === leftMenu) {
      return true;
    }
    if (!leftMenu.contains(element)) {
      return false;
    }

    return (
      element.matches("ul, ol, [role='list'], .menu-items, .menu-item-group-items, .menu-item-group-list, .menu-item-group-content, .menu-item-group-more-ul, .menu-items-group, .menu-items-group-list, .menu-group-items, [data-role='menu-items'], [data-role='menu-group-items']") ||
      Boolean(element.querySelector(":scope > li, :scope > .menu-item-block, :scope > .menu-item-link"))
    );
  }

  function getGroupDropTarget(container, eventTarget) {
    if (!(eventTarget instanceof Element)) {
      return null;
    }

    const groupElement = getTeamworkGroupElementFromTarget(eventTarget, container);

    if (!groupElement || groupElement.id === MENU_ITEM_ID || !container.contains(groupElement)) {
      return null;
    }

    const nestedContainer = findNestedMenuContainer(groupElement);
    if (nestedContainer && isMenuContainerElement(nestedContainer, container)) {
      return {
        container: nestedContainer,
        afterElement: null
      };
    }

    if (groupElement.parentElement === container) {
      return {
        container: container,
        afterElement: groupElement
      };
    }

    return null;
  }

  function getTeamworkGroupElementFromTarget(eventTarget, boundary) {
    let element = eventTarget;

    while (element && element !== boundary) {
      if (isTeamworkGroupElement(element)) {
        return element;
      }

      element = element.parentElement;
    }

    return boundary && isTeamworkGroupElement(boundary) ? boundary : null;
  }

  /* Распознавание группировки Bitrix24 "Совместная работа" и ее внутреннего списка. */
  function findTeamworkGroupElements(leftMenu) {
    return Array.from(leftMenu.querySelectorAll("*")).filter(function (element) {
      return isTeamworkGroupElement(element);
    });
  }

  function isTeamworkGroupElement(element) {
    if (!element || element.id === MENU_ITEM_ID) {
      return false;
    }

    const className = typeof element.className === "string" ? element.className : "";
    const text = normalizeMenuText(element);

    return (
      element.id === "bx_left_menu_menu_teamwork" ||
      element.id === "bx_left_menu_menu_teamwork_parent" ||
      className.includes("menu-teamwork") ||
      (className.includes("menu-item-group") && className.includes("menu-item-block")) ||
      className.includes("menu-item-group-more") ||
      element.getAttribute("data-id") === "menu_teamwork" ||
      element.getAttribute("data-menu-id") === "menu_teamwork" ||
      text === "Совместная работа" ||
      (text.includes("Совместная работа") && text.length <= 80)
    );
  }

  function findNestedMenuContainer(groupElement) {
    const selectors = [
      "ul.menu-items",
      "ul",
      "ol",
      "[role='list']",
      ".menu-item-group-items",
      ".menu-item-group-list",
      ".menu-item-group-content",
      ".menu-item-group-more-ul",
      ".menu-items-group",
      ".menu-items-group-list",
      ".menu-group-items",
      "[data-role='menu-items']",
      "[data-role='menu-group-items']"
    ];

    let candidate = groupElement;

    while (candidate && candidate !== document.body) {
      const childContainer = candidate.querySelector(selectors.join(","));
      if (childContainer) {
        return childContainer;
      }

      let sibling = candidate.nextElementSibling;
      while (sibling) {
        if (sibling.matches(selectors.join(",")) || isLikelyMenuItemsContainer(sibling)) {
          return sibling;
        }

        const nestedSiblingContainer = sibling.querySelector(selectors.join(","));
        if (nestedSiblingContainer) {
          return nestedSiblingContainer;
        }

        if (isPositionableMenuChild(sibling)) {
          break;
        }

        sibling = sibling.nextElementSibling;
      }

      candidate = candidate.parentElement;
    }

    return null;
  }

  function isLikelyMenuItemsContainer(element) {
    return Boolean(element.querySelector(":scope > li, :scope > .menu-item-block, :scope > .menu-item-link"));
  }

  function getDragAfterElement(container, pointerY) {
    const children = Array.from(container.children).filter(function (child) {
      return child.id !== MENU_ITEM_ID && isPositionableMenuChild(child);
    });

    return children.reduce(
      function (closest, child) {
        const rect = child.getBoundingClientRect();
        const offset = pointerY - rect.top - rect.height / 2;

        if (offset < 0 && offset > closest.offset) {
          return {
            offset: offset,
            element: child
          };
        }

        return closest;
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: null
      }
    ).element;
  }

  function isPositionableMenuChild(element) {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);

    return (
      rect.height > 0 &&
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      style.position !== "fixed"
    );
  }

  function normalizeMenuText(element) {
    return (element.innerText || element.textContent || "").replace(/\s+/g, " ").trim();
  }

  /* Сохранение и восстановление позиции кнопки внутри левого меню. */
  function saveMenuPosition(menuItem) {
    const container = menuItem.parentElement;
    const leftMenu = findLeftMenuContainer();
    if (!container || !leftMenu || (container !== leftMenu && !leftMenu.contains(container))) {
      return;
    }

    const children = Array.from(container.children).filter(isPositionableMenuChild);
    const index = children.indexOf(menuItem);
    if (index < 0) {
      return;
    }

    setStoredValue(STORAGE_KEY, {
      version: POSITION_SCHEMA_VERSION,
      index: index,
      containerPath: getElementPath(leftMenu, container),
      userMoved: true
    });
  }

  function restoreMenuPosition(leftMenu, menuItem) {
    const savedPosition = getStoredValue(STORAGE_KEY);

    if (
      !savedPosition ||
      savedPosition.version !== POSITION_SCHEMA_VERSION ||
      savedPosition.userMoved !== true ||
      !Number.isInteger(savedPosition.index)
    ) {
      restoreDefaultMenuPosition(leftMenu, menuItem);
      return;
    }

    const targetContainer = getSavedMenuContainer(leftMenu, savedPosition) || leftMenu;
    const siblings = Array.from(targetContainer.children).filter(function (child) {
      return child.id !== MENU_ITEM_ID && isPositionableMenuChild(child);
    });
    const index = Math.max(0, Math.min(savedPosition.index, siblings.length));
    const nextElement = siblings[index];

    if (nextElement) {
      targetContainer.insertBefore(menuItem, nextElement);
    } else {
      targetContainer.appendChild(menuItem);
    }

    menuItem.classList.toggle("b24ql-menu-item-native-parent", isNativeBitrixMenuList(targetContainer));
  }

  function getSavedMenuContainer(leftMenu, savedPosition) {
    if (!Array.isArray(savedPosition.containerPath) || savedPosition.containerPath.length === 0) {
      return leftMenu;
    }

    const savedContainer = getElementByPath(leftMenu, savedPosition.containerPath);
    return savedContainer && isMenuContainerElement(savedContainer, leftMenu) ? savedContainer : leftMenu;
  }

  function getElementPath(root, element) {
    const path = [];
    let current = element;

    while (current && current !== root) {
      const parent = current.parentElement;
      if (!parent) {
        return [];
      }

      path.unshift(Array.from(parent.children).indexOf(current));
      current = parent;
    }

    return current === root ? path : [];
  }

  function getElementByPath(root, path) {
    let current = root;

    for (const index of path) {
      if (!Number.isInteger(index) || index < 0 || !current.children[index]) {
        return null;
      }

      current = current.children[index];
    }

    return current;
  }

  function restoreDefaultMenuPosition(leftMenu, menuItem) {
    const children = Array.from(leftMenu.children);
    const teamworkGroup = children.find(function (child) {
      const className = typeof child.className === "string" ? child.className : "";

      return (
        child.id === "bx_left_menu_menu_teamwork" ||
        child.id === "bx_left_menu_menu_teamwork_parent" ||
        className.includes("menu-teamwork") ||
        className.includes("menu-item-group-more")
      );
    });

    if (teamworkGroup && teamworkGroup.parentElement === leftMenu) {
      leftMenu.insertBefore(menuItem, teamworkGroup.nextElementSibling);
      return;
    }

    const defaultPreviousItem = children.find(function (child) {
      const className = typeof child.className === "string" ? child.className : "";
      const text = (child.innerText || child.textContent || "").replace(/\s+/g, " ").trim();

      return className.includes("menu-tasks") || text.includes("Задачи и Проекты");
    });

    if (defaultPreviousItem && defaultPreviousItem.parentElement === leftMenu) {
      leftMenu.insertBefore(menuItem, defaultPreviousItem.nextElementSibling);
      return;
    }

    leftMenu.appendChild(menuItem);
  }

  /* Основное окно со списком блоков быстрых ссылок. */
  function createModal() {
    const overlay = document.createElement("div");
    overlay.id = MODAL_ID;
    overlay.className = "b24ql-modal b24ql-hidden";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "b24ql-title");

    const panel = document.createElement("div");
    panel.className = "b24ql-panel";

    const header = document.createElement("header");
    header.className = "b24ql-header";
    header.innerHTML = [
      '<div class="b24ql-title-wrap">',
      '<h2 id="b24ql-title">Быстрые ссылки</h2>',
      "<p>Переход к часто используемым разделам Bitrix24</p>",
      "</div>"
    ].join("");

    const actions = document.createElement("div");
    actions.className = "b24ql-header-actions";

    const settingsButton = createSettingsButton();

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "b24ql-close ui-btn ui-btn-light-border ui-btn-xs";
    closeButton.setAttribute("aria-label", "Закрыть");
    closeButton.innerHTML = [
      '<svg class="b24ql-close-icon" viewBox="0 0 24 24" aria-hidden="true">',
      '<path d="M18 6 6 18M6 6l12 12"></path>',
      "</svg>"
    ].join("");
    closeButton.addEventListener("click", function () {
      closeModal();
    });

    actions.appendChild(closeButton);
    actions.appendChild(settingsButton);

    const content = document.createElement("div");
    content.className = "b24ql-content b24ql-main-content";
    renderMainContent(content);

    panel.appendChild(actions);
    panel.appendChild(header);
    panel.appendChild(content);
    overlay.appendChild(panel);
    overlay.appendChild(createSubModal());
    overlay.appendChild(createTemplateModal());
    overlay.appendChild(createSettingsModal());
    applyModalTheme(overlay);

    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        closeModal();
      }
    });

    return overlay;
  }

  function renderMainContent(content) {
    content.replaceChildren();
    content.dataset.b24qlSearchActive = "false";
    content.appendChild(createSearchBox(SEARCH_INPUT_ID, "Поиск по быстрым ссылкам", applyMainSearch));
    content.appendChild(createFavoritesSection());
    content.appendChild(createSearchResultsSection());

    sections.forEach(function (section, index) {
      content.appendChild(createSection(section, index));
    });

    const empty = document.createElement("div");
    empty.className = "b24ql-empty ui-alert ui-alert-default b24ql-hidden";
    const emptyMessage = document.createElement("span");
    emptyMessage.className = "ui-alert-message";
    emptyMessage.textContent = "Ничего не найдено";
    empty.appendChild(emptyMessage);
    content.appendChild(empty);
  }

  function refreshMainContent() {
    const modal = document.getElementById(MODAL_ID);
    if (!modal) {
      return;
    }

    const searchValue = getMainSearchValue();
    const content = modal.querySelector(".b24ql-main-content");
    if (!content) {
      return;
    }

    renderMainContent(content);
    setSearchInputValue(document.getElementById(SEARCH_INPUT_ID), searchValue);
    renderFavoritesSection();
    refreshActiveLinks(modal);
    updateOpenAllButtons(modal);
    applyMainSearch(searchValue);
  }

  function refreshSettingsLists() {
    renderCollapsedSectionsSettingsList();
    renderOpenAllSettingsList();
    renderLinksEditor();
  }

  function createSettingsButton() {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "b24ql-settings-open ui-btn ui-btn-light-border ui-btn-xs";
    button.setAttribute("aria-label", "Открыть настройки");
    button.title = "Настройки";
    button.innerHTML = [
      '<svg class="b24ql-settings-open-icon" viewBox="0 0 24 24" aria-hidden="true">',
      '<circle cx="12" cy="12" r="3"></circle>',
      '<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6V20a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-.6 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-.6-1H4a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 .6-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-.6V4a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 .6 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.26.34.46.71.6 1H20a2 2 0 1 1 0 4h-.09c-.14.29-.34.66-.51 1z"></path>',
      "</svg>"
    ].join("");
    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      openSettingsModal();
    });
    return button;
  }

  /* Окно настроек: тема окна и включение кнопки "открыть весь блок". */
  function createSettingsModal() {
    const settingsModal = document.createElement("div");
    settingsModal.id = SETTINGS_MODAL_ID;
    settingsModal.className = "b24ql-settings-modal b24ql-hidden";
    settingsModal.setAttribute("role", "dialog");
    settingsModal.setAttribute("aria-labelledby", "b24ql-settings-title");

    const panel = document.createElement("div");
    panel.className = "b24ql-panel b24ql-settings-panel";

    const header = document.createElement("header");
    header.className = "b24ql-header b24ql-subheader";

    const titleWrap = document.createElement("div");
    const title = document.createElement("h2");
    title.id = "b24ql-settings-title";
    title.textContent = "Настройки";
    titleWrap.appendChild(title);

    const actions = document.createElement("div");
    actions.className = "b24ql-subactions";

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "b24ql-close ui-btn ui-btn-light-border ui-btn-xs";
    closeButton.setAttribute("aria-label", "Закрыть настройки");
    closeButton.innerHTML = [
      '<svg class="b24ql-close-icon" viewBox="0 0 24 24" aria-hidden="true">',
      '<path d="M18 6 6 18M6 6l12 12"></path>',
      "</svg>"
    ].join("");
    closeButton.addEventListener("click", function () {
      closeSettingsModal();
    });

    actions.appendChild(closeButton);
    header.appendChild(titleWrap);

    const content = document.createElement("div");
    content.className = "b24ql-content b24ql-settings-content";

    const mainView = document.createElement("div");
    mainView.className = "b24ql-settings-view b24ql-settings-main-view";
    mainView.appendChild(createThemeSettingsRow());
    mainView.appendChild(createCollapsedSectionsSettingsRow());
    mainView.appendChild(createOpenAllSettingsRow());
    mainView.appendChild(createLinksEditorSettingsRow());

    const openAllView = document.createElement("div");
    openAllView.className = "b24ql-settings-view b24ql-open-all-view b24ql-hidden";

    const toolbar = document.createElement("div");
    toolbar.className = "b24ql-settings-toolbar";

    const backButton = document.createElement("button");
    backButton.type = "button";
    backButton.textContent = "Назад";
    styleUiAction(backButton, "outline", "sm");
    backButton.addEventListener("click", showSettingsMainView);

    const toolbarTitle = document.createElement("h3");
    toolbarTitle.textContent = "Открыть весь блок";

    toolbar.appendChild(backButton);
    toolbar.appendChild(toolbarTitle);

    const list = document.createElement("div");
    list.id = "b24ql-open-all-settings-list";
    list.className = "b24ql-settings-list";

    openAllView.appendChild(toolbar);
    openAllView.appendChild(list);

    const collapsedView = document.createElement("div");
    collapsedView.className = "b24ql-settings-view b24ql-collapsed-sections-view b24ql-hidden";

    const collapsedToolbar = document.createElement("div");
    collapsedToolbar.className = "b24ql-settings-toolbar";

    const collapsedBackButton = document.createElement("button");
    collapsedBackButton.type = "button";
    collapsedBackButton.textContent = "Назад";
    styleUiAction(collapsedBackButton, "outline", "sm");
    collapsedBackButton.addEventListener("click", showSettingsMainView);

    const collapsedToolbarTitle = document.createElement("h3");
    collapsedToolbarTitle.textContent = "Состояние блоков";

    collapsedToolbar.appendChild(collapsedBackButton);
    collapsedToolbar.appendChild(collapsedToolbarTitle);

    const collapsedList = document.createElement("div");
    collapsedList.id = "b24ql-collapsed-sections-settings-list";
    collapsedList.className = "b24ql-settings-list";

    collapsedView.appendChild(collapsedToolbar);
    collapsedView.appendChild(collapsedList);

    const linkEditorView = document.createElement("div");
    linkEditorView.className = "b24ql-settings-view b24ql-links-editor-view b24ql-hidden";

    const editorToolbar = document.createElement("div");
    editorToolbar.className = "b24ql-settings-toolbar b24ql-links-editor-toolbar";

    const editorBackButton = document.createElement("button");
    editorBackButton.type = "button";
    editorBackButton.textContent = "Назад";
    styleUiAction(editorBackButton, "outline", "sm");
    editorBackButton.addEventListener("click", handleLinksEditorBack);

    const editorTitle = document.createElement("h3");
    editorTitle.id = "b24ql-links-editor-title";
    editorTitle.textContent = "Редактор ссылок";

    editorToolbar.appendChild(editorBackButton);
    editorToolbar.appendChild(editorTitle);

    const editorActions = document.createElement("div");
    editorActions.className = "b24ql-links-editor-actions";

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.id = "b24ql-links-editor-add";
    addButton.textContent = "Добавить блок";
    styleUiAction(addButton, "outline", "sm");
    addButton.addEventListener("click", handleLinksEditorAdd);

    const addGroupButton = document.createElement("button");
    addGroupButton.type = "button";
    addGroupButton.id = "b24ql-links-editor-add-group";
    addGroupButton.textContent = "Добавить вложенное окно";
    styleUiAction(addGroupButton, "outline", "sm");
    addGroupButton.addEventListener("click", handleLinksEditorAddGroup);

    const exportButton = document.createElement("button");
    exportButton.type = "button";
    exportButton.textContent = "Экспорт JSON";
    styleUiAction(exportButton, "outline", "sm");
    exportButton.addEventListener("click", exportLinksSettingsJson);

    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.id = "b24ql-links-editor-save";
    saveButton.textContent = "Сохранить";
    styleUiAction(saveButton, "primary", "sm");
    saveButton.addEventListener("click", saveLinksEditorDraft);

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.id = "b24ql-links-editor-cancel";
    cancelButton.textContent = "Отмена";
    styleUiAction(cancelButton, "outline", "sm");
    cancelButton.addEventListener("click", cancelLinksEditorDraft);

    const importButton = document.createElement("button");
    importButton.type = "button";
    importButton.textContent = "Импорт JSON";
    styleUiAction(importButton, "outline", "sm");

    const resetButton = document.createElement("button");
    resetButton.type = "button";
    resetButton.textContent = "Сбросить к файлу";
    styleUiAction(resetButton, "outline", "sm");
    resetButton.addEventListener("click", resetLinksEditorDraftToSettingsFile);

    const importInput = document.createElement("input");
    importInput.id = "b24ql-settings-import";
    importInput.className = "b24ql-import-input";
    importInput.type = "file";
    importInput.accept = "application/json,.json";
    importInput.addEventListener("change", importLinksSettingsJson);
    importButton.addEventListener("click", function () {
      // Обнуление позволяет повторно выбрать тот же файл после отмененного импорта.
      importInput.value = "";
      importInput.click();
    });

    const importStatus = document.createElement("div");
    importStatus.id = "b24ql-links-editor-notice";
    importStatus.className = "b24ql-editor-notice ui-alert ui-alert-default b24ql-hidden";
    importStatus.setAttribute("role", "status");
    const importMessage = document.createElement("span");
    importMessage.className = "ui-alert-message";
    importStatus.appendChild(importMessage);

    const editorTools = document.createElement("div");
    editorTools.className = "b24ql-editor-actions-tools";
    editorTools.append(addButton, addGroupButton, importButton, exportButton, resetButton);

    const editorCommit = document.createElement("div");
    editorCommit.className = "b24ql-editor-actions-commit";
    editorCommit.append(saveButton, cancelButton);

    editorActions.append(editorTools, editorCommit);
    editorActions.appendChild(importInput);
    editorActions.appendChild(importStatus);

    const editorList = document.createElement("div");
    editorList.id = "b24ql-links-editor-list";
    editorList.className = "b24ql-links-editor-list";

    linkEditorView.appendChild(editorToolbar);
    linkEditorView.appendChild(editorActions);
    linkEditorView.appendChild(editorList);
    content.appendChild(mainView);
    content.appendChild(openAllView);
    content.appendChild(collapsedView);
    content.appendChild(linkEditorView);

    settingsModal.addEventListener("click", function (event) {
      if (event.target === settingsModal) {
        closeSettingsModal();
      }
    });

    panel.appendChild(actions);
    panel.appendChild(header);
    panel.appendChild(content);
    settingsModal.appendChild(panel);
    return settingsModal;
  }

  function createThemeSettingsRow() {
    const row = createSettingsRow("Тема");
    const group = document.createElement("fieldset");
    group.className = "b24ql-radio-group";
    group.setAttribute("aria-label", "Тема расширения");

    [
      { title: "Авто", value: "auto" },
      { title: "Светлая", value: "light" },
      { title: "Темная", value: "dark" }
    ].forEach(function (theme) {
      const label = document.createElement("label");
      label.className = "b24ql-radio-option";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "b24ql-theme";
      input.value = theme.value;
      input.className = "b24ql-theme-choice";
      input.checked = theme.value === themePreference;
      input.addEventListener("change", function () {
        if (input.checked) {
          setThemePreference(theme.value);
        }
      });
      const text = document.createElement("span");
      text.textContent = theme.title;
      label.append(input, text);
      group.appendChild(label);
    });

    row.appendChild(group);
    return row;
  }

  function createOpenAllSettingsRow() {
    const row = createSettingsRow("Открыть весь блок");

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Настроить";
    styleUiAction(button, "outline", "sm");
    button.addEventListener("click", openOpenAllSettingsView);

    row.appendChild(button);
    return row;
  }

  function createCollapsedSectionsSettingsRow() {
    const row = createSettingsRow("Состояние блоков");

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Настроить";
    styleUiAction(button, "outline", "sm");
    button.addEventListener("click", openCollapsedSectionsSettingsView);

    row.appendChild(button);
    return row;
  }

  function createLinksEditorSettingsRow() {
    const row = createSettingsRow("Редактор ссылок");

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Редактировать";
    styleUiAction(button, "outline", "sm");
    button.addEventListener("click", openLinksEditorView);

    row.appendChild(button);
    return row;
  }

  function createSettingsRow(titleText) {
    const row = document.createElement("div");
    row.className = "b24ql-settings-row";

    const title = document.createElement("span");
    title.className = "b24ql-settings-row-title";
    title.textContent = titleText;

    row.appendChild(title);
    return row;
  }

  function createSettingsSwitch(checked, labelText, caption, onChange) {
    const label = document.createElement("label");
    label.className = "b24ql-switch-option";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.setAttribute("role", "switch");
    input.setAttribute("aria-label", labelText);
    input.checked = checked;
    input.addEventListener("change", function () {
      onChange(input.checked);
    });
    const track = document.createElement("span");
    track.className = "b24ql-switch-track";
    track.setAttribute("aria-hidden", "true");
    const text = document.createElement("span");
    text.className = "b24ql-switch-caption";
    text.textContent = caption;
    label.append(input, track, text);
    return label;
  }

  function styleUiAction(button, variant, size) {
    button.className = "b24ql-ui-action ui-btn ui-btn-" + size +
      " ui-btn-no-caps ui-btn-" + (variant === "primary" ? "primary" : variant === "danger" ? "danger" : "light-border");
    const text = document.createElement("span");
    text.className = "ui-btn-text";
    const inner = document.createElement("span");
    inner.className = "ui-btn-text-inner";
    inner.textContent = button.textContent;
    text.appendChild(inner);
    button.replaceChildren(text);
  }

  function setUiActionText(button, value) {
    const inner = button.querySelector(".ui-btn-text-inner");
    if (inner) {
      inner.textContent = value;
    } else {
      button.textContent = value;
    }
  }

  /* Собственное подтверждение работает одинаково во всех браузерах и не зависит от window.confirm. */
  function requestConfirmation(message) {
    return new Promise(function (resolve) {
      const modal = ensureModal();
      const previousDialog = document.getElementById(CONFIRM_MODAL_ID);
      if (previousDialog) {
        previousDialog.remove();
      }

      const overlay = document.createElement("div");
      overlay.id = CONFIRM_MODAL_ID;
      overlay.className = "b24ql-confirm-modal";
      overlay.setAttribute("role", "alertdialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.setAttribute("aria-labelledby", "b24ql-confirm-message");

      const panel = document.createElement("div");
      panel.className = "b24ql-confirm-panel";

      const text = document.createElement("p");
      text.id = "b24ql-confirm-message";
      text.className = "b24ql-confirm-message";
      text.textContent = message;

      const actions = document.createElement("div");
      actions.className = "b24ql-confirm-actions";

      const cancelButton = document.createElement("button");
      cancelButton.type = "button";
      cancelButton.textContent = "Отмена";
      styleUiAction(cancelButton, "outline", "md");

      const confirmButton = document.createElement("button");
      confirmButton.type = "button";
      confirmButton.textContent = "Продолжить";
      styleUiAction(confirmButton, "primary", "md");

      let completed = false;
      const finish = function (confirmed) {
        if (completed) {
          return;
        }

        completed = true;
        document.removeEventListener("keydown", handleKeyDown, true);
        overlay.remove();
        resolve(confirmed);
      };

      const header = document.createElement("header");
      header.className = "b24ql-confirm-header";
      const title = document.createElement("h2");
      title.textContent = "Подтверждение";
      const closeButton = document.createElement("button");
      closeButton.type = "button";
      closeButton.className = "b24ql-close ui-btn ui-btn-light-border ui-btn-xs";
      closeButton.setAttribute("aria-label", "Закрыть без изменений");
      closeButton.innerHTML = '<svg class="b24ql-close-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"></path></svg>';
      closeButton.addEventListener("click", function () { finish(false); });
      header.append(title, closeButton);

      const handleKeyDown = function (event) {
        if (event.key !== "Escape") {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        if (typeof event.stopImmediatePropagation === "function") {
          event.stopImmediatePropagation();
        }
        finish(false);
      };

      cancelButton.addEventListener("click", function () {
        finish(false);
      });
      confirmButton.addEventListener("click", function () {
        finish(true);
      });
      overlay.addEventListener("click", function (event) {
        if (event.target === overlay) {
          finish(false);
        }
      });

      actions.appendChild(cancelButton);
      actions.appendChild(confirmButton);
      panel.appendChild(header);
      panel.appendChild(text);
      panel.appendChild(actions);
      overlay.appendChild(panel);
      modal.appendChild(overlay);
      document.addEventListener("keydown", handleKeyDown, true);
      confirmButton.focus();
    });
  }

  function openSettingsModal() {
    const modal = ensureModal();
    const settingsModal = modal.querySelector("#" + SETTINGS_MODAL_ID);
    if (!settingsModal) {
      return;
    }

    showSettingsMainView();
    renderCollapsedSectionsSettingsList();
    renderOpenAllSettingsList();
    renderLinksEditor();
    updateThemeControls(settingsModal);
    settingsModal.classList.remove("b24ql-hidden");
  }

  async function closeSettingsModal(forceClose) {
    const settingsModal = document.getElementById(SETTINGS_MODAL_ID);
    if (settingsModal) {
      const linkEditorView = settingsModal.querySelector(".b24ql-links-editor-view");
      const isEditorVisible = linkEditorView && !linkEditorView.classList.contains("b24ql-hidden");
      if (!forceClose && linksEditorDirty && isEditorVisible &&
        !await requestConfirmation("В редакторе есть несохраненные изменения. Закрыть без сохранения?")) {
        return false;
      }

      if (linksEditorDirty) {
        resetLinksEditorDraft();
      }

      settingsModal.classList.add("b24ql-hidden");
      showSettingsMainView();
    }

    return true;
  }

  function isSettingsModalOpen() {
    const settingsModal = document.getElementById(SETTINGS_MODAL_ID);
    return Boolean(settingsModal && !settingsModal.classList.contains("b24ql-hidden"));
  }

  function showSettingsMainView() {
    const settingsModal = document.getElementById(SETTINGS_MODAL_ID);
    if (!settingsModal) {
      return;
    }

    settingsModal.classList.remove("b24ql-settings-editor-active");

    const mainView = settingsModal.querySelector(".b24ql-settings-main-view");
    const openAllView = settingsModal.querySelector(".b24ql-open-all-view");
    const collapsedView = settingsModal.querySelector(".b24ql-collapsed-sections-view");
    const linkEditorView = settingsModal.querySelector(".b24ql-links-editor-view");
    if (mainView) {
      mainView.classList.remove("b24ql-hidden");
    }
    if (openAllView) {
      openAllView.classList.add("b24ql-hidden");
    }
    if (collapsedView) {
      collapsedView.classList.add("b24ql-hidden");
    }
    if (linkEditorView) {
      linkEditorView.classList.add("b24ql-hidden");
    }
  }

  function openOpenAllSettingsView() {
    const settingsModal = document.getElementById(SETTINGS_MODAL_ID);
    if (!settingsModal) {
      return;
    }

    settingsModal.classList.remove("b24ql-settings-editor-active");

    const mainView = settingsModal.querySelector(".b24ql-settings-main-view");
    const openAllView = settingsModal.querySelector(".b24ql-open-all-view");
    const collapsedView = settingsModal.querySelector(".b24ql-collapsed-sections-view");
    const linkEditorView = settingsModal.querySelector(".b24ql-links-editor-view");
    if (mainView) {
      mainView.classList.add("b24ql-hidden");
    }
    if (openAllView) {
      openAllView.classList.remove("b24ql-hidden");
    }
    if (collapsedView) {
      collapsedView.classList.add("b24ql-hidden");
    }
    if (linkEditorView) {
      linkEditorView.classList.add("b24ql-hidden");
    }
    renderOpenAllSettingsList();
  }

  function openCollapsedSectionsSettingsView() {
    const settingsModal = document.getElementById(SETTINGS_MODAL_ID);
    if (!settingsModal) {
      return;
    }

    settingsModal.classList.remove("b24ql-settings-editor-active");

    const mainView = settingsModal.querySelector(".b24ql-settings-main-view");
    const openAllView = settingsModal.querySelector(".b24ql-open-all-view");
    const collapsedView = settingsModal.querySelector(".b24ql-collapsed-sections-view");
    const linkEditorView = settingsModal.querySelector(".b24ql-links-editor-view");
    if (mainView) {
      mainView.classList.add("b24ql-hidden");
    }
    if (openAllView) {
      openAllView.classList.add("b24ql-hidden");
    }
    if (collapsedView) {
      collapsedView.classList.remove("b24ql-hidden");
    }
    if (linkEditorView) {
      linkEditorView.classList.add("b24ql-hidden");
    }
    renderCollapsedSectionsSettingsList();
  }

  function openLinksEditorView() {
    const settingsModal = document.getElementById(SETTINGS_MODAL_ID);
    if (!settingsModal) {
      return;
    }

    settingsModal.classList.add("b24ql-settings-editor-active");

    const mainView = settingsModal.querySelector(".b24ql-settings-main-view");
    const openAllView = settingsModal.querySelector(".b24ql-open-all-view");
    const collapsedView = settingsModal.querySelector(".b24ql-collapsed-sections-view");
    const linkEditorView = settingsModal.querySelector(".b24ql-links-editor-view");
    if (mainView) {
      mainView.classList.add("b24ql-hidden");
    }
    if (openAllView) {
      openAllView.classList.add("b24ql-hidden");
    }
    if (collapsedView) {
      collapsedView.classList.add("b24ql-hidden");
    }
    if (linkEditorView) {
      linkEditorView.classList.remove("b24ql-hidden");
    }

    resetLinksEditorDraft();
    linksEditorMode = "blocks";
    linksEditorSectionIndex = null;
    linksEditorPath = [];
    renderLinksEditor();
  }

  function renderCollapsedSectionsSettingsList() {
    const list = document.getElementById("b24ql-collapsed-sections-settings-list");
    if (!list) {
      return;
    }

    list.replaceChildren();
    sections.map(function (section) {
      return section.title;
    }).forEach(function (sectionTitle) {
      const row = createSettingsRow(sectionTitle);
      row.classList.add("b24ql-collapsed-sections-settings-row");
      row.appendChild(createCollapsedSectionChoiceGroup(sectionTitle));
      list.appendChild(row);
    });
  }

  function createCollapsedSectionChoiceGroup(sectionTitle) {
    return createSettingsSwitch(
      isSectionCollapsed(sectionTitle),
      "Свернут по умолчанию: " + sectionTitle,
      "Свернут",
      function (checked) { setSectionCollapsed(sectionTitle, checked); }
    );
  }

  function isSectionCollapsed(sectionTitle) {
    return collapsedSections[sectionTitle] === true;
  }

  function setSectionCollapsed(sectionTitle, collapsed) {
    setSectionCollapsedState(sectionTitle, collapsed);
    sessionCollapsedSections[sectionTitle] = collapsed;
    saveCollapsedSections();
    refreshMainContent();
    renderCollapsedSectionsSettingsList();
  }

  function renderOpenAllSettingsList() {
    const list = document.getElementById("b24ql-open-all-settings-list");
    if (!list) {
      return;
    }

    list.replaceChildren();
    sections.filter(function (section) {
      return collectDirectLinks(section.links, []).length > 0;
    }).forEach(function (section) {
      const row = createSettingsRow(section.title);
      row.classList.add("b24ql-open-all-settings-row");
      row.appendChild(createOpenAllChoiceGroup(section.title));
      list.appendChild(row);
    });
  }

  function createOpenAllChoiceGroup(sectionTitle) {
    return createSettingsSwitch(
      isOpenAllEnabled(sectionTitle),
      "Открыть весь блок: " + sectionTitle,
      "Открыть всё",
      function (checked) { setOpenAllEnabled(sectionTitle, checked); }
    );
  }

  /* Редактор ссылок работает с черновиком: изменения применяются только по кнопке "Сохранить". */
  function resetLinksEditorDraft() {
    linksEditorDraftSections = cloneJson(sections);
    linksEditorDraftCollapsedSections = Object.assign({}, collapsedSections);
    linksEditorDraftOpenAllSections = Object.assign({}, openAllSections);
    linksEditorDraftFavoriteLinkIds = favoriteLinkIds.slice();
    linksEditorDirty = false;
    updateLinksEditorSaveState();
  }

  function ensureLinksEditorDraft() {
    if (!linksEditorDraftSections) {
      resetLinksEditorDraft();
    }
  }

  function getEditorSections() {
    ensureLinksEditorDraft();
    return linksEditorDraftSections;
  }

  function markLinksEditorDirty() {
    linksEditorDirty = true;
    updateLinksEditorSaveState();
  }

  function updateLinksEditorSaveState() {
    const saveButton = document.getElementById("b24ql-links-editor-save");
    const cancelButton = document.getElementById("b24ql-links-editor-cancel");
    if (saveButton) {
      saveButton.disabled = !linksEditorDirty;
    }
    if (cancelButton) {
      cancelButton.disabled = !linksEditorDirty;
    }
  }

  function saveLinksEditorDraft() {
    ensureLinksEditorDraft();
    sections = sanitizeSections(linksEditorDraftSections);
    replaceObjectContents(
      collapsedSections,
      getBooleanSettingsForSections(
        linksEditorDraftCollapsedSections,
        DEFAULT_COLLAPSED_SECTIONS
      )
    );
    replaceObjectContents(sessionCollapsedSections, collapsedSections);
    replaceObjectContents(
      openAllSections,
      getBooleanSettingsForSections(linksEditorDraftOpenAllSections, DEFAULT_OPEN_ALL_SECTIONS)
    );
    favoriteLinkIds = (linksEditorDraftFavoriteLinkIds || []).filter(function (id) {
      return Boolean(findLinkEntryById(id));
    });

    saveSectionsConfig();
    saveCollapsedSections();
    saveOpenAllSections();
    saveFavoriteLinkIds();
    resetLinksEditorDraft();
    refreshMainContent();
    refreshSettingsLists();
  }

  async function cancelLinksEditorDraft() {
    if (linksEditorDirty && !await requestConfirmation("Отменить изменения в редакторе ссылок?")) {
      return;
    }

    resetLinksEditorDraft();
    linksEditorMode = "blocks";
    linksEditorSectionIndex = null;
    linksEditorPath = [];
    renderLinksEditor();
  }

  async function resetLinksEditorDraftToSettingsFile() {
    if (!await requestConfirmation("Сбросить редактор к структуре из settings.js? Несохраненные изменения будут заменены.")) {
      return;
    }

    linksEditorDraftSections = cloneJson(DEFAULT_SECTIONS);
    linksEditorDraftCollapsedSections = Object.assign({}, DEFAULT_COLLAPSED_SECTIONS);
    linksEditorDraftOpenAllSections = Object.assign({}, DEFAULT_OPEN_ALL_SECTIONS);
    linksEditorDraftFavoriteLinkIds = [];
    linksEditorMode = "blocks";
    linksEditorSectionIndex = null;
    linksEditorPath = [];
    markLinksEditorDirty();
    renderLinksEditor();
  }

  function getBooleanSettingsForSections(source, defaultMap, extraSectionTitles) {
    const result = {};
    const sourceMap = source && typeof source === "object" && !Array.isArray(source) ? source : {};
    const sectionTitles = getEditorSections().map(function (section) {
      return section.title;
    }).concat(Array.isArray(extraSectionTitles) ? extraSectionTitles : []);

    sectionTitles.forEach(function (sectionTitle) {
      const value = sourceMap[sectionTitle];
      if (typeof value === "boolean" && (value === true || defaultMap[sectionTitle])) {
        result[sectionTitle] = value;
      }
    });

    return result;
  }

  function moveDraftSectionState(oldTitle, newTitle) {
    if (oldTitle === newTitle) {
      return;
    }

    if (Object.prototype.hasOwnProperty.call(linksEditorDraftOpenAllSections, oldTitle)) {
      linksEditorDraftOpenAllSections[newTitle] = linksEditorDraftOpenAllSections[oldTitle];
      delete linksEditorDraftOpenAllSections[oldTitle];
    }

    if (Object.prototype.hasOwnProperty.call(linksEditorDraftCollapsedSections, oldTitle)) {
      linksEditorDraftCollapsedSections[newTitle] = linksEditorDraftCollapsedSections[oldTitle];
      delete linksEditorDraftCollapsedSections[oldTitle];
    }
  }

  function deleteDraftSectionState(sectionTitle) {
    delete linksEditorDraftOpenAllSections[sectionTitle];
    delete linksEditorDraftCollapsedSections[sectionTitle];
  }

  function renderLinksEditor() {
    const settingsModal = document.getElementById(SETTINGS_MODAL_ID);
    if (!settingsModal) {
      return;
    }

    ensureLinksEditorDraft();
    const title = settingsModal.querySelector("#b24ql-links-editor-title");
    const addButton = settingsModal.querySelector("#b24ql-links-editor-add");
    const addGroupButton = settingsModal.querySelector("#b24ql-links-editor-add-group");
    const list = settingsModal.querySelector("#b24ql-links-editor-list");
    const context = getLinksEditorContext();
    if (!title || !addButton || !addGroupButton || !list || !context) {
      return;
    }

    title.textContent = context.title;
    addButton.textContent = context.type === "blocks" ? "Добавить блок" : "Добавить кнопку";
    addGroupButton.classList.toggle("b24ql-hidden", context.type === "blocks");
    list.replaceChildren();

    if (context.type === "blocks") {
      if (context.list.length === 0) {
        list.appendChild(createEditorEmpty("Блоков пока нет"));
        updateLinksEditorSaveState();
        return;
      }

      context.list.forEach(function (section, index) {
        list.appendChild(createEditorBlockRow(section, index));
      });
      updateLinksEditorSaveState();
      return;
    }

    if (context.list.length === 0) {
      list.appendChild(createEditorEmpty("Кнопок пока нет"));
      updateLinksEditorSaveState();
      return;
    }

    context.list.forEach(function (link, index) {
      list.appendChild(createEditorLinkRow(link, index, context.list));
    });
    updateLinksEditorSaveState();
  }

  function getLinksEditorContext() {
    const editorSections = getEditorSections();
    if (linksEditorMode === "blocks") {
      return {
        type: "blocks",
        title: "Редактор ссылок",
        list: editorSections
      };
    }

    const section = editorSections[linksEditorSectionIndex];
    if (!section) {
      linksEditorMode = "blocks";
      linksEditorSectionIndex = null;
      linksEditorPath = [];
      return getLinksEditorContext();
    }

    let currentTitle = section.title;
    let currentList = section.links;
    for (const linkIndex of linksEditorPath) {
      const group = currentList[linkIndex];
      if (!group || !Array.isArray(group.links)) {
        linksEditorPath = [];
        currentTitle = section.title;
        currentList = section.links;
        break;
      }

      currentTitle = group.title;
      currentList = group.links;
    }

    return {
      type: "links",
      title: "Кнопки: " + currentTitle,
      list: currentList,
      section: section
    };
  }

  function createEditorBlockRow(section, index) {
    const row = createEditorRow();
    const fields = document.createElement("div");
    fields.className = "b24ql-editor-fields";

    const titleInput = createEditorInput("Название блока", section.title);
    titleInput.addEventListener("change", function () {
      const oldTitle = section.title;
      const newTitle = getInputValue(titleInput, oldTitle);
      if (newTitle === oldTitle) {
        return;
      }

      section.title = newTitle;
      moveDraftSectionState(oldTitle, newTitle);
      markLinksEditorDirty();
      renderLinksEditor();
    });

    fields.appendChild(titleInput.parentElement);

    const actions = createEditorActions();
    actions.appendChild(createEditorSmallButton("Настроить", function () {
      linksEditorMode = "links";
      linksEditorSectionIndex = index;
      linksEditorPath = [];
      renderLinksEditor();
    }));
    actions.appendChild(createMoveButton("Вверх", getEditorSections(), index, -1));
    actions.appendChild(createMoveButton("Вниз", getEditorSections(), index, 1));
    actions.appendChild(createEditorSmallButton("Удалить", async function () {
      if (!await requestConfirmation("Удалить блок \"" + section.title + "\"?")) {
        return;
      }

      deleteDraftSectionState(section.title);
      getEditorSections().splice(index, 1);
      markLinksEditorDirty();
      renderLinksEditor();
    }, "b24ql-editor-danger"));

    row.appendChild(fields);
    row.appendChild(actions);
    return row;
  }

  function createEditorLinkRow(link, index, list) {
    const row = createEditorRow();
    const fields = document.createElement("div");
    fields.className = "b24ql-editor-fields";

    const titleInput = createEditorInput("Название кнопки", link.title);
    titleInput.addEventListener("change", function () {
      link.title = getInputValue(titleInput, link.title);
      markLinksEditorDirty();
    });
    fields.appendChild(titleInput.parentElement);

    if (Array.isArray(link.links)) {
      const nestedLabel = document.createElement("span");
      nestedLabel.className = "b24ql-editor-meta ui-label ui-label-light ui-label-sm";
      const nestedText = document.createElement("span");
      nestedText.className = "ui-label-inner";
      nestedText.textContent = "Вложенное окно";
      nestedLabel.appendChild(nestedText);
      fields.appendChild(nestedLabel);
    } else if (link.template) {
      const urlInput = createEditorInput("Шаблон ссылки", link.template.url || "");
      urlInput.addEventListener("change", function () {
        link.template.url = getInputValue(urlInput, link.template.url);
        markLinksEditorDirty();
      });
      fields.appendChild(urlInput.parentElement);
    } else {
      const urlInput = createEditorInput("Ссылка", link.url || "");
      urlInput.addEventListener("change", function () {
        link.url = getInputValue(urlInput, link.url || "https://" + PRODUCTION_PORTAL_HOST + "/");
        markLinksEditorDirty();
      });
      fields.appendChild(urlInput.parentElement);
    }

    const keywordsInput = createEditorInput("Ключевые слова через запятую", (link.keywords || []).join(", "));
    keywordsInput.parentElement.classList.add("b24ql-editor-keywords");
    keywordsInput.addEventListener("change", function () {
      link.keywords = sanitizeKeywords(keywordsInput.value);
      keywordsInput.value = link.keywords.join(", ");
      markLinksEditorDirty();
    });
    fields.appendChild(keywordsInput.parentElement);

    const actions = createEditorActions();
    if (Array.isArray(link.links)) {
      actions.appendChild(createEditorSmallButton("Открыть", function () {
        linksEditorPath = linksEditorPath.concat(index);
        renderLinksEditor();
      }));
    } else {
      actions.appendChild(createEditorSmallButton("Сделать окном", async function () {
        if (!await requestConfirmation("Заменить ссылку \"" + link.title + "\" на вложенное окно?")) {
          return;
        }

        delete link.url;
        delete link.template;
        link.links = [];
        markLinksEditorDirty();
        renderLinksEditor();
      }));
    }
    actions.appendChild(createMoveButton("Вверх", list, index, -1));
    actions.appendChild(createMoveButton("Вниз", list, index, 1));
    actions.appendChild(createEditorSmallButton("Удалить", async function () {
      if (!await requestConfirmation("Удалить кнопку \"" + link.title + "\"?")) {
        return;
      }

      list.splice(index, 1);
      markLinksEditorDirty();
      renderLinksEditor();
    }, "b24ql-editor-danger"));

    row.appendChild(fields);
    row.appendChild(actions);
    return row;
  }

  function createEditorRow() {
    const row = document.createElement("div");
    row.className = "b24ql-editor-row";
    return row;
  }

  function createEditorActions() {
    const actions = document.createElement("div");
    actions.className = "b24ql-editor-row-actions";
    return actions;
  }

  function createEditorInput(label, value) {
    const input = document.createElement("input");
    input.className = "b24ql-editor-input ui-ctl-element";
    input.type = "text";
    input.value = value || "";
    input.placeholder = label;
    input.setAttribute("aria-label", label);
    const control = document.createElement("div");
    control.className = "b24ql-editor-control ui-ctl ui-ctl-textbox ui-ctl-w100 ui-ctl-sm";
    control.appendChild(input);
    return input;
  }

  function createEditorSmallButton(text, onClick, extraClassName) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text;
    styleUiAction(button, extraClassName === "b24ql-editor-danger" ? "danger" : "outline", "sm");
    button.classList.add("b24ql-editor-small-button");
    if (extraClassName) {
      button.classList.add(extraClassName);
    }
    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      onClick(event);
    });
    return button;
  }

  function createMoveButton(text, list, index, direction) {
    const button = createEditorSmallButton(text, function () {
      moveEditorItem(list, index, index + direction);
    });
    const targetIndex = index + direction;
    button.disabled = targetIndex < 0 || targetIndex >= list.length;
    return button;
  }

  function createEditorEmpty(text) {
    const empty = document.createElement("div");
    empty.className = "b24ql-empty ui-alert ui-alert-default";
    const message = document.createElement("span");
    message.className = "ui-alert-message";
    message.textContent = text;
    empty.appendChild(message);
    return empty;
  }

  function getInputValue(input, fallback) {
    const value = input.value.replace(/\s+/g, " ").trim();
    if (value) {
      input.value = value;
      return value;
    }

    input.value = fallback;
    return fallback;
  }

  function moveEditorItem(list, fromIndex, toIndex) {
    if (toIndex < 0 || toIndex >= list.length || fromIndex === toIndex) {
      return;
    }

    const movedItems = list.splice(fromIndex, 1);
    list.splice(toIndex, 0, movedItems[0]);
    markLinksEditorDirty();
    renderLinksEditor();
  }

  function handleLinksEditorAdd() {
    const context = getLinksEditorContext();
    if (!context) {
      return;
    }

    if (context.type === "blocks") {
      getEditorSections().push({
        title: getUniqueSectionTitle("Новый блок"),
        links: []
      });
      markLinksEditorDirty();
      renderLinksEditor();
      return;
    }

    context.list.push({
      id: createLinkId(),
      title: "Новая кнопка",
      url: "https://" + PRODUCTION_PORTAL_HOST + "/"
    });
    markLinksEditorDirty();
    renderLinksEditor();
  }

  function handleLinksEditorAddGroup() {
    const context = getLinksEditorContext();
    if (!context || context.type !== "links") {
      return;
    }

    context.list.push({
      id: createLinkId(),
      title: getUniqueLinkTitle("Новое окно", context.list),
      links: []
    });
    markLinksEditorDirty();
    renderLinksEditor();
  }

  async function handleLinksEditorBack() {
    if (linksEditorMode === "blocks") {
      if (linksEditorDirty && !await requestConfirmation("В редакторе есть несохраненные изменения. Выйти без сохранения?")) {
        return;
      }
      resetLinksEditorDraft();
      showSettingsMainView();
      return;
    }

    if (linksEditorPath.length > 0) {
      linksEditorPath = linksEditorPath.slice(0, -1);
      renderLinksEditor();
      return;
    }

    linksEditorMode = "blocks";
    linksEditorSectionIndex = null;
    renderLinksEditor();
  }

  function getUniqueSectionTitle(baseTitle) {
    const existingTitles = new Set(getEditorSections().map(function (section) {
      return normalizeSearchValue(section.title);
    }));
    let title = baseTitle;
    let counter = 2;

    while (existingTitles.has(normalizeSearchValue(title))) {
      title = baseTitle + " " + counter;
      counter += 1;
    }

    return title;
  }

  function getUniqueLinkTitle(baseTitle, list) {
    const existingTitles = new Set(list.map(function (link) {
      return normalizeSearchValue(link.title);
    }));
    let title = baseTitle;
    let counter = 2;

    while (existingTitles.has(normalizeSearchValue(title))) {
      title = baseTitle + " " + counter;
      counter += 1;
    }

    return title;
  }

  function exportLinksSettingsJson() {
    const exportSections = linksEditorDraftSections || sections;
    const payload = {
      version: CONFIG_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      portalHosts: PORTAL_HOSTS,
      defaultPortalHost: PRODUCTION_PORTAL_HOST,
      collapsedSections: getCurrentCollapsedSectionsExport(),
      openAllSections: getCurrentOpenAllSectionsExport(),
      favoriteLinkIds: (linksEditorDraftFavoriteLinkIds || favoriteLinkIds).slice(),
      sections: sanitizeSections(exportSections)
    };
    const fileName = "b24-quick-links-settings-" + new Date().toISOString().slice(0, 10) + ".json";
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  function importLinksSettingsJson(event) {
    const input = event.target;
    const file = input && input.files ? input.files[0] : null;
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", async function () {
      try {
        const payload = JSON.parse(String(reader.result || ""));
        if (await importLinksSettingsPayload(payload)) {
          showLinksEditorNotice("Настройки загружены в черновик. Нажмите \"Сохранить\", чтобы применить их.");
        }
      } catch (error) {
        showLinksEditorNotice("Не удалось импортировать JSON: " + error.message, true);
      } finally {
        input.value = "";
      }
    });
    reader.addEventListener("error", function () {
      showLinksEditorNotice("Не удалось прочитать файл", true);
      input.value = "";
    });
    reader.readAsText(file);
  }

  function showLinksEditorNotice(message, isError) {
    const notice = document.getElementById("b24ql-links-editor-notice");
    if (!notice) {
      return;
    }

    if (linksEditorNoticeTimer) {
      window.clearTimeout(linksEditorNoticeTimer);
    }

    notice.querySelector(".ui-alert-message").textContent = message;
    notice.classList.toggle("b24ql-editor-notice-error", Boolean(isError));
    notice.classList.toggle("ui-alert-danger", Boolean(isError));
    notice.classList.toggle("ui-alert-default", !isError);
    notice.classList.remove("b24ql-hidden");
    linksEditorNoticeTimer = window.setTimeout(function () {
      notice.classList.add("b24ql-hidden");
      linksEditorNoticeTimer = null;
    }, 6000);
  }

  async function importLinksSettingsPayload(payload) {
    const rawSections = Array.isArray(payload) ? payload : payload && payload.sections;
    if (!Array.isArray(rawSections)) {
      throw new Error("в файле нет массива sections");
    }

    const importedSections = sanitizeSections(rawSections);
    const importedVersion = payload && !Array.isArray(payload) ? Number(payload.version) || 0 : 0;
    if (importedVersion < CONFIG_SCHEMA_VERSION) {
      addMissingDefaultTemplateLinks(importedSections);
      mergeDefaultLinkMetadata(importedSections);
    }
    if (importedSections.length === 0) {
      throw new Error("в файле нет подходящих блоков");
    }

    if (!await requestConfirmation("Импорт заменит текущий черновик редактора ссылок. Продолжить?")) {
      return false;
    }

    linksEditorDraftSections = importedSections;
    linksEditorDraftCollapsedSections = getImportedBooleanSettings(
      payload && payload.collapsedSections,
      DEFAULT_COLLAPSED_SECTIONS,
      importedSections
    );
    linksEditorDraftOpenAllSections = getImportedBooleanSettings(
      payload && payload.openAllSections,
      DEFAULT_OPEN_ALL_SECTIONS,
      importedSections
    );
    const importedLinkIds = collectLinkIds(importedSections, new Set());
    linksEditorDraftFavoriteLinkIds = Array.isArray(payload && payload.favoriteLinkIds)
      ? payload.favoriteLinkIds.filter(function (id) {
        return typeof id === "string" && importedLinkIds.has(id);
      })
      : [];
    linksEditorMode = "blocks";
    linksEditorSectionIndex = null;
    linksEditorPath = [];
    markLinksEditorDirty();
    renderLinksEditor();
    return true;
  }

  function collectLinkIds(sectionList, result) {
    (sectionList || []).forEach(function (section) {
      collectLinkIdsFromList(section.links || [], result);
    });
    return result;
  }

  function collectLinkIdsFromList(links, result) {
    links.forEach(function (link) {
      if (link.id) {
        result.add(link.id);
      }
      if (Array.isArray(link.links)) {
        collectLinkIdsFromList(link.links, result);
      }
    });
  }

  function getImportedBooleanSettings(importedMap, defaultMap, targetSections) {
    const source = importedMap && typeof importedMap === "object" && !Array.isArray(importedMap)
      ? importedMap
      : {};
    const result = {};

    targetSections.forEach(function (section) {
      if (Object.prototype.hasOwnProperty.call(source, section.title) && typeof source[section.title] === "boolean") {
        if (source[section.title] === true || defaultMap[section.title]) {
          result[section.title] = source[section.title] === true;
        }
        return;
      }

      if (defaultMap[section.title]) {
        result[section.title] = true;
      }
    });

    return result;
  }

  function getCurrentCollapsedSectionsExport() {
    const result = {};
    const exportSections = linksEditorDraftSections || sections;
    const exportCollapsedSections = linksEditorDraftCollapsedSections || collapsedSections;
    exportSections.forEach(function (section) {
      result[section.title] = exportCollapsedSections[section.title] === true;
    });
    return result;
  }

  function getCurrentOpenAllSectionsExport() {
    const result = {};
    const exportSections = linksEditorDraftSections || sections;
    const exportOpenAllSections = linksEditorDraftOpenAllSections || openAllSections;
    exportSections.forEach(function (section) {
      result[section.title] = exportOpenAllSections[section.title] === true;
    });
    return result;
  }

  function createSearchBox(inputId, placeholder, onInput) {
    const wrap = document.createElement("div");
    wrap.className = "b24ql-search ui-ctl ui-ctl-textbox ui-ctl-w100 ui-ctl-before-icon ui-ctl-after-icon";

    const icon = document.createElement("span");
    icon.className = "b24ql-search-icon ui-ctl-before ui-ctl-icon-search";
    icon.setAttribute("aria-hidden", "true");

    const input = document.createElement("input");
    input.id = inputId;
    input.className = "b24ql-search-input ui-ctl-element";
    input.type = "search";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.placeholder = placeholder;
    input.setAttribute("aria-label", placeholder);
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-autocomplete", "list");

    const clearButton = document.createElement("button");
    clearButton.type = "button";
    clearButton.className = "b24ql-search-clear ui-ctl-after ui-ctl-icon-clear b24ql-hidden";
    clearButton.setAttribute("aria-label", "Очистить поиск");

    input.addEventListener("input", function () {
      clearButton.classList.toggle("b24ql-hidden", input.value.length === 0);
      onInput(input.value);
    });
    input.addEventListener("keydown", function (event) {
      handleSearchInputKeydown(event, input);
    });

    clearButton.addEventListener("click", function () {
      input.value = "";
      clearButton.classList.add("b24ql-hidden");
      onInput("");
      input.focus();
    });

    wrap.appendChild(icon);
    wrap.appendChild(input);
    wrap.appendChild(clearButton);
    return wrap;
  }

  function createCounter(value) {
    const count = document.createElement("span");
    count.className = "b24ql-section-count ui-counter ui-counter-light";
    const inner = document.createElement("span");
    inner.className = "ui-counter-inner";
    inner.textContent = String(value);
    count.appendChild(inner);
    return count;
  }

  function setCounterValue(count, value) {
    const inner = count.querySelector(".ui-counter-inner");
    if (inner) {
      inner.textContent = String(value);
    }
  }

  function createFavoritesSection() {
    const sectionNode = document.createElement("section");
    sectionNode.className = "b24ql-section b24ql-favorites-section b24ql-hidden";

    const heading = document.createElement("div");
    heading.className = "b24ql-section-heading";

    const dot = document.createElement("span");
    dot.className = "b24ql-section-dot";
    dot.setAttribute("aria-hidden", "true");

    const title = document.createElement("h3");
    title.textContent = "Избранное";

    const count = createCounter(0);

    const grid = document.createElement("div");
    grid.className = "b24ql-link-grid";
    grid.id = "b24ql-favorites-grid";

    heading.appendChild(dot);
    heading.appendChild(title);
    heading.appendChild(count);
    sectionNode.appendChild(heading);
    sectionNode.appendChild(grid);
    return sectionNode;
  }

  function createSearchResultsSection() {
    const sectionNode = document.createElement("section");
    sectionNode.className = "b24ql-section b24ql-search-results b24ql-hidden";

    const heading = document.createElement("div");
    heading.className = "b24ql-section-heading";

    const dot = document.createElement("span");
    dot.className = "b24ql-section-dot";
    dot.setAttribute("aria-hidden", "true");

    const title = document.createElement("h3");
    title.textContent = "Результаты поиска";

    const count = createCounter(0);

    const grid = document.createElement("div");
    grid.className = "b24ql-link-grid";
    grid.id = "b24ql-search-results-grid";

    heading.appendChild(dot);
    heading.appendChild(title);
    heading.appendChild(count);
    sectionNode.appendChild(heading);
    sectionNode.appendChild(grid);

    return sectionNode;
  }

  /* Кнопка "открыть весь блок" появляется только у включенных в настройках разделов. */
  function createOpenAllButton(section) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "b24ql-section-open-all ui-btn ui-btn-xs ui-btn-light-border";
    button.dataset.sectionTitle = section.title;
    button.dataset.openAllAvailable = collectDirectLinks(section.links, []).length > 0 ? "true" : "false";
    button.title = "Открыть все ссылки блока";
    button.setAttribute("aria-label", "Открыть все ссылки блока " + section.title);
    button.innerHTML = [
      '<svg class="b24ql-section-open-all-icon" viewBox="0 0 24 24" aria-hidden="true">',
      '<path d="M5 7h7M5 12h7M5 17h7"></path>',
      '<path d="M15 7l4 5-4 5"></path>',
      "</svg>"
    ].join("");
    button.classList.toggle(
      "b24ql-hidden",
      button.dataset.openAllAvailable !== "true" || !isOpenAllEnabled(section.title)
    );
    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      openAllLinksInSection(section);
    });
    return button;
  }

  function isOpenAllEnabled(sectionTitle) {
    return openAllSections[sectionTitle] === true;
  }

  function setOpenAllEnabled(sectionTitle, enabled) {
    if (enabled) {
      openAllSections[sectionTitle] = true;
    } else if (DEFAULT_OPEN_ALL_SECTIONS[sectionTitle]) {
      openAllSections[sectionTitle] = false;
    } else {
      delete openAllSections[sectionTitle];
    }

    saveOpenAllSections();
    updateOpenAllButtons();
    renderOpenAllSettingsList();
  }

  function updateOpenAllButtons(root) {
    const scope = root || document;
    Array.from(scope.querySelectorAll(".b24ql-section-open-all")).forEach(function (button) {
      button.classList.toggle(
        "b24ql-hidden",
        button.dataset.openAllAvailable !== "true" || !isOpenAllEnabled(button.dataset.sectionTitle)
      );
    });
  }

  function collectDirectLinks(links, result) {
    links.forEach(function (link) {
      if (Array.isArray(link.links)) {
        collectDirectLinks(link.links, result);
        return;
      }

      if (link.url) {
        result.push(link);
      }
    });

    return result;
  }

  function openAllLinksInSection(section) {
    const urls = collectDirectLinks(section.links, []).map(function (link) {
      return getPortalUrl(link.url);
    });
    const browserRuntime = typeof browser !== "undefined" && browser.runtime &&
      typeof browser.runtime.sendMessage === "function"
      ? browser.runtime
      : null;
    const chromeRuntime = typeof chrome !== "undefined" && chrome.runtime &&
      typeof chrome.runtime.sendMessage === "function"
      ? chrome.runtime
      : null;
    const runtimeApi = browserRuntime || chromeRuntime;
    if (runtimeApi) {
      const message = { type: "b24ql-open-tabs", urls: urls };
      let handled = false;
      const finish = function (response) {
        if (handled) {
          return;
        }
        handled = true;
        const opened = response && Number.isInteger(response.count) ? response.count : 0;
        if (!response || response.ok !== true) {
          urls.slice(opened).forEach(function (url) {
            window.open(url, "_blank", "noopener,noreferrer");
          });
        }
      };
      try {
        const result = browserRuntime
          ? runtimeApi.sendMessage(message)
          : runtimeApi.sendMessage(message, finish);
        if (result && typeof result.then === "function") {
          result.then(finish, function () { finish(null); });
        }
      } catch (error) {
        finish(null);
      }
    } else {
      urls.forEach(function (url) {
        window.open(url, "_blank", "noopener,noreferrer");
      });
    }
    closeModal();
  }

  /* Блок внутри основного окна: заголовок, счетчик, сворачивание и сетка кнопок. */
  function createSection(section, index) {
    const sectionNode = document.createElement("section");
    sectionNode.className = "b24ql-section b24ql-source-section";
    sectionNode.dataset.totalCount = String(section.links.length);
    sectionNode.dataset.sectionTitle = section.title;
    sectionNode.dataset.sectionIndex = String(index);
    if (sessionCollapsedSections[section.title]) {
      sectionNode.classList.add("b24ql-section-collapsed");
    }

    const heading = document.createElement("div");
    heading.className = "b24ql-section-heading";

    const dot = document.createElement("span");
    dot.className = "b24ql-section-dot";
    dot.setAttribute("aria-hidden", "true");

    const title = document.createElement("h3");
    title.textContent = section.title;

    const openAllButton = createOpenAllButton(section);

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.className = "b24ql-section-toggle ui-btn ui-btn-xs ui-btn-light-border";
    toggleButton.innerHTML = '<span class="b24ql-section-toggle-icon" aria-hidden="true"></span>';

    const count = createCounter(section.links.length);

    heading.appendChild(dot);
    heading.appendChild(title);
    heading.appendChild(openAllButton);
    heading.appendChild(toggleButton);
    heading.appendChild(count);

    const grid = document.createElement("div");
    grid.className = "b24ql-link-grid";
    grid.id = "b24ql-section-links-" + index;
    toggleButton.setAttribute("aria-controls", grid.id);
    updateSectionToggle(toggleButton, section.title, sessionCollapsedSections[section.title]);
    toggleButton.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      toggleSection(sectionNode, toggleButton, section.title);
    });

    section.links.forEach(function (link) {
      grid.appendChild(createLinkItem(link));
    });

    sectionNode.appendChild(heading);
    sectionNode.appendChild(grid);
    return sectionNode;
  }

  function createLinkMeta(text) {
    const meta = document.createElement("span");
    meta.className = "b24ql-link-meta ui-label ui-label-light ui-label-xs";
    const inner = document.createElement("span");
    inner.className = "ui-label-inner";
    inner.textContent = text;
    meta.appendChild(inner);
    return meta;
  }

  /* Обычная ссылка или кнопка, которая открывает вложенное окно. */
  function createLinkItem(link, metaText) {
    if (Array.isArray(link.links)) {
      const isTemplateGroup = linkContainsOnlyTemplates(link);
      const item = document.createElement("button");
      item.type = "button";
      item.className = "b24ql-link b24ql-link-group ui-btn ui-btn-light ui-btn-no-caps" +
        (isTemplateGroup ? " b24ql-link-template-group" : "") +
        (metaText ? " b24ql-link-search-result" : "");
      item.setAttribute("aria-haspopup", "dialog");
      item.dataset.searchText = normalizeSearchValue([getLinkSearchText(link), metaText].filter(Boolean).join(" "));
      item.__b24qlLink = link;

      const textWrap = document.createElement("span");
      textWrap.className = "b24ql-link-text";

      const label = document.createElement("span");
      label.className = "b24ql-link-label";
      label.textContent = link.title;
      textWrap.appendChild(label);

      if (metaText) {
        textWrap.appendChild(createLinkMeta(metaText));
      }

      item.appendChild(textWrap);
      if (!isTemplateGroup) {
        const arrow = document.createElement("span");
        arrow.className = "b24ql-link-arrow";
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = "›";
        item.appendChild(arrow);
      }
      updateGroupActiveState(item, link);
      item.addEventListener("click", function () {
        openLinkGroup(link);
      });
      addMiddleClickHandlers(item, function () {
        openLinkGroup(link);
      });
      item.__b24qlActivate = function () {
        openLinkGroup(link);
      };
      return wrapLinkItem(item, link);
    }

    if (link.template) {
      return createTemplateLink(link, metaText);
    }

    return createDirectLink(link, metaText);
  }

  function createDirectLink(link, metaText) {
    const item = document.createElement("a");
    const targetUrl = getPortalUrl(link.url);
    item.href = targetUrl;
    item.className = "b24ql-link ui-btn ui-btn-light ui-btn-no-caps" +
      (metaText ? " b24ql-link-search-result" : "");
    item.dataset.url = targetUrl;
    item.dataset.searchText = normalizeSearchValue([getLinkSearchText(link), metaText].filter(Boolean).join(" "));
    item.__b24qlLink = link;

    const textWrap = document.createElement("span");
    textWrap.className = "b24ql-link-text";

    const label = document.createElement("span");
    label.className = "b24ql-link-label";
    label.textContent = link.title;
    textWrap.appendChild(label);

    if (metaText) {
      textWrap.appendChild(createLinkMeta(metaText));
    }

    item.appendChild(textWrap);

    updateDirectActiveState(item, targetUrl);
    item.addEventListener("click", function (event) {
      const opensInCurrentTab = event.button === 0 &&
        !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

      if (opensInCurrentTab) {
        event.preventDefault();
      }
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === "function") {
        event.stopImmediatePropagation();
      }
      if (opensInCurrentTab) {
        navigateDirectLinkInCurrentTab(targetUrl);
      }
    }, true);

    item.addEventListener("auxclick", function (event) {
      if (event.button !== 1) {
        return;
      }

      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === "function") {
        event.stopImmediatePropagation();
      }
    }, true);
    item.__b24qlActivate = function (openInNewTab) {
      if (openInNewTab) {
        openLinkInNewTab(targetUrl);
      } else {
        navigateDirectLinkInCurrentTab(targetUrl);
      }
    };
    return wrapLinkItem(item, link);
  }

  function createTemplateLink(link, metaText) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "b24ql-link b24ql-link-template ui-btn ui-btn-light ui-btn-no-caps" +
      (metaText ? " b24ql-link-search-result" : "");
    item.dataset.searchText = normalizeSearchValue([getLinkSearchText(link), metaText].filter(Boolean).join(" "));
    item.__b24qlLink = link;

    const textWrap = document.createElement("span");
    textWrap.className = "b24ql-link-text";

    const label = document.createElement("span");
    label.className = "b24ql-link-label";
    label.textContent = link.title;
    textWrap.appendChild(label);

    if (metaText) {
      textWrap.appendChild(createLinkMeta(metaText));
    }

    item.appendChild(textWrap);
    item.addEventListener("click", function () {
      openTemplateModal(link, true);
    });
    addMiddleClickHandlers(item, function () {
      openTemplateModal(link, true);
    });
    item.__b24qlActivate = function () {
      openTemplateModal(link, true);
    };
    return wrapLinkItem(item, link);
  }

  function wrapLinkItem(item, link) {
    const shell = document.createElement("div");
    shell.className = "b24ql-link-shell";
    searchOptionCounter += 1;
    item.id = "b24ql-search-option-" + searchOptionCounter;
    item.setAttribute("role", "option");
    shell.appendChild(item);

    if (!link || !link.id) {
      return shell;
    }

    const favoriteButton = document.createElement("button");
    favoriteButton.type = "button";
    favoriteButton.className = "b24ql-favorite-toggle ui-btn ui-btn-xs ui-btn-light-border";
    favoriteButton.dataset.favoriteId = link.id;
    favoriteButton.innerHTML = [
      '<svg viewBox="0 0 24 24" aria-hidden="true">',
      '<path d="m12 3 2.75 5.57 6.15.9-4.45 4.33 1.05 6.12L12 17.03l-5.5 2.89 1.05-6.12L3.1 9.47l6.15-.9L12 3Z"></path>',
      "</svg>"
    ].join("");
    favoriteButton.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      toggleFavoriteLink(link);
    });
    shell.appendChild(favoriteButton);
    updateFavoriteButtons(shell);
    return shell;
  }

  function addMiddleClickHandlers(item, onMiddleClick) {
    item.addEventListener("mousedown", function (event) {
      if (event.button === 1) {
        stopLinkEvent(event);
      }
    }, true);

    item.addEventListener("auxclick", function (event) {
      if (event.button !== 1) {
        return;
      }

      stopLinkEvent(event);
      onMiddleClick();
    }, true);
  }

  function stopLinkEvent(event) {
    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === "function") {
      event.stopImmediatePropagation();
    }
  }

  function updateDirectActiveState(item, targetUrl) {
    const isActive = isCurrentPageUrl(targetUrl);
    item.classList.toggle("b24ql-link-active", isActive);
    item.classList.toggle("b24ql-link-current", isActive);

    if (isActive) {
      item.setAttribute("aria-current", "page");
      item.title = "Текущая страница";
    } else {
      item.removeAttribute("aria-current");
      item.removeAttribute("title");
    }
  }

  function updateGroupActiveState(item, group) {
    const isActive = isGroupCurrentPage(group);
    item.classList.toggle("b24ql-link-active", isActive);
    item.classList.toggle("b24ql-link-current-group", isActive);
    item.title = isActive ? "Текущая страница находится внутри этого раздела" : "";
  }

  function refreshActiveLinks(root) {
    const scope = root || document;

    Array.from(scope.querySelectorAll(".b24ql-link[data-url]")).forEach(function (item) {
      updateDirectActiveState(item, item.dataset.url);
    });

    Array.from(scope.querySelectorAll(".b24ql-link-group")).forEach(function (item) {
      if (item.__b24qlLink) {
        updateGroupActiveState(item, item.__b24qlLink);
      }
    });
  }

  /* Избранные ссылки и окна хранятся по устойчивым идентификаторам кнопок. */
  function readFavoriteLinkIds() {
    const stored = getStoredValue(FAVORITE_LINKS_KEY);
    if (!Array.isArray(stored)) {
      return [];
    }

    return stored.filter(function (id, index) {
      return typeof id === "string" && id && stored.indexOf(id) === index;
    });
  }

  function saveFavoriteLinkIds() {
    setStoredValue(FAVORITE_LINKS_KEY, favoriteLinkIds.slice());
  }

  function isFavoriteLink(link) {
    return Boolean(link && link.id && favoriteLinkIds.includes(link.id));
  }

  function toggleFavoriteLink(link) {
    if (!link || !link.id) {
      return;
    }

    const index = favoriteLinkIds.indexOf(link.id);
    if (index >= 0) {
      favoriteLinkIds.splice(index, 1);
    } else {
      favoriteLinkIds.push(link.id);
    }

    saveFavoriteLinkIds();
    updateFavoriteButtons();
    renderFavoritesSection();
  }

  function updateFavoriteButtons(root) {
    const scope = root || document;
    Array.from(scope.querySelectorAll(".b24ql-favorite-toggle")).forEach(function (button) {
      const isFavorite = favoriteLinkIds.includes(button.dataset.favoriteId || "");
      button.classList.toggle("b24ql-favorite-active", isFavorite);
      button.setAttribute("aria-pressed", String(isFavorite));
      button.setAttribute("aria-label", isFavorite ? "Убрать из избранного" : "Добавить в избранное");
      button.title = isFavorite ? "Убрать из избранного" : "Добавить в избранное";
    });
  }

  function findLinkEntryById(linkId) {
    for (const section of sections) {
      const result = findLinkEntryInList(section.links, linkId, [section.title]);
      if (result) {
        return result;
      }
    }
    return null;
  }

  function findLinkEntryInList(links, linkId, path) {
    for (const link of links) {
      if (link.id === linkId) {
        return { link: link, path: path };
      }
      if (Array.isArray(link.links)) {
        const nested = findLinkEntryInList(link.links, linkId, path.concat(link.title));
        if (nested) {
          return nested;
        }
      }
    }
    return null;
  }

  function renderFavoritesSection() {
    const section = document.querySelector(".b24ql-favorites-section");
    if (!section) {
      return;
    }

    const grid = section.querySelector("#b24ql-favorites-grid");
    const count = section.querySelector(".b24ql-section-count");
    const entries = favoriteLinkIds.map(findLinkEntryById).filter(Boolean);

    if (grid) {
      grid.replaceChildren();
      entries.forEach(function (entry) {
        grid.appendChild(createLinkItem(entry.link, entry.path.join(" / ")));
      });
    }
    if (count) {
      setCounterValue(count, entries.length);
    }

    section.classList.toggle("b24ql-hidden", entries.length === 0);
    refreshActiveLinks(section);
    updateFavoriteButtons(section);
  }

  function setSearchInputValue(input, value) {
    if (!input) {
      return;
    }

    input.value = value;
    const clearButton = input.parentElement
      ? input.parentElement.querySelector(".b24ql-search-clear")
      : null;
    if (clearButton) {
      clearButton.classList.toggle("b24ql-hidden", input.value.length === 0);
    }
  }

  function getMainSearchValue() {
    const input = document.getElementById(SEARCH_INPUT_ID);
    return input ? input.value : "";
  }

  function focusMainSearch() {
    const input = document.getElementById(SEARCH_INPUT_ID);
    if (input) {
      input.focus();
      input.select();
    }
  }

  function clearSearchInput(input) {
    setSearchInputValue(input, "");
    if (input && input.id === SEARCH_INPUT_ID) {
      applyMainSearch("");
    } else {
      applySubSearch("");
    }
  }

  function handleSearchInputKeydown(event, input) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      const options = getSearchOptions(input);
      if (options.length === 0) {
        return;
      }
      event.preventDefault();
      const currentIndex = searchSelectionIndexes.has(input)
        ? searchSelectionIndexes.get(input)
        : 0;
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setSearchSelection(input, currentIndex + direction, true);
      return;
    }

    if (event.key !== "Enter") {
      return;
    }

    const options = getSearchOptions(input);
    if (options.length === 0) {
      return;
    }
    event.preventDefault();
    const selectedIndex = searchSelectionIndexes.has(input)
      ? searchSelectionIndexes.get(input)
      : 0;
    const selected = options[Math.max(0, Math.min(selectedIndex, options.length - 1))];
    if (selected && typeof selected.__b24qlActivate === "function") {
      selected.__b24qlActivate(Boolean(event.metaKey || event.ctrlKey));
    }
  }

  function getSearchOptions(input) {
    let container = null;
    if (input && input.id === SEARCH_INPUT_ID) {
      container = document.getElementById("b24ql-search-results-grid");
    } else {
      container = document.getElementById("b24ql-subgrid");
    }
    if (!container) {
      return [];
    }

    return Array.from(container.querySelectorAll(".b24ql-link")).filter(function (item) {
      const shell = item.parentElement;
      return !item.hidden && !(shell && shell.hidden);
    });
  }

  function resetSearchSelection(input) {
    const options = getSearchOptions(input);
    searchSelectionIndexes.set(input, 0);
    options.forEach(function (item, index) {
      item.classList.toggle("b24ql-link-search-selected", index === 0);
    });
    if (options[0]) {
      input.setAttribute("aria-activedescendant", options[0].id);
    } else {
      input.removeAttribute("aria-activedescendant");
    }
  }

  function setSearchSelection(input, requestedIndex, scrollIntoView) {
    const options = getSearchOptions(input);
    if (options.length === 0) {
      resetSearchSelection(input);
      return;
    }

    const index = (requestedIndex + options.length) % options.length;
    searchSelectionIndexes.set(input, index);
    options.forEach(function (item, optionIndex) {
      item.classList.toggle("b24ql-link-search-selected", optionIndex === index);
    });
    input.setAttribute("aria-activedescendant", options[index].id);
    if (scrollIntoView && typeof options[index].scrollIntoView === "function") {
      options[index].scrollIntoView({ block: "nearest" });
    }
  }

  /* Во время поиска исходные кнопки удаляются из DOM, чтобы не держать второй
   * скрытый набор элементов и обработчиков рядом с результатами поиска. */
  function clearMainSourceLinks(modal) {
    Array.from(modal.querySelectorAll(".b24ql-source-section .b24ql-link-grid")).forEach(function (grid) {
      grid.replaceChildren();
    });

    const favoritesGrid = modal.querySelector("#b24ql-favorites-grid");
    if (favoritesGrid) {
      favoritesGrid.replaceChildren();
    }
  }

  function restoreMainSourceLinks(modal) {
    Array.from(modal.querySelectorAll(".b24ql-source-section")).forEach(function (sectionNode) {
      const sectionIndex = Number(sectionNode.dataset.sectionIndex);
      const section = Number.isInteger(sectionIndex) ? sections[sectionIndex] : null;
      const grid = sectionNode.querySelector(".b24ql-link-grid");
      if (!section || !grid) {
        return;
      }

      grid.replaceChildren();
      section.links.forEach(function (link) {
        grid.appendChild(createLinkItem(link));
      });
    });
  }

  function applyMainSearch(value) {
    const modal = document.getElementById(MODAL_ID);
    if (!modal) {
      return;
    }

    const query = normalizeSearchValue(value);
    const searchResults = modal.querySelector(".b24ql-search-results");
    const searchResultsGrid = modal.querySelector("#b24ql-search-results-grid");
    const searchResultsCount = searchResults ? searchResults.querySelector(".b24ql-section-count") : null;
    const favoritesSection = modal.querySelector(".b24ql-favorites-section");
    const empty = modal.querySelector(".b24ql-empty");
    const mainContent = modal.querySelector(".b24ql-main-content");

    if (query) {
      if (mainContent && mainContent.dataset.b24qlSearchActive !== "true") {
        clearMainSourceLinks(modal);
        mainContent.dataset.b24qlSearchActive = "true";
      }
      const results = getFlatSearchResults(query);

      Array.from(modal.querySelectorAll(".b24ql-source-section")).forEach(function (sectionNode) {
        sectionNode.hidden = true;
      });
      if (favoritesSection) {
        favoritesSection.classList.add("b24ql-hidden");
      }

      if (searchResultsGrid) {
        searchResultsGrid.replaceChildren();
        results.forEach(function (result) {
          searchResultsGrid.appendChild(createLinkItem(result.link, result.path.join(" / ")));
        });
      }
      if (searchResultsCount) {
        setCounterValue(searchResultsCount, results.length);
      }
      if (searchResults) {
        searchResults.classList.toggle("b24ql-hidden", results.length === 0);
      }
      if (empty) {
        empty.classList.toggle("b24ql-hidden", results.length > 0);
      }
      const searchInput = document.getElementById(SEARCH_INPUT_ID);
      if (searchInput) {
        resetSearchSelection(searchInput);
      }
      return;
    }

    if (searchResultsGrid) {
      searchResultsGrid.replaceChildren();
    }
    if (searchResultsCount) {
      setCounterValue(searchResultsCount, 0);
    }
    if (searchResults) {
      searchResults.classList.add("b24ql-hidden");
    }
    if (empty) {
      empty.classList.add("b24ql-hidden");
    }
    if (mainContent && mainContent.dataset.b24qlSearchActive === "true") {
      restoreMainSourceLinks(modal);
      mainContent.dataset.b24qlSearchActive = "false";
    }
    renderFavoritesSection();

    Array.from(modal.querySelectorAll(".b24ql-source-section")).forEach(function (sectionNode) {
      const grid = sectionNode.querySelector(".b24ql-link-grid");
      const count = sectionNode.querySelector(".b24ql-section-count");
      if (!grid) {
        return;
      }

      const items = Array.from(grid.querySelectorAll(".b24ql-link"));
      items.forEach(function (item) {
        item.hidden = false;
        if (item.parentElement && item.parentElement.classList.contains("b24ql-link-shell")) {
          item.parentElement.hidden = false;
        }
      });

      sectionNode.hidden = false;
      sectionNode.classList.remove("b24ql-section-search-open");
      if (count) {
        setCounterValue(count, sectionNode.dataset.totalCount);
      }
    });
    const searchInput = document.getElementById(SEARCH_INPUT_ID);
    if (searchInput) {
      searchSelectionIndexes.delete(searchInput);
      searchInput.removeAttribute("aria-activedescendant");
    }
  }

  function getFlatSearchResults(query) {
    const results = [];
    const seen = new Set();

    sections.forEach(function (section) {
      collectFlatSearchResults(section.links, [section.title], query, results, seen);
    });

    return results.sort(function (left, right) {
      return right.score - left.score || left.link.title.localeCompare(right.link.title, "ru");
    });
  }

  function collectFlatSearchResults(links, path, query, results, seen) {
    links.forEach(function (link) {
      if (Array.isArray(link.links)) {
        collectFlatSearchResults(link.links, path.concat(link.title), query, results, seen);
        return;
      }

      const score = getLinkMatchScore(link, query, path.join(" "));
      if (score <= 0) {
        return;
      }

      const resultKey = [link.id || getComparableUrl(link.url), link.title, path.join("/")].join("|");
      if (seen.has(resultKey)) {
        return;
      }

      seen.add(resultKey);
      results.push({
        link: link,
        path: path,
        score: score
      });
    });
  }

  function applySubSearch(value) {
    const subModal = document.getElementById(SUBMODAL_ID);
    if (!subModal) {
      return;
    }

    const query = normalizeSearchValue(value);
    const grid = subModal.querySelector("#b24ql-subgrid");
    const empty = subModal.querySelector(".b24ql-subempty");
    if (!grid) {
      return;
    }

    let totalVisible = 0;
    const rankedItems = Array.from(grid.querySelectorAll(".b24ql-link")).map(function (item) {
      const score = !query ? 1 : getLinkMatchScore(item.__b24qlLink || {}, query, "");
      return {
        item: item,
        shell: item.parentElement,
        score: score,
        order: Number(item.parentElement && item.parentElement.dataset.searchOrder) || 0
      };
    });

    rankedItems.sort(function (left, right) {
      return query ? right.score - left.score || left.order - right.order : left.order - right.order;
    }).forEach(function (entry) {
      const item = entry.item;
      const isVisible = entry.score > 0;
      item.hidden = !isVisible;
      if (entry.shell && entry.shell.classList.contains("b24ql-link-shell")) {
        entry.shell.hidden = !isVisible;
        grid.appendChild(entry.shell);
      }
      if (isVisible) {
        totalVisible += 1;
      }
    });

    if (empty) {
      empty.classList.toggle("b24ql-hidden", !query || totalVisible > 0);
    }
    const searchInput = subModal.querySelector("#" + SUBSEARCH_INPUT_ID);
    if (searchInput) {
      resetSearchSelection(searchInput);
    }
  }

  /* Обычный клик закрывает окно и обходит внутреннюю SPA-навигацию Bitrix24. */
  async function navigateDirectLinkInCurrentTab(url) {
    await closeModal(true);
    window.location.assign(getPortalUrl(url));
  }

  /* Открытие ссылок через background.js, чтобы новая вкладка создавалась надежно. */
  function openLinkInNewTab(url) {
    const targetUrl = getPortalUrl(url);
    const message = {
      type: "b24ql-open-tab",
      url: targetUrl
    };

    if (typeof browser !== "undefined" && browser.runtime &&
        typeof browser.runtime.sendMessage === "function") {
      sendRuntimeMessage(browser.runtime, message, targetUrl, true);
      return;
    }

    if (typeof chrome !== "undefined" && chrome.runtime &&
        typeof chrome.runtime.sendMessage === "function") {
      sendRuntimeMessage(chrome.runtime, message, targetUrl);
      return;
    }

    window.open(targetUrl, "_blank", "noopener,noreferrer");
  }

  function sendRuntimeMessage(runtimeApi, message, fallbackUrl, promiseOnly) {
    let handled = false;
    const fallbackTimer = window.setTimeout(function () {
      if (!handled) {
        handled = true;
        window.open(fallbackUrl, "_blank", "noopener,noreferrer");
      }
    }, 600);

    const finish = function (response) {
      if (handled) {
        return;
      }

      handled = true;
      window.clearTimeout(fallbackTimer);

      if (!response || response.ok !== true) {
        window.open(fallbackUrl, "_blank", "noopener,noreferrer");
      }
    };

    try {
      const result = promiseOnly ? runtimeApi.sendMessage(message) : runtimeApi.sendMessage(message, finish);
      if (result && typeof result.then === "function") {
        result.then(finish, function () {
          finish(null);
        });
      } else if (promiseOnly) {
        finish(null);
      }
    } catch (error) {
      finish(null);
    }
  }

  /* Диалог подстановки ID в шаблонную ссылку. */
  function createTemplateModal() {
    const overlay = document.createElement("div");
    overlay.id = TEMPLATE_MODAL_ID;
    overlay.className = "b24ql-template-modal b24ql-hidden";

    const panel = document.createElement("div");
    panel.className = "b24ql-template-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-labelledby", "b24ql-template-title");

    const header = document.createElement("header");
    header.className = "b24ql-template-header";

    const title = document.createElement("h2");
    title.id = "b24ql-template-title";
    title.textContent = "Открыть по ID";

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "b24ql-close ui-btn ui-btn-light-border ui-btn-xs";
    closeButton.setAttribute("aria-label", "Закрыть");
    closeButton.innerHTML = [
      '<svg class="b24ql-close-icon" viewBox="0 0 24 24" aria-hidden="true">',
      '<path d="M18 6 6 18M6 6l12 12"></path>',
      "</svg>"
    ].join("");
    closeButton.addEventListener("click", closeTemplateModal);

    header.appendChild(title);
    header.appendChild(closeButton);

    const form = document.createElement("form");
    form.className = "b24ql-template-form";
    form.addEventListener("submit", handleTemplateSubmit);

    const fields = document.createElement("div");
    fields.className = "b24ql-template-fields";

    const error = document.createElement("div");
    error.className = "b24ql-template-error ui-alert ui-alert-danger b24ql-hidden";
    error.setAttribute("role", "alert");
    const errorMessage = document.createElement("span");
    errorMessage.className = "ui-alert-message";
    error.appendChild(errorMessage);

    const actions = document.createElement("div");
    actions.className = "b24ql-template-actions";

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.textContent = "Отмена";
    styleUiAction(cancelButton, "outline", "md");
    cancelButton.addEventListener("click", closeTemplateModal);

    const openButton = document.createElement("button");
    openButton.type = "submit";
    openButton.id = "b24ql-template-open";
    openButton.textContent = "Открыть";
    styleUiAction(openButton, "primary", "md");

    const uiButtonHost = document.createElement("span");
    uiButtonHost.id = "b24ql-ui-button-host";
    uiButtonHost.className = "b24ql-ui-button-host b24ql-hidden";

    actions.appendChild(cancelButton);
    actions.appendChild(openButton);
    actions.appendChild(uiButtonHost);
    form.appendChild(fields);
    form.appendChild(error);
    form.appendChild(actions);
    panel.appendChild(header);
    panel.appendChild(form);
    overlay.appendChild(panel);

    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        closeTemplateModal();
      }
    });
    return overlay;
  }

  function openTemplateModal(link, openInNewTab) {
    if (!link || !link.template) {
      return;
    }

    const modal = ensureModal();
    const overlay = modal.querySelector("#" + TEMPLATE_MODAL_ID);
    if (!overlay) {
      return;
    }

    templateOpenInNewTab = Boolean(openInNewTab);
    overlay.__b24qlLink = link;
    const title = overlay.querySelector("#b24ql-template-title");
    const fields = overlay.querySelector(".b24ql-template-fields");
    const error = overlay.querySelector(".b24ql-template-error");
    const openButton = overlay.querySelector("#b24ql-template-open");
    const uiButtonHost = overlay.querySelector("#b24ql-ui-button-host");
    if (title) {
      title.textContent = link.title;
    }
    if (error) {
      error.querySelector(".ui-alert-message").textContent = "";
      error.classList.add("b24ql-hidden");
    }
    if (openButton) {
      setUiActionText(openButton, openInNewTab ? "Открыть в новой вкладке" : "Открыть");
    }
    if (uiButtonHost) {
      uiButtonHost.dataset.active = "true";
      uiButtonHost.dataset.text = openInNewTab ? "Открыть в новой вкладке" : "Открыть";
    }
    if (fields) {
      fields.replaceChildren();
      link.template.fields.forEach(function (field) {
        const fieldWrap = document.createElement("label");
        fieldWrap.className = "b24ql-template-field";

        const fieldLabel = document.createElement("span");
        fieldLabel.textContent = field.label;

        const input = document.createElement("input");
        input.className = "b24ql-template-input ui-ctl-element";
        input.type = "text";
        input.inputMode = field.inputMode || "numeric";
        input.autocomplete = "off";
        input.placeholder = field.placeholder || "";
        input.dataset.templateKey = field.key;
        input.dataset.inputMode = field.inputMode || "numeric";
        input.setAttribute("aria-label", field.label);

        fieldWrap.appendChild(fieldLabel);
        const control = document.createElement("div");
        control.className = "b24ql-template-control ui-ctl ui-ctl-textbox ui-ctl-w100";
        control.appendChild(input);
        fieldWrap.appendChild(control);
        fields.appendChild(fieldWrap);
      });
    }

    overlay.classList.remove("b24ql-hidden");
    document.dispatchEvent(new Event("b24ql-ui-render"));
    const firstInput = overlay.querySelector(".b24ql-template-input");
    if (firstInput) {
      firstInput.focus();
    }
  }

  function closeTemplateModal() {
    const overlay = document.getElementById(TEMPLATE_MODAL_ID);
    if (!overlay) {
      return;
    }
    const uiButtonHost = overlay.querySelector("#b24ql-ui-button-host");
    if (uiButtonHost) {
      uiButtonHost.dataset.active = "false";
      document.dispatchEvent(new Event("b24ql-ui-dispose"));
    }
    overlay.classList.add("b24ql-hidden");
    overlay.__b24qlLink = null;
    templateOpenInNewTab = false;
  }

  function isTemplateModalOpen() {
    const overlay = document.getElementById(TEMPLATE_MODAL_ID);
    return Boolean(overlay && !overlay.classList.contains("b24ql-hidden"));
  }

  function handleTemplateSubmit(event) {
    event.preventDefault();
    const overlay = document.getElementById(TEMPLATE_MODAL_ID);
    const link = overlay && overlay.__b24qlLink;
    if (!overlay || !link || !link.template) {
      return;
    }

    const values = {};
    let invalidInput = null;
    Array.from(overlay.querySelectorAll(".b24ql-template-input")).forEach(function (input) {
      const value = input.value.trim();
      const isNumeric = input.dataset.inputMode !== "text";
      if (!value || (isNumeric && !/^[1-9]\d*$/.test(value))) {
        invalidInput = invalidInput || input;
        input.classList.add("b24ql-template-input-invalid");
        input.classList.add("--error");
      } else {
        input.classList.remove("b24ql-template-input-invalid");
        input.classList.remove("--error");
        values[input.dataset.templateKey] = value;
      }
    });

    const error = overlay.querySelector(".b24ql-template-error");
    if (invalidInput) {
      if (error) {
        error.querySelector(".ui-alert-message").textContent = "Введите корректный ID: целое число больше нуля";
        error.classList.remove("b24ql-hidden");
      }
      invalidInput.focus();
      return;
    }

    let targetUrl = link.template.url;
    Object.keys(values).forEach(function (key) {
      targetUrl = targetUrl.replace(new RegExp("\\{" + key + "\\}", "g"), encodeURIComponent(values[key]));
    });
    if (/\{[a-zA-Z][a-zA-Z0-9_]*\}/.test(targetUrl)) {
      if (error) {
        error.querySelector(".ui-alert-message").textContent = "В шаблоне ссылки осталось незаполненное поле";
        error.classList.remove("b24ql-hidden");
      }
      return;
    }

    const openInNewTab = templateOpenInNewTab;
    closeTemplateModal();
    if (openInNewTab) {
      openLinkInNewTab(targetUrl);
    } else {
      navigateDirectLinkInCurrentTab(targetUrl);
    }
  }

  /* Вложенное окно для групп ссылок: поддерживает переходы на несколько уровней внутрь. */
  function createSubModal() {
    const subModal = document.createElement("div");
    subModal.id = SUBMODAL_ID;
    subModal.className = "b24ql-submodal b24ql-hidden";
    subModal.setAttribute("role", "dialog");
    subModal.setAttribute("aria-labelledby", "b24ql-subtitle");

    const panel = document.createElement("div");
    panel.className = "b24ql-panel b24ql-subpanel";

    const header = document.createElement("header");
    header.className = "b24ql-header b24ql-subheader";

    const titleWrap = document.createElement("div");
    const title = document.createElement("h2");
    title.id = "b24ql-subtitle";
    title.textContent = "";
    titleWrap.appendChild(title);

    const actions = document.createElement("div");
    actions.className = "b24ql-subactions";

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "b24ql-close ui-btn ui-btn-light-border ui-btn-xs";
    closeButton.setAttribute("aria-label", "Вернуться назад");
    closeButton.title = "Вернуться";
    closeButton.innerHTML = [
      '<svg class="b24ql-close-icon" viewBox="0 0 24 24" aria-hidden="true">',
      '<path d="M18 6 6 18M6 6l12 12"></path>',
      "</svg>"
    ].join("");
    closeButton.addEventListener("click", function () {
      closeSubModal();
    });

    actions.appendChild(closeButton);
    header.appendChild(titleWrap);

    const content = document.createElement("div");
    content.className = "b24ql-content b24ql-subcontent";

    content.appendChild(createSearchBox(SUBSEARCH_INPUT_ID, "Поиск в разделе", applySubSearch));

    const grid = document.createElement("div");
    grid.className = "b24ql-link-grid";
    grid.id = "b24ql-subgrid";
    content.appendChild(grid);

    const empty = document.createElement("div");
    empty.className = "b24ql-empty b24ql-subempty ui-alert ui-alert-default b24ql-hidden";
    const emptyMessage = document.createElement("span");
    emptyMessage.className = "ui-alert-message";
    emptyMessage.textContent = "В этом разделе ничего не найдено";
    empty.appendChild(emptyMessage);
    content.appendChild(empty);

    subModal.addEventListener("click", function (event) {
      if (event.target === subModal) {
        closeSubModal();
      }
    });

    panel.appendChild(actions);
    panel.appendChild(header);
    panel.appendChild(content);
    subModal.appendChild(panel);
    return subModal;
  }

  function openLinkGroup(group) {
    if (!Array.isArray(group.links)) {
      return;
    }

    const subModal = document.getElementById(SUBMODAL_ID);
    const sourceSearchInput = subModal && !subModal.classList.contains("b24ql-hidden")
      ? subModal.querySelector("#" + SUBSEARCH_INPUT_ID)
      : document.getElementById(SEARCH_INPUT_ID);
    const sourceSearchValue = sourceSearchInput ? sourceSearchInput.value : "";

    if (subModal && !subModal.classList.contains("b24ql-hidden") && subModalStack.length > 0) {
      subModalStack.push(group);
    } else {
      subModalStack = [group];
    }

    renderLinkGroup(group, sourceSearchValue);
  }

  function renderLinkGroup(group, sourceSearchValue) {
    const subModal = document.getElementById(SUBMODAL_ID);
    if (!subModal) {
      return;
    }

    const title = subModal.querySelector("#b24ql-subtitle");
    const grid = subModal.querySelector("#b24ql-subgrid");
    if (!title || !grid) {
      return;
    }

    title.textContent = group.title;
    grid.replaceChildren();

    group.links.forEach(function (link, index) {
      const shell = createLinkItem(link);
      shell.dataset.searchOrder = String(index);
      grid.appendChild(shell);
    });

    const sourceQuery = normalizeSearchValue(sourceSearchValue || "");
    const shouldCarrySearch = Boolean(sourceQuery) &&
      !normalizeSearchValue(group.title).includes(sourceQuery) &&
      group.links.some(function (link) {
        return linkMatchesSearch(link, sourceQuery);
      });
    const searchInput = subModal.querySelector("#" + SUBSEARCH_INPUT_ID);
    setSearchInputValue(searchInput, shouldCarrySearch ? sourceSearchValue : "");
    refreshActiveLinks(subModal);
    applySubSearch(searchInput ? searchInput.value : "");

    subModal.classList.remove("b24ql-hidden");
  }

  function closeSubModal(forceClose) {
    const subModal = document.getElementById(SUBMODAL_ID);
    if (!subModal) {
      subModalStack = [];
      return;
    }

    if (!forceClose && subModalStack.length > 1 && !subModal.classList.contains("b24ql-hidden")) {
      subModalStack.pop();
      renderLinkGroup(subModalStack[subModalStack.length - 1], "");
      return;
    }

    subModalStack = [];
    subModal.classList.add("b24ql-hidden");
  }

  /* Сворачивание и разворачивание блоков основного окна. */
  function toggleSection(sectionNode, toggleButton, sectionTitle) {
    const collapsed = !sectionNode.classList.contains("b24ql-section-collapsed");
    sessionCollapsedSections[sectionTitle] = collapsed;
    sectionNode.classList.toggle("b24ql-section-collapsed", collapsed);
    updateSectionToggle(toggleButton, sectionTitle, collapsed);
  }

  function setSectionCollapsedState(sectionTitle, collapsed) {
    if (collapsed) {
      collapsedSections[sectionTitle] = true;
    } else if (DEFAULT_COLLAPSED_SECTIONS[sectionTitle]) {
      collapsedSections[sectionTitle] = false;
    } else {
      delete collapsedSections[sectionTitle];
    }
  }

  function updateSectionToggle(toggleButton, sectionTitle, collapsed) {
    toggleButton.setAttribute("aria-expanded", String(!collapsed));
    toggleButton.setAttribute(
      "aria-label",
      (collapsed ? "Развернуть блок " : "Свернуть блок ") + sectionTitle
    );
    toggleButton.title = collapsed ? "Развернуть" : "Свернуть";
  }

  function ensureModal() {
    let modal = document.getElementById(MODAL_ID);
    if (!modal) {
      modal = createModal();
      document.body.appendChild(modal);
    }
    return modal;
  }

  /* Открытие, закрытие и отслеживание изменений DOM Bitrix24 после внутренних перерисовок. */
  function openModal() {
    if (!findLeftMenuContainer()) {
      unmountButtonUntilMenuExists();
      return;
    }

    replaceObjectContents(sessionCollapsedSections, collapsedSections);
    const modal = ensureModal();
    refreshMainContent();
    applyModalTheme(modal);
    renderFavoritesSection();
    refreshActiveLinks(modal);
    updateOpenAllButtons(modal);
    applyMainSearch(getMainSearchValue());
    modal.classList.remove("b24ql-hidden");
    document.documentElement.classList.add("b24ql-page-locked");
  }

  async function closeModal(forceClose) {
    const settingsClosed = await closeSettingsModal(forceClose);
    if (!settingsClosed) {
      return;
    }

    closeTemplateModal();
    closeSubModal(true);
    const modal = document.getElementById(MODAL_ID);
    if (modal) {
      if (runtimeOptions.destroyModalOnClose || isSafariUserscriptRuntime) {
        if (linksEditorNoticeTimer !== null) {
          window.clearTimeout(linksEditorNoticeTimer);
          linksEditorNoticeTimer = null;
        }
        modal.remove();
      } else {
        modal.classList.add("b24ql-hidden");
      }
    }
    document.documentElement.classList.remove("b24ql-page-locked");
  }

  function watchBitrixLayout() {
    if (runtimeOptions.leanLayoutWatcher || isSafariUserscriptRuntime) {
      watchBitrixLayoutLean();
      return;
    }

    let mountScheduled = false;
    let colorSyncScheduled = false;
    const observedThemeTargets = new WeakSet();

    const layoutObserver = new MutationObserver(function (mutations) {
      if (mountScheduled || !mutations.some(isRelevantLayoutMutation)) {
        return;
      }
      mountScheduled = true;
      window.requestAnimationFrame(function () {
        mountScheduled = false;
        mountButton();
        observeThemeTarget(document.body);
      });
    });

    const themeObserver = new MutationObserver(function (mutations) {
      if (colorSyncScheduled || !mutations.some(isPortalThemeMutation)) {
        return;
      }
      colorSyncScheduled = true;
      window.requestAnimationFrame(function () {
        colorSyncScheduled = false;
        const leftMenu = findLeftMenuContainer();
        const menuItem = document.getElementById(MENU_ITEM_ID);
        if (leftMenu && menuItem) {
          syncMenuItemColor(leftMenu, menuItem);
        }
      });
    });

    function observeThemeTarget(target) {
      if (!target || observedThemeTargets.has(target)) {
        return;
      }
      observedThemeTargets.add(target);
      themeObserver.observe(target, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ["class", "style", "data-theme"]
      });
    }

    layoutObserver.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
    observeThemeTarget(document.documentElement);
    observeThemeTarget(document.body);
  }

  function watchBitrixLayoutLean() {
    let mountScheduled = false;
    let colorSyncScheduled = false;
    let observedMenuRoot = null;
    let menuObserver = null;
    let healthCheckTimer = null;
    const observedThemeTargets = new WeakSet();

    const themeObserver = new MutationObserver(function (mutations) {
      if (colorSyncScheduled || !mutations.some(isPortalThemeMutation)) {
        return;
      }
      colorSyncScheduled = true;
      window.requestAnimationFrame(function () {
        colorSyncScheduled = false;
        const leftMenu = findLeftMenuContainer();
        const menuItem = document.getElementById(MENU_ITEM_ID);
        if (leftMenu && menuItem) {
          syncMenuItemColor(leftMenu, menuItem);
        }
      });
    });

    function observeThemeTarget(target) {
      if (!target || observedThemeTargets.has(target)) {
        return;
      }
      observedThemeTargets.add(target);
      themeObserver.observe(target, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ["class", "style", "data-theme"]
      });
    }

    function getMenuObserverRoot(leftMenu) {
      return leftMenu && (leftMenu.closest("#left-menu") || leftMenu);
    }

    function observeMenu(leftMenu) {
      const nextRoot = getMenuObserverRoot(leftMenu);
      if (nextRoot === observedMenuRoot) {
        return;
      }
      if (menuObserver) {
        menuObserver.disconnect();
      }
      observedMenuRoot = nextRoot;
      if (!nextRoot) {
        return;
      }
      menuObserver = new MutationObserver(function (mutations) {
        if (mutations.some(isRelevantLayoutMutation)) {
          scheduleMount();
        }
      });
      menuObserver.observe(nextRoot, {
        childList: true,
        subtree: true
      });
    }

    function mountAndObserve() {
      mountScheduled = false;
      mountButton();
      observeMenu(findLeftMenuContainer());
      observeThemeTarget(document.body);
    }

    function scheduleMount() {
      if (mountScheduled) {
        return;
      }
      mountScheduled = true;
      window.requestAnimationFrame(mountAndObserve);
    }

    function checkMenuHealth() {
      if (document.hidden) {
        return;
      }
      const menuItem = document.getElementById(MENU_ITEM_ID);
      const leftMenu = menuItem && menuItem.parentElement;
      if (!menuItem || !menuItem.isConnected || !leftMenu || !leftMenu.matches(LEFT_MENU_SELECTOR)) {
        scheduleMount();
        return;
      }
      observeMenu(leftMenu);
    }

    function handleVisibilityChange() {
      if (!document.hidden) {
        scheduleMount();
      }
    }

    function cleanup() {
      if (menuObserver) {
        menuObserver.disconnect();
      }
      themeObserver.disconnect();
      if (healthCheckTimer !== null) {
        window.clearInterval(healthCheckTimer);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    }

    observeThemeTarget(document.documentElement);
    observeThemeTarget(document.body);
    observeMenu(findLeftMenuContainer());
    healthCheckTimer = window.setInterval(checkMenuHealth, 5000);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", cleanup, { once: true });
  }

  function isPortalThemeMutation(mutation) {
    if (mutation.type !== "attributes") {
      return false;
    }
    if (mutation.attributeName !== "class") {
      return true;
    }

    return getPortalClassName(mutation.target.className) !== getPortalClassName(mutation.oldValue);
  }

  function getPortalClassName(value) {
    return String(value || "")
      .split(/\s+/)
      .filter(function (className) {
        return className && !className.startsWith("b24ql-");
      })
      .sort()
      .join(" ");
  }

  function isRelevantLayoutMutation(mutation) {
    if (mutation.type !== "childList") {
      return false;
    }

    const menuItem = document.getElementById(MENU_ITEM_ID);
    const target = mutation.target instanceof Element
      ? mutation.target
      : mutation.target.parentElement;

    if (!target || isExtensionUiNode(target) || target === menuItem || menuItem?.contains(target)) {
      return false;
    }
    if (target.closest(LEFT_MENU_SELECTOR)) {
      return true;
    }

    return Array.from(mutation.addedNodes).concat(Array.from(mutation.removedNodes)).some(function (node) {
      if (!(node instanceof Element) || isExtensionUiNode(node) || node === menuItem) {
        return false;
      }
      return node.matches(LEFT_MENU_SELECTOR) || Boolean(node.querySelector(LEFT_MENU_SELECTOR));
    });
  }

  function isExtensionUiNode(node) {
    return Boolean(node && typeof node.closest === "function" && node.closest("#" + MODAL_ID));
  }

  document.addEventListener("keydown", function (event) {
    const isSearchShortcut = (event.metaKey || event.ctrlKey) &&
      (event.code === "KeyK" || event.key.toLocaleLowerCase("ru-RU") === "k");

    if (isSearchShortcut) {
      event.preventDefault();
      openModal();
      focusMainSearch();
      return;
    }

    if (event.key === "Escape") {
      if (event.target && event.target.classList && event.target.classList.contains("b24ql-search-input") && event.target.value) {
        event.preventDefault();
        clearSearchInput(event.target);
        return;
      }

      if (isTemplateModalOpen()) {
        event.preventDefault();
        closeTemplateModal();
        return;
      }

      if (isSettingsModalOpen()) {
        event.preventDefault();
        closeSettingsModal();
        return;
      }

      closeModal();
    }
  });

  if (browserThemeQuery) {
    const handleBrowserThemeChange = function () {
      if (themePreference === "auto") {
        applyModalTheme();
      }
    };

    if (typeof browserThemeQuery.addEventListener === "function") {
      browserThemeQuery.addEventListener("change", handleBrowserThemeChange);
    } else if (typeof browserThemeQuery.addListener === "function") {
      browserThemeQuery.addListener(handleBrowserThemeChange);
    }
  }

  async function initialize() {
    if (extensionStorage) {
      await loadExtensionStorage();
    } else {
      migrateStoredConfiguration();
      applyStoredState();
    }
    mountButton();
    watchBitrixLayout();
  }

  initialize().catch(function (error) {
    console.error("B24 Quick Links: initialization failed", error);
  });
})();
