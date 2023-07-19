class main extends Phaser.Scene {
  constructor() {
    super({
      key: "main",
    });

    // Put global variable here
  }

  init(data) {
    this.playerPos = data.playerPos;
  }

  preload() {
    {
      this.load.atlas('right', 'assets/hiro walk.png',
        'assets/hiro walk.json')
      this.load.atlas('hiro attack', 'assets/hiro attack.png',
        'assets/hiro attack.json')
      this.load.atlas('down', 'assets/hiro front.png',
        'assets/hiro front.json')
      this.load.atlas('up', 'assets/hiro back.png',
        'assets/hiro back.json')

      this.load.image('main', 'assets/intro.png');
      this.load.audio('islandMusic', 'assets/island.wav');
    }
  }

  create() {
    console.log("*** main scene");

    // Add any sound and music here
    // ( 0 = mute to 1 is loudest )
    //this.music = this.sound.add('bgMusic').setVolume(0.3) // 10% volume
    window.introMusic = this.sound.add('islandMusic', { loop: true, }).setVolume(0.1);
    window.introMusic.play();

    // this.bgmSnd = this.sound.add('islandMusic').setVolume(0.2);
    // this.bgmSnd.play();
    // this.bgmSnd.loop = true;

    //this.music.play()
    //window.music = this.music

    // Add image and detect spacebar keypress
    this.add.image(0, 0, 'main').setOrigin(0, 0);

    //animation for Hiro
    this.anims.create({
      key: 'left',
      frames: [
        { key: 'right', frame: 'walk 01' },
        { key: 'right', frame: 'walk 02' },
        { key: 'right', frame: 'walk 03' },
        { key: 'right', frame: 'walk 04' },
      ],
      frameRate: 6,
      repeat: -1
    })

    this.anims.create({
      key: 'right',
      frames: [
        { key: 'right', frame: 'walk 05' },
        { key: 'right', frame: 'walk 06' },
        { key: 'right', frame: 'walk 07' },
        { key: 'right', frame: 'walk 08' },
      ],
      frameRate: 6,
      repeat: -1
    })

    this.anims.create({
      key: 'down',
      frames: [
        { key: 'down', frame: 'hiro front 01' },
        { key: 'down', frame: 'hiro front 02' },
        { key: 'down', frame: 'hiro front 03' },
      ],
      frameRate: 6,
      repeat: -1
    })

    this.anims.create({
      key: 'up',
      frames: [
        { key: 'up', frame: 'hiro back 01' },
        { key: 'up', frame: 'hiro back 02' },
        { key: 'up', frame: 'hiro back 03' },
      ],
      frameRate: 5,
      repeat: -1
    })

    this.anims.create({
      key: 'leftAttack',
      frames: [
        { key: 'hiro attack', frame: 'hiro attack 01' },
        { key: 'hiro attack', frame: 'hiro attack 02' },
        { key: 'hiro attack', frame: 'hiro attack 03' },
        { key: 'hiro attack', frame: 'hiro attack 04' },
      ],
      frameRate: 10,
      repeat: 0
    })

    this.anims.create({
      key: 'idle',
      frames: [
        { key: 'right', frame: 'walk 01' },
        { key: 'right', frame: 'walk 02' },
      ],
      frameRate: 5,
      repeat: -1
    })

    // Check for spacebar or any key here
    var spaceDown = this.input.keyboard.addKey("SPACE");

    // Create shortcut keys to jump to scene without playing each level
    var enterDown = this.input.keyboard.addKey("ENTER");
    var key1 = this.input.keyboard.addKey(49);
    var key2 = this.input.keyboard.addKey(50);
    var key3 = this.input.keyboard.addKey(51);

    spaceDown.on(
      "down",
      function () {

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

    // on enter to jump into world
    enterDown.on(
      "down", function () {
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

    // Jump to room1
    key1.on(
      "down", function () {
        console.log("jump to room1");
        window.introMusic.stop();

        let playerPos = {};
        playerPos.x = 340;
        playerPos.y = 526;
        playerPos.dir = "up";
        this.scene.start("room1", { playerPos: playerPos });
      }, this);

    // Jump to room2
    key2.on(
      "down", function () {
        console.log("jump to room2");

        window.introMusic.stop();

        let playerPos = {};
        playerPos.x = 353;
        playerPos.y = 677;
        playerPos.dir = "up";
        this.scene.start("room2", { playerPos: playerPos });
      }, this);

    // Jump to room2
    key3.on(
      "down", function () {
        console.log("jump to room3");

        window.introMusic.stop();

        let playerPos = {};
        playerPos.x = 200;
        playerPos.y = 677;
        playerPos.dir = "up";
        this.scene.start("room3", { playerPos: playerPos });
      }, this);

    // Add any text in the main page
    this.add.text(190, 350, "PRESS SPACEBAR TO CONTINUE", {
      font: "20px Arial Rounded MT Bold",
      fill: "#000000",
    });

    // Create all the game animations here
  }
}
