const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API documentation for my application",
    },
    servers: [
      {
        url: "http://localhost:8080",
        description: "Local server",
      },
    ],
  },
  apis: ["./routes/*.js"], // Đường dẫn tới các file chứa định nghĩa API của bạn
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };
