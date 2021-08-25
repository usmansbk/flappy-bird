import Phaser from 'phaser';
import Zero from '../assets/sprites/0.png';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('game-scene');
  }

  preload() {
    this.load.image('0', Zero);
  }

  create() {
    this.add.image(100, 100, '0');
  }
}