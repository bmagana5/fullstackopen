const mongoose = require('mongoose');

const url = process.env.MONGODB_PHONEBOOK_APP_URI;

const personSchema = mongoose.Schema({
    name: String,
    number: String
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB');
    })
    .catch(error => {
        console.log('error connecting to MongoDB', error.message);
    });

module.exports = mongoose.model('Person', personSchema);