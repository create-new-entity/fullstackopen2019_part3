const mongoose = require('mongoose');

const url = process.env.MONGO_URI;

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
