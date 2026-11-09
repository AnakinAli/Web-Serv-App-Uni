# Упражнение 11 – WebSocket и Weather API

Проектът използва React, TypeScript, `react-use-websocket` и Docker с Node.js 26 LTS.

## WeatherAPI ключ

1. Регистрирайте безплатен профил в <https://www.weatherapi.com/>.
2. Отворете файла `.env` в папката `upr11`.
3. Добавете ключа:

```env
VITE_WEATHER_API_KEY=вашият_ключ
```

4. Пресъздайте контейнера:

```bash
docker compose up -d --force-recreate client
```

Ключовете с префикс `VITE_` са видими в браузъра. За production приложение заявката трябва да минава през собствен backend, който пази ключа на сървъра.

## CoinCap WebSocket

Приложението винаги се свързва към зададения в условието адрес:

```text
wss://ws.coincap.io/prices?assets=bitcoin,ethereum
```

Ако вашият CoinCap план предоставя WebSocket API ключ, може да добавите и `VITE_COINCAP_API_KEY` в `.env`. При отворена връзка без ценови съобщения интерфейсът показва диагностично съобщение.

## Стартиране

```bash
docker compose up
```

Приложението е достъпно на <http://localhost:5177>.

## Проверки

```bash
docker compose run --rm client npm run lint --prefix react-app
docker compose run --rm client npm run build --prefix react-app
```
