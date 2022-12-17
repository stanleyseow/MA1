class introduction extends Phaser.Scene {
  constructor() 
  {
    super({ key: "introduction"});
  }

  preload() {
    //this.load.image('nickname', 'assets/xxx.png');
   
  }

  create() {
    console.log("This is introduction");

    // Add image and detect spacebar keypress
    //this.add.image(0, 0, 'nickname').setOrigin(0, 0);

    // Check for spacebar or any key here
    var spaceDown = this.input.keyboard.addKey("SPACE");

    // On spacebar event, call the world scene
    spaceDown.on('down', function () {
    console.log("Spacebar pressed, go to introduction");
    this.scene.stop("introduction");
    this.scene.start("storyScene");
    }, this );

    // Add any text in the main page
    this.add.text(90, 200, "Press spacebar to continue", {
      font: "30px Courier",
      fill: "#FFFFFF",
    });

    // Create all the game animations here
  }
}
