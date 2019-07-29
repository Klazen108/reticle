import { spawn } from 'child_process';
import util from 'util';
import Task, { ITask } from '../../models/task';
import queries from './queries/teamforge';
import { Client } from 'pg';
import { forkJoin } from 'rxjs';
import { ReticlePlugin } from '../plugin';
import { IKBProject } from '../../models/kbProject';
const execute = util.promisify(spawn);

interface TFArtifact {
    ArtifactId: string;

    EstimatedEffort?: number;
    RemainingEffort?: number;
    ActualEffort?: number;

    Status?: string;
}

class Teamforge implements ReticlePlugin {
    private url: string = "";
    private user: string = "";
    private pass: string = "";
    private tfPgUrl: string = "";

    constructor() {

    }

    configName = "TeamforgePlugin";

    pluginName = "TeamforgePlugin";

    async init(config: any): Promise<string> {
        if (!config.url) {
            return "Invalid value for: url";
        }
        if (!config.user) {
            return "Invalid value for: user";
        }
        if (!config.pass) {
            return "Invalid value for: pass";
        }
        if (!config.tfPgUrl) {
            return "Invalid value for: tfPgUrl";
        }

        this.url = config.url;
        this.user = config.user;
        this.pass = config.pass;
        this.tfPgUrl = config.tfPgUrl;

        try {
            await spawn("java",["-version"]);
        } catch (e) {
            return "Java not installed. Required for this plugin.";
        }

        return "";
    }

    async taskUpdated(task: ITask): Promise<string> {
        const artifact = this.convertArtifact(task);
        await spawn("java",[
            "-jar","tf-server.jar",
            this.url,this.user,this.pass,artifact.ArtifactId,
            JSON.stringify(artifact),"Updated by Reticle"
        ]);
        return "";
    }

    async updateKanban(project: IKBProject): Promise<string> {
        //get artifacts in folder
        if (project.folder == null) return "invalid project: missing folder";
        const planFolder = project.folder!;
        const query = queries.tfArtifactsByPlanningFolder;
        const client = new Client(this.tfPgUrl);//teamforge url
        await client.connect();
        const rows = await client.query(query,[planFolder]);
        await client.end();
    
        await forkJoin(rows.rows.map(task => Task.findOneAndUpdate(
            { taskId: task.id },
            { $set: this.cleanup({
            name: task.title,
            taskId: task.id,
            developerId: task.assigned_to_user_id,
            estimate: task.estimated_effort,
            remaining: task.remaining_effort,
            actual: task.actual_effort,
            state: this.mapTFStatus(task.status)
            }) },
            { upsert: true, new: true, setDefaultsOnInsert: true },
            err => { if (err) throw err; }
        )))
        return "";
    }

    convertArtifact(task: ITask): TFArtifact {
        return {
            ArtifactId: task.taskId,
            EstimatedEffort: task.estimate,
            RemainingEffort: task.remaining,
            ActualEffort: task.actual,
            Status: this.reverseMapTFStatus(task.state)
        };
    }

    /**
     * Map TF statuses into reticle statuses
     * @param tfStatus The status from teamforge to map
     */
    mapTFStatus(tfStatus: string): string {
      if (tfStatus==="Open / Acknowledged") return "Open";
      if (tfStatus==="Not Started") return "Open";
      if (tfStatus==="In Development") return "In Development";
      if (tfStatus==="Started") return "In Development";
      if (tfStatus==="Ready For Test") return "Ready for Test";
      if (tfStatus==="Completed") return "Ready for Test";
      return "Open";
    }

    /**
     * Map reticle statuses into TF statuses
     * @param tfStatus The status from teamforge to map
     */
    reverseMapTFStatus(tfStatus: string): string {
        //TODO: need artifact type to determine appropriate status
      if (tfStatus==="Open") return "Not Started";
      return "Not Started";
    }
    
    /**
     * Remove undefined fields from an object (to not clear them on mongoose insert)
     * @param obj The object to clean up
     */
    cleanup(obj: any): any {
      Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key])
      return obj;
    }
}

export default Teamforge;