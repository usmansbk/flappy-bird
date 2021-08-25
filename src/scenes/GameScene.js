import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('game-scene');
  }

  preload() {
    this.load.image('0', '/assets/sprites/0.png');
  }

  create() {
    this.add.image(100, 100, '0');
  }
}