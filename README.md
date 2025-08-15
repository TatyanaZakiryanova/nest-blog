# Nest Blog

**Backend API for a blog built with NestJS, PostgreSQL, and TypeORM.** Implements **JWT authentication**, **role-based access control**, **cloud file uploads**, and **WebSocket** support for real-time features.

⚠️ _Please note: free Render server may take up to 1 minute to wake up on first request._

## 🔗 Quick Links

[**Swagger docs**](https://nest-blog-7ygh.onrender.com/docs) _(use `/auth/register` to get tokens)_

[**README на русском**](./README.ru.md)

## 🛠️ Technologies

- **Node.js + Nest.js**
- **PostgreSQL** (TypeORM)
- **JWT** - authentication and authorization
- **bcrypt** - password hashing
- **Multer + Cloudinary** - image uploads
- **Zod** - input validation
- **nestjs/config**, **dotenv** - environment configuration
- **Neon, Render** - deployment
- **Swagger** - API documentation

## 💻 Features

### Authentication & Authorization

- User authentication and registration with **JWT token**
- **Role-based access control** using **RolesGuard**. **Admin privileges**:
  - View list of all users with their roles
  - Delete any user, post, or comment
- **AuthGuard** for route protection
- **Admin seeding** on initial database connection

### CRUD & Database

- **CRUD** operations for posts and comments
- Data validation using **Zod schemas** (custom **ZodValidationPipe**) and **DTOs**
- Atomic DB operations via **TypeORM transactions** (e.g., **increment/decrement commentsCount** when comments are added/removed)

### Pagination

- **offset/limit pagination** for posts and comments
- Supports query parameters: `?page=1&limit=10`
- Returns metadata: **total**, **page**, **lastPage**

### WebSocket Gateway (online status)

- **WebSocket connection** with **JWT authentication** (`handshake.auth.token`)
- User status (online/offline) is **persisted in the database**
- Status updates on:
  - Connection (`handleConnection`)
  - Disconnection (`handleDisconnect`)

### Security & Performance

- HTTP header protection via **Helmet**
- **CORS** enabled
- Rate limiting via **ThrottlerModule**: `limit: 10`

### Мedia

- Image uploads using **Multer + Cloudinary**

#### File Upload explained

- Frontend sends a **multipart/form-data** POST request with an image under the image field
- NestJS controller uses **built-in validators** (max size, file type) via **ParseFilePipe**
- Controller passes the file `Express.Multer.File` to the **UploadService**
- **UploadService**:
  - Converts the file's **buffer** to a **readable stream**: `Readable.from(file.buffer)`
  - Sends that stream to **Cloudinary's upload_stream**
  - On success, resolves the URL `secure_url` returned by Cloudinary
  - Returns an object `{ url: 'https://res.cloudinary.com/...' }`

### Deployment & Docs

- **Swagger documentation** generated from **YAML files**
- Backend deployed on **Render**, PostgreSQL database hosted on **Neon**

## 📁 Architecture

```bash
migrations/
src/
├── admin/
├── auth/
├── comments/
├── common/
├── config/
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
