const express = require('express');
const { appendFile } = require('fs');
const server = express();

server.use(express.json());

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method);
    console.log('Path:  ', request.path);
    console.log('Body:  ', request.body);
    console.log('-------');
    next();
};

server.use(requestLogger);

let persons = [
    { 
      id: 1,
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: 2,
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: 3,
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: 4,
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]

server.get('/info', (request, response) => {
    const d = new Date();
    response.send(`Phonebook has info for ${persons.length} people<br/><br/>${d.toUTCString()}`);
})

server.get('/api/persons', (request, response) => {
    response.json(persons);
});

server.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(p => p.id === id);

    if (!person) {
        response.status(404).end();
    } else {
        response.json(person);
    }
});

server.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(p => p.id !== id);

    response.status(204).end();
});

const generateId = () => {
    let id = Math.floor(Math.random() * 1000);
    while (persons.find(p => p.id === id)) {
        id = Math.floor(Math.random() * 1000);
    }
    return id;
};

server.post('/api/persons/', (request, response) => {
    const newId = generateId();
    const body = request.body;
    if (!body.name && !body.number) {
        return response.status(400).json({
            error: 'name and number fields are missing' 
        });
    } else if (!body.name) {
        return response.status(400).json({
            error: 'name field is missing'
        });
    } else if (!body.number) {
        return response.status(400).json({
            error: 'number field is missing'
        });
    } else if (persons.find(p => p.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        });
    } else {
        const person = {
            id: newId,
            name: body.name,
            number: body.number
        }
        persons = persons.concat(person);
        response.json(person);
    }
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({
        error: 'unknown endpoint'
    });
};

server.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});