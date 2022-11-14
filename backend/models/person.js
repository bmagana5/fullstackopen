const mongoose = require('mongoose');

const url = process.env.MONGODB_PHONEBOOK_APP_URI;

const personSchema = mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        validate: {
            validator: (v) => /[0-9]{3}-[0-9]{3}-[0-9]{4}/.test(v) || /[0-9]{3}-[0-9]{8}/.test(v) || /[0-9]{2}-[0-9]{7}/.test(v),
            message: props => `'${props.value}' is not a valid phone number!`
        },
        required: true
    }
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