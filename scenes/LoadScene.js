/** @type {import("../typings/phaser")} */

class LoadScene extends Phaser.Scene {
    constructor()
    {
        super({
            key: "Load" // Ime scene
        })
    }

    create()
    {
        // Može se proslediti i neka poruka kao drugi parametar
        this.scene.start("Menu");
    }

    init() 
    {

    }

    /* Učitavaju se resursi */
    preload()
    {
        this.load.image("sky","assets/sky.png");
        this.load.image("ground","assets/platform.png");
        this.load.image("star","assets/star.png");
        this.load.image("bomb","assets/bomb.png");
        this.load.image("title", "assets/MainMenu.png");
        this.load.image("play", "assets/play.png");

        this.load.spritesheet("player", "assets/player.png", { frameWidth: 32, frameHeight: 48 });
    
        this.load.audio("ping", "assets/ping.wav");
        this.load.audio("death","assets/playerDeath.wav");
    
        this.load.spritesheet("fullscreen", "assets/fullscreen.png", { frameWidth: 64, frameHeight: 64 });
    }
}