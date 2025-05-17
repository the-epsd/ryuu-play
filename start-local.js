const { App, BotManager, SimpleBot, config } = require('@ptcg/server');
const { CardManager, StateSerializer } = require('@ptcg/common');
const { mkdirSync, existsSync } = require('node:fs');
const path = require('path');
const sets = require('@ptcg/sets');
require('dotenv').config();

// Configure backend
config.backend.address = 'localhost';
config.backend.port = process.env.PORT || 12021;
config.backend.avatarsDir = path.join(__dirname, 'avatars');
config.backend.webUiDir = path.join(__dirname, 'packages/play/dist/ptcg-play');
config.backend.serverPassword = process.env.SERVER_PASSWORD || '';
config.backend.secret = process.env.SERVER_SECRET || '!secret!';

// Configure storage
config.storage.type = 'sqlite';
config.storage.database = path.join(__dirname, 'database.sq3');

// Configure bots
config.bots.defaultPassword = 'bot';

// Configure sets/scans
config.sets.scansDir = __dirname;
config.sets.scansUrl = '{cardImage}';

// Initialize card manager
const cardManager = CardManager.getInstance();
// cardManager.defineSet(sets.setAncientOrigins);
// cardManager.defineSet(sets.setArceus);
// cardManager.defineSet(sets.setAstralRadiance);
cardManager.defineSet(sets.setDestinedRivals);
cardManager.defineSet(sets.setJourneyTogether);
cardManager.defineSet(sets.setM1S);
cardManager.defineSet(sets.setPaldeaEvolved);
cardManager.defineSet(sets.setScarletAndViolet);
cardManager.defineSet(sets.setScarletAndVioletEnergy);
cardManager.defineSet(sets.setScarletAndVioletPromos);

// Feed state-serializer with card definitions
StateSerializer.setKnownCards(cardManager.getAllCards());

// Ensure directories exist
try {
  if (config.backend.avatarsDir) {
    const avatarsDir = path.resolve(config.backend.avatarsDir);
    if (!existsSync(avatarsDir)) {
      mkdirSync(avatarsDir, { recursive: true });
    }
  }

  if (config.sets.scansDir) {
    const scansDir = path.resolve(config.sets.scansDir);
    if (!existsSync(scansDir)) {
      mkdirSync(scansDir, { recursive: true });
    }
  }
} catch (error) {
  console.warn('Warning: Could not create directories:', error.message);
}

// Initialize bot manager
const botManager = BotManager.getInstance();
botManager.registerBot(new SimpleBot('bot'));

// Start the server
const app = new App();
app.connectToDatabase()
  .then(() => app.configureBotManager(botManager))
  .then(() => app.configureWebUi(config.backend.webUiDir))
  .then(() => app.start())
  .then(() => {
    console.log(`Application started on ${config.backend.address}:${config.backend.port}`);
  })
  .catch(error => {
    console.error(error.message);
    process.exit(1);
  }); 