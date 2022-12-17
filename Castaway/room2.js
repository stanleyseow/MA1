var angle;
class room2 extends Phaser.Scene {
    constructor() {
        super({ key: 'room2' });
        
        // Put global variable here
    }

    init(data) {
      this.playerPos = data.playerPos;
  }

  preload() {
    this.load.atlas('fire','assets/fire.png',
                            'assets/fire.json')
    this.load.audio('mainBgm','assets/island2.mp3');
    this.load.audio('hit','assets/minusHeart.wav'); //hit by fire
    this.load.audio('shoot','assets/fireball.wav'); //shoot by bullet
    this.load.audio('collectItem','assets/item.wav');
    this.load.audio('sword','assets/sword.wav');

    // Step 1, load JSON
    this.load.tilemapTiledJSON("room2","assets/Cave2.json");

    // Step 2 : Preload any images here, nickname, filename
    this.load.image("ground", "assets/Pipoya.png");
    this.load.image("potion","assets/various.png");
    this.load.image('heartPng','assets/heart.png');
    this.load.image('hiroHealth','assets/health1.png');
    this.load.image('bullet','assets/flame1.png');
    this.load.image('crystal','assets/magicCrystal.png');
  }

  create() {
    console.log("*** room2 scene");
    console.log("live:", window.heart);

    window.music = this.sound.add('mainBgm', { loop:true,}).setVolume(0.1);
    window.music.play();

    this.attackSnd = this.sound.add('sword');
    this.hitSnd = this.sound.add('hit'); //hit by enemy fire
    this.shootSnd = this.sound.add('shoot'); //shoot by fireball
    this.itemSnd = this.sound.add('collectItem'); //collect crystal

    let map = this.make.tilemap({key:'room2'});

    //animation for crab
    this.anims.create({
      key:'move',
      frames: [
          {key:'crab', frame:'crab 01'},
          {key:'crab', frame:'crab 02'},
          {key:'crab', frame:'crab 03'},
      ],
      frameRate: 4,
      repeat: -1
  })
    
    //animation for crab
    this.anims.create({
      key:'burn',
      frames: [
          {key:'fire', frame:'fire 01'},
          {key:'fire', frame:'fire 02'},
          {key:'fire', frame:'fire 03'},
      ],
      frameRate: 4,
      repeat: -1
  })

    // Step 4 Load the game tiles
    // 1st parameter is name in Tiled,
    // 2nd parameter is key in Preload
    let groundTiles = map.addTilesetImage("Pipoya", "ground");
    let potionTiles = map.addTilesetImage("various","potion");

    // Step 5  Load in layers by layers
    this.groundLayer = map.createLayer("groundLayer", [groundTiles], 0, 0);
    this.wallLayer = map.createLayer("wallLayer",[groundTiles],0,0);
    this.itemLayer = map.createLayer("itemLayer",[groundTiles],0,0);
    this.potionLayer = map.createLayer("potionLayer",[potionTiles],0,0);


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

  //this.crystal = this.add.image(70,55,'crystal').setScale(0.2).setScrollFactor(0).setVisible(false);

  //score for coin
  var score = 0;
  var scoreText;

  this.coinScore = this.add.text(500,10,'Coin:'+ window.coin,{font: "25px Arial Rounded MT Bold", fill:'#ef6c00'}).setScrollFactor(0);
  this.crystalScore = this.add.text(500,35,'Crystal:'+ window.crystal,{font: "25px Arial Rounded MT Bold", fill:'#ef6c00'}).setScrollFactor(0);

  //this.scoreText1.setText('Coin: ' +  window.coin);

  // this.scoreText = this.add.text(500,10,'Coin:0',{font: "25px Arial Rounded MT Bold", fill:'#ef6c00'}).setScrollFactor(0);
  // window.coin = 0;
  // this.scoreText.setText('Coin: ' +  window.coin);

  // this.scoreText = this.add.text(500,35,'Crystal:0',{font: "25px Arial Rounded MT Bold", fill:'#ef6c00'}).setScrollFactor(0);

    // create the this.playersprite
    this.enemy2 = this.physics.add.sprite(220, 250, 'fire').setScale(1.3).setSize(100,100).play('burn');

    this.crystal = this.physics.add.sprite(220, 250,'crystal').setScale(0.3).setSize(100,60).setVisible(false);

    this.bullet = this.physics.add.sprite(220, 250, 'bullet').setVisible(false);
    this.bullet.disableBody(true, true);

    this.physics.world.bounds.width = this.groundLayer.width;
    this.physics.world.bounds.height = this.groundLayer.height;

    // create the this.playersprite
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

    // Add main player here with physics.add.sprite

    //crazy flame shoot fire
    this.timer2= this.time.addEvent({
      delay: 2000,
      callback: this.shootFireBall,
      callbackScope: this,
      loop: true,
    });

    // get the tileIndex number in json, +1
    //mapLayer.setTileIndexCallback(11, this.room1, this);

    //collect Red
    this.potionLayer.setTileIndexCallback(180, this.removeRed, this);

    // What will collider with what layers
    this.wallLayer.setCollisionByProperty({wall: true});
    this.itemLayer.setCollisionByProperty({tree: true});

    this.physics.add.collider(this.wallLayer, this.player);
    this.physics.add.collider(this.itemLayer, this.player);
    this.physics.add.collider(this.potionLayer, this.player);

    this.physics.add.overlap(this.player, this.bullet, this.bulletHitPlayer, null, this);
    this.physics.add.overlap(this.player, this.enemy2, this.killFire, null, this);
    this.physics.add.overlap(this.player, this.crystal, this.collectCrystal, null, this);

    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player);
  } /////////////////// end of create //////////////////////////////

  update() {
    //console.log(this.bullet.x, this.bullet.y, this.player.x, this.player.y);
    angle = Phaser.Math.Angle.BetweenPoints(this.enemy2, this.player);

    //check for BlockA exit
    if (this.player.x > 300 && 
      this.player.x < 403 && 
      this.player.y > 677 
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

  } ///////////////////////////// end of update ///////////////////////////

  bulletHitPlayer (player, bullet){
    if (this.cursors.space.isDown){
      console.log("attack fire")
      bullet.disableBody(true, true);
    } else {
      console.log("deduct live")
      this.cameras.main.shake(400);

    console.log("minus life by bullet")

    //deduact life
    window.heart --;
    
    //remove fireball bullet
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

killFire(player, fire){
if (this.cursors.space.isDown){
   console.log("attack fire")
   this.attackSnd.play();
   fire.disableBody(true, true);
   this.crystal.setVisible(true);
   this.crystal.body.setEnable(true);
   this.timer2.remove();
} else {
  console.log("deduct live")
  this.hitSnd.play();
  this.cameras.main.shake(400);

console.log("minus life by fire")

//deduact life
window.heart --;
player.x = fire.x+110
player.y = fire.y+100

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
collectCrystal (player, crystal){
  console.log("collect crystal");
  this.itemSnd.play();
  crystal.disableBody(true, true);

  window.crystal ++;
  this.crystalScore.setText('Crystal: ' +  window.crystal);
}
  
  // Function to jump to room1
  world(player, tile) {
    console.log("world function");
    
    let playerPos = {};
    playerPos.x = 973;
    playerPos.y = 380;
    playerPos.dir = "down";

    window.music.stop();

    this.scene.start("world", { player: playerPos }); 
  }

  shootFireBall (){
    console.log("shoot fire ball")
    
    // calculate angle between crab to player
    console.log("check angle ", angle)
    this.shootSnd.play();
    
    this.bullet.enableBody(true, this.enemy2.x, this.enemy2.y, true, true);
    this.physics.velocityFromRotation(angle, 300, this.bullet.body.velocity);

    this.bullet.setVisible(true);

    // set fire setVisable 

    // check for edges (fire cannot go through the sceen)  

    // overlap under create fuction
    // overlap bullet and player

  }
}
