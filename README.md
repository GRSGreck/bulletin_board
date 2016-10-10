#Bulletin board

API написано на **Nodejs v.4.6.0**

## Разворачивание проекта

1) Установка зависимостей - **npm install**
2) Запуск сервера - **npm start**
    
### Режимы

1) **development** - (_default_), при ошибке выводит стек вызова функций,
в логи выводит все уровни логирования "debug", "warn","info",
"error", настройки находятся в файле `"/config/development.js"`
2) **production** - при ошибке не выводит стек вызова функций, в логи
выводит только уровень "error" (не выводит: "debug", "warn", "info"),
настройки находятся в файле `"/config/production.js"`. Что бы
запустить сервер в режиме "production" нужно в файле package.json
в поле start (_"start": "NODE_ENV=development node app.js"_) заменить
слово "development" на "production" (_"start": "NODE_ENV=production_
_node app.js"_) и запустить (перезапустить сервер).