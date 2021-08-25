import Phaser from 'phaser';
import TitleScene from './scenes/Title.js';
import GameScene from './scenes/Game.js';

const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [TitleScene, GameScene],
};

const start = () => new Phaser.Game(config);

window.addEventListener('load', start);