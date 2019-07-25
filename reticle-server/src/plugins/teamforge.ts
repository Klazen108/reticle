import { exec } from 'child_process';
import util from 'util';
import { ITask } from '../task';
const execute = util.promisify(exec);

export interface TFArtifact {
    ArtifactId: string;

    EstimatedEffort?: number;
    RemainingEffort?: number;
    ActualEffort?: number;

    Status?: string;
}

interface ReticlePlugin {
    configName: string;

    /**
     * Initializes the plugin.
     * 
     * @param config The config object for this plugin. This should be an object in the main config file under "configName"
     * @returns empty string if successful, or an error message if init failed. 
     * If an error message is returned, then this plugin should not be installed.
     */
    init(config: any): Promise<string>;

    taskUpdated(task: ITask): Promise<string>;
}

class Teamforge implements ReticlePlugin {
    private url: string = "";
    private user: string = "";
    private pass: string = "";

    constructor() {

    }

    configName = "TeamforgePlugin";

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

        this.url = config.url;
        this.user = config.user;
        this.pass = config.pass;

        try {
            await execute(`java -version`);
        } catch (e) {
            return "Java not installed. Required for this plugin.";
        }

        return "";
    }

    async taskUpdated(task: ITask): Promise<string> {
        const artifact = this.convertArtifact(task);
        await execute(`java tf-update "${this.url}" "${this.user}" "${this.pass}" "${artifact.ArtifactId}" "${JSON.stringify(artifact)}"`);
        return "";
    }

    convertArtifact(task: ITask): TFArtifact {
        return {
            ArtifactId: task.taskId,
            EstimatedEffort: task.estimate,
            RemainingEffort: task.remaining,
            ActualEffort: task.actual,
            Status: task.state
        };
    }
}

export default Teamforge;