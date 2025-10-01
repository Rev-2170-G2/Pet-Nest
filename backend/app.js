const express = require('express');
const bodyParser = require('body-parser');
const { loggerMiddleware } = require('./util/logger');
const { authenticateToken } = require('./util/jwt');

const userRoutes = require('./routes/api/userRoutes');
const eventRoutes = require('./routes/api/eventRoutes');

const app = express();

app.use(bodyParser.json());
app.use(loggerMiddleware);

// can change /api to something else if desired
app.use('/api/users', userRoutes);
app.use('/api/events', authenticateToken, eventRoutes);

app.get('/', (req, res) => { 
    res.send('Home Page');
});

module.exports = app;