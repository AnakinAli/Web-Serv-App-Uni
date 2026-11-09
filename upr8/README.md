# Упражнение 8 – Firestore

Проектът използва Node.js 26 LTS чрез Docker Compose:

- React клиент: <http://localhost:5174>
- Express API: <http://localhost:3001/products>
- Диагностика: <http://localhost:3001/health>

## Firebase настройка

1. Създайте Firebase проект и Firestore база `Store1Database`.
2. Създайте колекция `products`.
3. Добавете документи с полета `name`, `price` и `img`. Firestore създава идентификатора на документа, който API връща като `id`.
4. Заменете placeholder стойностите в `.env` и `.env.production` с параметрите от Firebase Console.

Примерни продукти:

```json
{
  "name": "Тениска",
  "price": 19.90,
  "img": "tshirt.svg"
}
```

```json
{
  "name": "Спортни обувки",
  "price": 89.50,
  "img": "shoes.svg"
}
```

## Обновяване на криптирания vault

Версия `1.21.0` запазва командата `local build`, използвана в условието:

```bash
docker compose run --rm api npx --yes dotenv-vault@1.21.0 local build
```

Командата генерира `.env.vault` и `.env.keys`. Файлът `.env.keys` не трябва да се добавя в Git.

## Стартиране

За разработка чрез `.env`:

```bash
docker compose up
```

За проверка на production vault в Windows Command Prompt:

```bat
set DOTENV_KEY=dotenv://:production_key@dotenv.local/vault/.env.vault?environment=production
docker compose up
```

За Linux/macOS:

```bash
DOTENV_KEY='dotenv://:production_key@dotenv.local/vault/.env.vault?environment=production' docker compose up
```

## Проверки

```bash
docker compose run --rm client npm run lint --prefix react-app
docker compose run --rm client npm run build --prefix react-app
```
