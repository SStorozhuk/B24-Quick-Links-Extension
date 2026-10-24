(function (root) {
  "use strict";

  /*
   * Базовая конфигурация новой установки.
   *
   * Внутренние ссылки Bitrix24 хранятся как пути, поэтому один и тот же набор
   * работает на облачном и коробочном портале с любым HTTPS-доменом.
   * Пользовательские блоки и кнопки настраиваются через:
   * шестеренка -> Редактор ссылок.
   */

  /* Домены прежних сборок используются только для переноса старых абсолютных ссылок. */
  const legacyPortalHosts = [
    "bitrix24.ostec-group.ru",
    "bitrix24test.ostec-group.ru",
    "bitrix24develop.ostec-group.ru",
    "bitrix24.selectica.ru",
    "bitrix24test.selectica.ru",
    "bitrix24develop.selectica.ru"
  ];

  const defaultCollapsedSections = {
    "Настройки": true
  };

  const defaultOpenAllSections = {};

  function createIdTemplate(title, path, fieldLabel, keywords) {
    return {
      title: title,
      keywords: keywords || [],
      template: {
        url: path,
        fields: [
          {
            key: "id",
            label: fieldLabel,
            placeholder: "Например, 1254",
            inputMode: "numeric"
          }
        ]
      }
    };
  }

  const sections = [
    {
      title: "Открыть по ID",
      links: [
        createIdTemplate("Сделка", "/crm/deal/details/{id}/", "ID сделки", ["сделки", "CRM", "по ID"]),
        createIdTemplate("Счет", "/crm/type/31/details/{id}/", "ID счета", ["счета", "CRM", "по ID"]),
        createIdTemplate(
          "Задача",
          "/company/personal/user/0/tasks/task/view/{id}/",
          "ID задачи",
          ["задачи", "проекты", "по ID"]
        )
      ]
    },
    {
      title: "CRM",
      links: [
        { title: "Лиды", url: "/crm/lead/kanban/", keywords: ["лиды", "CRM"] },
        { title: "Сделки", url: "/crm/deal/kanban/", keywords: ["сделки", "воронки", "продажи"] },
        {
          title: "Клиенты",
          keywords: ["контакты", "компании", "контрагенты", "CRM"],
          links: [
            { title: "Контакты", url: "/crm/contact/list/", keywords: ["контакты", "клиенты"] },
            { title: "Компании", url: "/crm/company/list/", keywords: ["компании", "контрагенты"] }
          ]
        },
        { title: "Счета", url: "/crm/type/31/kanban/category/0/", keywords: ["счета", "CRM"] },
        { title: "Каталог товаров", url: "/crm/catalog/", keywords: ["товары", "каталог", "CRM"] }
      ]
    },
    {
      title: "Работа",
      links: [
        { title: "Лента", url: "/stream/", keywords: ["лента", "новости"] },
        { title: "Задачи", url: "/company/personal/user/0/tasks/", keywords: ["задачи", "проекты"] },
        { title: "Календарь", url: "/company/personal/user/0/calendar/", keywords: ["календарь", "встречи"] },
        { title: "Диск", url: "/docs/", keywords: ["диск", "файлы", "документы"] }
      ]
    },
    {
      title: "Сотрудники",
      links: [
        { title: "Сотрудники", url: "/company/", keywords: ["сотрудники", "люди"] },
        { title: "Структура компании", url: "/hr/structure/", keywords: ["структура", "подразделения"] },
        { title: "Учет времени", url: "/timeman/", keywords: ["время", "рабочий день"] },
        { title: "Видеоконференции", url: "/conference/", keywords: ["видеозвонки", "конференции"] }
      ]
    },
    {
      title: "Настройки",
      links: [
        { title: "Настройки CRM", url: "/crm/configs/", keywords: ["настройки", "CRM"] },
        { title: "Права доступа CRM", url: "/crm/perms/all/", keywords: ["права", "доступ", "CRM"] },
        { title: "Бизнес-процессы CRM", url: "/crm/configs/bp/", keywords: ["бизнес-процессы", "автоматизация", "CRM"] },
        { title: "Бизнес-процессы", url: "/bizproc/processes/", keywords: ["бизнес-процессы", "автоматизация"] },
        { title: "Разработчикам", url: "/devops/", keywords: ["разработчики", "REST", "вебхуки"] }
      ]
    }
  ];

  const exportedSettings = {
    legacyPortalHosts: legacyPortalHosts,
    defaultCollapsedSections: defaultCollapsedSections,
    defaultOpenAllSections: defaultOpenAllSections,
    sections: sections
  };

  root.B24QL_SETTINGS = exportedSettings;
  if (typeof window !== "undefined") {
    window.B24QL_SETTINGS = exportedSettings;
  }
})(typeof globalThis !== "undefined" ? globalThis : window);
