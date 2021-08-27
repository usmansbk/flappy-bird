import Phaser from 'phaser';
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
};

const start = () => new Phaser.Game(config);

window.addEventListener('load', start);