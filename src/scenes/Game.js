import Phaser from 'phaser';
import Base from '../assets/sprites/base.png';
import Background from '../assets/sprites/background.png';
import Bird from '../assets/sprites/bird.png';
import Pipe from '../assets/sprites/pipe.png';
import Message from '../assets/sprites/message.png';

const GROUND = 'ground';
const BACKGROUND = 'background';
const BIRD = 'bird';
const PIPE = 'bottom-pipe';
const FLAP = 'flap';
const MESSAGE = 'message';
const PIPE_HEIGHT = 320;
const PIPE_GAP_HEIGHT = 120;
const PIPE_GAP_LENGTH = 180;
const PIPE_PAIRS = 3;
const GROUND_HEIGHT = 112;
const FRAME_RATE = 10;
const BIRD_GRAVITY = 1000;
const BIRD_VELOCITY = -350;
const GAME_SPEED = 1.8;
const ELEVATION_ANGLE = 25;
const DECLINE_ANGLE_DELTA = 2;

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

    this.physics.add.existing(this.ground, true);
    this.physics.add.collider(this.player, this.ground);

    this.physics.add.collider(this.player, this.pipes, () => console.log('Collide'));

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    this.flap();
    this.moveGround();
  }

  flap() {
    if (this.cursors.space.isDown || this.input.activePointer.leftButtonDown()) {
      this.message.visible = false;
      this.player.setVelocityY(BIRD_VELOCITY);
      this.player.anims.play(FLAP, true);
      this.player.angle = -ELEVATION_ANGLE;
    } else if (!this.player.body.touching.down) {
      this.player.angle += DECLINE_ANGLE_DELTA;
    }
  }

  moveGround() {
    this.ground.tilePositionX += GAME_SPEED;
    this.pipes.incX(-GAME_SPEED);
  }

  createBackground() {
    const { width, height } = this.scale;
    this.physics.add.staticImage(width * 0.5, height * 0.5, BACKGROUND).setScale(1.5).refreshBody();
  }

  createPlayer() {
    const { width, height } = this.scale;
    const player = this.physics.add.sprite(width * 0.3, height * 0.5, BIRD);
    player.setCollideWorldBounds(true);
    player.setGravityY(BIRD_GRAVITY);
    // player.body.allowGravity = false;

    this.anims.create({
      key: FLAP,
      frames: this.anims.generateFrameNumbers(BIRD, { start: 0, end: 2 }),
      frameRate: FRAME_RATE,
      repeat: -1,
    });

    return player;
  }

  createMessage() {
    const { width, height } = this.scale;

    return this.add.image(width * 0.5, height * 0.4, MESSAGE);
  }

  createGround() {
    const { width, height } = this.scale;
    const x = width * 0.5;
    const y = height - GROUND_HEIGHT * 0.3;
    const ground = this.add.tileSprite(x, y, width, GROUND_HEIGHT, GROUND);

    return ground;
  }

  createPipes() {
    const { width } = this.scale;
    const pipes = this.physics.add.group();
    const offset = width + PIPE_GAP_LENGTH;

    for (let i = 0; i < PIPE_PAIRS; i += 1) {
      const y = Phaser.Math.Between(-PIPE_HEIGHT * 0.4, 0);
      const deltaX = offset + (i * PIPE_GAP_LENGTH);
      const bottomY = y + PIPE_GAP_HEIGHT + PIPE_HEIGHT;

      const top = this.physics.add.image(deltaX, y, PIPE);
      top.flipY = true;
      top.body.moves = false;
      pipes.add(top);

      const bottom = this.physics.add.image(deltaX, bottomY, PIPE);
      bottom.body.moves = false;
      pipes.add(bottom);
    }

    pipes.setOrigin(0, 0);
    return pipes;
  }
}