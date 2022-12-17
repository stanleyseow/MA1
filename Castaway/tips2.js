class tips2 extends Phaser.Scene {
  constructor() {
    super({
      key: "tips2",
    });

    // Put global variable here
  }

  preload() {
    this.load.image("floor1", "assets/floor1.png");
    this.load.atlas('crab','assets/crab.png',
                           'assets/crab.json') 
                          
    this.load.image('goldCoin','assets/coin.png');
    this.load.image('crystal','assets/magicCrystal.png');                      
  }

  create() {
    console.log(" This is tips2");

    this.add.image(0, 0, 'floor1').setOrigin(0, 0);

    this.anims.create({
      key:'attack',
      frames:[
          {key:'hiro attack',frame:'hiro attack 01'},
          {key:'hiro attack',frame:'hiro attack 02'},
          {key:'hiro attack',frame:'hiro attack 03'},
          {key:'hiro attack',frame:'hiro attack 04'},
      ],
      frameRate: 6,
      repeat: -1
  })

  //animation for crab
  this.anims.create({
    key:'crabMove',
    frames: [
        {key:'crab', frame:'crab 01'},
        {key:'crab', frame:'crab 02'},
        {key:'crab', frame:'crab 03'},
    ],
    frameRate: 4,
    repeat: -1
})
  
    this.hiro = this.add.sprite(180,250,'hiro attack').setScale(1.7).play('attack');
    this.crab = this.add.sprite(400,280,'crab').setScale(1.7).play('crabMove');
    

    this.crystal = this.add.image(380,160,'crystal').setScale(0.4);

    // Check for spacebar or any key here
    var spaceDown = this.input.keyboard.addKey("SPACE");
    //var key3 = this.input.keyboard.addKey(51);

    // On spacebar event, call the world scene
    // spaceDown.on("down", function () {
    //   console.log("jump to story6");
      
    //   this.scene.start("story6");
    //     },
    //     this
    //   );
  
      spaceDown.on (
        "down", function (){
        console.log("jump to room1");
  
        let playerPos = {};
        playerPos.x = 340;
        playerPos.y = 526;
        playerPos.dir = "up";
        this.scene.start("room1",{playerPos:playerPos});
      },
      this
    );

    // Add any text in the main page
    this.add.text(200, 400, "PRESS SPACEBAR TO CONTINUE", {
      font: "15px Arial Rounded MT Bold",
      fill: "#000000",
    });

    this.add.text(100, 40, "- KILL THE CRAB TO COLLECT THE CRYSTAL!", {
      font: "20px Arial Rounded MT Bold",
      fill: "#000000",
    });

    this.add.text(200, 70, "- AVOID THE BULET STAR!", {
      font: "20px Arial Rounded MT Bold",
      fill: "#000000",
    });

    // Create all the game animations here
  }
}
