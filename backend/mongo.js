const mongoose = require('mongoose');

if (process.argv.length !== 5 && process.argv.length !== 3) {
    console.log('Please adhere to any the following syntaxes: \n\nnode mongo.js <password> <name> <number>\nnode mongo.js <password>')
    process.exit();
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@bmagana5-fullstack.ctpre.mongodb.net/personApp?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

const Person = mongoose.model('Person', personSchema);

// mongoose
//     .connect(url)
//     .then(result => {
//         console.log('connected');

//         const note = new Note({
//             content: 'HTML is easy',
//             date: new Date(),
//             important: true
//         });
//         return note.save();
//     })
//     .then(() => {
//         console.log('note saved!');
//         return mongoose.connection.close();
//     })
//     .catch(err => {
//         console.log(err);
//     });
mongoose.connect(url).then(result => {
    switch(process.argv.length) {
        case 3:
            Person.find({}).then(persons => {
                console.log('phonebook:');
                persons.map(person => console.log(`${person.name} ${person.number}`));
                mongoose.connection.close();
            });
            break;
        case 5:
            const person = new Person({
                name: process.argv[3],
                number: process.argv[4]
            });
            person.save().then(result => {
                console.log('person saved successfully!');
                mongoose.connection.close();
            });
            break;
    }
});