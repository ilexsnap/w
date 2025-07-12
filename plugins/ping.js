export default {
  name: 'ping',
  aliases: ['p'],
  category: 'main',
  description: 'Check bot response time and status',
  usage: 'ping',
  cooldown: 3,
  
  async execute(client, m) {
    const start = Date.now();
    
    const sent = await m.reply('🏓 Calculating response time...');
    
    const end = Date.now();
    const responseTime = end - start;
    
    const statusText = `
🏓 *Pong!*

⚡ *Response Time:* ${responseTime}ms
🕐 *Timestamp:* ${new Date().toLocaleString()}
🤖 *Status:* Online
📱 *Platform:* Neoxr Baileys
    `.trim();
    
    await client.sendMessage(m.from, {
      text: statusText,
      edit: sent.key
    });
  }
};
