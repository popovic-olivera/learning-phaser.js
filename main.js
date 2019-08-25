/** @type {import("../typings/phaser")} */

var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
    physics: {
        default: "arcade",
        arcade : {
            // Pozitivna gravitacija znači da objekti padaju na doleč kao prirodna gravitacija
            gravity: { y: 300},
            debug: false
        }
    },
    // Niz scena
    scene: [
        LoadScene, MenuScene, GameScene
    ]
}

var game = new Phaser.Game(config);


