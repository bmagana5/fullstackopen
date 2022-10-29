const express = require('express');
const server = express();

// uses json-parser to make it possible to ready body of request 
server.use(express.json());

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method);
    console.log('Path:  ', request.path);
    console.log('Body:  ', request.body);
    console.log('-------');
    next();
}

server.use(requestLogger);

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      date: "2022-05-30T17:30:31.098Z",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only Javascript",
      date: "2022-05-30T18:39:34.091Z",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2022-05-30T19:20:14.298Z",
      important: true
    }
];

const generateId = () => {
    let maxId = Math.floor(Math.random() * 1000);
    while (notes.find(n => n.id === maxId)) {
        maxId = Math.floor(Math.random() * 1000);
    }
    return maxId;
};

server.post('/api/notes', (request, response) => {
    const body = request.body;

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        });
    }

    const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId()
    };
    notes = notes.concat(note);
    response.json(note);
});

server.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
});

server.get('/api/notes', (request, response) => {
    response.json(notes);
});

server.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    const note = notes.find(n => n.id === id);
    if (note) {
        response.json(note);
    } else {
        response.status(404).end();
    }
});

server.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    notes = notes.filter(n => n.id !== id);
    response.status(204).end();
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({
        error: 'unknown endpoint'
    });
};

server.use(unknownEndpoint);

const PORT = 3001;
server.listen(PORT);
console.log(`Server is running on port ${PORT}`);