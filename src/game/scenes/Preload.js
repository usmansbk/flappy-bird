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
import StartButton from '../assets/sprites/start.png';
import PointWav from '../assets/audio/point.wav';
import PointOgg from '../assets/audio/point.ogg';
import FlapWav from '../assets/audio/wing.wav';
import FlapOgg from '../assets/audio/wing.ogg';
import SwooshWav from '../assets/audio/swoosh.wav';
import SwooshOgg from '../assets/audio/swoosh.ogg';
import HitSoundWav from '../assets/audio/hit.wav';
import HitSoundOgg from '../assets/audio/hit.ogg';
import DieSoundWav from '../assets/audio/die.wav';
import DieSoundOgg from '../assets/audio/die.ogg';
import {
  PRELOAD_SCENE_KEY,
  GROUND,
  BACKGROUND,
  BIRD,
  PIPE,
  GAME_OVER_MESSAGE,
  READY_MESSAGE,
  GAME_SCENE_KEY,
  POINT_SOUND,
  FLAP_SOUND,
  SWOOSH_SOUND,
  HIT_SOUND,
  DIE_SOUND,
  START_BUTTON,
} from './shared.js';

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super(PRELOAD_SCENE_KEY);
  }

  preload() {
    const { width, height } = this.scale;
    const loadingText = this.add.text(width * 0.5, height * 0.5, 'Loading...', { fontSize: '25px' }).setOrigin(0.5);

    this.load.image(GROUND, Base);
    this.load.image(BACKGROUND, Background);
    this.load.image(PIPE, Pipe);
    this.load.image(READY_MESSAGE, Message);
    this.load.image(GAME_OVER_MESSAGE, GameOver);
    this.load.image(START_BUTTON, StartButton);
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
    this.load.audio(POINT_SOUND, [PointOgg, PointWav]);
    this.load.audio(FLAP_SOUND, [FlapOgg, FlapWav]);
    this.load.audio(SWOOSH_SOUND, [SwooshOgg, SwooshWav]);
    this.load.audio(HIT_SOUND, [HitSoundOgg, HitSoundWav]);
    this.load.audio(DIE_SOUND, [DieSoundOgg, DieSoundWav]);
    this.load.webfont('Teko', 'https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Teko:wght@600;700&display=swap');

    this.load.on('progress', (progress) => {
      const percent = progress * 100;
      loadingText.setText(`Loading... ${Math.round(percent)}%`);
    });
    this.load.on('complete', () => this.scene.start(GAME_SCENE_KEY));
  }
}