class story1 extends Phaser.Scene {
  constructor() {
    super({
      key: "story1",
    });

    // Put global variable here
  }

  preload() {
    this.load.image('story1', 'assets/story1.png');
    this.load.audio('islandMusic','assets/island.wav');
  }

  create() {
    console.log(" This is story1");

    // Add any sound and music here
    // ( 0 = mute to 1 is loudest )
    //this.music = this.sound.add('bgMusic').setVolume(0.3) // 10% volume
    // window.introMusic = this.sound.add('islandMusic', { loop:true,}).setVolume(0.1);
    // window.introMusic.play();

    //this.music.play()
    //window.music = this.music

    // Add image and detect spacebar keypress
    this.add.image(0, 0, 'story1').setOrigin(0, 0);

    // Check for spacebar or any key here
    var spaceDown = this.input.keyboard.addKey("SPACE");
    var key3 = this.input.keyboard.addKey(51);

    // On spacebar event, call the world scene
    spaceDown.on("down", function () {
    console.log("jump to story2");
      
      this.scene.start("story2");
        },
        this
      );
  
      key3.on (
        "down", function (){
        console.log("jump to world");
        window.introMusic.stop();
  
      let playerPos = {};
      playerPos.x = 50;
      playerPos.y = 150;
      playerPos.dir = "right";
  
        this.scene.start("world", { player: playerPos });
      },
      this
    );

    // Add any text in the main page
    this.add.text(400, 220, "PRESS SPACEBAR TO CONTINUE", {
      font: "12px Arial Rounded MT Bold",
      fill: "#000000",
    });

    // Create all the game animations here
  }
}
