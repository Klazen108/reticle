import express from "express";
import Dashboard from "./dashboard";
import { ReticlePlugin } from "./plugins/plugin";

export default (plugins: ReticlePlugin[]) => {

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

return dbRouter;

};