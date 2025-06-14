const { App, BotManager, config: baseConfig } = require('@ptcg/server');
const { CardManager, StateSerializer } = require('@ptcg/common');
const { mkdirSync, existsSync } = require('node:fs');
const path = require('path');
const sets = require('@ptcg/sets');
const dotenv = require('dotenv');
dotenv.config();

let config = baseConfig;

// Only use Heroku config when running on Heroku
if (process.env.NODE_ENV === 'production' && process.env.DYNO) {
  console.log('Loading Heroku config...');
  const { config: herokuConfig } = require('./packages/server/dist/cjs/config.heroku');
  config = herokuConfig;
  console.log('Heroku config loaded, webUiDir:', config.backend.webUiDir);

  // Ensure the app binds to the PORT environment variable
  config.backend.port = process.env.PORT || 12021;
  config.backend.address = '0.0.0.0'; // Bind to all interfaces

  // Configure storage using environment variables
  config.storage.type = process.env.STORAGE_TYPE || 'mysql';
  config.storage.host = process.env.STORAGE_HOST;
  config.storage.port = process.env.STORAGE_PORT ? parseInt(process.env.STORAGE_PORT) : 4002;
  config.storage.username = process.env.STORAGE_USERNAME;
  config.storage.password = process.env.STORAGE_DATABASE_PASSWORD;
  config.storage.database = process.env.STORAGE_DATABASE;

  const cardManager = CardManager.getInstance();
  // cardManager.defineSet(sets.setAncientOrigins);
  // cardManager.defineSet(sets.setArceus);
  // cardManager.defineSet(sets.setAstralRadiance);
  cardManager.defineSet(sets.setDestinedRivals);
  cardManager.defineSet(sets.setJourneyTogether);
  cardManager.defineSet(sets.setM1S);
  cardManager.defineSet(sets.setObsidianFlames);
  cardManager.defineSet(sets.setPaldeaEvolved);
  cardManager.defineSet(sets.setPokemon151);
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

  // Start the server
  const app = new App();
  app.connectToDatabase()
    .then(() => app.configureBotManager(BotManager.getInstance()))
    .then(() => app.configureWebUi(config.backend.webUiDir))
    .then(() => app.start())
    .then(() => {
      console.log(`Application started on ${config.backend.address}:${config.backend.port}.`);
    })
    .catch(error => {
      console.error(error.message);
      process.exit(1);
    });
} else {
  // Local config (using init.js)
  require('./init.js');
}
