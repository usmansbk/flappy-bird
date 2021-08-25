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
const PIPE_HEIGHT = 320;
const PIPE_GAP_HEIGHT = 100;
const PIPE_GAP_LENGTH = 175;
const PIPE_PAIRS = 3;
const GROUND_HEIGHT = 112;
const GROUND_WIDTH = 336;
const FRAME_RATE = 10;
const BIRD_GRAVITY = 1000;
const BIRD_VELOCITY = -350;
const GROUND_VELOCITY = 1.5;

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

    this.pipes = this.createPipes();
    this.ground = this.createGround();
    this.player = this.createPlayer();
    this.message = this.createMessage();

    this.player.setGravityY(BIRD_GRAVITY);

    this.physics.add.existing(this.ground, true);
    this.physics.add.collider(this.player, this.ground);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    if (this.cursors.space.isDown) {
      this.message.visible = false;
      this.flap();
    }

    this.ground.tilePositionX += GROUND_VELOCITY;
  }

  flap() {
    this.player.setVelocityY(BIRD_VELOCITY);
    this.player.anims.play(FLAP, true);
  }

  createBackground() {
    const plaforms = this.physics.add.staticGroup();

    const { width, height } = this.scale;
    plaforms.create(width * 0.5, height * 0.5, BACKGROUND).setScale(1.5).refreshBody();

    return plaforms;
  }

  createPlayer() {
    const { width, height } = this.scale;
    const player = this.physics.add.sprite(width * 0.3, height * 0.5, BIRD);
    player.setCollideWorldBounds(true);

    this.anims.create({
      key: FLAP,
      frames: this.anims.generateFrameNumbers(BIRD, { start: 0, end: 2 }),
      frameRate: FRAME_RATE,
      repeat: -1,
    });

    this.anims.create({
      key: GLIDE,
      frames: [{ key: BIRD, frame: 0 }],
      frameRate: FRAME_RATE,
    });

    return player;
  }

  createMessage() {
    const { width, height } = this.scale;

    return this.add.image(width * 0.5, height * 0.3, MESSAGE);
  }

  createGround() {
    const { width, height } = this.scale;
    const x = width * 0.5;
    const y = height - GROUND_HEIGHT * 0.3;
    const ground = this.add.tileSprite(x, y, GROUND_WIDTH, GROUND_HEIGHT, GROUND);
    ground.setScale(1.5, 1);

    return ground;
  }

  createPipes() {
    const y = 0;
    const pipes = this.physics.add.staticGroup();

    for (let i = 0; i < PIPE_PAIRS; i += 1) {
      const deltaX = i * PIPE_GAP_LENGTH;
      const top = this.add.image(deltaX, y, PIPE).setOrigin(0, 0);
      top.flipY = true;

      const bottom = this.add.image(deltaX, y + PIPE_GAP_HEIGHT + PIPE_HEIGHT, PIPE)
        .setOrigin(0, 0);

      pipes.add(top);
      pipes.add(bottom);
    }

    return pipes;
  }
}