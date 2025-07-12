import NodeCache from 'node-cache';
import mongoose from 'mongoose';
import { config } from '../config/config.js';
import Logger from './logger.js';

// MongoDB Schemas
const userSchema = new mongoose.Schema({
  jid: { type: String, unique: true, required: true },
  name: { type: String, default: '' },
  isOwner: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
  commandCount: { type: Number, default: 0 },
  joinDate: { type: Date, default: Date.now }
});

const groupSchema = new mongoose.Schema({
  jid: { type: String, unique: true, required: true },
  name: { type: String, default: '' },
  welcome: { type: Boolean, default: true },
  antilink: { type: Boolean, default: false },
  members: [String]
});

const User = mongoose.model('User', userSchema);
const Group = mongoose.model('Group', groupSchema);

class Database {
  constructor() {
    this.cache = new NodeCache({ stdTTL: 3600 });
    this.users = new Map();
    this.groups = new Map();
    this.isMongoConnected = false;
    
    if (config.database.type === 'mongodb') {
      this.connectMongoDB();
    }
  }
  
  async connectMongoDB() {
    try {
      await mongoose.connect(config.database.mongodb.uri);
      this.isMongoConnected = true;
      Logger.success('Connected to MongoDB');
    } catch (error) {
      Logger.error('MongoDB connection failed:', error.message);
      Logger.warn('Falling back to local database');
    }
  }
  
  // User Management
  async getUser(jid) {
    if (this.isMongoConnected) {
      try {
        let user = await User.findOne({ jid });
        if (!user) {
          user = new User({
            jid,
            name: '',
            isOwner: jid === config.ownerNumber,
            isBanned: false,
            commandCount: 0
          });
          await user.save();
        }
        return user.toObject();
      } catch (error) {
        Logger.error('Error getting user from MongoDB:', error.message);
      }
    }
    
    return this.users.get(jid) || {
      jid,
      name: '',
      isOwner: jid === config.ownerNumber,
      isBanned: false,
      commandCount: 0,
      joinDate: new Date().toISOString()
    };
  }
  
  async setUser(jid, data) {
    if (this.isMongoConnected) {
      try {
        await User.findOneAndUpdate({ jid }, data, { upsert: true });
        return;
      } catch (error) {
        Logger.error('Error setting user in MongoDB:', error.message);
      }
    }
    
    const currentUser = await this.getUser(jid);
    this.users.set(jid, { ...currentUser, ...data });
  }
  
  // Group Management
  async getGroup(jid) {
    if (this.isMongoConnected) {
      try {
        let group = await Group.findOne({ jid });
        if (!group) {
          group = new Group({
            jid,
            name: '',
            welcome: true,
            antilink: false,
            members: []
          });
          await group.save();
        }
        return group.toObject();
      } catch (error) {
        Logger.error('Error getting group from MongoDB:', error.message);
      }
    }
    
    return this.groups.get(jid) || {
      jid,
      name: '',
      welcome: true,
      antilink: false,
      members: []
    };
  }
  
  async setGroup(jid, data) {
    if (this.isMongoConnected) {
      try {
        await Group.findOneAndUpdate({ jid }, data, { upsert: true });
        return;
      } catch (error) {
        Logger.error('Error setting group in MongoDB:', error.message);
      }
    }
    
    const currentGroup = await this.getGroup(jid);
    this.groups.set(jid, { ...currentGroup, ...data });
  }
  
  // Cache Methods
  set(key, value, ttl = 3600) {
    return this.cache.set(key, value, ttl);
  }
  
  get(key) {
    return this.cache.get(key);
  }
  
  del(key) {
    return this.cache.del(key);
  }
}

export default new Database();
