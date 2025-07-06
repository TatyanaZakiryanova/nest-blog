## File Upload explanation

- Frontend sends a **multipart/form-data** POST request with an image under the image field.
- NestJS controller uses **built-in validators** (max size, file type) via **ParseFilePipe**.
- Controller passes the file `Express.Multer.File` to the **UploadService**.
- **UploadService**:
  - Converts the file's **buffer** into a **readable stream**: `Readable.from(file.buffer)`
  - Sends that stream to **Cloudinary's upload_stream**
  - On success, resolves the URL `secure_url` returned by Cloudinary
  - Returns an object `{ url: 'https://res.cloudinary.com/...' }`

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```
