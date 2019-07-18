import express from 'express';
import Dashboard from './dashboard';
import mongoose from 'mongoose';
import bodyParser = require('body-parser');
import Project from './project';
mongoose.set('useFindAndModify', false); //https://mongoosejs.com/docs/deprecations.html#-findandmodify-
mongoose.connect('mongodb://localhost:27017/test');

const app = express();

app.use(bodyParser.json());

var dbRouter = express.Router();

dbRouter.put('/', async (req, res, next) => {
  const db = await Dashboard.create(req.body);
  res.status(201).send(db);
});


dbRouter.patch('/:id', async (req, res) => {
  const db = await Dashboard.update(
      { _id : req.params.id },
      { $set : req.body },
      function( err, result ) {
          if ( err ) throw err;
      }
  );
  res.send(db)
});
dbRouter.get('/:id', async (req, res, next) => {
  try {
    const db = await Dashboard.findById(req.params.id).populate('projects').exec();
    res.send(db);
  } catch (err) {
    next(err);
  }
});

dbRouter.get('/', async (req, res, next) => {
  try {
    const db = await Dashboard.find().exec();
    res.send(db);
  } catch (err) {
    next(err);
  }
});

var pjRouter = express.Router();
pjRouter.put('/', async (req, res, next) => {
  const db = await Project.create(req.body);
  res.status(201).send(db);
});

pjRouter.patch('/:id', async (req, res) => {
  const db = await Project.findByIdAndUpdate(
      req.params.id,
      { $set : req.body },
      function( err, result ) {
          if ( err ) throw err;
      }
  );
  res.send(db)
});


pjRouter.get('/:id', async (req, res, next) => {
  try {
    const db = await Project.findById(req.params.id).exec();
    res.send(db);
  } catch (err) {
    next(err);
  }
});

pjRouter.get('/', async (req, res, next) => {
  try {
    const db = await Project.find().exec();
    res.send(db);
  } catch (err) {
    next(err);
  }
});

app.use('/api/dashboard',dbRouter);
app.use('/api/project',pjRouter);

app.listen(8080, () => {
  console.log('Example app listening on port 8080!')
});