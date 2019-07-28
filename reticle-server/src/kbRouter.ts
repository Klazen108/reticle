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

return kbRouter;

};