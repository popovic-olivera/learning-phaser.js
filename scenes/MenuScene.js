class MenuScene extends Phaser.Scene {
    constructor(){
        super({
            key: "Menu"
        })
    }

    create()
    {
        this.add.image(400,  300,  "sky");
        this.add.image(400, 100,"title").setScale(1.5);
        let playButton = this.add.image(400, 400, "play");

        playButton.setInteractive();

        playButton.on("pointerup", function() {
            this.scene.start("Game");
        }, this);
    }

    init() 
    {

    }

    preload()
    {
        
    }
}
