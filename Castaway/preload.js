class preload extends Phaser.Scene {
  constructor() {
    super({
      key: "preload",
    });

    // Put global variable here
  }

  preload() {
    // Preload all the assets here
   
  }

  create() {
    console.log("*** main scene");

    // Add any sound and music here
    // ( 0 = mute to 1 is loudest )
    //this.music = this.sound.add('bgMusic').setVolume(0.3) // 10% volume

    //this.music.play()
    //window.music = this.music

    // Add image and detect spacebar keypress
    //this.add.image(0, 0, 'main').setOrigin(0, 0);

    // Check for spacebar or any key here
    var spaceDown = this.input.keyboard.addKey("SPACE");

    // On spacebar event, call the world scene
    spaceDown.on(
      "down",
      function () {
        console.log("Jump to world scene");

    let playerPos = {};
    playerPos.x = 50;
    playerPos.y = 150;
    playerPos.dir = "right";

    this.scene.start("world", { player: playerPos });
      },
      this
    );

    // Add any text in the main page
    this.add.text(90, 200, "Press spacebar to continue", {
      font: "30px Courier",
      fill: "#FFFFFF",
    });

    // Create all the game animations here
  }
}
