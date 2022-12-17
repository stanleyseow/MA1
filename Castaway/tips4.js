class tips4 extends Phaser.Scene {
  constructor() {
    super({
      key: "tips4",
    });

    // Put global variable here
  }

  preload() {
    this.load.image("floor1", "assets/floor1.png");                    
    this.load.image('goldCoin','assets/coin.png');
    this.load.image('crystal','assets/magicCrystal.png'); 
    this.load.image('teleportOn','assets/teleportOn.png');
    this.load.image('teleportOff','assets/teleportOff.png');                     
  }

  create() {
    console.log(" This is tips4");

    this.add.image(0, 0, 'floor1').setOrigin(0, 0);
    

    this.crystal = this.add.image(380,160,'crystal').setScale(0.4);
    this.goldCoin = this.add.image(200,180,'goldCoin');
    this.teleportOff = this.add.image(220,280, 'teleportOff').setScale(0.8);
    this.teleportOn = this.add.image(420,280, 'teleportOn').setScale(0.8);

    // Check for spacebar or any key here
    var spaceDown = this.input.keyboard.addKey("SPACE");

      spaceDown.on (
        "down", function (){
          console.log("jump to room3");
          let playerPos = {};
          playerPos.x = 200;
          playerPos.y = 677;
          playerPos.dir = "up";
          this.scene.start("room3",{playerPos:playerPos});
      },
      this
    );

    // Add any text in the main page
    this.add.text(200, 400, "PRESS SPACEBAR TO CONTINUE", {
      font: "15px Arial Rounded MT Bold",
      fill: "#000000",
    });

    this.add.text(90, 40, "- COLLECT AT LEAST THIS AMOUNT OF ITEMS", {
      font: "20px Arial Rounded MT Bold",
      fill: "#000000",
    });

    this.add.text(180, 80, "- TO ACTIVATE THE TELEPORT", {
      font: "20px Arial Rounded MT Bold",
      fill: "#000000",
    });

    this.add.text(240, 160, "x15", {
      font: "35px Arial Rounded MT Bold",
      fill: "#000000",
    });

    this.add.text(410, 160, "x2", {
      font: "35px Arial Rounded MT Bold",
      fill: "#000000",
    });

    // Create all the game animations here
  }
}
