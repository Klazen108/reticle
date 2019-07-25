import express from "express";
import * as mongoose from 'mongoose';
import bodyParser = require('body-parser');
import TeamforgePlugin from './plugins/teamforge/teamforge';
import { ReticlePlugin, initPlugin } from "./plugins/plugin";
import taskRouter from "./taskRouter";
import projectRouter from "./projectRouter";
import dashboardRouter from "./dashboardRouter";

const config = require("../config")

mongoose.set('useFindAndModify', false); //https://mongoosejs.com/docs/deprecations.html#-findandmodify-
mongoose.connect('mongodb://localhost:27017/test');

//create and init plugins
const initWithConfig = (p: ReticlePlugin) => initPlugin(p,config);
const plugins: ReticlePlugin[] = [
  new TeamforgePlugin(),
].map(initWithConfig).filter(p => p != null).map(p => p!);

//init app
const app = express();
app.use(bodyParser.json());
app.use('/api/dashboard',dashboardRouter(plugins));
app.use('/api/project',projectRouter(plugins));
app.use('/api/task',taskRouter(plugins));
app.listen(config.reticle.port, () => {
  console.log(`Reticle Server live on port ${config.reticle.port}!`)
});