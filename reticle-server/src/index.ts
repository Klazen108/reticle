import express from "express";
import mongoose from 'mongoose';
import bodyParser = require('body-parser');
import TeamforgePlugin from './plugins/teamforge/teamforge';
import { ReticlePlugin, initPlugin } from "./plugins/plugin";
import taskRouter from "./taskRouter";
import projectRouter from "./projectRouter";
import dashboardRouter from "./dashboardRouter";
import kbRouter from "./kbRouter";


(async () => {
  const config = require("./config.json")

  console.log("Initializing database...")
  mongoose.set('useFindAndModify', false); //https://mongoosejs.com/docs/deprecations.html#-findandmodify-
  await mongoose.connect(config.reticle.dbUrl);
  console.log("Database initialized.")
  
  //create and init plugins
  console.log("Initializing plugins...")
  const initWithConfig = (p: ReticlePlugin) => initPlugin(p,config);
  const plugins: ReticlePlugin[] = (await Promise.all([
    new TeamforgePlugin(),
  ].map(initWithConfig))).filter(p => p != null).map(p => p!);
  console.log("Plugins initialized.")
  
  //init app
  console.log("Initializing app...")
  const app = express();
  app.use(bodyParser.json());
  app.use('/api/dashboard',dashboardRouter(plugins));
  app.use('/api/project',projectRouter(plugins));
  app.use('/api/task',taskRouter(plugins));
  app.use('/api/kb',kbRouter(plugins));
  app.listen(config.reticle.port, () => {
    console.log(`Reticle Server live on port ${config.reticle.port}!`)
  });
})();