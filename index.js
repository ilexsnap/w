import { NeoxrBot } from 'neoxr-whatsapp-bot';
import qrcode from 'qrcode-terminal';
import fs from 'fs-extra';
import { config } from './config.js';
import Logger from './core/logger.js';
import database from './core/database.js';
import { utils } from './core/utils.js';
import pluginLoader from './core/pluginLoader.js';

class WhatsAppBot {
  constructor() {
    this.bot = new NeoxrBot({
      sessionName: config.sessionName,
      printQRInTerminal: config.connectionMethod === 'qr',
      pairingNumber: config.pairingNumber,
      browser: ['NeoxrBot', 'Chrome', '1.0.0']
    });
    
    this.cooldowns = new Map();
    this.isConnected = false;
  }
  
  async start() {
    Logger.info('Starting NeoxrBot...');
    
    // Load plugins
    await pluginLoader.loadPlugins();
    
    // Initialize bot events
    this.setupEvents();
    
    // Start the bot
    await this.bot.start();
  }
  
  setupEvents() {
    // Connection events
    this.bot.on('connection.update', this.handleConnection.bind(this));
    this.bot.on('qr', this.handleQR.bind(this));
    this.bot.on('pairing-code', this.handlePairingCode.bind(this));
    
    // Message events
    this.bot.on('messages.upsert', this.handleMessages.bind(this));
    this.bot.on('group-participants.update', this.handleGroupUpdate.bind(this));
  }
  
  handleConnection(update) {
    const { connection, lastDisconnect } = update;
    
    if (connection === 'close') {
      this.isConnected = false;
      Logger.warn('Connection closed, attempting to reconnect...');
    } else if (connection === 'open') {
      this.isConnected = true;
      Logger.success('Connected to WhatsApp!');
      Logger.info(`Bot Name: ${config.botNa
