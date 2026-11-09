# Упражнение 7 – React магазин

Проектът използва Node.js 26 LTS чрез Docker Compose. React приложението работи на порт 5173, а REST услугата от `json-server` е достъпна на порт 8001. Вътре в Docker контейнера услугата продължава да работи на порт 8000.

## Стартиране

```bash
docker compose up
```

Отворете <http://localhost:5173>. REST данните са достъпни на <http://localhost:8001/items/>.

## Проверки

```bash
docker compose run --rm react npm run lint --prefix react-app
docker compose run --rm react npm run build --prefix react-app
```
