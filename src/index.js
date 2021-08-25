import Phaser from 'phaser';
import GameScene from './scenes/GameScene.js';

const config = {
  type: Phaser.AUTO,
  width: 320,
  height: 480,
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