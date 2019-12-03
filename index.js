require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const PersonModel = require('./models/person');

const app = express();

morgan.token('post-request-data', (req, res) => JSON.stringify(req.body));
app.use(cors());
app.use(express.static('build'));
app.use(bodyParser.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-request-data'));



app.get('/api/persons', (req, res) => {
    PersonModel
        .find({})
        .then((persons) => {
            console.log('Phonebook:');
            console.log(persons);
            res.send(persons);
        })
        .catch((error) => {
            res.status(500).json({error: 'DB Connection failed'});
        });
});


app.post('/api/persons', (req, res) => {
    if(!req.body.name){
        return res.status(400).json({
            error: 'name missing'
        });
    }
    if(!req.body.phone){
        return res.status(400).json({
            error: 'phone number missing'
        });
    }

    const newPerson = new PersonModel({
        name: req.body.name,
        phone: req.body.phone
    });
    
    newPerson
        .save()
        .then((savedPerson) => {
            console.log('Saved', savedPerson);
            res.send(savedPerson.toJSON());
        })
        .catch((error) => {
            console.log("Could not save new entry to DB");
            res.status(500).json({error: "Could not save new entry to DB"});
        });
});

// app.get('/api/persons/:id', (req, res) => {
//     let person = persons.find((person) => person.id === Number(req.params.id));
//     if(person){
//         res.json(person);
//     }
//     else{
//         res.status(404).end();
//     }
// });

// app.get('/info', (req, res) => {
//     let info = `Phonebook has info for ${persons.length} people`;
//     let time = new Date();
//     res.send(`<p>${info}</p><p>${time}</p>`);
// });

// app.delete('/api/persons/:id', (req, res) => {
//     persons = persons.filter((person) => person.id !== Number(req.params.id));
//     res.status(204).end();
// });



const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log('Server listening on', PORT);
});