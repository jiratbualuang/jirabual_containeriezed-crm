const express = require('express');
const mongoose = require('mongoose');
const routes = require('./src/routes/userRoutes.js');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CRM API',
      version: '1.0.0',
      description: 'A simple CRM API',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // paths to files containing Swagger annotations
};
const swaggerSpec = swaggerJsdoc(options);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017/CRMdb');

// For parsing application/json
app.use(express.json());
// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static("public"));

// JWT setup
app.use((req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
        jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            req.user = decode;
            next();
        });
    } else {
        return res.status(401).json({ message: 'Unauthorized' });
    }
});

// Routes
routes(app); // Assuming routes are defined in userRoutes.js

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @openapi
 * /:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
app.get('/', (req, res) => 
    res.send(`Node and express server is running on port ${PORT}`)
);

app.listen(PORT, '0.0.0.0', () => 
    console.log(`Your server is running on port ${PORT}`)
);
