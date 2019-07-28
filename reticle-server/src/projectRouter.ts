import express from "express";
import { ReticlePlugin } from "./plugins/plugin";
import Project from "../bin/src/project";

export default (plugins: ReticlePlugin[]) => {

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

return pjRouter;

};