const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const notesRouter = require('./controllers/notes');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB');
    })
    .catch(error => {
        logger.error('error connecting to MongoDB:', error.message);
    });


// uses cors middleware to allow for cross-origin resource sharing
app.use(cors());
// uses static middleware to allow for the server to serve a minified version of a web app
app.use(express.static('build'));
// uses json-parser middleware to make it possible to ready body of request 
// note: must be loaded BEFORE all other middleware that make use of things like response.json()!
app.use(express.json());
// use middleware that shows http request data on server's console
app.use(middleware.requestLogger);
// set the base path for the separate router to use
app.use('/api/notes', notesRouter);
app.use(middleware.unknownEndpoint);
// load the errorHandler LAST
app.use(middleware.errorHandler);

module.exports = app;