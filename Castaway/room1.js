var angle;
class room1 extends Phaser.Scene {
    constructor() {
        super({ key: 'room1' });
        
        // Put global variable here
    }


    init(data) {
        this.playerPos = data.playerPos;
    }

  preload() {
    this.load.atlas('crab','assets/crab.png',
                           'assets/crab.json')
    this.load.audio('sword','assets/sword.wav');
    this.load.audio('mainBgm','assets/island2.mp3');
    this.load.audio('hit','assets/minusHeart.wav'); //hit by crab
    this.load.audio('shoot','assets/fireball.wav'); //shoot by bullet
    this.load.audio('collectItem','assets/item.wav');

    // Step 1, load JSON
    this.load.tilemapTiledJSON("room1","assets/Cave1.json");

    // Step 2 : Preload any images here, nickname, filename
    this.load.image("ground", "assets/Pipoya.png");
    this.load.image('heartPng','assets/heart.png');
    this.load.image('bullet','assets/star.png');
    this.load.image('hiroHealth','assets/health1.png');
    this.load.image('crabHealth','assets/health2.png');
    this.load.image('crystal','assets/magicCrystal.png');
  }

  create() {
    console.log("*** room1 scene");
    console.log("live:", window.heart);

    window.music = this.sound.add('mainBgm', { loop:true,}).setVolume(0.1);
    window.music.play();

    this.attackSnd = this.sound.add('sword');
    this.hitSnd = this.sound.add('hit'); //hit by enemy crab
    this.shootSnd = this.sound.add('shoot'); //shoot by star/bullet
    this.itemSnd = this.sound.add('collectItem'); //collect crystal

    //Step 3 - Create the map from main
    let map = this.make.tilemap({key:'room1'});

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

    // Step 4 Load the game tiles
    // 1st parameter is name in Tiled,
    // 2nd parameter is key in Preload
    let groundTiles = map.addTilesetImage("Pipoya", "ground");

    // Step 5  Load in layers by layers
    this.groundLayer = map.createLayer("groundLayer", [groundTiles], 0, 0);
    this.wallLayer = map.createLayer("wallLayer",[groundTiles],0,0);
    this.itemLayer = map.createLayer("itemLayer",[groundTiles],0,0);

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
  
  this.crabHealth = this.add.image(30,60,'crabHealth').setScale(0.5).setScrollFactor(0);
  this.crabHeart1 = this.add.image(70,60,'heartPng').setScale(0.3).setScrollFactor(0);//.setVisible(false);
  this.crabHeart2 = this.add.image(110,60,'heartPng').setScale(0.3).setScrollFactor(0);//.setVisible(false);
  this.crabHeart3 = this.add.image(150,60,'heartPng').setScale(0.3).setScrollFactor(0);//.setVisible(false);

  // if (window.Crabheart == 3){
  //   this.heart1.setVisible(true);
  //   this.heart2.setVisible(true);
  //   this.heart3.setVisible(true);
  // } else if (window.heart == 2){
  //   this.heart1.setVisible(true);
  //   this.heart2.setVisible(true);
  // }else if (window.heart == 1){
  //   this.heart1.setVisible(true);
  // }

    // create the this.playersprite
    this.enemy1 = this.physics.add.sprite(240, 200, 'crab').setScale(1.7).setSize(100,80).play('crabMove');
    window.enemy1 = this.enemy1
    this.crystal = this.physics.add.sprite(0, 0,'crystal').setScale(0.3).setSize(100,60).setVisible(false);
    this.crystal.body.setEnable(false);

    var score = 0;
    var scoreText;

    this.coinScore = this.add.text(450,10,'Coin:'+ window.coin,{font: "25px Arial Rounded MT Bold", fill:'#ef6c00'}).setScrollFactor(0);
    this.crystalScore = this.add.text(450,35,'Crystal:'+ window.crystal,{font: "25px Arial Rounded MT Bold", fill:'#ef6c00'}).setScrollFactor(0);
    
    this.bullet = this.physics.add.sprite(450, 200, 'bullet').setVisible(false);
    this.bullet.disableBody(true, true);

    this.physics.world.bounds.width = this.groundLayer.width;
    this.physics.world.bounds.height = this.groundLayer.height;

    this.player = this.physics.add.sprite(
      this.playerPos.x,
      this.playerPos.y,
      this.playerPos.dir
    ).setScale(0.5).setSize(50,100);

    this.player.setCollideWorldBounds(true);
    window.player = this.player;

    this.timedEvent = this.time.addEvent({
      delay: 1000,
      callback: this.delayOneSec,
      callbackScope: this,
      loop: false,
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceDown = this.input.keyboard.addKey("SPACE");

    //crab shoot star
    this.timer1= this.time.addEvent({
      delay: 3000,
      callback: this.shootFire,
      callbackScope: this,
      loop: true,
    });
    
    //this.physics.add.overlap(this.player, this.bullet, this.minusHealth1, null, this);
    // Add main player here with physics.add.sprite

    // Add time event / movement here

    // get the tileIndex number in json, +1
    //mapLayer.setTileIndexCallback(11, this.room1, this);

    // Add custom properties in Tiled called "mouintain" as bool
    // What will collider with what layers
    this.wallLayer.setCollisionByProperty({caveWall: true});
    this.wallLayer.setCollisionByProperty({wall: true});
    this.wallLayer.setCollisionByProperty({room: true});

    this.physics.add.collider(this.wallLayer, this.player);

    this.physics.add.overlap(this.player, this.bullet, this.starHitPlayer, null, this);
    this.physics.add.overlap(this.player, this.enemy1, this.killCrab, null, this);
    this.physics.add.overlap(this.player, this.crystal, this.collectCrystal, null, this);

    // create the arrow keys
    //this.cursors = this.input.keyboard.createCursorKeys();

    // camera follow player
    //this.cameras.main.startFollow(this.player);

    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(this.player);
  } /////////////////// end of create //////////////////////////////

  update() {
    //console.log(this.bullet.x, this.bullet.y, this.player.x, this.player.y);
    angle = Phaser.Math.Angle.BetweenPoints(this.enemy1, this.player);

      //check for BlockA exit
    if (this.player.x > 270 && 
        this.player.x < 371 && 
        this.player.y > 550 
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
    } /////////////////// end of update //////////////////////////////


  starHitPlayer (player, bullet){
    if ( window.attack ){
      console.log("attack fire")
      bullet.disableBody(true, true);
    } else {
      console.log("deduct live")
      this.cameras.main.shake(400);

    console.log("minus life by bullet")

    //deduact life
    window.heart --;
    
    //remove flame
    bullet.disableBody(true, true);

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
    this.scene.start('gameoverScene');  
  }
}
}

killCrab(player, crab){
  if ( window.attack ){
     console.log("attack crab")
     this.attackSnd.play();

     window.crabHeart --;

    if ( window.crabHeart == 2){
    this.crabHeart3.setVisible(false)
    crab.x = crab.x+70
    } else if ( window.crabHeart == 1){
      this.crabHeart2.setVisible(false)
      crab.x = crab.x+70
    } else if ( window.crabHeart == 0){
      this.crabHeart1.setVisible(false)
      crab.x = crab.x+70

    console.log('crab is dead')
    crab.disableBody(true, true);
    this.crystal.x = crab.x
    this.crystal.y = crab.y
    this.crystal.setVisible(true);
    this.crystal.body.setEnable(true);
      
    //  this.crystal.setVisible(true);
    //  this.crystal.body.setEnable(true);
     this.timer1.remove();
  } 
} else {
    console.log("deduct live")
    this.hitSnd.play();
    this.cameras.main.shake(400);
  
  console.log("minus life by crab")
  
  //deduact life
  window.heart --;
  player.x = crab.x-140
  player.y = crab.y-120
  
  //remove fire
  //fire.disableBody(true, true);
  
  if ( window.heart == 4){
    this.heart5.setVisible(false)
  } else if ( window.heart == 3){
    this.heart4.setVisible(false)
  } else if ( window.heart == 2){
  this.heart3.setVisible(false)
  } else if ( window.heart == 1){
    this.heart2.setVisible(false)
  } else if ( window.heart == 0){
    this.heart1.setVisible(false)
  console.log("you are dead")
  window.music.stop();
  this.scene.start('gameoverScene');   
  }
  }
  }

  collectCrystal (player, crystal){
    console.log("collect crystal");
    this.itemSnd.play();
    crystal.disableBody(true, true);
  
    window.crystal ++;
    this.crystalScore.setText('Crystal: ' +  window.crystal);
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
      this.heart5.setVisible(true);
    } else if (window.heart == 4){
      this.heart4.setVisible(true);
    } else if (window.heart == 3){
      this.heart3.setVisible(true);
    } else if (window.heart == 2){
      this.heart2.setVisible(true);
    } else if (window.heart == 1){
      this.heart1.setVisible(true);
  }
  }
  
  // Function to jump to room1
  world(player, tile) {
    console.log("world function");
    
    let playerPos = {};
    playerPos.x = 556;
    playerPos.y = 353;
    playerPos.dir = "down";

    window.music.stop();

    this.scene.start("world", { player: playerPos });
  }

  shootFire (){
    console.log("shoot fire")

    // calculate angle between crab to player
    console.log("check angle ", angle)
    this.shootSnd.play();
    
    this.bullet.enableBody(true, this.enemy1.x, this.enemy1.y, true, true);
    this.physics.velocityFromRotation(angle, 300, this.bullet.body.velocity);

    this.bullet.setVisible(true);

  }
}
