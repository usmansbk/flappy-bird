import Phaser from 'phaser';
import GameScene from './scenes/Game.js';

const config = {
  scale: {
    autoCenter: true,
  },
  type: Phaser.AUTO,
  width: 400,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
    },
  },
  scene: [GameScene],
};

const start = () => new Phaser.Game(config);

window.addEventListener('load', start);