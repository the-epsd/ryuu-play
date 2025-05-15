const { App, BotManager } = require('@ptcg/server');
const { CardManager, StateSerializer } = require('@ptcg/common');
const { mkdirSync } = require('node:fs');

// Use Heroku config in production
let config;
if (process.env.NODE_ENV === 'production') {
  config = require('./packages/server/dist/cjs/config.heroku').config;
} else {
  // Search for the argument with init script (like "--init=./init.js")
  config = require((process.argv.find(arg => arg.startsWith('--init=')) || '--init=./init.js')
    .replace(/^--init=/, '').replace(/.js$/, '')).config;
}

const cardManager = CardManager.getInstance();
const botManager = BotManager.getInstance();
const app = new App();

// Feed state-serializer with card definitions
StateSerializer.setKnownCards(cardManager.getAllCards());

// Ensure directories exists
mkdirSync(config.backend.avatarsDir, { recursive: true });
mkdirSync(config.sets.scansDir, { recursive: true });

// Run server app
app.connectToDatabase()
  .catch(error => {
    console.log('Unable to connect to database.');
    console.error(error.message);
    process.exit(1);
  })
  .then(() => app.configureBotManager(botManager))
  .then(() => app.configureWebUi(config.backend.webUiDir))
  // .then(() => app.downloadMissingScans())
  // .catch(error => {
  //   console.log('Unable to download image.');
  //   console.error(error.message);
  //   process.exit(1);
  // })
  .then(() => app.start())
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
