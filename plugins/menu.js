import { config } from '../config/config.js';

export default {
  name: 'menu',
  aliases: ['help', 'm'],
  category: 'main',
  description: 'Show bot menu with all available plugins',
  usage: 'menu [plugin name]',
  cooldown: 5,
  
  async execute(client, m, args, { plugins }) {
    const prefix = config.prefix;
    
    if (args[0]) {
      // Show specific plugin help
      const pluginName = args[0].toLowerCase();
      const plugin = plugins.get(pluginName);
      
      if (!plugin) {
        return await m.reply(`❌ Plugin "${pluginName}" not found!`);
      }
      
      const helpText = `
📖 *Plugin Info*

*Name:* ${plugin.name}
*Category:* ${plugin.category || 'Other'}
*Description:* ${plugin.description || 'No description'}
*Usage:* ${prefix}${plugin.usage || plugin.name}
*Aliases:* ${plugin.aliases ? plugin.aliases.join(', ') : 'None'}
*Cooldown:* ${plugin.cooldown || 3} seconds
      `.trim();
      
      return await m.reply(helpText);
    }
    
    // Show all plugins grouped by category
    const categories = new Map();
    
    plugins.forEach(plugin => {
      const category = plugin.category || 'Other';
      if (!categories.has(category)) categories.set(category, []);
      categories.get(category).push(plugin.name);
    });
    
    let menuText = `
🤖 *${config.botName}*
📦 *Plugin Menu*

*Prefix:* ${prefix}
*Total Plugins:* ${plugins.size}

`;
    
    categories.forEach((pluginList, category) => {
      menuText += `\n📁 *${category.toUpperCase()}*\n`;
      pluginList.forEach(pluginName => {
        menuText += `• ${prefix}${pluginName}\n`;
      });
    });
    
    menuText += `\n💡 *Tip:* Use ${prefix}menu <plugin> for detailed info\n`;
    menuText += `🔄 *Auto-Updated:* This menu updates automatically when new plugins are added`;
    
    await m.reply(menuText);
  }
};
