(function (root) {
  "use strict";

  /*
   * Файл настроек расширения.
   *
   * Здесь хранятся стартовые порталы, блоки, кнопки и свернутые по умолчанию разделы.
   * Обычные правки ссылок можно делать в интерфейсе расширения:
   * шестеренка -> Редактор ссылок.
   *
   * Правки из интерфейса сохраняются в браузере пользователя и не меняют этот файл.
   * Этот файл нужен как базовый шаблон для новой установки или сброса пользовательских
   * данных браузера.
   *
   * Рабочая логика расширения лежит в content.js и background.js; туда обычно
   * нужно лезть только при изменении поведения кнопки, окна или перетаскивания.
   */

  /*
   * Порталы Bitrix24, на которых должно работать расширение.
   * Если добавляете новый портал:
   * 1. Добавьте домен в portalHosts.
   * 2. Добавьте такой же URL-шаблон в manifest.json -> content_scripts -> matches.
   * 3. Пересоберите ZIP-архив расширения.
   */
  const portalHosts = [
    "bitrix24.ostec-group.ru",
    "bitrix24test.ostec-group.ru",
    "bitrix24develop.ostec-group.ru"
  ];

  /*
   * Базовый портал для хранения ссылок ниже.
   * При клике расширение автоматически заменит этот домен на текущий портал:
   * prod -> prod, test -> test, develop -> develop.
   */
  const defaultPortalHost = "bitrix24.ostec-group.ru";

  /*
   * Разделы, которые при первом открытии окна будут свернуты.
   * true = свернут по умолчанию.
   * Название должно совпадать с title нужного блока в sections.
   * Пользователь может переопределить это через шестеренку -> Состояние блоков.
   */
  const defaultCollapsedSections = {
    "Заметки": false,
    "Настройка CRM": true,
    "Сотрудники": true,
    "Локальные приложения": true
  };

  /*
   * Блоки, где при первом запуске показывается кнопка "открыть весь блок".
   * true = показывать кнопку по умолчанию.
   * Пользователь может переопределить это через шестеренку в окне расширения.
   */
  const defaultOpenAllSections = {};

  /*
   * Вложенное окно CRM -> Сделки.
   * Чтобы переименовать кнопку, меняйте title.
   * Чтобы изменить адрес, меняйте url.
   */
  const dealLinks = [
    {
      title: "Продажи",
      url: "https://bitrix24.ostec-group.ru/crm/deal/kanban/category/0/"
    },
    {
      title: "Реализация",
      url: "https://bitrix24.ostec-group.ru/crm/deal/kanban/category/1/"
    },
    {
      title: "Закупки",
      url: "https://bitrix24.ostec-group.ru/crm/deal/kanban/category/2/"
    },
    {
      title: "Консолидаторы",
      url: "https://bitrix24.ostec-group.ru/crm/deal/kanban/category/12/"
    },
    {
      title: "Сервис ЗИП",
      url: "https://bitrix24.ostec-group.ru/crm/deal/kanban/category/4/"
    },
    {
      title: "Сервис Работы",
      url: "https://bitrix24.ostec-group.ru/crm/deal/kanban/category/5/"
    },
    {
      title: "Обучение и консалтинг",
      url: "https://bitrix24.ostec-group.ru/crm/deal/kanban/category/14/"
    },
    {
      title: "Неком. расходы/доходы",
      url: "https://bitrix24.ostec-group.ru/crm/deal/kanban/category/7/"
    }
  ];

  /* Вложенное окно CRM -> Клиенты. */
  const clientLinks = [
    {
      title: "Контакт",
      keywords: ["Контакты", "клиент", "физлицо"],
      url: "https://bitrix24.ostec-group.ru/crm/contact/list/"
    },
    {
      title: "Компания",
      keywords: ["Компании", "клиент", "контрагент", "юрлицо"],
      url: "https://bitrix24.ostec-group.ru/crm/company/list/"
    }
  ];

  /* Вложенное окно CRM -> Смарт-процессы. */
  const smartProcessLinks = [
    {
      title: "Отгрузки",
      url: "https://bitrix24.ostec-group.ru/crm/type/162/list/category/0/"
    },
    {
      title: "Оборудование",
      url: "https://bitrix24.ostec-group.ru/crm/type/142/list/category/0/"
    },
    {
      title: "Сервис Деск",
      url: "https://bitrix24.ostec-group.ru/crm/type/188/list/category/0/"
    },
    {
      title: "Задания инженерам",
      url: "https://bitrix24.ostec-group.ru/crm/type/163/list/category/0/"
    },
    {
      title: "Договоры",
      url: "https://bitrix24.ostec-group.ru/crm/type/167/list/category/0/"
    },
    {
      title: "Конкурсы",
      url: "https://bitrix24.ostec-group.ru/crm/type/146/list/category/0/"
    },
    {
      title: "Обеспечения",
      url: "https://bitrix24.ostec-group.ru/crm/type/144/list/category/0/"
    },
    {
      title: "Мероприятия",
      url: "https://bitrix24.ostec-group.ru/crm/type/189/list/category/0/"
    },
    {
      title: "Траки",
      url: "https://bitrix24.ostec-group.ru/crm/type/180/kanban/category/0/"
    },
    {
      title: "Грузовые места",
      url: "https://bitrix24.ostec-group.ru/crm/type/190/list/category/0/"
    },
    {
      title: "Шаблоны конфигураций",
      url: "https://bitrix24.ostec-group.ru/crm/type/172/list/category/0/"
    },
    {
      title: "Конфигурации",
      url: "https://bitrix24.ostec-group.ru/crm/type/165/list/category/0/"
    },
    {
      title: "Разрешительные документы",
      url: "https://bitrix24.ostec-group.ru/crm/type/1036/kanban/category/0/"
    },
    {
      title: "Реализация проектов",
      url: "https://bitrix24.ostec-group.ru/crm/type/1040/kanban/category/0/"
    },
    {
      title: "Управление качеством",
      url: "https://bitrix24.ostec-group.ru/crm/type/1050/list/category/0/"
    },
    {
      title: "Внутренняя документация",
      url: "https://bitrix24.ostec-group.ru/crm/type/1056/list/category/0/"
    },
    {
      title: "Файлы",
      url: "https://bitrix24.ostec-group.ru/crm/type/159/list/category/0/"
    },
    {
      title: "Кадровые документы",
      url: "https://bitrix24.ostec-group.ru/crm/type/186/list/category/0/"
    },
    {
      title: "Обученные лица",
      url: "https://bitrix24.ostec-group.ru/crm/type/181/list/category/0/"
    },
    {
      title: "Пользователи МП",
      url: "https://bitrix24.ostec-group.ru/crm/type/151/kanban/category/0/"
    },
    {
      title: "Горыныч",
      url: "https://bitrix24.ostec-group.ru/crm/type/1062/kanban/category/0/"
    }
  ];

  /*
   * Шаблонные переходы запрашивают ID и подставляют его вместо {id}.
   * У смарт-процессов тип берется из уже настроенных ссылок выше, поэтому
   * пользователь выбирает процесс по названию и вводит только ID элемента.
   */
  function createIdTemplate(title, url, fieldLabel, keywords) {
    return {
      title: title,
      keywords: keywords || [],
      template: {
        url: url,
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

  const smartProcessTemplateLinks = smartProcessLinks.map(function (link) {
    const typeMatch = link.url.match(/\/crm\/type\/(\d+)\//);
    return createIdTemplate(
      link.title,
      "https://bitrix24.ostec-group.ru/crm/type/" + typeMatch[1] + "/details/{id}/",
      "ID элемента «" + link.title + "»",
      ["смарт-процесс", "элемент", "по ID"]
    );
  });

  const quickOpenLinks = [
    createIdTemplate(
      "Сделка",
      "https://bitrix24.ostec-group.ru/crm/deal/details/{id}/",
      "ID сделки",
      ["сделки", "CRM", "по ID"]
    ),
    createIdTemplate(
      "Счет",
      "https://bitrix24.ostec-group.ru/crm/type/31/details/{id}/",
      "ID счета",
      ["счета", "CRM", "по ID"]
    ),
    createIdTemplate(
      "Задача",
      "https://bitrix24.ostec-group.ru/company/personal/user/0/tasks/task/view/{id}/",
      "ID задачи",
      ["задачи", "проекты", "по ID"]
    ),
    {
      title: "Смарт-процессы",
      keywords: ["смарт", "SPA", "по ID"],
      links: smartProcessTemplateLinks
    }
  ];

  /*
   * Основные блоки окна "Быстрые ссылки".
   *
   * Простой пункт:
   *   { title: "Название кнопки", url: "https://..." }
   *
   * Пункт с вложенным окном:
   *   { title: "Название кнопки", links: массивСсылок }
   *
   * Порядок элементов в массиве = порядок кнопок в интерфейсе.
   * Сетка сейчас раскладывает кнопки по 4 в строку.
   */
  const sections = [
    {
      title: "Открыть по ID",
      links: quickOpenLinks
    },
    {
      title: "Проекты",
      links: [
        {
          title: "ОТС НПП",
          url: "https://bitrix24.ostec-group.ru/workgroups/group/1023/tasks/"
        },
        {
          title: "Техподдержка Б24",
          url: "https://bitrix24.ostec-group.ru/workgroups/group/972/tasks/"
        },
        {
          title: "Цифровизация БП",
          url: "https://bitrix24.ostec-group.ru/workgroups/group/16/tasks/"
        },
        {
          title: "B24.Update",
          url: "https://bitrix24.ostec-group.ru/workgroups/group/218/tasks/"
        }
      ]
    },
    {
      title: "CRM",
      links: [
        {
          title: "Лиды",
          url: "https://bitrix24.ostec-group.ru/crm/lead/kanban/"
        },
        {
          title: "Сделки",
          keywords: ["сделка", "воронки", "продажи"],
          links: dealLinks
        },
        {
          title: "Клиенты",
          keywords: ["контакты", "компании", "контрагенты"],
          links: clientLinks
        },
        {
          title: "Смарт-процессы",
          keywords: ["смарт", "SPA", "динамические сущности"],
          links: smartProcessLinks
        },
        {
          title: "Счета",
          url: "https://bitrix24.ostec-group.ru/crm/type/31/kanban/category/2/"
        },
        {
          title: "Предложения",
          url: "https://bitrix24.ostec-group.ru/crm/quote/kanban/"
        },
        {
          title: "CRM-формы",
          url: "https://bitrix24.ostec-group.ru/crm/webform/"
        },
        {
          title: "Каталог товаров",
          url: "https://bitrix24.ostec-group.ru/crm/catalog/"
        }
      ]
    },
    {
      title: "Настройка CRM",
      links: [
        {
          title: "Настройка CRM",
          url: "https://bitrix24.ostec-group.ru/crm/configs/"
        },
        {
          title: "ПД CRM",
          url: "https://bitrix24.ostec-group.ru/crm/perms/all/"
        },
        {
          title: "ПД Каталог товаров",
          url: "https://bitrix24.ostec-group.ru/shop/settings/permissions/"
        },
        {
          title: "ПД к документам CRM",
          url: "https://bitrix24.ostec-group.ru/bitrix/components/bitrix/documentgenerator.settings.perms/slider.php"
        },
        {
          title: "БП CRM",
          url: "https://bitrix24.ostec-group.ru/crm/configs/bp/"
        },
        {
          title: "БП Лента",
          url: "https://bitrix24.ostec-group.ru/bizproc/processes/"
        },
        {
          title: "Разработчикам",
          url: "https://bitrix24.ostec-group.ru/devops/"
        }
      ]
    },
    {
      title: "Сотрудники",
      links: [
        {
          title: "Сотрудники",
          url: "https://bitrix24.ostec-group.ru/company/"
        },
        {
          title: "Структура компании",
          url: "https://bitrix24.ostec-group.ru/hr/structure/"
        },
        {
          title: "График отсутствий",
          url: "https://bitrix24.ostec-group.ru/timeman/"
        },
        {
          title: "Видеоконференции",
          url: "https://bitrix24.ostec-group.ru/conference/"
        }
      ]
    },
    {
      title: "Локальные приложения",
      links: [
        {
          title: "Поездки и расходы",
          url: "https://bitrix24.ostec-group.ru/absences/work/"
        },
        {
          title: "Реестр отпусков",
          url: "https://bitrix24.ostec-group.ru/services/lists/99/view/0/"
        },
        {
          title: "Отчеты",
          url: "https://bitrix24.ostec-group.ru/marketplace/app/53/"
        },
        {
          title: "Финансы",
          url: "https://bitrix24.ostec-group.ru/finance/"
        }
      ]
    }
  ];

  const exportedSettings = {
    portalHosts: portalHosts,
    defaultPortalHost: defaultPortalHost,
    defaultCollapsedSections: defaultCollapsedSections,
    defaultOpenAllSections: defaultOpenAllSections,
    sections: sections
  };

  /* Firefox может разделять globalThis и window в контексте расширения. */
  root.B24QL_SETTINGS = exportedSettings;
  if (typeof window !== "undefined") {
    window.B24QL_SETTINGS = exportedSettings;
  }
})(typeof globalThis !== "undefined" ? globalThis : window);
