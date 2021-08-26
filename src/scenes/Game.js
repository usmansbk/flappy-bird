import Phaser from 'phaser';
import Base from '../assets/sprites/base.png';
import Background from '../assets/sprites/background.png';
import Bird from '../assets/sprites/bird.png';
import Pipe from '../assets/sprites/pipe.png';
import Message from '../assets/sprites/message.png';
import GameOver from '../assets/sprites/gameover.png';

const SCENE_NAME = 'game-scene';
const GROUND = 'ground';
const BACKGROUND = 'background';
const BIRD = 'bird';
const PIPE = 'bottom-pipe';
const FLAP = 'flap';
const MESSAGE = 'message';
const GAME_OVER = 'gameover';
const PIPE_HEIGHT = 320;
const PIPE_GAP_HEIGHT = 120;
const PIPE_GAP_LENGTH = 180;
const PIPE_PAIRS = 3;
const GROUND_HEIGHT = 112;
const FRAME_RATE = 10;
const BIRD_GRAVITY = 1000;
const BIRD_VELOCITY = -340;
const GAME_SPEED = 1.8;
const ELEVATION_ANGLE = 25;
const DECLINE_ANGLE_DELTA = 2;
const MIN_PIPE_HEIGHT = -PIPE_HEIGHT * 0.8;
const READY_STATE = 'ready-state';
const PLAYING_STATE = 'playing-state';
const GAME_OVER_STATE = 'gameover-state';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super(SCENE_NAME);
    this.state = READY_STATE;
  }

  setReady() {
    this.state = READY_STATE;
  }

  setPlaying() {
    this.state = PLAYING_STATE;
  }

  setGameOver() {
    this.state = GAME_OVER_STATE;
  }

  isReady() {
    return this.state === READY_STATE;
  }

  isPlaying() {
    return this.state === PLAYING_STATE;
  }

  isOver() {
    return this.state === GAME_OVER_STATE;
  }

  preload() {
    this.load.image(GROUND, Base);
    this.load.image(BACKGROUND, Background);
    this.load.image(PIPE, Pipe);
    this.load.image(MESSAGE, Message);
    this.load.image(GAME_OVER, GameOver);
    this.load.spritesheet(BIRD, Bird, { frameWidth: 34, frameHeight: 24 });
  }

  create() {
    this.createBackground();

    this.pipes = this.createPipes();
    this.ground = this.createGround();
    this.player = this.createPlayer();
    this.message = this.createMessage();
    this.gameover = this.createGameOverMessage();

    this.physics.add.existing(this.ground, true);
    this.physics.add.collider(this.player, this.ground, this.setGameOver, null, this);
    this.physics.add.collider(this.player, this.pipes.topPipes);
    this.physics.add.collider(this.player, this.pipes.bottomPipes);

    this.physics.add.overlap(this.player, this.pipes.topPipes, this.setGameOver, null, this);
    this.physics.add.overlap(this.player, this.pipes.bottomPipes, this.setGameOver, null, this);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    switch (this.state) {
      case READY_STATE: {
        this.moveGround();
        this.gameover.visible = false;
        if (this.cursors.space.isDown || this.input.activePointer.leftButtonDown()) {
          this.start();
        }
        break;
      }
      case PLAYING_STATE: {
        this.flap();
        this.movePipes();
        this.recyclePipes();
        this.moveGround();
        break;
      }
      case GAME_OVER_STATE: {
        this.gameover.visible = true;
        this.stop();
        break;
      }
      default:
        break;
    }
  }

  start() {
    this.state = PLAYING_STATE;
    this.message.visible = false;
    this.player.body.allowGravity = true;
  }

  stop() {
    if (!this.player.body.touching.down) {
      this.player.angle += DECLINE_ANGLE_DELTA;
    }
    this.player.anims.stop();
  }

  flap() {
    if (this.cursors.space.isDown || this.input.activePointer.leftButtonDown()) {
      this.player.setVelocityY(BIRD_VELOCITY);
      this.player.anims.play(FLAP, true);
      this.player.angle = -ELEVATION_ANGLE;
    } else if (!this.player.body.touching.down) {
      this.player.angle += DECLINE_ANGLE_DELTA;
    }
  }

  moveGround() {
    this.ground.tilePositionX += GAME_SPEED;
  }

  movePipes() {
    this.pipes.topPipes.incX(-GAME_SPEED);
    this.pipes.bottomPipes.incX(-GAME_SPEED);
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
    player.body.allowGravity = false;

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

  createGameOverMessage() {
    const { width, height } = this.scale;

    return this.add.image(width * 0.5, height * 0.4, GAME_OVER);
  }

  createGround() {
    const { width, height } = this.scale;
    const x = width * 0.5;
    const y = height - GROUND_HEIGHT * 0.3;
    const ground = this.add.tileSprite(x, y, width, GROUND_HEIGHT, GROUND);

    return ground;
  }

  createPipePair(x, y) {
    const top = this.physics.add.image(x, y, PIPE);
    top.flipY = true;
    top.body.moves = false;
    top.setOrigin(0, 0);

    const bottomY = y + PIPE_GAP_HEIGHT + PIPE_HEIGHT;
    const bottom = this.physics.add.image(x, bottomY, PIPE);
    bottom.body.moves = false;
    bottom.setOrigin(0, 0);

    return [top, bottom];
  }

  createPipes() {
    const { width } = this.scale;
    const topPipes = this.physics.add.group();
    const bottomPipes = this.physics.add.group();

    const offsetX = width + PIPE_GAP_LENGTH;

    for (let i = 0; i < PIPE_PAIRS; i += 1) {
      const y = Phaser.Math.Between(MIN_PIPE_HEIGHT, 0);
      const deltaX = offsetX + (i * PIPE_GAP_LENGTH);

      const [top, bottom] = this.createPipePair(deltaX, y);

      topPipes.add(top);
      bottomPipes.add(bottom);
    }

    return { topPipes, bottomPipes };
  }

  updatePipesPosition(top, bottom) {
    const x = this.scale.width + PIPE_GAP_LENGTH;
    const y = Phaser.Math.Between(MIN_PIPE_HEIGHT, 0);
    const bottomY = y + PIPE_GAP_HEIGHT + PIPE_HEIGHT;

    top.y = y;
    top.x = x;

    bottom.x = x;
    bottom.y = bottomY;
  }

  recyclePipes() {
    this.pipes.bottomPipes.getChildren().forEach((bottom, index) => {
      const x = bottom.getBounds().right;
      if (x < 0) {
        const top = this.pipes.topPipes.getChildren()[index];
        this.updatePipesPosition(top, bottom);
      }
    });
  }
}