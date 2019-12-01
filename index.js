const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

morgan.token('post-request-data', (req, res) => JSON.stringify(req.body));
app.use(bodyParser.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-request-data'));

let persons = [
    {
      "name": "Ibn Batuta",
      "phone": "890",
      "id": 7
    },
    {
      "name": "Snake",
      "phone": "789",
      "id": 9
    },
    {
      "name": "Hideo Kojima",
      "phone": "2356-234-677",
      "id": 13
    },
    {
      "name": "Ocelot",
      "phone": "6878-23556-56",
      "id": 14
    }
];



const getRandomId = () => {
    let currentIds = persons.map(person => person.id);
    while(true){
        let newId = Math.floor(Math.random() * Math.floor(1000)) + 1;
        if(currentIds.includes(newId)) continue;
        return newId;
    }
};

const nameNotUnique = (name) => {
    return persons.some((person) => {
        return person.name.toLowerCase() === name.toLowerCase();
    });
}


app.get('/api/persons', (req, res) => {
    res.send(persons);
});

app.get('/api/persons/:id', (req, res) => {
    let person = persons.find((person) => person.id === Number(req.params.id));
    if(person){
        res.json(person);
    }
    else{
        res.status(404).end();
    }
});

app.get('/info', (req, res) => {
    let info = `Phonebook has info for ${persons.length} people`;
    let time = new Date();
    res.send(`<p>${info}</p><p>${time}</p>`);
});

app.delete('/api/persons/:id', (req, res) => {
    persons = persons.filter((person) => person.id !== Number(req.params.id));
    res.status(204).end();
});

app.post('/api/persons', (req, res) => {
    let newPerson = req.body;
    if(!newPerson.name){
        return res.status(400).json({
            error: 'name missing'
        });
    }
    if(!newPerson.phone){
        return res.status(400).json({
            error: 'phone number missing'
        });
    }
    if(nameNotUnique(newPerson.name)){
        return res.status(400).json({
            error: 'name must be unique'
        });
    }
    newPerson.id = getRandomId();
    persons = persons.concat(newPerson);
    res.send(newPerson);
});


const PORT = 3001;
app.listen(PORT, () => {
    console.log('Server listening on', PORT);
});