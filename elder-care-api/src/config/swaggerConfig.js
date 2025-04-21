// swaggerConfig.js
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API tự động',
        version: '1.0.0',
        description: 'API tự động được tạo ra bằng Swagger và Express',
    },
    servers: [
        {
            url: 'http://localhost:3000',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: [
        './server.js',
        './src/routes/authRouter.js',
        './src/routes/otpRouter.js',
        './src/routes/serviceRouter.js',
        './src/routes/profileRouter.js',
        './src/routes/bookingRouter.js',
        './src/routes/doctorRouter.js',
        './src/routes/nurseRouter.js',
        './src/routes/scheduleRouter.js',
        './src/routes/salaryRouter.js',

    ], // Đảm bảo Swagger có thể tìm thấy các endpoint của bạn
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
