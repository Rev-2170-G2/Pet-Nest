const express = require('express');
const bodyParser = require('body-parser');
const { loggerMiddleware } = require('./util/logger');
const { authenticateToken } = require('./util/jwt');

const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(bodyParser.json());
app.use(loggerMiddleware);

app.use('/users', userRoutes);

app.get('/', (req, res) => { 
    res.send('Home Page');
})

module.exports = app;