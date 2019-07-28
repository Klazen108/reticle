import express from "express";
import { ReticlePlugin } from "./plugins/plugin";
import KBProject from "./models/kbProject";

export default (plugins: ReticlePlugin[]) => {

var kbRouter = express.Router();

kbRouter.get('/', async (req, res, next) => {
  try {
    const db = await KBProject.find().exec();
    res.send(db);
  } catch (err) {
    next(err);
  }
});
  
kbRouter.get('/:id', async (req, res, next) => {
  try {
    const db = await KBProject.findById(req.params.id).exec();
    res.send(db);
  } catch (err) {
    next(err);
  }
});

kbRouter.put('/', async (req, res, next) => {
  try {
    const db = await KBProject.create(req.body);
    res.status(201).send(db);
  } catch (err) {
    next(err);
  }
});
  
kbRouter.get('/:id/update', async (req, res, next) => {
  try {
    let db = await KBProject.findById(req.params.id).exec();
    if (db == null) return res.sendStatus(404);
    const proj = db!;
    const errors = await Promise.all(plugins.map(p => p.updateKanban(proj)));
    errors.filter(e => e !== "").forEach(e => console.log(e));
    res.send("ok");
  } catch (err) {
    next(err);
  }
});

return kbRouter;

};