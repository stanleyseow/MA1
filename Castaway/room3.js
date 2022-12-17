class room3 extends Phaser.Scene {
    constructor() {
        super({ key: 'room3' });
        
        // Put global variable here
    }

  init(data) {
    this.playerPos = data.playerPos;
}

  preload() {
    this.load.atlas('bat','assets/bat.png',
                          'assets/bat.json')

    // Step 1, load JSON
    this.load.tilemapTiledJSON("room3","assets/Cave3.json");

    // Step 2 : Preload any images here, nickname, filename
    this.load.image("groundPng", "assets/Pipoya.png");
    this.load.image("teleportPng","assets/teleportTile.png");
    this.load.image('heartPng','assets/heart.png');
    this.load.image('hiroHealth','assets/health1.png');
    this.load.image('teleportOn','assets/teleportOn.png');
    this.load.image('teleportOff','assets/teleportOff.png');
    this.load.image('goldCoin','assets/coin.png');

    this.load.audio('teleportActivated','assets/teleportActivated.mp3');
    this.load.audio('mainBgm','assets/island2.mp3');
    this.load.audio('hit','assets/minusHeart.wav');
    this.load.audio('shoot','assets/fireball.wav'); //shoot by bullet
    this.load.audio('collectItem','assets/item.wav');
    this.load.audio('sword','assets/sword.wav');
  }

  create() {
    console.log("*** room3 scene");
    console.log("live:", window.heart);
    
    this.attackSnd = this.sound.add('sword');
    this.hitSnd = this.sound.add('hit'); //hit by enemy fire
    this.shootSnd = this.sound.add('shoot'); //shoot by fireball
    this.itemSnd = this.sound.add('collectItem'); //collect crystal

    window.music = this.sound.add('mainBgm', { loop:true,}).setVolume(0.1);
    window.music.play();

    this.teleportActivatedSnd = this.sound.add('teleportActivated');
    this.hitSnd = this.sound.add('hit'); //hit by enemy

    let map = this.make.tilemap({key:'room3'});

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

    let tilesArray = [ groundTiles]

    // Step 5  Load in layers by layers
    this.groundLayer = map.createLayer("groundLayer",tilesArray,0,0);
    this.plantsLayer = map.createLayer("plantsLayer",tilesArray,0,0);
    this.wallLayer = map.createLayer("wallLayer",tilesArray,0,0);

    //health hearts
    this.hiroHealth = this.add.image(30,25,'hiroHealth').setScale(0.5).setScrollFactor(0);
    this.heart1 = this.add.image(70,25,'heartPng').setScale(0.3).setScrollFactor(0).setVisible(false);
    this.heart2 = this.add.image(110,25,'heartPng').setScale(0.3).setScrollFactor(0).setVisible(false);
    this.heart3 = this.add.image(150,25,'heartPng').setScale(0.3).setScrollFactor(0).setVisible(false);
    this.heart4 = this.add.image(190,25,'heartPng').setScale(0.3).setScrollFactor(0).setVisible(false);
    this.heart5 = this.add.image(230,25,'heartPng').setScale(0.3).setScrollFactor(0).setVisible(false);

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

    //load bat enemies object
    var bat01 = map.findObject("objectLayer",(obj) => obj.name === "bat01");
    var bat02 = map.findObject("objectLayer",(obj) => obj.name === "bat02");
    var bat03 = map.findObject("objectLayer",(obj) => obj.name === "bat03");

    //load bat enemies
    this.bat01 = this.physics.add.sprite(bat01.x, bat01.y, 'bat').setScale(0.5).setSize(90,60).play("fly");
    this.bat02 = this.physics.add.sprite(bat02.x, bat02.y, 'bat').setScale(0.5).setSize(90,60).play("fly");
    this.bat03 = this.physics.add.sprite(bat03.x, bat03.y, 'bat').setScale(0.5).setSize(90,60).play("fly");

    var score = 0;
    var scoreText;

    this.coinScore = this.add.text(340,10,'Coin:'+ window.coin,{font: "25px Arial Rounded MT Bold", fill:'#ef6c00'}).setScrollFactor(0);
    this.crystalScore = this.add.text(340,35,'Crystal:'+ window.crystal,{font: "25px Arial Rounded MT Bold", fill:'#ef6c00'}).setScrollFactor(0);

    this.physics.world.bounds.width = this.groundLayer.width;
    this.physics.world.bounds.height = this.groundLayer.height;

    if(window.coin>=15 && window.crystal>=2){
    this.teleportOn = this.physics.add.sprite(360,160, 'teleportOn').setScale(0.4).setSize(180,100).setVisible(true);
    }else {
    this.teleportOff = this.physics.add.sprite(360,160, 'teleportOff').setScale(0.4).setSize(180,100).setVisible(true);
    }

    // create the this.playersprite
    this.player = this.physics.add.sprite(
      this.playerPos.x,
      this.playerPos.y,
      this.playerPos.dir
    ).setScale(0.5).setSize(50,100);

    this.player.setCollideWorldBounds(true);
    window.player = this.player;

    this.time.addEvent({
      delay: 3000,
      callback: this.moveDownUp,
      callbackScope: this,
      loop: false,
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceDown = this.input.keyboard.addKey("SPACE");

    // Add main player here with physics.add.sprite

    // Add time event / movement here

    // What will collider with what layers
    this.wallLayer.setCollisionByProperty({cave3: true});

    this.physics.add.overlap(this.player, this.bat01, this.minusHealth2, null, this);
    this.physics.add.overlap(this.player, this.bat02, this.minusHealth2, null, this);
    this.physics.add.overlap(this.player, this.bat03, this.minusHealth2, null, this);
    this.physics.add.overlap(this.player, this.teleportOn, this.jumpToVictory, null, this);

    this.physics.add.collider(this.wallLayer, this.player);

    // create the arrow keys
    //this.cursors = this.input.keyboard.createCursorKeys();

    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(this.player);
  } /////////////////// end of create //////////////////////////////

  update() {
    //check for BlockA exit
    if (this.player.x > 200 && 
       this.player.x < 233 && 
       this.player.y > 454 
      ) {
       this.world();
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
  } ///////////////////////// end of update ////////////////////////


  minusHealth2 (player, bat){

    if ( window.attack ) {    
      console.log("attack bat")
      this.attackSnd.play();
      bat.disableBody(true, true);
      //this.physics.add.sprite(bat.x, bat.y, 'goldCoin');
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

  moveDownUp() {
    console.log("moveDownUp");
    this.tweens.timeline
    ({
      targets: [this.bat01, this.bat02],
      ease: "Linear",
      loop: -1, // loop forever
      duration: 2000,
      yoyo: true,
      tweens: [{ y: 237,},{ y: 280,},],
    });
    this.tweens.timeline
    ({
      targets: [this.bat03],
      ease: "Linear",
      loop: -1, // loop forever
      duration: 2000,
      yoyo: true,
      tweens: [{ y: 70,},{ y: 150,},],
    });
  }

    removeRed(player, tile) 
    {
      console.log("remove red", tile.index);
      this.potionLayer.removeTileAt(tile.x, tile.y); // remove the item
      return false;
    }

    jumpToVictory()
    {
      console.log("jump to victory")
      this.teleportActivatedSnd.play();
      window.music.stop();
      this.scene.start("victoryScene")
    }
  
  // Function to jump to room1
  world(player, tile) {
    console.log("world function");
    
    let playerPos = {};
    playerPos.x = 970;
    playerPos.y = 166;
    playerPos.dir = "down";

    window.music.stop();

    this.scene.start("world", { player: playerPos }); 
  }
}
