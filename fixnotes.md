У нас есть страница http://localhost:4173/password-recovery
Она отвравляет код на наш эмейл. Но не понятно куда этот код вставлять.

Сейчас есть эндпоинт
@PasswordRecoverySwagger()
@HttpCode(HttpStatus.NO_CONTENT)
@Post(authPaths.passwordRecovery)
async passwordRecovery(@Body() dto: PasswordRecoveryInputDto): Promise<void> {
await this.commandBus.execute(new PasswordRecoveryCommand(dto.email));
}

но может сложиться впечатление что именно он меняет пароль.

Задача: изменить нейминг этого эндпоинта и всем что с ним связано, что бы четко было видно, что это ЗАПРОС на изменения пароля.

Задача 2: Сделать флоу смены пароля.
В модель User призмы добавить passwordRecoveryCode и дату его истечения.
добавить входные типы и path для этого flow в shared-types, объект должен состоять из кода и эмейла юзера
Добавить эндпоинт для смены пароля в authController. Не защищен гвардом.

в БД сделать метод для смены пароля - должен принимать эмейл, код, хеш пароля.
Сделать юзкейс для смены пароля.
