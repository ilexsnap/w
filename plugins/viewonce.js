import { config } from '../config/config.js';

export default {
  name: 'viewonce',
  aliases: ['vo', 'antiviewonce'],
  category: 'media',
  description: 'Automatically save view once messages',
  usage: 'viewonce',
  cooldown: 1,
  
  async execute(client, m, args, { database }) {
    // Check if this is a view once message
    const viewOnceMessage = m.quoted?.viewOnceMessage || 
                          m.quoted?.viewOnceMessageV2 || 
                          m.quoted?.viewOnceMessageV2Extension;
    
    if (!viewOnceMessage) {
      return await m.reply('❌ Please reply to a view once message!');
    }
    
    if (!config.features.viewOnce) {
      return await m.reply('❌ ViewOnce feature is disabled!');
    }
    
    try {
      const media = viewOnceMessage.message;
      
      if (media.imageMessage) {
        const buffer = await client.downloadMediaMessage(m.quoted);
        const caption = media.imageMessage.caption || '';
        
        await client.sendMessage(m.from, {
          image: buffer,
          caption: `📸 *ViewOnce Image Captured*\n\n*From:* @${m.quoted.sender.split('@')[0]}\n*Caption:* ${caption}`,
          mentions: [m.quoted.sender]
        });
        
      } else if (media.videoMessage) {
        const buffer = await client.downloadMediaMessage(m.quoted);
        const caption = media.videoMessage.caption || '';
        
        await client.sendMessage(m.from, {
          video: buffer,
          caption: `🎥 *ViewOnce Video Captured*\n\n*From:* @${m.quoted.sender.split('@')[0]}\n*Caption:* ${caption}`,
          mentions: [m.quoted.sender]
        });
        
      } else {
        await m.reply('❌ Unsupported view once message type!');
      }
      
    } catch (error) {
      console.error('ViewOnce error:', error);
      await m.reply('❌ Failed to process view once message!');
    }
  }
};
