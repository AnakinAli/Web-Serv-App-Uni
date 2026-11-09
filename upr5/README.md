# Упражнение 5 – React компоненти

Проектът използва Node.js 26 LTS чрез Docker Compose.

## Стартиране

```bash
docker compose run --rm react npm install --prefix react-app
docker compose up
```

Приложението е достъпно на <http://localhost:5173>.

## Проверка

```bash
docker compose run --rm react npm run lint --prefix react-app
docker compose run --rm react npm run build --prefix react-app
```
