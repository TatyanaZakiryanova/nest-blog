# Nest Blog

**Backend API блога на NestJS, PostgreSQL и TypeORM**. Включает **JWT-аутентификацию**, **RBAC**, **загрузку файлов** в облако, **WebSocket-соединения** для realtime-функциональности.

⚠️ _Первая загрузка сервера на Render может занять до 1 минуты. Пожалуйста, подождите_

## 🔗 Quick Links

[**Swagger docs**](https://nest-blog-7ygh.onrender.com/docs) _(use `/auth/register` to get tokens)_

## 🛠️ Technologies

- **Node.js + Nest.js**
- **PostgreSQL** (TypeORM)
- **JWT** - аутентификация и авторизация
- **bcrypt** - хэширование паролей
- **Multer + Cloudinary** - загрузка изображений
- **Zod** - валидация входящих данных
- **nestjs/config**, **dotenv** - конфигурация окружения
- **Neon, Render** - деплой
- **Swagger** - документация

## 💻 Features

### Authentication & Authorization

- Аутентификация и регистрация пользователей с использованием **JWT token**
- Управление доступом на основе ролей через **RolesGuard**. **Права администратора**:
  - Получение списка всех юзеров с указанием ролей
  - Удаление любого юзера, поста и комментария
- **AuthGuard** для защиты маршрутов
- **Admin seeding** при первом подключении к БД

### CRUD & Database

- **CRUD** для постов и комментариев
- Валидация данных с использованием **схем Zod** (создан **ZodValidationPipe**) и **DTO**
- Атомарные операции с БД с использованием **TypeORM transactions** (**increment/decrement commentsCount** поста при создании/удалении комментария)

### Pagination

- **offset/limit пагинация** для списка постов и комментариев
- Поддержка query-параметров: `?page=1&limit=10`
- Возвращаются метаданные: **total**, **page**, **lastPage**

### WebSocket Gateway (online status)

- Реализовано **WebSocket-соединение** с **JWT-аутентификацией** (через `handshake.auth.token`)
- Статус пользователя (online/offline) **сохраняется в БД**
- Статусы обновляются при:
  - подключении (`handleConnection`)
  - отключении (`handleDisconnect`)

### Security & Performance

- Включена защита заголовков с помощью **Helmet**
- Открыт доступ по **CORS**
- Ограничение количества запросов через **ThrottlerModule**: `limit: 10`

### Мedia

- Загрузка изображений через **Multer + Cloudinary**

#### File Upload explanation

- Frontend отправляет POST-запрос **multipart/form-data** с изображением
- Nest.js контроллер использует встроенные валидаторы (максимальный размер, тип файла) через **ParseFilePipe**
- Контроллер передаёт `Express.Multer.File` в **UploadService**
- **UploadService**:
  - Преобразует file's **buffer** в **readable stream**: `Readable.from(file.buffer)`
  - Отправляет этот поток в **Cloudinary's upload_stream**
  - Возвращает `{ url: 'https://res.cloudinary.com/...' }`

### Deployment & Docs

- **Swagger** документация с использованием **YAML** файлов
- Деплой бэкенда - **Render**, деплой PostgreSQL базы - **Neon**

## 📁 Architecture

```bash
migrations/
src/
├── admin/
├── auth/
├── comments/
├── common/
├── posts/
├── seed/
├── swagger/
├── upload/
├── users/
├── ws/
```

## 🪄 How to start project

clone the repository:

```bash
git clone
```

in the project directory, run:

```bash
npm install
```

create **.env** file with _.env.example_ in the root directory, then build the project:

```bash
npm run build
```

start the server:

```bash
npm start
```
