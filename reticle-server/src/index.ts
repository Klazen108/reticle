import express from 'express';
import Dashboard from './dashboard';
import mongoose from 'mongoose';
import bodyParser = require('body-parser');
mongoose.connect('mongodb://localhost:27017/test');

const app = express();

app.use(bodyParser.json())

app.put('/', async (req, res, next) => {
  const db = await Dashboard.create(req.body);
  res.status(201).send(db);
});

/*
app.patch('/:id', async (req, res) => {
  const db = await getDb();
  const result = db.collection('Dashboard').update(
    { _id : req.params.id },
    { $set : req.body },
    function( err, result ) {
        if ( err ) throw err;
    }
);
  res.send('Hello World!')
});*/
app.get('/:id', async (req, res, next) => {
  try {
    const db = await Dashboard.findById(req.params.id).exec();
    res.send(db);
  } catch (err) {
    next(err);
  }
});

app.get('/', async (req, res, next) => {
  try {
    const db = await Dashboard.find().exec();
    res.send(db);
  } catch (err) {
    next(err);
  }
});

app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
});