import { config } from '../config.js';
export default {
  name: 'owner',
  aliases: ['creator', 'dev'],
  category: 'info',
  description: 'Show bot owner information',
  usage: 'owner',
  cooldown: 5,
  
  async execute(client, m) {
    const ownerText = `
👑 *Bot Owner Information*

*Bot Name:* ${config.botName}
*Owner:* @${config.ownerNumber.split('@')[0]}
*Version:* 1.0.0
*Platform:* Neoxr Baileys
*Type:* Modular Plugin System

📝 *Features:*
• Auto-updating menu
• Plugin system
• ViewOnce capture
• Multi-database support
• QR & Pairing connection

🔗 *Source:* Created with ❤️
    `.trim();
    
    await client.sendMessage(m.from, {
      text: ownerText,
      mentions: [config.ownerNumber]
    });
  }
};
