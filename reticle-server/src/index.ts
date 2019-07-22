import * as express from 'express';
import Dashboard from './dashboard';
import * as mongoose from 'mongoose';
import bodyParser = require('body-parser');
import Project from './project';
import Task from './task';
import queries from './queries/teamforge';
import {Client} from 'pg';
import { forkJoin } from 'rxjs';
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

function mapTFStatus(tfStatus: string): string {
  if (tfStatus==="Open / Acknowledged") return "Open";
  if (tfStatus==="Not Started") return "Open";
  if (tfStatus==="In Development") return "In Development";
  if (tfStatus==="Started") return "In Development";
  if (tfStatus==="Ready For Test") return "Ready for Test";
  if (tfStatus==="Completed") return "Ready for Test";
  return "Open";
}

var taskRouter = express.Router();

taskRouter.get('/update/:id', async (req,res,next) => {
  try {
    //get srtifacts in folder
    const planFolder = req.params.id;
    const query = queries.tfArtifactsByPlanningFolder;
    const client = new Client('');//teamforge url
    await client.connect();
    const rows = await client.query(query,[planFolder]);
    await client.end();

    await forkJoin(rows.rows.map(task => Task.findOneAndUpdate(
      { taskId: task.id },
      { $set: {
        name: task.title,
        taskId: task.id,
        developerId: task.assigned_to_user_id,
        estimate: task.estimated_effort,
        remaining: task.remaining_effort,
        actual: task.actual_effort,
        state: mapTFStatus(task.status)
      } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
      err => { if (err) throw err; }
    ))).subscribe(r => res.send(r));
  } catch (err) {
    next(err);
  }
});

taskRouter.patch("/:id", async (req,res,next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (req.body.state !== task.state) {
      //transition
    }
    const result = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      err => {if (err) throw err;}
    );
    res.send(result);
  } catch (err) {
    next(err);
  }
})

taskRouter.get('/', async (req, res, next) => {
  try {
    const tasks = await Task.find().exec();
    const groupedTasks = tasks.reduce((acc,cur) => {
      var list = acc.find(l => l.name === cur.state)
      if (list === undefined) {
        list = {name: cur.state,tickets: []};
        acc.push(list);
      }
      list.tickets.push(cur);
      return acc;
    },[
      {name: "Open", tickets:[]},
      {name: "Acknowledged", tickets:[]},
      {name: "In Development", tickets:[]},
      {name: "Ready for Test", tickets:[]},
      {name: "Ready for QA", tickets:[]},
      {name: "QA Passed", tickets:[]},
    ] as {name:string,tickets:{}[]}[]);

    res.send(groupedTasks);
  } catch (err) {
    next(err); 
  }
});

app.use('/api/dashboard',dbRouter);
app.use('/api/project',pjRouter);
app.use('/api/task',taskRouter);

app.listen(8080, () => {
  console.log('Example app listening on port 8080!')
});