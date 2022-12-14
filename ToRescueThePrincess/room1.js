class room1 extends Phaser.Scene {

    constructor() {
        super('room1');
        
        // Put global variable here
    }


    init(data) {
        this.playerPos = data.playerPos;
    
    }

    preload() {
        var map = this.load.tilemapTiledJSON('room1','assets/room1.json')

        this.load.image('dungeonpng', 'assets/dungeon1.png')
         this.load.image('wallpng', 'assets/wall.png')
         this.load.image("keypng","assets/key.png")
         this.load.image("heartpng","assets/heart.png")

         this.load.audio("ding","assets/ding.mp3");
         this.load.audio("hit","assets/hit.wav");
         this.load.audio("dooropen","assets/doorOpen.wav");
         this.load.audio("lose","assets/lose.mp3");

    }

    create() {
        console.log('*** room1 scene');

        // Call to update inventory
        this.time.addEvent({
        delay: 500,
        callback: updateInventory,
        callbackScope: this,
        loop: false,
        });

        this.dingSnd = this.sound.add("ding").setVolume(3);
        this.hitSnd = this.sound.add("hit").setVolume(3);
        this.dooropenSnd = this.sound.add("dooropen").setVolume(0.5);
        this.loseSnd = this.sound.add("lose").setVolume(0.5);

        var map = this.make.tilemap({key:'room1'});

        var tileset1= map.addTilesetImage('dungeon','dungeonpng');
        var tileset2= map.addTilesetImage('wall','wallpng');


        let tilesArray = [tileset1,tileset2]
        
        this.floorLayer = map.createLayer('floor',tilesArray,0,0).setScale(2)
        this.decoLayer = map.createLayer('deco',tilesArray,0,0).setScale(2)
        this.wallLayer = map.createLayer('wall',tilesArray,0,0).setScale(2)
        this.deco2Layer = map.createLayer('deco 2',tilesArray,0,0).setScale(2)
        this.doorLayer = map.createLayer('door',tilesArray,0,0).setScale(2)

        this.physics.world.bounds.width = this.floorLayer.width*2;
        this.physics.world.bounds.height = this.floorLayer.height*2;



    // load player into phytsics
    this.player = this.physics.add.sprite(290, 450, 'up').setScale(0.9)    
    this.player.body.setSize(this.player.width * 0.5, this.player.height)
    this.player.setCollideWorldBounds(true); // don't go out of the this.map

    // this.add.sprite(140,188,"guard");

    this.time.addEvent({
        delay: 1000,
        callback: this.moveGuard1,
        callbackScope: this,
        loop: false,
      });

      this.guard = this.physics.add.sprite(157, 100, "guarddown").play("guarddownAnim").setScale(0.9);
    

      this.key1 = this.physics.add.sprite(80, 120, "keypng").setScale(0.5);
      this.key2 = this.physics.add.sprite(440, 530, "keypng").setScale(0.5);

      this.physics.add.overlap(
        this.player,
        [this.key1,this.key2],
        this.collectKey,
        null,
        this
      );


    this.wallLayer.setCollisionByExclusion(-1, true);
    this.doorLayer.setCollisionByExclusion(-1, true);

    // Show colliding tiles as different colours 
    const debugGraphics = this.add.graphics().setAlpha(0.75);
    this.wallLayer.renderDebug(debugGraphics, {
    tileColor: null, // Color of non-colliding tiles
    collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    });

    this.physics.add.collider(this.player,this.wallLayer);
    this.physics.add.collider(this.player,this.doorLayer);


    //  Input Events
    this.cursors = this.input.keyboard.createCursorKeys();

    // make the camera follow the player
    this.cameras.main.startFollow(this.player);

    this.physics.add.overlap(
        this.player,
        this.guard,
        //this.guardCaught,
        // call global function guardCaught
        guardCaught,
        null,
        this
      );
    }

    

    update() {

        if(
            this.player.x > 279 &
            this.player.x < 313 &
            this.player.y > 516 &
            this.player.y < 520 
        ){
            this.gameScene();
        }

        if (this.cursors.left.isDown) 
    {
        this.player.setVelocityX(-200);
        this.player.anims.play('left', true);
    } 
    else if (this.cursors.right.isDown)
    {
        this.player.setVelocityX(200);
        this.player.anims.play('right', true);
    }
    else if (this.cursors.up.isDown)
    {
        this.player.setVelocityY(-200);
        this.player.anims.play('up', true);
    }
    else if (this.cursors.down.isDown)
    {
        this.player.setVelocityY(200);
        this.player.anims.play('down', true);
    } else {
        this.player.setVelocity(0);
        this.player.anims.stop()
    }

    }///////// end of update //////////

    collectKey (player,key1) {
        console.log("collectKey")

        this.dingSnd.play();
        window.key++
        key1.disableBody(true, true);
        //this.updateInventory();
        updateInventory.call(this)


}

    // guardCaught(player,guard) {
    //     console.log("attack by guard");
    //     window.heart--

    //     this.hitSnd.play();

    //     // Shake screen
    //    this.cameras.main.shake(150);

    //     guard.disableBody(true, true);
    //     //this.updateInventory();
    //     updateInventory.call(this)


    //   if (window.heart == 0){
    //     this.scene.start("gameOver");
    //     this.loseSnd.play();

    //   }
    // }

    moveGuard1() {
        console.log("guard moveDownUp");
        this.tweens.timeline({
          targets: this.guard,
          ease: "Linear",
          loop: -1, // loop forever
          duration: 2000,
          tweens: [
            {
              y: 265,
            },
            {
              y: 100,
            },
          ],
        });
      }

    gameScene(player, title){
        console.log("gameScene function");

        let playerPos = {};
        playerPos.x = 890
        playerPos.y = 190
        playerPos.dir = "down"
        this.scene.start("world", {playerPos: playerPos})

        this.dooropenSnd.play();
    }

  //   updateInventory() {
  //     // Emit events showInventory
  //     this.inventory = {}
  //     this.inventory.heart = window.heart
  //     this.inventory.key = window.key

  //     console.log('Emit event', this.inventory)
  //     this.invEvent = (event, data) => this.scene.get('showInventory').events.emit(event, data);
  //     this.invEvent("inventory", this.inventory);
  // }



}
