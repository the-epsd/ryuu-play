import express from 'express';
import { json } from 'body-parser';
import * as fs from 'fs';
import * as path from 'path';

import { Core } from '../game/core/core';
import { BotManager } from '../game/bots/bot-manager';
import { Storage } from '../storage';
import { WebSocketServer } from './socket/websocket-server';
import { config } from '../config';
import { cors } from './services/cors';

import {
  Avatars,
  ControllerClass,
  Cards,
  Decks,
  Game,
  Login,
  Messages,
  Profile,
  Ranking,
  Replays,
  ResetPassword
} from './controllers';

export class App {

  private app: express.Application;
  private ws: WebSocketServer;
  private storage: Storage;
  private core: Core;

  constructor() {
    this.storage = new Storage();
    this.core = new Core(this.storage);
    this.app = this.configureExpress();
    this.ws = this.configureWebSocket();
  }

  private configureExpress(): express.Application {
    const storage = this.storage;
    const core = this.core;
    const app = express();
    const define = function (path: string, controller: ControllerClass): void {
      const instance = new controller(path, app, storage, core);
      instance.init();
    };

    app.use(json({ limit: 512 + config.backend.avatarFileSize * 4 }));
    app.use(cors());
    define('/v1/avatars', Avatars);
    define('/v1/cards', Cards);
    define('/v1/decks', Decks);
    define('/v1/game', Game);
    define('/v1/login', Login);
    define('/v1/messages', Messages);
    define('/v1/profile', Profile);
    define('/v1/ranking', Ranking);
    define('/v1/replays', Replays);
    define('/v1/resetPassword', ResetPassword);

    // Ensure directories exist before serving static files
    if (config.sets.scansDir) {
      fs.mkdirSync(config.sets.scansDir, { recursive: true });
      app.use('/scans', express.static(config.sets.scansDir));
    }

    if (config.backend.avatarsDir) {
      fs.mkdirSync(config.backend.avatarsDir, { recursive: true });
      app.use('/avatars', express.static(config.backend.avatarsDir));
    }

    return app;
  }

  private configureWebSocket(): WebSocketServer {
    return new WebSocketServer(this.core);
  }

  public connectToDatabase(): Promise<void> {
    return this.storage.connect();
  }

  public configureBotManager(botManager: BotManager): void {
    botManager.initBots(this.core);
  }

  public configureWebUi(absolutePath: string): void {
    if (absolutePath) {
      const resolvedPath = path.resolve(absolutePath);
      console.log('Configuring web UI from:', resolvedPath);
      console.log('Directory contents:', fs.readdirSync(resolvedPath));

      // Check if directory exists
      if (!fs.existsSync(resolvedPath)) {
        console.error('Web UI directory does not exist:', resolvedPath);
        return;
      }

      // Check if index.html exists
      const indexPath = path.join(resolvedPath, 'index.html');
      if (!fs.existsSync(indexPath)) {
        console.error('index.html not found in:', resolvedPath);
        return;
      }

      console.log('Serving static files from:', resolvedPath);
      this.app.use(express.static(resolvedPath));

      // Serve index.html for all routes
      this.app.use('*', (req, res) => {
        console.log('Serving index.html for route:', req.originalUrl);
        res.sendFile(indexPath);
      });
    }
  }

  // public downloadMissingScans(): Promise<void> {
  //   const scansDownloader = new ScansDownloader();
  //   return scansDownloader.downloadAllMissingCards();
  // }

  public start(): void {
    const address = config.backend.address;
    const port = config.backend.port;

    const httpServer = this.app.listen(port, address, () => {
      console.log(`Server listening on ${address}:${port}.`);
    });

    this.ws.listen(httpServer);
  }

}
