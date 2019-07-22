import express from 'express';
import Dashboard from './dashboard';
import mongoose from 'mongoose';
import bodyParser = require('body-parser');
import Project from './project';
import Task from './task';
mongoose.set('useFindAndModify', false); //https://mongoosejs.com/docs/deprecations.html#-findandmodify-
mongoose.connect('mongodb://localhost:27017/test');

//refresh from teamforge once every 10 minutes
/*setInterval(()=>{
  const tasks: any[] = []; //TODO: query from task db
  tasks.forEach(async t => {
    console.log('updating task');
    const newDoc = await Task.findOneAndUpdate(
      {},
      t,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  });
},10*60*1000)*/

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

var taskRouter = express.Router();
taskRouter.get('/', async (req, res, next) => {
  /*
  try {
    const db = await Task.find().exec();
    res.send(db);
  } catch (err) {
    next(err);
  }*/
  res.send([
    {
      name: 'Open',
      tickets: [
        {artifactId:"artf12345",title:'task 2',est:1,rem:1,act:0},
        {artifactId:"artf12345",title:'woogedy woogedy woogedy woogedy woogedy woogedy ',est:1,rem:1,act:0}
      ],
      onTransition: "ba13d6df-4268-4838-ba8a-32778ad9fbb0"
    },
    {
      name: 'Acknowledged',
      tickets: [
        {artifactId:"artf12345",title:'task 2',est:1,rem:1,act:0},
        {artifactId:"artf12345",title:'task 2',est:1,rem:1,act:0}
      ]
    },
    {
      name: 'In Development',
      tickets: [
        {artifactId:"artf12345",title:'task 2',est:1,rem:1,act:0},
        {artifactId:"artf12345",title:'task 2',est:1,rem:1,act:0}
      ]
    },
    {
      name: 'Ready For Test',
      tickets: [
        {artifactId:"artf12345",title:'task 2',est:1,rem:1,act:0},
        {artifactId:"artf12345",title:'task 2',est:1,rem:1,act:0}
      ]
    },
    {
      name: 'Ready For QA',
      tickets: [
        {artifactId:"artf12345",title:'task 2',est:1,rem:1,act:0},
        {artifactId:"artf12345",title:'task 2',est:1,rem:1,act:0}
      ]
    },
    {
      name: 'QA Passed',
      tickets: [
        {artifactId:"artf12345",title:'task 2',est:1,rem:1,act:0},
        {artifactId:"artf12345",title:'task 2',est:1,rem:1,act:0}
      ]
    }
  ]);
});

app.use('/api/dashboard',dbRouter);
app.use('/api/project',pjRouter);
app.use('/api/task',taskRouter);

app.listen(8080, () => {
  console.log('Example app listening on port 8080!')
});