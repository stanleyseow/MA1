class tips1 extends Phaser.Scene {
  constructor() {
    super({
      key: "tips1",
    });

    // Put global variable here
  }

  preload() {
    this.load.image("floor1", "assets/floor1.png");
    this.load.atlas('snake', 'assets/snake.png',
                             'assets/snake.json');
    this.load.atlas('bat','assets/bat.png',
                          'assets/bat.json'); 
                          
    this.load.image('goldCoin','assets/coin.png');                      
  }

  create() {
    console.log(" This is tips1");

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

  //anims for snake
  this.anims.create({
    key:'crawl',
    frames:[
        {key:'snake',frame:'snake 01'},
        {key:'snake',frame:'snake 02'},
        {key:'snake',frame:'snake 03'},
    ],
    frameRate: 3,
    repeat: -1
  })

  //anims for bat
  this.anims.create({
    key:'fly',
    frames:[
        {key:'bat',frame:'bat 01'},
        {key:'bat',frame:'bat 02'},
    ],
    frameRate: 7,
    repeat: -1
  })
  

    this.hiro = this.add.sprite(180,250,'hiro attack').setScale(1.7).play('attack');
    this.snake = this.add.sprite(360,260,'snake').setScale(1).play('crawl');
    this.bat = this.add.sprite(500,260,'bat').setScale(1).play('fly');

    this.goldCoin = this.add.image(360,200,'goldCoin');

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
    this.add.text(200, 400, "PRESS SPACEBAR TO START GAME", {
      font: "15px Arial Rounded MT Bold",
      fill: "#000000",
    });

    this.add.text(110, 40, "- KILL THE SNAKE TO COLLECT THE COIN!", {
      font: "20px Arial Rounded MT Bold",
      fill: "#000000",
    });

    this.add.text(230, 70, "- AVOID THE BAT!", {
      font: "20px Arial Rounded MT Bold",
      fill: "#000000",
    });

    // Create all the game animations here
  }
}
