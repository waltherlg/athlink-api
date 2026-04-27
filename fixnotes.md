Контекст заданий: реализовать валидацию внесения результата при создании trainingRecords.

на frontend есть страница создания записи trainingRecords. сейчас вписывается заметка для тренера, заметка для себя и просто результат в виде строки.

Нужно изменить формат создания записи:
во первых, результат будет приниматься как number а не string.
Прежде чем записать результат, пользователь выбирает SportEvent (по русски будет "упражнение"). То есть слева от поля вписывания результата, нужно нажать на стрелочку и открыть список упражнений.
Первым на выбор free training (свободная тренировка), если это выбрать, то запись именно результата не будет доступна, можно будет вписать только личные и тренерский заметки.

Кроме free trainig можно будет выбрать event. Однако список event хранится в БД.

в файле C:\Users\user\Desktop\prod\athlink-api\apps\backend\src\core\database\prisma\schema.prisma

есть модель

model SportEvent {
id String @id @default(uuid()) @db.Uuid

sportType SportType

code String
name String

resultType ResultType

maxScore Float?
decimals Int?

createdAt DateTime @default(now())

trainingRecords TrainingRecord[]

@@unique([sportType, code])
}

При миграции БД будет заполнятся сидом из этого файла
C:\Users\user\Desktop\prod\athlink-api\apps\backend\src\core\database\prisma\seed.ts

сама модель записи теперь такая:
model TrainingRecord {
id String @id @default(uuid()) @db.Uuid

trainingJournalId String @db.Uuid
trainingJournal TrainingJournal @relation(fields: [trainingJournalId], references: [id], onDelete: Cascade)

type TrainingRecordType

eventId String? @db.Uuid
event SportEvent? @relation(fields: [eventId], references: [id])

result Float?
coachNotes String?
privateNotes String?

createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}
Логика такая: Когда юзер открывает окно создания записи,
Автоматически идет запрос на эндпоинт, что бы получить все events вида спорта из журнала. Сами events содержат начальные файлы валидации. Например

      sportType: 'SHOOTING_RIFLE_PISTOL',
      code: 'AIR_RIFLE_60',
      name: 'Air Rifle 60',
      resultType: 'SCORE',
      maxScore: 654,
      decimals: 1,

      значит результат должен быть числом с одной десятой (но допустимо что бы пользователь писал целое число, тогда ноль после запятой пусть добавится сам. Результат не может быть больше 654).

      если например decimals: 0, то ввод десятых недопустимо

обрати внимание на TrainingRecordType, если пользователь выбирает free training тогда тип записи - free, если пользователь выбирает конкретный event, то тип записи - structured.

эту логику и нужно реализовать.

Я сделал файл контроллера, но ты заполни его сам. Для примера возьми любой другой контроллер.
C:\Users\user\Desktop\prod\athlink-api\apps\backend\src\features\sport-events\api\sport-event.controller.ts

gpt советует для передачи sport-type использовать query параметр:

Лучший вариант для тебя сейчас:

GET /events?sportType=SHOOTING_RIFLE_PISTOL

👉 через query param, а не в URI

SportTypeEnum лежит в shared-types

я сделал репозиторий с методом возвращения всех events по sporttype.

в shared-types нужно будет сделать view типы для events.
