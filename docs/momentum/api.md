# API Документация

## Аутентификация

Все API запросы (кроме регистрации/входа) требуют JWT токен:
```
Authorization: Bearer <jwt_token>
```

## REST API

### Пользователи

#### Регистрация
- `POST /api/auth/register`
- Body: `{ username: string, email: string, password: string }`
- Ответ: `{ success: boolean, token?: string }`

#### Вход
- `POST /api/auth/login`
- Body: `{ email: string, password: string }`
- Ответ: `{ success: boolean, token?: string }`

### Игры

#### Создать комнату
- `POST /api/games/create`
- Body: `{ name?: string, questionCount?: number }`
- Ответ: `{ success: boolean, roomCode: string }`

#### Присоединиться к комнате
- `POST /api/games/join`
- Body: `{ roomCode: string }`
- Ответ: `{ success: boolean, game: object }`

#### Начать игру
- `POST /api/games/:roomCode/start`
- Ответ: `{ success: boolean }`

### Вопросы

#### Получить вопросы
- `GET /api/questions?category=:category&count=:count`
- Ответ: `{ success: boolean, questions: array }`

## WebSocket API

### События клиента → сервера

#### Присоединиться к комнате
```javascript
socket.emit('join_room', {
  roomCode: string,
  token: string
});
```

#### Ответить на вопрос
```javascript
socket.emit('answer_question', {
  roomCode: string,
  answer: number
});
```

#### Начать игру
```javascript
socket.emit('start_game', {
  roomCode: string
});
```

### События сервера → клиента

#### Новый вопрос
```javascript
socket.on('question_started', (data) => {
  // data: { question: object, timeLimit: number }
});
```

#### Результаты вопроса
```javascript
socket.on('question_ended', (data) => {
  // data: { correctAnswer: number, results: array }
});
```

#### Финальные результаты
```javascript
socket.on('game_results', (data) => {
  // data: { leaderboard: array }
});
```

## Примеры использования

### WebSocket подключение
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

// Присоединиться к комнате
socket.emit('join_room', {
  roomCode: 'ABC123',
  token: localStorage.getItem('token')
});

// Обработка вопросов
socket.on('question_started', (data) => {
  console.log('Вопрос:', data.question);
});

socket.on('question_ended', (data) => {
  console.log('Результаты:', data.results);
});
```

### API запросы
```bash
# Создать комнату
curl -X POST http://localhost:3000/api/games/create \
  -H 'Authorization: Bearer <token>' \
  -d '{"questionCount":10}'

# Получить вопросы
curl -X GET "http://localhost:3000/api/questions?count=5" \
  -H 'Authorization: Bearer <token>'
```
