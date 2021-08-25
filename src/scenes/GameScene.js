import Phaser from 'phaser';
import Base from '../assets/sprites/base.png';
import Background from '../assets/sprites/background.png';
import Bird from '../assets/sprites/bird.png';

const GROUND = 'ground';
const BACKGROUND = 'background';
const BIRD = 'bird';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('game-scene');
  }

  preload() {
    this.load.image(GROUND, Base);
    this.load.image(BACKGROUND, Background);
    this.load.spritesheet(BIRD, Bird, { frameWidth: 34, frameHeight: 24 });
  }

  create() {
    this.createPlatforms();
    this.add.image(165, 568, GROUND);
  }

  createPlatforms() {
    const plaforms = this.physics.add.staticGroup();

    plaforms.create(200, 300, BACKGROUND).setScale(1.5).refreshBody();

    return plaforms;
  }
}