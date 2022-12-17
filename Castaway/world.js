class world extends Phaser.Scene {
  constructor() 
  {
    super({ key: "world"});
    window.attack = false;
  }

  // incoming data from scene below
  init(data) {
    this.playerPos = data.player;
  }

  preload() {
    this.load.atlas('snake', 'assets/snake.png',
                             'assets/snake.json')
    this.load.atlas('bat','assets/bat.png',
                          'assets/bat.json')
    this.load.audio('collectCoin','assets/collectCoin.wav');
    this.load.audio('sword','assets/sword.wav');
    this.load.audio('mainBgm','assets/island2.mp3');
    this.load.audio('hit','assets/minusHeart.wav');
    this.load.audio('collectItem','assets/item.wav');
    this.load.audio('islandMusic','assets/island.wav');

    // Step 1, load JSON
    this.load.tilemapTiledJSON("world","assets/Castaway.json");

    // Step 2 : Preload any images here, nickname, filename
    this.load.image("groundPng", "assets/Pipoya.png");
    //this.load.image("sea","assets/various.png");
    this.load.image("potionPng","assets/various.png");
    this.load.image("portalPng","assets/teleportTile.png");
    this.load.image("grassPng","assets/Grass-ground.png");
    this.load.image('heartPng','assets/heart.png');
    this.load.image('goldCoin','assets/coin.png');
    this.load.image('hiroHealth','assets/health1.png');
  }

  create() {
    console.log("*** world scene");
    console.log("live:", window.heart);
    console.log('enemyCount:', this.enemyCount);
    
    window.music = this.sound.add('mainBgm', { loop:true,}).setVolume(0.1);
    window.music.play();

    //this.bgmSnd = this.sound.add('mainBgm').setVolume(0.3);
    this.attackSnd = this.sound.add('sword');
    this.coinSnd = this.sound.add('collectCoin');
    this.hitSnd = this.sound.add('hit'); //hit by enemy
    this.itemSnd = this.sound.add('collectItem'); //collect potion
    // this.bgmSnd.play();
    // this.bgmSnd.loop = true;

  //Step 3 - Create the map from main
  let map = this.make.tilemap({key:'world'});
    
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

    // Step 4 Load the game tiles
    // 1st parameter is name in Tiled,
    // 2nd parameter is key in Preload
    let groundTiles = map.addTilesetImage("Pipoya", "groundPng");
    let grassTiles = map.addTilesetImage("Grass-ground","grassPng",);
    let portalTiles = map.addTilesetImage("Teleport","portalPng");
    let potionTiles = map.addTilesetImage("various","potionPng");

    let tilesArray = [ groundTiles,grassTiles,portalTiles,potionTiles]

    // Step 5  Load in layers by layers
    this.groundLayer = map.createLayer("groundLayer",tilesArray,0,0);
    this.waterLayer = map.createLayer("waterLayer",tilesArray,0,0);
    this.treesLayer = map.createLayer("treesLayer",tilesArray,0,0);
    this.itemLayer = map.createLayer("itemLayer",tilesArray,0,0);
    this.roomLayer = map.createLayer("roomLayer",tilesArray,0,0);
    this.potionLayer = map.createLayer("potionLayer",tilesArray,0,0);
    
    //health hearts
    this.hiroHealth = this.add.image(30,25,'hiroHealth').setScale(0.5).setScrollFactor(0);
    this.heart1 = this.add.image(70,25,'heartPng').setScale(0.3).setScrollFactor(0).setVisible(false);
    this.heart2 = this.add.image(110,25,'heartPng').setScale(0.3).setScrollFactor(0).setVisible(false);
    this.heart3 = this.add.image(150,25,'heartPng').setScale(0.3).setScrollFactor(0).setVisible(false);
    this.heart4 = this.add.image(190,25,'heartPng').setScale(0.3).setScrollFactor(0).setVisible(false);
    this.heart5 = this.add.image(230,25,'heartPng').setScale(0.3).setScrollFactor(0).setVisible(false);

    // this.goldCoin = this.add.image(230,200,'goldCoin').setScale(0.3).setVisible(false);

    if (window.heart>= 5){
      this.heart1.setVisible(true);
      this.heart2.setVisible(true);
      this.heart3.setVisible(true);
      this.heart4.setVisible(true);
      this.heart5.setVisible(true);
    } else if (window.heart == 4){
      this.heart1.setVisible(true);
      this.heart2.setVisible(true);
      this.heart3.setVisible(true);
      this.heart4.setVisible(true);
    } else if (window.heart == 3){
      this.heart1.setVisible(true);
      this.heart2.setVisible(true);
      this.heart3.setVisible(true);
    } else if (window.heart == 2){
      this.heart1.setVisible(true);
      this.heart2.setVisible(true);
    } else if (window.heart == 1){
      this.heart1.setVisible(true);
  }

    //load snake enemies object
    var snake01 = map.findObject("objectLayer",(obj) => obj.name === "snake01");
    var snake03 = map.findObject("objectLayer",(obj) => obj.name === "snake03");
    var snake04 = map.findObject("objectLayer",(obj) => obj.name === "snake04");
    var snake05 = map.findObject("objectLayer",(obj) => obj.name === "snake05");
    var snake06 = map.findObject("objectLayer",(obj) => obj.name === "snake06");
    var snake07 = map.findObject("objectLayer",(obj) => obj.name === "snake07");
    var snake08 = map.findObject("objectLayer",(obj) => obj.name === "snake08");
    var snake09 = map.findObject("objectLayer",(obj) => obj.name === "snake09");
    var snake10 = map.findObject("objectLayer",(obj) => obj.name === "snake10");

    this.snakeGroup1 = this.physics.add.group();
    this.snakeGroup2 = this.physics.add.group();
    this.snakeGroup3 = this.physics.add.group();
    this.snakeGroup4 = this.physics.add.group();

    this.snakeGroup1.create(snake01.x, snake01.y, 'snake').setScale(0.5).setSize(90,60);
    this.snakeGroup1.create(snake03.x, snake03.y, 'snake').setScale(0.5).setSize(90,60);
    this.snakeGroup1.create(snake04.x, snake04.y, 'snake').setScale(0.5).setSize(90,60);
    this.snakeGroup2.create(snake05.x, snake05.y, 'snake').setScale(0.5).setSize(90,60);
    this.snakeGroup3.create(snake06.x, snake06.y, 'snake').setScale(0.5).setSize(90,60);
    this.snakeGroup4.create(snake07.x, snake07.y, 'snake').setScale(0.5).setSize(90,60);
    this.snakeGroup3.create(snake08.x, snake08.y, 'snake').setScale(0.5).setSize(90,60);
    this.snakeGroup2.create(snake09.x, snake09.y, 'snake').setScale(0.5).setSize(90,60);
    this.snakeGroup4.create(snake10.x, snake10.y, 'snake').setScale(0.5).setSize(90,60);//.play("crawl");
     
    this.coinGroup = this.physics.add.group();

    // this.coinGroup.create(snake01.x, snake01.y, 'goldCoin').setVisible(false).body.setEnable(false);
    // this.coinGroup.create(snake03.x, snake03.y, 'goldCoin').setVisible(false).body.setEnable(false);
    // this.coinGroup.create(snake04.x, snake04.y, 'goldCoin').setVisible(false).body.setEnable(false);
    // this.coinGroup.create(snake05.x, snake05.y, 'goldCoin').setVisible(false).body.setEnable(false);
    // this.coinGroup.create(snake06.x, snake06.y, 'goldCoin').setVisible(false).body.setEnable(false);
    // this.coinGroup.create(snake07.x, snake07.y, 'goldCoin').setVisible(false).body.setEnable(false);
    // this.coinGroup.create(snake08.x, snake08.y, 'goldCoin').setVisible(false).body.setEnable(false);
    // this.coinGroup.create(snake09.x, snake09.y, 'goldCoin').setVisible(false).body.setEnable(false);
    // this.coinGroup.create(snake10.x, snake10.y, 'goldCoin').setVisible(false).body.setEnable(false);

    this.snakeGroup1.children.iterate(snake => 
    {
      snake.play('crawl');
    })
    this.snakeGroup2.children.iterate(snake => 
      {
        snake.play('crawl');
      })
    this.snakeGroup3.children.iterate(snake => 
      {
        snake.play('crawl');
      })
    this.snakeGroup4.children.iterate(snake => 
      {
        snake.play('crawl');
      })

    //load bat enemies object
    var bat01 = map.findObject("objectLayer",(obj) => obj.name === "bat01");
    var bat02 = map.findObject("objectLayer",(obj) => obj.name === "bat02");
    var bat03 = map.findObject("objectLayer",(obj) => obj.name === "bat03");
    var bat04 = map.findObject("objectLayer",(obj) => obj.name === "bat04");
    var bat05 = map.findObject("objectLayer",(obj) => obj.name === "bat05");
    var bat06 = map.findObject("objectLayer",(obj) => obj.name === "bat06");

    this.batGroup1 = this.physics.add.group();
    this.batGroup2 = this.physics.add.group();

    this.batGroup1.create(bat01.x, bat01.y, 'bat').setScale(0.5).setSize(90,60);
    this.batGroup2.create(bat02.x, bat02.y, 'bat').setScale(0.5).setSize(90,60);
    this.batGroup2.create(bat03.x, bat03.y, 'bat').setScale(0.5).setSize(90,60);
    this.batGroup1.create(bat04.x, bat04.y, 'bat').setScale(0.5).setSize(90,60);
    this.batGroup2.create(bat05.x, bat05.y, 'bat').setScale(0.5).setSize(90,60);
    this.batGroup1.create(bat06.x, bat06.y, 'bat').setScale(0.5).setSize(90,60);

    this.batGroup1.children.iterate(bat => 
      {
        bat.play('fly');
      })
    this.batGroup2.children.iterate(bat => 
      {
        bat.play('fly');
      })

    //score for coin
    var score = 0;
    var scoreText;

    this.coinScore = this.add.text(500,10,'Coin:'+ window.coin,{font: "25px Arial Rounded MT Bold", fill:'#ef6c00'}).setScrollFactor(0);
    this.crystalScore = this.add.text(500,35,'Crystal:'+ window.crystal,{font: "25px Arial Rounded MT Bold", fill:'#ef6c00'}).setScrollFactor(0);
    // this.scoreText2.setText('Crystal: ' +  window.crystal);

    //this.scoreText = this.add.text(500,10,'Coin:0',{font: "25px Arial Rounded MT Bold", fill:'#ef6c00'}).setScrollFactor(0);
    //this.scoreText = this.add.text(500,35,'Crystal:0',{font: "25px Arial Rounded MT Bold", fill:'#ef6c00'}).setScrollFactor(0);
    // window.crystal = 0;
    // this.scoreText.setText('Crystal: ' +  window.crystal);

    // create the this.playersprite
    this.player = this.physics.add.sprite(
      this.playerPos.x,
      this.playerPos.y,
      this.playerPos.dir
    ).setScale(0.5).setSize(50,100);

    // don't go out of the this.map
    this.physics.world.bounds.width = this.groundLayer.width;
    this.physics.world.bounds.height = this.groundLayer.height;
    this.player.setCollideWorldBounds(true);

    // enable debug
    window.player = this.player;

    this.cursors = this.input.keyboard.createCursorKeys();
    //this.spaceDown = this.input.keyboard.addKey("SPACE");

    //var spaceDown = this.input.keyboard.addKey("SPACE");
    
    //collect Red
    this.potionLayer.setTileIndexCallback(1332, this.removeRed, this);


    // Add custom properties in Tiled called "mouintain" as bool
    this.waterLayer.setCollisionByProperty({grass: true});
    this.waterLayer.setCollisionByProperty({grass2: true});
    this.roomLayer.setCollisionByProperty({room: true});

    // What will collider with what layers
    this.physics.add.collider(this.waterLayer, this.player);
    this.physics.add.collider(this.roomLayer, this.player);
    this.physics.add.collider(this.potionLayer, this.player);

    this.time.addEvent({
      delay: 3000,
      callback: this.moveRightLeft,
      callbackScope: this,
      loop: false,
    });

    this.time.addEvent({
      delay: 3000,
      callback: this.moveDownUp,
      callbackScope: this,
      loop: false,
    });


    this.physics.add.overlap(this.player, this.snakeGroup1, this.minusHealth1, null, this);
    this.physics.add.overlap(this.player, this.snakeGroup2, this.minusHealth1, null, this);
    this.physics.add.overlap(this.player, this.snakeGroup3, this.minusHealth1, null, this);
    this.physics.add.overlap(this.player, this.snakeGroup4, this.minusHealth1, null, this);
    this.physics.add.overlap(this.player, this.batGroup1, this.minusHealth2, null, this);
    this.physics.add.overlap(this.player, this.batGroup2, this.minusHealth2, null, this);

    this.physics.add.overlap(this.player, this.coinGroup, this.collectCoin, null, this);

    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(this.player);
  } 
  
  /////////////////// end of create //////////////////////////////

  update() {

    // check for cave1
    if (
      this.player.x > 542.5 &&
      this.player.x < 579 &&
      this.player.y > 276 &&
      this.player.y < 319
    ) {
      this.room1();
    }

    // check for cave2
    if (
      this.player.x > 966 &&
      this.player.x < 993 &&
      this.player.y > 326 &&
      this.player.y < 330
    ) {
      this.room2();
    }

    // check for cave3
    if (
      this.player.x > 956 &&
      this.player.x < 986 &&
      this.player.y > 121 &&
      this.player.y < 134
    ) {
      this.room3();
    }

    if (this.cursors.left.isDown && this.cursors.space.isDown) { 
      console.log("attack left");
      this.player.body.setVelocityX(-30);
      this.player.flipX = true;
      this.player.anims.play("leftAttack", true);
      window.attack = true;
    } 
    else if (this.cursors.right.isDown && this.cursors.space.isDown) { 
      console.log("attack right");
      this.player.body.setVelocityX(30);
      this.player.flipX = false;
      this.player.anims.play("leftAttack", true)
      window.attack = true;
    } 
    else if (this.cursors.up.isDown && this.cursors.space.isDown) { 
      console.log("attack up");
      this.player.body.setVelocityY(-30);
      this.player.flipX = false;
      this.player.anims.play("leftAttack", true)
      window.attack = true;
    } 
    else if (this.cursors.down.isDown && this.cursors.space.isDown) { 
      console.log("attack down");
      this.player.body.setVelocityY(30);
      this.player.flipX = true;
      this.player.anims.play("leftAttack", true);
      window.attack = true;
    } 
    else if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-200);
      this.player.setSize(50,100);
      this.player.anims.play("right", true); // walk left
      this.player.flipX = true; 
      window.attack = false;
      // flip the sprite to the left
      //console.log('left');
    }
    else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(200);
      this.player.setSize(50,100);
      this.player.anims.play("right", true);
      this.player.flipX = false; 
      window.attack = false;
      // use the original sprite looking to the right
      //console.log('right');
    }
    else if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-200);
      this.player.setSize(50,100);
      this.player.anims.play("up", true);
      window.attack = false;
      //console.log('up');
    } 
    else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(200);
      this.player.setSize(50,100);
      this.player.anims.play("down", true);
      window.attack = false;
      //console.log('down');
    } 
    else {
      this.player.anims.stop();
      this.player.body.setVelocity(0, 0);
      this.player.setSize(50,100);
      window.attack = false;
      //console.log('idle');
    }
  }

  minusHealth1 (player, snake){

    if ( window.attack ) {    
      console.log("attack snake")
      this.attackSnd.play();
      snake.disableBody(true, true);
      this.coinGroup.create(snake.x, snake.y, 'goldCoin');
    } else {
      console.log("deduct live")
      this.cameras.main.shake(400);
    
    console.log("minus life by snake")

    //deduact life
    window.heart --;
    
    //remove snake
    snake.disableBody(true, true);

    if ( window.heart == 4){
      this.hitSnd.play();
      this.heart5.setVisible(false)
    } else if ( window.heart == 3){
      this.hitSnd.play();
      this.heart4.setVisible(false)
    } else if ( window.heart == 2){
      this.hitSnd.play();
    this.heart3.setVisible(false)
    } else if ( window.heart == 1){
      this.hitSnd.play();
      this.heart2.setVisible(false)
    } else if ( window.heart == 0){
      this.hitSnd.play();
      this.heart1.setVisible(false)
    console.log("you are dead")
    window.music.stop();
    // this.bgmSnd.loop = false;
    // this.bgmSnd.stop();
    this.scene.start('gameoverScene');  
  }
}
}

minusHealth2 (player, bat){

  if ( window.attack ) {    
    console.log("attack bat")
    this.attackSnd.play();
    bat.disableBody(true, true);
    this.coinGroup.create(bat.x, bat.y, 'goldCoin');
  } else {
    console.log("deduct live")
    this.cameras.main.shake(400);

    console.log("minus life by bat")

    //deduact life
    window.heart --;

    //screen shake
    this.cameras.main.shake(400);
    
    //remove bat
    bat.disableBody(true, true);

      if ( window.heart == 4){
        this.hitSnd.play();
        this.heart5.setVisible(false)
      } else if ( window.heart == 3){
        this.hitSnd.play();
        this.heart4.setVisible(false)
      } else if ( window.heart == 2){
        this.hitSnd.play();
      this.heart3.setVisible(false)
      } else if ( window.heart == 1){
        this.hitSnd.play();
        this.heart2.setVisible(false)
      } else if ( window.heart == 0){
        this.hitSnd.play();
        this.heart1.setVisible(false)
      console.log("you are dead")
      window.music.stop();
        // this.bgmSnd.loop = false;
        // this.bgmSnd.stop();
      this.scene.start('gameoverScene');  
    }
  }
}

removeRed(player, tile) 
    {
      console.log("remove red potion", tile.index);
      this.potionLayer.removeTileAt(tile.x, tile.y); // remove the item

      //get life
      window.heart ++;
      console.log("live:", window.heart)
      if (window.heart>5){
          window.heart=5
      }

      if (window.heart == 5){
        this.itemSnd.play();
        this.heart5.setVisible(true);
      } else if (window.heart == 4){
        this.itemSnd.play();
        this.heart4.setVisible(true);
      } else if (window.heart == 3){
        this.itemSnd.play();
        this.heart3.setVisible(true);
      } else if (window.heart == 2){
        this.itemSnd.play();
        this.heart2.setVisible(true);
      } else if (window.heart == 1){
        this.itemSnd.play();
        this.heart1.setVisible(true);
    }
  }

collectCoin (player, coin){
  console.log("collect coin");

  this.coinSnd.play();
  coin.disableBody(true, true);
  
    window.coin ++;
    this.coinScore.setText('Coin: ' +  window.coin);

}

moveRightLeft() {
    console.log("moveDownUp tween");
    this.tweens.timeline
    ({
      targets: this.snakeGroup1.getChildren(), //[this.snake01,this.snake03,this.snake04],
      loop: -1, // loop forever
      ease: "Linear",
      duration: 4000,
      yoyo: true,
      tweens: [{x: 180,}, {x: 120,},],
    });

    this.tweens.timeline
    ({
      targets: this.snakeGroup2.getChildren(),//[this.snake05,this.snake09],
      loop: -1, // loop forever
      ease: "Linear",
      duration: 4000,
      yoyo: true,
      tweens: [{x: 480,}, {x: 530,},]
    });

    this.tweens.timeline
    ({
      targets: this.snakeGroup3.getChildren(), //[this.snake06,this.snake08],
      loop: -1, // loop forever
      ease: "Linear",
      duration: 4000,
      yoyo: true,
      tweens: [{x: 600,}, {x: 680,},],
    });

    this.tweens.timeline
    ({
      targets: this.snakeGroup4.getChildren(), // [this.snake07,this.snake10],
      loop: -1, // loop forever
      ease: "Linear",
      duration: 4000,
      yoyo: true,
      tweens: [{x: 880,}, {x: 960,},],
    });
  }

moveDownUp() {
    console.log("moveDownUp tween");
    this.tweens.timeline
    ({
      targets: this.batGroup1.getChildren(), //[this.bat01, this.bat04, this.bat06],
      ease: "Linear",
      loop: -1, // loop forever
      duration: 2000,
      yoyo: true,
      tweens: [{ y: 80,},{ y: 160,},],
    });

    this.tweens.timeline
    ({
      targets: this.batGroup2.getChildren(), //[this.bat02, this.bat03, this.bat05],
      ease: "Linear",
      loop: -1, // loop forever
      duration: 2000,
      yoyo: true,
      tweens: [{ y: 570,},{ y: 650,},],
    });
  }

  //Function to jump to room1
  room1(player, tile) {
    console.log("tips2");
    // let playerPos = {};
    // playerPos.x = 340;
    // playerPos.y = 526;
    // playerPos.dir = "up";
    //this.scene.start("room1",{playerPos:playerPos});
    this.scene.start("tips2");
    window.music.stop();
  }

  //Function to jump to room2
  room2(player, tile) {
    console.log("tips3");
    // let playerPos = {};
    // playerPos.x = 353;
    // playerPos.y = 677;
    // playerPos.dir = "up";
   this.scene.start("tips3");
   window.music.stop();
  }

  //Function to jump to room2
  room3(player, tile) {
    console.log("tips4");
    // let playerPos = {};
    // playerPos.x = 200;
    // playerPos.y = 677;
    // playerPos.dir = "up";
    this.scene.start("tips4");
    window.music.stop();
  }

  } /////////////////// end of update //////////////////////////////

 //////////// end of class world ////////////////////////
