# Упражнение 9 – Екскурзии

Приложението използва React, TypeScript, Fetch API, Express и MongoDB. Всички услуги работят чрез Docker Compose с Node.js 26 LTS.

## Стартиране

```bash
docker compose up
```

- React клиент: <http://localhost:5175>
- Express REST API: <http://localhost:3002/api>
- API диагностика: <http://localhost:3002/api/health>

MongoDB работи само във вътрешната Docker мрежа. Данните се пазят във volume `upr9_mongo_data`.

## Демонстрационен администратор

- Потребителско име: `admin`
- Парола: `pass`

Входът с парола в URL заявка е реализиран според условието. В реално приложение трябва да се използват POST заявка, хеширани пароли и постоянни защитени сесии.

## Реализирани REST услуги

- `GET /api/excursions`
- `GET /api/excursions?available=true`
- `POST /api/registrations`
- `DELETE /api/registrations/:cancellationCode`
- `GET /api/users?userName=admin&password=pass`
- `GET /api/registrations?excursionId=...` – изисква администраторски token

## JSON Server вариант

Файлът `data.json` запазва варианта от задачи 1–3. Той може да бъде стартиран отделно на порт 8002:

```bash
docker compose --profile json-server up json-server
```

Крайният React клиент използва Express + MongoDB варианта от задачи 4–5.

## Проверки

```bash
docker compose run --rm client npm run lint --prefix react-app
docker compose run --rm client npm run build --prefix react-app
docker compose exec -T api npm run test:integration
```

Интеграционният тест създава временна регистрация, влиза като администратор, проверява списъка, отказва регистрацията и потвърждава, че свободното място е възстановено.
