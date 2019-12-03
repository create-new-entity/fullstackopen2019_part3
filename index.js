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
            res.send(persons);
        })
        .catch((error) => {
            res.status(500).json({ error: 'DB Connection failed' });
        });
});


app.post('/api/persons', (req, res, next) => {
    const newPerson = new PersonModel({
        name: req.body.name,
        phone: req.body.phone
    });

    newPerson
        .save()
        .then((savedPerson) => {
            res.send(savedPerson.toJSON());
        })
        .catch((error) => {
            next(error);
        });
});

app.get('/api/persons/:id', (req, res, next) => {
    PersonModel
        .findById(req.params.id)
        .then((person) => {
            if(person){
                res.json(person.toJSON());
            }
            else res.status(404).end();
        })
        .catch((error) => {
            next(error);
        });
});

app.get('/info', (req, res, next) => {
    PersonModel
        .countDocuments({})
        .then((count) => {
            let info = `Phonebook has info for ${count} people`;
            let time = new Date();
            res.send(`<p>${info}</p><p>${time}</p>`);
        })
        .catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
    PersonModel
        .findByIdAndRemove(req.params.id)
        .then((removedPerson) => {
            if(removedPerson){
                res.status(204).end();
            }
            else{
                res.end();
            }
        })
        .catch((error) => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
    let updatedPerson = {
        name: req.body.name,
        phone: req.body.phone
    };

    PersonModel
        .findByIdAndUpdate(req.params.id, updatedPerson, { new: true, runValidators: true, context: 'query' })
        .then((updatedPerson) => {
            res.send(updatedPerson.toJSON());
        })
        .catch(error => next(error));
});

const errorHandler = (error, req, res, next) => {
    // console.log(error);

    if(error.name === 'ValidationError'){
        return res.status(400).send({ error: error.message });
    }

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).send({ error: 'malformatted id' });
    }

    res.send(error);
};

app.use(errorHandler);



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log('Server listening on', PORT);
});