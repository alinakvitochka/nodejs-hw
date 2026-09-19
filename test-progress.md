# Smoke-тест: 04-auth (покроковий план)

Розбито з розділу «Верифікація» в `plan.md`. Кожна частина має окремий скрипт
у `scripts/smoke/` і запускається незалежно (кожний створює свого юзера з унікальним email).

Запуск усього: `npm run smoke` (сервер має працювати: `npm run dev` / `npm start`).

Або по частинях: `node scripts/smoke/01-register.mjs` тощо.

## Частина 1 — Реєстрація (`01-register.mjs`)
- [x] 1.1 `POST /auth/register` → **201**, тіло — user **без** `password`
- [x] 1.2 Куки `accessToken`, `refreshToken`, `sessionId` проставлені (`Set-Cookie`)
- [x] 1.3 Куки мають атрибути `HttpOnly`, `Secure`, `SameSite=None`
- [x] 1.4 Повторний register з тим самим email → **400** `'Email in use'`
- [x] 1.5 Невалідне тіло (пошкіджений email, короткий пароль) → **400** (celebrate)

## Частина 2 — Логін (`02-login.mjs`)
- [x] 2.1 `POST /auth/login` з коректними даними → **200** + нові куки
- [x] 2.2 Неправильний пароль → **401** `'Invalid credentials'`
- [x] 2.3 Невідомий email → **401** `'Invalid credentials'`

## Частина 3 — Auth-захист /notes (`03-auth-guard.mjs`)
- [x] 3.1 `GET /notes` **без** кук → **401** `'Missing access token'`
- [x] 3.2 `GET /notes` з куками → **200**, `notes` — масив, `totalNotes` — число

## Частина 4 — CRUD нотаток (`04-notes-crud.mjs`)
- [x] 4.1 `POST /notes` → **201**, у нотатки додано `userId`
- [x] 4.2 `GET /notes` — містить створену нотатку
- [x] 4.3 `GET /notes/:noteId` → **200**
- [x] 4.4 `PATCH /notes/:noteId` → **200**, поля оновлено
- [x] 4.5 `DELETE /notes/:noteId` → **200**; подальше `GET /notes/:noteId` → **404**
- [x] 4.6 Невалідний `noteId` (не ObjectId) → **400** (celebrate)

## Частина 5 — Приватність: чужі нотатки (`05-foreign-note.mjs`)
- [x] 5.1 `GET /notes/:id` чужої нотатки → **404** `'Note not found'`
- [x] 5.2 `PATCH /notes/:id` чужої → **404** `'Note not found'`
- [x] 5.3 `DELETE /notes/:id` чужої → **404** `'Note not found'`
- [x] 5.4 `GET /notes` другого юзера не містить чужих нотаток

## Частина 6 — Refresh сесії (`06-refresh.mjs`)
- [x] 6.1 `POST /auth/refresh` з куками → **200** `{ "message": "Session refreshed" }`
- [x] 6.2 Нові куки (accessToken відрізняється від старого) і працюють: `GET /notes` → **200**
- [x] 6.3 Старі куки після refresh більше не працюють → **401** `'Session not found'`
- [x] 6.4 `POST /auth/refresh` без кук → **401** `'Session not found'`
- [x] 6.5 Псута `sessionId`-кука → **401** `'Session not found'`

## Частина 7 — Логаут (`07-logout.mjs`)
- [x] 7.1 `POST /auth/logout` → **204**
- [x] 7.2 `Set-Cookie` очищає 3 куки (`accessToken`, `refreshToken`, `sessionId` = порожні)
- [x] 7.3 `GET /notes` зі старими куками → **401** (сесію видалено)

## Частина 8 — 404 handler (`08-not-found.mjs`)
- [x] 8.1 `GET /nonexistent-route` → **404** `'Route not found'`

## Частина 9 — Деплой (ручна перевірка, окремо)
- [ ] 9.1 Push `04-auth` на GitHub (почекати 5 хв після деплою)
- [ ] 9.2 На render.com: реєстрація/логін через HTTPS працюють (secure-куки)
- [ ] 9.3 `GET /notes` захищений на продакшені

## Результати

| Дата | Запуск | Частина 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 (деплой) |
|---|---|---|---|---|---|---|---|---|---|---|
| 2026-09-19 | `npm run smoke` | ✅ 6/6 | ✅ 5/5 | ✅ 2/2 | ✅ 8/8 | ✅ 6/6 | ✅ 6/6 | ✅ 3/3 | ✅ 1/1 | ⏳ ручна перевірка |

> Зауваження (2026-09-19): частина 5 спочатку провалилася — `PATCH /notes/:id` чужої нотатки повертав 200, бо `filter` не є валідним опцією `findByIdAndUpdate` у mongoose 9 (ігнорувався). Виправлено: `updateNote` тепер використовує `findOneAndUpdate({ _id, userId })` — після фікса весь smoke-прохід зелений.