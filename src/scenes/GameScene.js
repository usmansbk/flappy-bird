import Phaser from 'phaser';
import Base from '../assets/sprites/base.png';
import Background from '../assets/sprites/background.png';

const GROUND = 'ground';
const BACKGROUND = 'background';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('game-scene');
  }

  preload() {
    this.load.image(GROUND, Base);
    this.load.image(BACKGROUND, Background);
  }

  create() {
    this.add.image(200, 300, GROUND);
    this.createPlatforms();
  }

  createPlatforms() {
    const plaforms = this.physics.add.staticGroup();

    plaforms.create(0, 0, BACKGROUND).setScale(2).refreshBody();
  }
}