const mongoose = require('mongoose');

const url = "mongodb+srv://fullstack:Snowcat__3@fullstackopen2019-s0yy1.mongodb.net/phonebook?retryWrites=true&w=majority";

mongoose
    .connect(url, { useNewUrlParser: true })
    .then((result) => {
        console.log('DB Connected');
    })
    .catch((error) => {
        console.log('Connecting to DB failed');
    });

const personSchema = new mongoose.Schema({
    name: String,
    phone: String
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
});

module.exports = mongoose.model('Person', personSchema);
