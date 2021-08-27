import Phaser from 'phaser';
import Base from '../assets/sprites/base.png';
import Background from '../assets/sprites/background.png';
import Bird from '../assets/sprites/bird.png';
import Pipe from '../assets/sprites/pipe.png';
import Message from '../assets/sprites/message.png';
import GameOver from '../assets/sprites/gameover.png';
import Zero from '../assets/sprites/0.png';
import One from '../assets/sprites/1.png';
import Two from '../assets/sprites/2.png';
import Three from '../assets/sprites/3.png';
import Four from '../assets/sprites/4.png';
import Five from '../assets/sprites/5.png';
import Six from '../assets/sprites/6.png';
import Seven from '../assets/sprites/7.png';
import Eight from '../assets/sprites/8.png';
import Nine from '../assets/sprites/9.png';

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
const GAME_SPEED = 2;
const ELEVATION_ANGLE = 25;
const FALL_ANGLE = 90;
const DECLINE_ANGLE_DELTA = 2;
const MIN_PIPE_HEIGHT = -PIPE_HEIGHT * 0.75;
const READY_STATE = 'ready-state';
const PLAYING_STATE = 'playing-state';
const GAME_OVER_STATE = 'gameover-state';
const DIGIT_WIDTH = 24;
const BEST_SCORE_KEY = 'best-score';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super(SCENE_NAME);
    this.score = 0;
  }

  preload() {
    this.load.image(GROUND, Base);
    this.load.image(BACKGROUND, Background);
    this.load.image(PIPE, Pipe);
    this.load.image(MESSAGE, Message);
    this.load.image(GAME_OVER, GameOver);
    this.load.spritesheet(BIRD, Bird, { frameWidth: 34, frameHeight: 24 });
    this.load.image('0', Zero);
    this.load.image('1', One);
    this.load.image('2', Two);
    this.load.image('3', Three);
    this.load.image('4', Four);
    this.load.image('5', Five);
    this.load.image('6', Six);
    this.load.image('7', Seven);
    this.load.image('8', Eight);
    this.load.image('9', Nine);
  }

  create() {
    this.createBackground();

    this.pipes = this.createPipes();
    this.ground = this.createGround();
    this.player = this.createPlayer();
    this.readyMessage = this.createReadyMessage();
    this.gameoverMessage = this.createGameOverMessage();
    this.scoreText = this.createScoreText();
    this.bestScoreText = this.createBestScoreText();

    this.physics.add.existing(this.ground, true);
    this.physics.add.collider(this.player, this.ground, this.setGameOver, null, this);
    this.physics.add.collider(this.player, this.pipes.topPipes, this.setGameOver, null, this);
    this.physics.add.collider(this.player, this.pipes.bottomPipes, this.setGameOver, null, this);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.setReady();
  }

  isTapped() {
    return this.cursors.space.isDown || this.input.activePointer.primaryDown;
  }

  animate() {
    switch (this.state) {
      case READY_STATE: {
        this.moveGround();
        break;
      }
      case PLAYING_STATE: {
        this.fall();
        this.movePipes();
        this.loopPipes();
        this.moveGround();
        break;
      }
      case GAME_OVER_STATE: {
        this.fall();
        break;
      }
      default:
        break;
    }
  }

  handleInput() {
    if (this.isTapped()) {
      switch (this.state) {
        case READY_STATE:
          this.setPlaying();
          break;
        case PLAYING_STATE:
          this.flap();
          break;
        case GAME_OVER_STATE:
          this.restart();
          break;
        default:
          break;
      }
    }
  }

  update() {
    this.animate();
    this.handleInput();
  }

  setReady() {
    this.gameoverMessage.visible = false;
    this.bestScoreText.visible = false;
    this.player.body.allowGravity = false;
    this.player.anims.play(FLAP, true);
    this.state = READY_STATE;
  }

  setPlaying() {
    this.readyMessage.visible = false;
    this.player.body.allowGravity = true;
    this.state = PLAYING_STATE;
  }

  setGameOver() {
    this.gameoverMessage.visible = true;
    this.bestScoreText.visible = true;
    this.player.anims.stop();
    this.state = GAME_OVER_STATE;
    const bestScore = localStorage.getItem(BEST_SCORE_KEY) || 0;
    localStorage.setItem(BEST_SCORE_KEY, Math.max(this.score, bestScore));
    this.bestScoreText.setText(`Best: ${bestScore}`);
  }

  restart() {
    this.clearScore();
    this.scene.restart();
    this.setReady();
  }

  clearScore() {
    this.score = 0;
    this.lastRecordedPipe = null;
  }

  flap() {
    this.player.setVelocityY(BIRD_VELOCITY);
    this.player.anims.play(FLAP, true);
    this.player.angle = -ELEVATION_ANGLE;
  }

  fall() {
    if (this.player.angle < FALL_ANGLE) {
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

  createReadyMessage() {
    const { width, height } = this.scale;

    return this.add.image(width * 0.5, height * 0.4, MESSAGE);
  }

  createGameOverMessage() {
    const { width, height } = this.scale;

    return this.add.image(width * 0.5, height * 0.4, GAME_OVER);
  }

  createScoreText() {
    const { width, height } = this.scale;
    const score = this.physics.add.staticGroup();

    const x = width * 0.5;
    const y = height * 0.08;
    const digits = String(this.score).split('');
    const length = digits.length * DIGIT_WIDTH;
    const offsetX = x - length / 2;
    digits.forEach((digit, index) => {
      score.create(offsetX + (index * DIGIT_WIDTH), y, digit);
    });

    score.setOrigin(0, 0);

    return score;
  }

  createBestScoreText() {
    const { width, height } = this.scale;
    const score = this.add.text(width * 0.5, height * 0.5, 'Best');

    return score;
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

  resetPipesPosition(top, bottom) {
    const x = this.scale.width + PIPE_GAP_LENGTH;
    const y = Phaser.Math.Between(MIN_PIPE_HEIGHT, 0);
    const bottomY = y + PIPE_GAP_HEIGHT + PIPE_HEIGHT;

    top.y = y;
    top.x = x;

    bottom.x = x;
    bottom.y = bottomY;
  }

  updateScoreText() {
    this.scoreText.clear(true, true);
    this.scoreText = this.createScoreText();
  }

  updateScore(pipeMiddle, currentPipe) {
    const { right } = this.player.getBounds();
    if (pipeMiddle < right && this.lastRecordedPipe !== currentPipe) {
      this.score += 1;
      this.lastRecordedPipe = currentPipe;
      this.updateScoreText();
    }
  }

  loopPipes() {
    this.pipes.bottomPipes.getChildren().forEach((bottom, index) => {
      const { right, centerX } = bottom.getBounds();
      if (right < 0) {
        const top = this.pipes.topPipes.getChildren()[index];
        this.resetPipesPosition(top, bottom);
      }
      this.updateScore(centerX, index);
    });
  }
}