const { BotManager, SimpleBot, config } = require('@ptcg/server');
const { CardManager } = require('@ptcg/common');
require('dotenv').config();

// Backend config
config.backend.address = '0.0.0.0';
config.backend.port = process.env.PORT || 12021;
config.backend.avatarsDir = __dirname + '/avatars';
config.backend.webUiDir = __dirname + '/packages/play/dist/ptcg-play';
config.backend.serverPassword = process.env.SERVER_PASSWORD || '';
config.backend.secret = process.env.SERVER_SECRET || '!secret!';

// Storage config
config.storage.type = process.env.STORAGE_TYPE;
config.storage.host = process.env.STORAGE_HOST;
config.storage.port = parseInt(process.env.STORAGE_PORT);
config.storage.username = process.env.STORAGE_USERNAME;
config.storage.password = process.env.STORAGE_DATABASE_PASSWORD;
config.storage.database = process.env.STORAGE_DATABASE;
config.storage.extra = {
  ssl: {
    rejectUnauthorized: false
  },
  connectionLimit: 10,
  charset: 'utf8mb4'
};

// Bots config
config.bots.defaultPassword = 'bot';

// Sets/scans config
config.sets.scansDir = __dirname + '';
config.sets.scansUrl = '{cardImage}';
// config.sets.scansDownloadUrl = 'https://ptcg.ryuu.eu/scans'; // Server to download missing scans

// Define available sets
const sets = require('@ptcg/sets');
const cardManager = CardManager.getInstance();
cardManager.defineSet(sets.setAncientOrigins);
cardManager.defineSet(sets.setArceus);

// Define bots
const botManager = BotManager.getInstance();
botManager.registerBot(new SimpleBot('bot'));
