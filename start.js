const { App, BotManager, config: baseConfig } = require('@ptcg/server');
const { CardManager, StateSerializer } = require('@ptcg/common');
const { mkdirSync, existsSync } = require('node:fs');
const path = require('path');
const sets = require('@ptcg/sets');

let config = baseConfig;

// Only use Heroku config when running on Heroku
if (process.env.NODE_ENV === 'production' && process.env.DYNO) {
  console.log('Loading Heroku config...');
  const { config: herokuConfig } = require('./packages/server/dist/cjs/config.heroku');
  config = herokuConfig;
  console.log('Heroku config loaded, webUiDir:', config.backend.webUiDir);

  const cardManager = CardManager.getInstance();
  cardManager.defineSet(sets.setAncientOrigins);
  cardManager.defineSet(sets.setArceus);
  cardManager.defineSet(sets.setAstralRadiance);
  cardManager.defineSet(sets.setScarletAndVioletEnergy);

  // Bots config
  config.bots.defaultPassword = 'bot';

  // Sets/scans config
  config.sets.scansDir = __dirname + '';
  config.sets.scansUrl = '{cardImage}';

  const botManager = BotManager.getInstance();
  botManager.registerBot(new SimpleBot('bot'));
} else {
  // Search for the argument with init script (like "--init=./init.js")
  require((process.argv.find(arg => arg.startsWith('--init=')) || '--init=./init.js')
    .replace(/^--init=/, '').replace(/.js$/, ''));
}

const cardManager = CardManager.getInstance();
const botManager = BotManager.getInstance();
const app = new App();

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

// Run server app
app.connectToDatabase()
  .catch(error => {
    console.log('Unable to connect to database.');
    console.error(error.message);
    process.exit(1);
  })
  .then(() => {
    console.log('Configuring bot manager...');
    return app.configureBotManager(botManager);
  })
  .then(() => {
    console.log('Configuring web UI with path:', config.backend.webUiDir);
    return app.configureWebUi(config.backend.webUiDir);
  })
  // .then(() => app.downloadMissingScans())
  // .catch(error => {
  //   console.log('Unable to download image.');
  //   console.error(error.message);
  //   process.exit(1);
  // })
  .then(() => {
    console.log('Starting server...');
    return app.start();
  })
  .then(() => {
    const address = config.backend.address;
    const port = config.backend.port;
    console.log('Application started on ' + address + ':' + port + '.');
  })
  .catch(error => {
    console.error(error.message);
    console.log('Application not started.');
    process.exit(1);
  });
