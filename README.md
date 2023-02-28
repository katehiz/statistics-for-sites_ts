Серверное приложения для сбора данных производительности сайтов.
из Google Pagespeed Insights: https://developers.google.com/speed/pagespeed/insights/

Google Api docs: https://developers.google.com/speed/docs/insights/rest/v5/pagespeedapi/runpagespeed

# Структура проекта
* Файл `./app-node/modules/ParseMetrics` для парсинга метрики
* Файл `./app-node/config/parse.js` содержит общие настройки, а также url's страниц для сбора показателей производительности
* Файл `./index.js` содержит функцию исполнителя расписания, т.е. запускает в назначенное время парсинг данных для всех сайтов в мобильной и desktop версиях.
* В директории `./app` -  фронтенд с графиками
* `./dist` - директория для продуктового фронта. Там создаётся файл stats.json
* `./dist/stats.json` - JSON файл для накопления метрики. При запуске продуктовой сборки `npm run build` он копируется из `./public/stats.json`, поэтому  не забудьте сделать резервную копию файла, т.к. он перезатрётся после сборки.

Запуск сервера. Сервер парсит данные и складывает в dist/stats.json
`node index.js`

Сборка фронта:
`npm run serve` - для разработки.
`npm run build` - продовая. Запускать на боевом сервере после обновления
Для локальной разработки, чтобы обновить даты слепков в stats.json, запустите `node setActualMetricsDates.js`. Даты слепков в `public/stats.json` сдвинутся с учётом текущей даты.

# Руководство по настройке сервера

Сборка
```
1. перед сборкой надо остановить супервизор: `<supervisor-name> stop <process-name>`
2. перейти в директорию проекта
3. стянуть с гита изменения `git pull origin master`
4. Запустить сборку `npm run build`. Cкопировать в папку `./dist` сохранённую копию `stats.json`
5. Запустить node сервер: `<supervisor-name> stop <process-name>`
```

Логи:
```
NodeJS: `tail -f /var/log/nodejs.log`
cупервизор: tail -f /var/log/supervisord.log
```

Как только вы определите, какой часовой пояс соответствует вашему местоположению, выполните следующую команду от имени пользователя sudo:
```
sudo timedatectl set-timezone your_time_zone
```

Например, чтобы изменить часовой пояс системы на Europe/Moscow:
```
sudo timedatectl set-timezone Europe/Moscow
```

Вызовите timedatectlкоманду для проверки изменений: `timedatectl`
