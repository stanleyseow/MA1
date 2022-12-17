var config = {
    type: Phaser.AUTO,
    // pixel size * tile map size * zoom 
    width: 32 * 20, //640
    height: 32 * 15, //480
    backgroundColor:'#FFFFFF',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: false,
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    //backgroundColor: "#555555",
    pixelArt: true,
    scene: [main, story1, story2, story3, story4, story5, tips1, world, tips2, room1, tips3, room2, tips4, room3, gameoverScene, victoryScene]
};

var game = new Phaser.Game(config);
window.heart = 5;
window.coin = 0;
window.crystal = 0;
window.crabHeart = 3;