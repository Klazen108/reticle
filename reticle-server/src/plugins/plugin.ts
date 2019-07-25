import { ITask } from "../task";
import { IProject } from "../project";

export interface ReticlePlugin {
    /** The key under which the config for this project can be found in the main config.json */
    configName: string;

    /** A printable name for this plugin */
    pluginName: string;

    /**
     * Initializes the plugin.
     * 
     * @param config The config object for this plugin. This should be an object in the main config file under "configName"
     * @returns empty string if successful, or an error message if init failed. 
     * If an error message is returned, then this plugin should not be installed.
     */
    init(config: any): Promise<string>;

    /**
     * Called when a Reticle task is updated.
     * 
     * @param task The new version of the task
     */
    taskUpdated(task: ITask): Promise<string>;

    /**
     * Called when Reticle requests a project update.
     * 
     * @param project The Reticle project being updated
     * @returns empty string if successful, or an error message if init failed. 
     * If an error message is returned, then this error should be logged, and the app will continue.
     */
    updateProject(project: IProject): Promise<string>;
}

/**
 * 
 * @param plugin 
 * @param globalConfig The global config for Reticle. Contains sub-objects for each plugin, referenced by plugin.configName
 */
export async function initPlugin(plugin: ReticlePlugin, globalConfig: any): Promise<ReticlePlugin | null> {
    console.log(`Initializing Plugin: ${plugin.pluginName} with config key: ${plugin.configName}`)
    if (globalConfig === undefined || globalConfig === null || Object.keys(globalConfig).length==0) {
        throw new Error("Invalid config: must not be empty!");
    }
    const error = await plugin.init(globalConfig[plugin.configName] || {});
    if (error) {
      console.log(error);
      return null;
    } else {
      return plugin;
    }
  }