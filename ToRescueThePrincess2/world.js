class world extends Phaser.Scene {
  constructor() {
    super({ key: "world" });
  }

  init(data) {
    this.playerPos = data.playerPos;
  }

  preload() {
    var map = this.load.tilemapTiledJSON("world", "assets/world.json");

    //this.load.image("cloud", "assets/Street32x32.png");

    this.load.image("dungeonpng", "assets/dungeon1.png");
    this.load.image("wallpng", "assets/wall.png");
    this.load.image("keypng", "assets/key.png");
    this.load.image("heartpng", "assets/heart.png");

    // // chars
    this.load.atlas(
      "left",
      "assets/knight_walk_left.png",
      "assets/knight_walk_left.json"
    );
    this.load.atlas(
      "right",
      "assets/knight_walk_right.png",
      "assets/knight_walk_right.json"
    );
    this.load.atlas(
      "up",
      "assets/knight_walk_up.png",
      "assets/knight_walk_up.json"
    );
    this.load.atlas(
      "down",
      "assets/knight_walk_down.png",
      "assets/knight_walk_down.json"
    );
  } // end of preload //

  create() {
    console.log("world map");

    // Call to update inventory
    this.time.addEvent({
      delay: 500,
      callback: updateInventory,
      callbackScope: this,
      loop: false,
    });

    this.dingSnd = this.sound.add("ding").setVolume(3);
    this.hitSnd = this.sound.add("hit").setVolume(3);
    this.smallhitSnd = this.sound.add("smallhit").setVolume(0.5);
    this.dooropenSnd = this.sound.add("dooropen").setVolume(0.5);
    this.winSnd = this.sound.add("win").setVolume(0.2);
    this.loseSnd = this.sound.add("lose").setVolume(1);
    this.shoot1Snd = this.sound.add("shoot1").setVolume(0.1);

    // this.bgmusicSnd = this.sound.add("bgmusic")

    var map = this.make.tilemap({ key: "world" });
    var tileset1 = map.addTilesetImage("dungeon", "dungeonpng");
    var tileset2 = map.addTilesetImage("wall", "wallpng");

    let tilesArray = [tileset1, tileset2];

    this.bgLayer = map.createLayer("bg", tilesArray, 0, 0).setScale(2);
    this.floorLayer = map.createLayer("floor", tilesArray, 0, 0).setScale(2);
    this.wallLayer = map.createLayer("wall", tilesArray, 0, 0).setScale(2);
    //this.decoLayer = map.createLayer('deco',tilesArray,0,0).setScale(2)
    //this.deco2Layer = map.createLayer('deco 2',tilesArray,0,0).setScale(2)
    this.doorLayer = map.createLayer("door", tilesArray, 0, 0).setScale(2);

    this.physics.world.bounds.width = this.bgLayer.width * 2;
    this.physics.world.bounds.height = this.bgLayer.height * 2;

    // load player into phytsics
    // this.player = this.physics.add.sprite(this.playerPos.x,this.playerPos.y,this.playerPos.dir)
    // this.player.body.setSize(this.player.width * 0.5, this.player.height * 0.5)

    // window.player = this.player;
    // this.player.setCollideWorldBounds(true); // don't go out of the this.map

    this.player = new Player(
      this,
      this.playerPos.x,
      this.playerPos.y,
      this.playerPos.dir,
      "player",
      "1",
      "stanleyseow",
      32,
      64
    );

    // this.player.PlayerContainer is the physics object
    this.player.create();
    window.player = this.player;


    this.key0 = this.input.keyboard.addKey(48);
    this.key1 = this.input.keyboard.addKey(49);
    this.key2 = this.input.keyboard.addKey(50);

    this.key1.on('down', ()=>{
      console.log("Key1")
      this.player.increaseHealthBar(10)
     }, this );

     this.key2.on('down', ()=>{
      console.log("Key2")
      this.player.decreaseHealthBar(10)
     }, this );



    // Disable tween during testing
    this.time.addEvent({
      delay: 1000,
      callback: this.moveGuard1,
      callbackScope: this,
      loop: false,
    });

    this.time.addEvent({
      delay: 1000,
      callback: this.moveGuard2,
      callbackScope: this,
      loop: false,
    });

    this.time.addEvent({
      delay: 1000,
      callback: this.moveGuard3,
      callbackScope: this,
      loop: false,
    });

    //   this.guard = this.physics.add.sprite(757, 460, "guardleft").play("guardleftAnim").setScale(0.85);
    this.guard = this.physics.add
      .sprite(707, 150, "guarddown")
      .play("guarddownAnim")
      .setScale(0.9);
    this.guard2 = this.physics.add
      .sprite(337, 747, "guarddown")
      .play("guarddownAnim")
      .setScale(0.9);
    this.guard3 = this.physics.add
      .sprite(747, 435, "guarddown")
      .play("guarddownAnim")
      .setScale(0.9);

    // this.guard.setPipeline('Light2D').setAlpha(0.2);
    // this.guard2.setPipeline('Light2D').setAlpha(0.2);
    // this.guard3.setPipeline('Light2D').setAlpha(0.2);

    this.wallLayer.setCollisionByExclusion(-1, true);

    // Show colliding tiles as different colours
    // const debugGraphics = this.add.graphics().setAlpha(0.75);
    // this.wallLayer.renderDebug(debugGraphics, {
    // tileColor: null, // Color of non-colliding tiles
    // collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
    // faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
    // });

    this.physics.add.collider(this.player.PlayerContainer, this.wallLayer);
    this.physics.add.collider(this.guard, this.wallLayer);

    this.physics.add.overlap(
      this.player.PlayerContainer,
      [this.guard, this.guard2, this.guard3],
      // call global function guardCaught at
      guardCaught,
      null,
      this
    );

    // spacebar
    this.spaceDown = this.input.keyboard.addKey("SPACE");

    //  Input Events
    this.cursors = this.input.keyboard.createCursorKeys();

    // make the camera follow the player
    //this.cameras.main.startFollow(this.player);

    // Needed for fog of war
    this.cameras.main.setBackgroundColor(0x000000);

    // Add fog of war lights
    // this.bgLayer.setPipeline('Light2D').setAlpha(0.1);
    // this.floorLayer.setPipeline('Light2D').setAlpha(0.1);
    // this.wallLayer.setPipeline('Light2D').setAlpha(0.1);
    // //this.decoLayer.setPipeline('Light2D').setAlpha(0.1);
    // //this.deco2Layer.setPipeline('Light2D').setAlpha(0.1);
    // this.doorLayer.setPipeline('Light2D').setAlpha(0.1);

    // this.lights.enable();
    // this.lights.setAmbientColor(0x080808);
    // this.spotlight=this.lights
    //       .addLight(this.player.x, this.player.y)
    //       .setRadius(150,150)
    //       .setIntensity(20);

    // start another scene in parallel
    this.scene.launch("showInventory");

    // PhaserGUIAction(
    //   this,
    //   {
    //     alpha: 0.6, // 0.0 ~ 1.0 (any value, you can change it in GUI)
    //     right: 100, // any value
    //     top: 50,    // any value
    //     side: true  // boolean (default is true)
    //   }
    // );
  } // end of create //

  update() {
    // spotlight follows player movement
    // this.spotlight.x=this.player.x+5;
    // this.spotlight.y=this.player.y-5;

    if (
      this.player.x > 870 &&
      this.player.x < 928 &&
      this.player.y > 183 &&
      this.player.y < 187
    ) {
      this.room1();
      this.dooropenSnd.play();
    } else if (
      this.player.x > 806 &&
      this.player.x < 863 &&
      this.player.y > 439 &&
      this.player.y < 446
    ) {
      this.room2();
      this.dooropenSnd.play();
    } else if (
      this.player.x > 196 &&
      this.player.x < 250 &&
      this.player.y > 727 &&
      this.player.y < 740
    ) {
      this.room3();
      this.dooropenSnd.play();
    } else if (
      this.player.x > 773 &&
      this.player.x < 830 &&
      this.player.y > 855 &&
      this.player.y < 868 &&
      window.key >= 7
    ) {
      this.room4();
      this.dooropenSnd.play();
      this.winSnd.play();
    } else if (
      this.player.x > 777 &&
      this.player.x < 827 &&
      this.player.y > 853.6 &&
      this.player.y < 856 &&
      window.key <= 7
    ) {
      console.log("Can't enter room4, not enough keys");
      this.smallhitSnd.play();
    }

    // Move all common movement to globalFunctions
    movement.call(this);
  } // end of update //

  collectKey(player, key1) {
    console.log("collectKey");

    this.dingSnd.play();
    window.key++;
    key1.disableBody(true, true);
    //this.updateInventory()
    updateInventory.call(this);
  }

  // guardCaught(player,guard) {
  //     console.log("attack by guard");

  //     this.hitSnd.play();

  //     // Shake screen
  //    this.cameras.main.shake(150);

  //     window.heart--
  //     guard.disableBody(false, true);
  //     //this.updateInventory()
  //     updateInventory.call(this)

  //   if (window.heart == 0){
  //     this.scene.start("gameOver");
  //     this.loseSnd.play();
  //   }
  // }

  moveGuard1() {
    //console.log("guard moveDownUp");
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
          y: 150,
        },
      ],
    });
  }

  moveGuard2() {
    //console.log("guard moveDownUp");
    this.tweens.timeline({
      targets: this.guard2,
      ease: "Linear",
      loop: -1, // loop forever
      duration: 2000,
      tweens: [
        {
          y: 872,
        },
        {
          y: 747,
        },
      ],
    });
  }

  moveGuard3() {
    //console.log("guard moveUpDown");
    this.tweens.timeline({
      targets: this.guard3,
      ease: "Linear",
      loop: -1, // loop forever
      duration: 2000,
      tweens: [
        {
          y: 532,
        },
        {
          y: 435,
        },
      ],
    });
  }

  room1(player, title) {
    console.log("entering room1");
    this.scene.start("room1");
  }

  room2(player, title) {
    console.log("entering room2");
    this.scene.start("room2");
  }

  room3(player, title) {
    console.log("entering room3");
    this.scene.start("room3");
  }

  room4(player, title) {
    this.scene.start("room4");
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
