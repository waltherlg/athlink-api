Я изменил типизацию в C:\Users\user\Desktop\prod\athlink-api\packages\shared-types. Во всех типах где было trainingJournalId: string я поменял на journalId: string. В backend я везде исправил что с этим звязано, но тебе надо будет исправить это на frontend.

создал фичу с тренерами
C:\Users\user\Desktop\prod\athlink-api\apps\backend\src\features\coaches

начиная с контроллера
C:\Users\user\Desktop\prod\athlink-api\apps\backend\src\features\coaches\api\coaches.controller.ts

пользователь может создать свой профайл как тренера.
