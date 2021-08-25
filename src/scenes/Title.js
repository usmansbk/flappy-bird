import Phaser from 'phaser';
import Base from '../assets/sprites/base.png';
import Background from '../assets/sprites/background.png';
import Message from '../assets/sprites/message.png';

const GROUND = 'ground';
const BACKGROUND = 'background';
const MESSAGE = 'message';

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super('title-scene');
  }

  preload() {
    this.load.image(GROUND, Base);
    this.load.image(MESSAGE, Message);
    this.load.image(BACKGROUND, Background);
  }

  create() {
    this.createPlatforms();
    const ground = this.add.image(165, 568, GROUND);
    ground.setScale(1.5, 1);

    this.add.image(200, 300, MESSAGE);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.cursors.space.isDown) {
      this.scene.start('game-scene');
    }
  }

  createPlatforms() {
    const plaforms = this.physics.add.staticGroup();

    plaforms.create(200, 300, BACKGROUND).setScale(1.5).refreshBody();

    return plaforms;
  }
}