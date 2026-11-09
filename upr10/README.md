# Упражнение 10 – MongoDB и Mongoose

Проектът използва Docker вместо локално изтегляне на ZIP архивите. MongoDB работи в отделен контейнер, Express и nodemon – в Node.js 26 LTS контейнер, а React клиентът е в трети контейнер.

## Стартиране

```bash
docker compose up
```

- React клиент: <http://localhost:5176>
- Express API: <http://localhost:3003>
- API диагностика: <http://localhost:3003/api/health>
- MongoDB Compass: `mongodb://localhost:27018/excursions`

Базата е `excursions`, а началните колекции са:

- `excursions`
- `products`
- `users`

Данните се пазят във Docker volume `upr10_mongo_data`.

## Основни файлове

- `start-express-with-mongodb.js` – Express маршрути и REST услуги
- `mongoDB.js` – примери с директния MongoDB Node.js driver
- `models.js` – Mongoose схеми, модели и начални данни

## Маршрути

- `GET /api/excursions`
- `GET /api/products`
- `GET /api/users`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`
- `GET /mongo/mongodb`
- `GET /mongo/test`

## Проверки

```bash
docker compose run --rm --no-deps client npm run lint --prefix react-app
docker compose run --rm --no-deps client npm run build --prefix react-app
docker compose exec -T api npm run test:integration
```

Интеграционният тест създава временен потребител, редактира точките му и го изтрива.
