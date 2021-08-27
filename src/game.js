import Phaser from 'phaser';
import { WebFontLoaderPlugin } from 'phaser3-webfont-loader';
import GameScene from './scenes/Game.js';
import './styles/game.css';

const config = {
  type: Phaser.AUTO,
  autoCenter: true,
  width: 320,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [GameScene],
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