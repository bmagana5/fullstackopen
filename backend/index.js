require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Note = require('./models/note');
const server = express();


// uses static middleware to allow for the server to serve a minified version of a web app
server.use(express.static('build'));

// uses cors middleware to allow for cross-origin resource sharing
server.use(cors());

// uses json-parser middleware to make it possible to ready body of request 
// note: must be loaded BEFORE all other middleware that make use of things like response.json()!
server.use(express.json());

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method);
    console.log('Path:  ', request.path);
    console.log('Body:  ', request.body);
    console.log('-------');
    next();
}

server.use(requestLogger);

server.post('/api/notes', (request, response, next) => {
    const body = request.body;
    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date()
    });
    note.save()
        .then(savedNote => {
            response.json(savedNote);
        })
        .catch(error => next(error));
});

server.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
});

server.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes);
    });
});

server.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id)
        .then(note => {
            if (note) {
                response.json(note);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => next(error));
});

server.put('/api/notes/:id', (request, response, next) => {
    const { content, important } = request.body;

    // use {new:true} to have updated note be returned by the Promise in then() as the updatedNote parameter in callback
    Note.findByIdAndUpdate(request.params.id, { content, important }, { new: true, runValidators: true, context: 'query' })
        .then(updatedNote => {
            response.json(updatedNote);
        })
        .catch(error => next(error));
});

server.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end();
        })
        .catch(error => next(error));
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({
        error: 'unknown endpoint'
    });
};

server.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
    console.error(error.message);
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message });
    }
    // if not a CastError or ValidationError, send to Express' default error handling middleware
    next(error);
};

// load the errorHandler LAST
server.use(errorHandler);

const PORT = process.env.PORT || "3001";
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});