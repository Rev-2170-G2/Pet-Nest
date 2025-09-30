const express = require('express');
const bodyParser = require('body-parser');
const { loggerMiddleware } = require('./util/logger');
const { authenticateToken } = require('./util/jwt');

const userRoutes = require('./routes/api/userRoutes');
const petRoutes = require('./routes/api/petRoutes');

const app = express();

app.use(bodyParser.json());
app.use(loggerMiddleware);

// can change /api to something else if desired
app.use('/api/users', userRoutes);
app.use('/api/pets', petRoutes);

// example of middleware usage on a suite of routes
// app.use('/api/route', authenticateToken, someRoutes);

// for testing purposes only 
app.get('/', (req, res) => { 
    res.send('Home Page');
})

// app.get('/protected', (req, res) => { 
//     res.json({message: 'Accessed protected route', user: req.user});
// })

module.exports = app;