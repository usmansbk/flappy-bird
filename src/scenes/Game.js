import Phaser from 'phaser';
import Base from '../assets/sprites/base.png';
import Background from '../assets/sprites/background.png';
import Bird from '../assets/sprites/bird.png';
import Pipe from '../assets/sprites/pipe.png';
import Message from '../assets/sprites/message.png';

const GROUND = 'ground';
const BACKGROUND = 'background';
const BIRD = 'bird';
const PIPE = 'pipe';
const FLAP = 'flap';
const GLIDE = 'glide';
const MESSAGE = 'message';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('game-scene');
  }

  preload() {
    this.load.image(GROUND, Base);
    this.load.image(BACKGROUND, Background);
    this.load.image(PIPE, Pipe);
    this.load.image(MESSAGE, Message);
    this.load.spritesheet(BIRD, Bird, { frameWidth: 34, frameHeight: 24 });
  }

  create() {
    this.createBackground();
    this.createPipe();

    this.ground = this.createGround();
    this.player = this.createPlayer();

    this.createMessage();

    this.physics.add.existing(this.ground, true);
    this.physics.add.collider(this.player, this.ground);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.cursors.space.isDown) {
      this.player.setVelocityY(-160);
      this.player.anims.play(FLAP, true);
    }

    this.ground.tilePositionX += 1.5;
  }

  createBackground() {
    const plaforms = this.physics.add.staticGroup();

    const { width, height } = this.scale;
    plaforms.create(width * 0.5, height * 0.5, BACKGROUND).setScale(1.5).refreshBody();

    return plaforms;
  }

  createPlayer() {
    const player = this.physics.add.sprite(200, 300, BIRD);
    player.setCollideWorldBounds(true);

    this.anims.create({
      key: FLAP,
      frames: this.anims.generateFrameNumbers(BIRD, { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: GLIDE,
      frames: [{ key: BIRD, frame: 0 }],
      frameRate: 20,
    });

    return player;
  }

  createMessage() {
    const { width, height } = this.scale;

    this.message = this.add.image(width * 0.5, height * 0.5, MESSAGE);
  }

  createGround() {
    const ground = this.add.tileSprite(165, 568, 336, 112, GROUND);
    ground.setScale(1.5, 1);

    return ground;
  }

  createPipe() {
    const pipe = this.add.image(165, 568, PIPE);

    return pipe;
  }
}