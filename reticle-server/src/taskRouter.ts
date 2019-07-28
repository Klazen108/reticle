import express from "express";
import Task from "./models/task";
import { ReticlePlugin } from "./plugins/plugin";

export default (plugins: ReticlePlugin[]) => {

var taskRouter = express.Router();

taskRouter.patch("/:id", async (req,res,next) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      err => {if (err) throw err;}
    );
    if (task == null) return res.send(404);

    const errors = await Promise.all(plugins.map(p => p.taskUpdated(task)));
    errors.filter(e => e !== "").forEach(e => console.log(e));

    /*if (task && req.body.state !== task.state) {
      //transition
      let obj = {
        id: task.taskId,
        state: "Open / Acknowledged"
      }
    }
    const result = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      err => {if (err) throw err;}
    );
    res.send(result);*/
    res.send(task);
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

return taskRouter;

};