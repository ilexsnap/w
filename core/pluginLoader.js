import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import Logger from './logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pluginsDir = path.join(__dirname, '../plugins');

class PluginLoader {
  constructor() {
    this.plugins = new Map();
    this.categories = new Map();
  }
  
  async loadPlugins() {
    try {
      const files = await fs.readdir(pluginsDir);
      const jsFiles = files.filter(file => file.endsWith('.js'));
      
      Logger.info(`Loading ${jsFiles.length} plugins...`);
      
      for (const file of jsFiles) {
        await this.loadPlugin(file);
      }
      
      Logger.success(`Loaded ${this.plugins.size} plugins successfully`);
    } catch (error) {
      Logger.error('Error loading plugins:', error.message);
    }
  }
  
  async loadPlugin(filename) {
    try {
      const pluginPath = path.join(pluginsDir, filename);
      const pluginUrl = `file://${pluginPath}?update=${Date.now()}`;
      
      const plugin = await import(pluginUrl);
      const pluginData = plugin.default;
      
      if (!pluginData || !pluginData.name) {
        Logger.warn(`Plugin ${filename} is missing name property`);
        return;
      }
      
      this.plugins.set(pluginData.name, pluginData);
      
      // Add aliases
      if (pluginData.aliases) {
        pluginData.aliases.forEach(alias => {
          this.plugins.set(alias, pluginData);
        });
      }
      
      // Track categories
      const category = pluginData.category || 'Other';
      if (!this.categories.has(category)) {
        this.categories.set(category, []);
      }
      
      if (!this.categories.get(category).includes(pluginData.name)) {
        this.categories.get(category).push(pluginData.name);
      }
      
      Logger.debug(`Loaded plugin: ${pluginData.name}`);
    } catch (error) {
      Logger.error(`Error loading plugin ${filename}:`, error.message);
    }
  }
  
  async reloadPlugins() {
    this.plugins.clear();
    this.categories.clear();
    await this.loadPlugins();
  }
  
  getPlugin(name) {
    return this.plugins.get(name);
  }
  
  getAllPlugins() {
    const uniquePlugins = new Map();
    this.plugins.forEach((plugin, name) => {
      if (name === plugin.name) {
        uniquePlugins.set(name, plugin);
      }
    });
    return uniquePlugins;
  }
  
  getCategories() {
    return this.categories;
  }
}

export default new PluginLoader();
