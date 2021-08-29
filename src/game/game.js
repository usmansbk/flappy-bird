import Phaser from 'phaser';
import { WebFontLoaderPlugin } from 'phaser3-webfont-loader';
import GameScene from './scenes/Game.js';
import PreloadScene from './scenes/Preload.js';
import './game.css';

const config = {
  type: Phaser.AUTO,
  autoCenter: true,
  width: 320,
  height: 600,
  backgroundColor: '#1e272e',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [PreloadScene, GameScene],
  plugins: {
    global: [{
      key: 'WebFontLoader',
      plugin: WebFontLoaderPlugin,
      start: true,
    }],
  },
};

const start = () => new Phaser.Game(config);

window.addEventListener('load', start);