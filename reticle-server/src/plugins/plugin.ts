import { ITask } from "../task";

export interface ReticlePlugin {
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
    updateProject(project: string): Promise<string>;
}

export function initPlugin(plugin: ReticlePlugin, globalConfig: any): ReticlePlugin | null {
    const error = plugin.init(globalConfig[plugin.configName]);
    if (error) {
      console.log(error);
      return null;
    } else {
      return plugin;
    }
  }