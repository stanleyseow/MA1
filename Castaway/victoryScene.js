class victoryScene extends Phaser.Scene {
  constructor() {
    super({
      key: "victoryScene",
    });

    // Put global variable here
  }

  preload() {
    this.load.image('victory', 'assets/victory.png');
    this.load.audio('victoryMusic','assets/victory.mp3');
    this.load.audio('islandMusic','assets/island.wav');
  }

  create() {
    console.log(" This is victoryScene");

    // Add any sound and music here
    // ( 0 = mute to 1 is loudest )
    //this.music = this.sound.add('bgMusic').setVolume(0.3) // 10% volume
    window.music.stop();
    
    this.bgmSnd = this.sound.add('victoryMusic').setVolume(0.2);
    this.bgmSnd.play();


    //this.music.play()
    //window.music = this.music

    // Add image and detect spacebar keypress
    this.add.image(0, 0, 'victory').setOrigin(0, 0);

    // Check for spacebar or any key here
    var spaceDown = this.input.keyboard.addKey("SPACE");

    // On spacebar event, call the world scene
    spaceDown.on("down", function () {
    console.log("Spacebar pressed, reply game");

    this.bgmSnd.loop = false;
    this.bgmSnd.stop();

    let playerPos = {};
    playerPos.x = 50;
    playerPos.y = 150;
    playerPos.dir = "right";

    window.heart = 5;
    window.coin = 0;
    window.crystal = 0;
    window.crabHeart = 3;
    
    this.scene.start("main");
      },
      this
    );

    // Add any text in the main page
    this.add.text(350, 280, "PRESS SPACEBAR TO RESTART", {
      font: "15px Arial Rounded MT Bold",
      fill: "#000000",
    });

    // Create all the game animations here
  }
}
