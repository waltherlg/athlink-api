Прочитай AI_CONTEXT.md

Для контекста:

типизация ошибок в проекте устроена так:

в файле C:\Users\user\Desktop\prod\athlink-api\packages\shared-types\src\error-codes.ts
коды ошибок разных фич, по задумке эти коды видят и фронт и бек.

Сами обекты ошибок на бекенде разбросаны по фичам, например:
C:\Users\user\Desktop\prod\athlink-api\apps\backend\src\features\accounts\consts\account-errors.consts.ts

Объекты ошибок используются для заполнения домейных эксепшенов, например:

if (!user) {
throw BadRequestDomainException.create(ACCOUNT_ERRORS.EMAIL_NOT_FOUND);
}

так же эти объекты ошибок используются в сваггере, например
C:\Users\user\Desktop\prod\athlink-api\apps\backend\src\features\accounts\api\swagger\auth.swagger.ts

В чем проблема: фронтэнд имеет доступ только к error-code из shared-types, но не имеет понятия какие объекты приходят от бэкэнда (по задумаке он должен был получать это от сваггера, но это плохо сработало).

мне нужно перенести объекты ошибок из бэкенда в shared-types, от туда уже импортировать их и в бэкенд и фронтэнд. Заодно объеденить эти объекты ошибок с C:\Users\user\Desktop\prod\athlink-api\packages\shared-types\src\error-codes.ts или же попросту удалить C:\Users\user\Desktop\prod\athlink-api\packages\shared-types\src\error-codes.ts.

Вторая проблема: в папке C:\Users\user\Desktop\prod\athlink-api\packages\shared-types\src становится слишком много файлов.
Файлы типизаций нужно будет разбить по папкам (по фичам), а заодно же по этим же папкам можно будет распихать объекты ошибок.

Не приступай к изменению кода. Сначала напиши понимаешь ли ты проблему и задачу. Дай свои предложения и советы.
