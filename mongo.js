const mongoose = require('mongoose');

const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@fullstackopen2019-s0yy1.mongodb.net/phonebook?retryWrites=true&w=majority`
mongoose.connect(url, { useNewUrlParser: true });

const personSchema = new mongoose.Schema({
    name: String,
    phone: String
});

const Person = mongoose.model('Person', personSchema);


if(process.argv.length === 5) {
    const person = new Person({
        name: process.argv[3],
        phone: process.argv[4]
    });

    person.save().then((response) => {
        console.log(`added ${response.name} number ${response.phone} to phonebook`);
        mongoose.connection.close();
    });
}
else if(process.argv.length === 3){
    console.log("Phonebook:");
    Person.find({}).then((result) => {
        result.forEach((person) => {
            console.log(person);
        });
        mongoose.connection.close();
    });
}

