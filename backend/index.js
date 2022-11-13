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

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date()
    });
    note.save().then(savedNote => {
        response.json(savedNote);
    });
});

server.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
});

server.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes);
    });
});

server.get('/api/notes/:id', (request, response) => {
        
    Note.findById(request.params.id)
        .then(note => {
            response.json(note);
        })
        .catch(error => {
            response.status(404).end();
        });
});

server.put('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    const body = request.body;
    if (!body.content || !body.date || !body.id) {
        response.status(400).json({
            error: 'malformed content received; please double check submitted data'
        });
    } else {
        const newNote = {
            id: id,
            content: body.content,
            date: body.date,
            important: body.important
        }
        notes = notes.map(n => n.id === id ? newNote: n);
        response.json(newNote);
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

const PORT = process.env.PORT || "3001";
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});