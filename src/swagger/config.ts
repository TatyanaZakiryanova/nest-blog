import { Options } from 'swagger-jsdoc';

const swaggerConfig: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog API',
      version: '1.0.0',
      description: 'Swagger YAML-based docs',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['src/swagger/*.yaml'],
};

export default swaggerConfig;
