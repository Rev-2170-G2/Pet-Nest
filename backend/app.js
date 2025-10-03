const express = require('express');
const bodyParser = require('body-parser');
const { loggerMiddleware } = require('./util/logger');
const { authenticateToken } = require('./util/jwt');

const userRoutes = require('./routes/api/userRoutes');
const petRoutes = require('./routes/api/petRoutes');
const eventRoutes = require('./routes/api/eventRoutes');
const offerRoutes = require('./routes/api/offerRoutes');

const app = express();

app.use(bodyParser.json());
app.use(loggerMiddleware);

// can change /api to something else if desired
app.use('/api/users', userRoutes);
app.use('/api/pets', authenticateToken, petRoutes);
app.use('/api/events', authenticateToken, eventRoutes);
app.use('/api/offers', offerRoutes);

app.get('/', (req, res) => { 
    res.send('Home Page');
});

module.exports = app;