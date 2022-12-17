class gameoverScene extends Phaser.Scene {
  constructor() {
    super({
      key: "gameoverScene",
    });

    // Put global variable here
  }

  preload() {
    this.load.image('gameOver', 'assets/gameOver.png');
    this.load.audio('gameoverMusic','assets/gameover.mp3');
  }

  create() {
    console.log(" This is gameoverScene");

    // Add any sound and music here
    // ( 0 = mute to 1 is loudest )
    //this.music = this.sound.add('bgMusic').setVolume(0.3) // 10% volume
    window.music.stop();
    
    this.bgmSnd = this.sound.add('gameoverMusic').setVolume(0.1);
    this.bgmSnd.play();
    this.bgmSnd.loop = true;

    //this.music.play()
    //window.music = this.music

    // Add image and detect spacebar keypress
    this.add.image(0, 0, 'gameOver').setOrigin(0, 0);

    // Check for spacebar or any key here
    var spaceDown = this.input.keyboard.addKey("SPACE");

    // On spacebar event, call the world scene
    spaceDown.on("down", function () {
    console.log("Spacebar pressed, reply game");

    this.bgmSnd.loop = false;
    this.bgmSnd.stop();
    window.music = this.sound.add('mainBgm', { loop:true,}).setVolume(0.1);

    let playerPos = {};
    playerPos.x = 50;
    playerPos.y = 150;
    playerPos.dir = "right";

    window.heart = 5;
    window.coin = 0;
    window.crystal = 0;
    window.crabHeart = 3;
    
    this.scene.start("world", { player: playerPos });
      },
      this
    );

    // Add any text in the main page
    this.add.text(360, 250, "PRESS SPACEBAR TO RESTART", {
      font: "15px Arial Rounded MT Bold",
      fill: "#000000",
    });

    // Create all the game animations here
  }
}
