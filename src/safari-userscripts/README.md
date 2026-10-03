# Safari Userscripts

Safari-версия состоит из двух userscript-файлов:

- `b24-quick-links-safari.user.js` — интерфейс, настройки, хранение и открытие вкладок;
- `b24-quick-links-bxui-safari.user.js` — мост к `BX.UI` в контексте страницы Bitrix24.

Оба файла собираются из актуальных исходников Chromium-комплекта командой:

```bash
npm run build:safari
```

Сборка работает на шести порталах:

- `https://bitrix24.ostec-group.ru/*`;
- `https://bitrix24test.ostec-group.ru/*`;
- `https://bitrix24develop.ostec-group.ru/*`;
- `https://bitrix24.selectica.ru/*`;
- `https://bitrix24test.selectica.ru/*`;
- `https://bitrix24develop.selectica.ru/*`.

## Установка

1. Установить Userscripts из App Store и включить расширение в Safari.
2. Разрешить Userscripts доступ к шести порталам Bitrix24 из списка выше. Доступ ко всем остальным сайтам не требуется.
3. Открыть приложение Userscripts и посмотреть путь `Save Location`.
4. В Finder открыть этот путь и скопировать в папку `scripts` оба `.user.js` из `releases/1.0/safari`.
5. Нажать значок Userscripts в Safari и убедиться, что на портале отображаются оба скрипта.
6. Обновить вкладку портала.

Скрипты сохраняются в Userscripts и продолжают работать после перезапуска Safari. Ежедневная переустановка не требуется.

Настройки хранятся через асинхронные `GM.getValue` и `GM.setValue`. Новые вкладки открываются через `GM.openInTab`. Интерфейс `BX.UI` работает через отдельный page-context userscript, потому что API `GM.*` доступны только в content-контексте Userscripts.

При закрытии панели ее DOM полностью удаляется. Во время поиска исходные кнопки не остаются скрытыми копиями: отображается только текущий набор результатов.
