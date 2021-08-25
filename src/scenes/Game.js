import Phaser from 'phaser';
import Base from '../assets/sprites/base.png';
import Background from '../assets/sprites/background.png';
import Bird from '../assets/sprites/bird.png';
import Pipe from '../assets/sprites/pipe.png';

const GROUND = 'ground';
const BACKGROUND = 'background';
const BIRD = 'bird';
const PIPE = 'pipe';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('game-scene');
  }

  preload() {
    this.load.image(GROUND, Base);
    this.load.image(BACKGROUND, Background);
    this.load.image(PIPE, Pipe);
    this.load.spritesheet(BIRD, Bird, { frameWidth: 34, frameHeight: 24 });
  }

  create() {
    this.createPlatforms();
    this.add.image(165, 568, PIPE);
    const ground = this.add.image(165, 568, GROUND);
    ground.setScale(1.5, 1);
    const player = this.createPlayer();

    this.physics.add.existing(ground, true);
    this.physics.add.collider(player, ground);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  createPlatforms() {
    const plaforms = this.physics.add.staticGroup();

    plaforms.create(200, 300, BACKGROUND).setScale(1.5).refreshBody();

    return plaforms;
  }

  createPlayer() {
    const player = this.physics.add.sprite(100, 300, BIRD);
    player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'flap',
      frames: this.anims.generateFrameNumbers(BIRD, { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1,
    });

    return player;
  }
}