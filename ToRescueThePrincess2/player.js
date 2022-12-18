class Player {
    constructor(scene, x, y, sprite, type, scale, username, initHealth, maxHealth ) {

        this.scene = scene
        this.x = x
        this.y = y
        this.sprite = sprite
        this.type = type
        this.scale  = scale
        this.username = username
        this.initHealth = initHealth
        this.maxHealth = maxHealth // length of bar is 64 pixel

    }

    // create container, sprite, name, healthbar
    create() {

        this.PlayerContainer = this.scene.add.container(this.x, this.y);
        this.playerObj = this.scene.add.sprite(0, 0, this.sprite)
        this.playerObj.setScale(this.scale)
        this.scene.add.existing(this.playerObj);



        let username = this.scene.add.text(-10, -30, this.username, {
          font: '14px Courier',
          fill: '#ffff00',
          backgroundColor: "#00000",
        })

        this.healthRect = this.scene.add.graphics(0,0)
        this.healthRect.fillStyle(0x000000)
        this.healthRect.fillRect(0,-15,this.maxHealth,10)
        this.healthRect.fillStyle(0x00ff00)
        this.healthRect.fillRect(0,-15,this.initHealth,10)

        this.healthRect.lineStyle(2, 0xffffff, 1)
        this.healthRect.strokeRect(0,-15,this.maxHealth,10)
            
        this.PlayerContainer.add([this.healthRect, this.playerObj, username]);
        
        // Add object to existing scene
        //this.scene.add.existing(this.PlayerContainer);

        // Enable physics
        this.scene.physics.world.enable(this.PlayerContainer);

        this.PlayerContainer.setDepth(1)
        this.scene.cameras.main.startFollow(this.PlayerContainer);

        console.log("this.PlayerContainer: ", this.PlayerContainer)

    }

    // destroy container
    destroy() {

    }

    left(speed) {
        this.PlayerContainer.body.velocity.x = -speed;
        this.x = this.PlayerContainer.x
        this.y = this.PlayerContainer.y
        this.playerObj.play('left', true)
    }

    right(speed) {
        this.PlayerContainer.body.velocity.x = speed;
        this.x = this.PlayerContainer.x
        this.y = this.PlayerContainer.y
        this.playerObj.play('right', true)
    }

    up(speed) {
        this.PlayerContainer.body.velocity.y = -speed;
        this.x = this.PlayerContainer.x
        this.y = this.PlayerContainer.y
        this.playerObj.play('up', true);
    }

    down(speed) {
        this.PlayerContainer.body.velocity.y = speed;
        this.x = this.PlayerContainer.x
        this.y = this.PlayerContainer.y
        this.playerObj.play('down', true);
    }

    stop() {
        this.PlayerContainer.body.velocity.x = 0;
        this.PlayerContainer.body.velocity.y = 0;
        this.x = this.PlayerContainer.x
        this.y = this.PlayerContainer.y
        this.playerObj.stop()
    }

    
    // enable / disable healthbar
    healthbar() {

    }

    increaseHealthBar(num) {
        this.initHealth = this.initHealth + num
        this.healthRect.fillStyle(0x000000)
        this.healthRect.fillRect(0,-15,this.maxHealth,10)
        this.healthRect.fillStyle(0x00ff00)
        this.healthRect.fillRect(0,-15,this.initHealth,10)
    }

    decreaseHealthBar(num){
        this.initHealth = this.initHealth - num
        this.healthRect.fillStyle(0x000000)
        this.healthRect.fillRect(0,-15,this.maxHealth,10)
        this.healthRect.fillStyle(0x00ff00)
        this.healthRect.fillRect(0,-15,this.initHealth,10)
    }




}