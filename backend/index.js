require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');
const server = express();

server.use(express.json());
server.use(express.static('build'));
server.use(cors());

morgan.token('body', (request, response) => {
    return JSON.stringify(request.body);
});
server.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

server.get('/info', (request, response) => {
    Person.find({})
        .then(persons => {
            const d = new Date();
            response.send(`Phonebook has info for ${persons.length} people<br/><br/>${d.toUTCString()}`);
        });
});

server.get('/api/persons', (request, response) => {
    Person.find({})
        .then(persons => {
            response.json(persons);
        })
});

server.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => next(error));
});

server.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end();
        })
        .catch(error => next(error));
});

server.post('/api/persons', (request, response) => {
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
    } else {
        const person = new Person({
            name: body.name,
            number: body.number
        });
        person.save()
            .then(savedPerson => {
                response.json(savedPerson);
            });
    }
});

server.put('/api/persons/:id', (request, response, next) => {
    const body = request.body;
    const person = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson);
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
    }
    next(error);
};

server.use(errorHandler);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});