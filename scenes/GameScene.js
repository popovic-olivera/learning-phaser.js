let player;
let stars;
let bombs;
let platforms;
let cursors;
let score =  0;  
let scoreText;
let gameOver = false;

class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: "Game"
        })
    }

    create()
    {
        // Dodaje se pozadina
        this.add.image(400,  300,  "sky");
        
        // Pravi se statička grupa istih elemenata - platformi
        platforms =  this.physics.add.staticGroup();

        /* Skalira se prva platforma da prekrije celo dno, 
        a zatim se forsira ponovno iscrtavanje, jer je platforma statička i 
        u suprotnom se ne bi pomerila */
        platforms.create(400,  568, "ground").setScale(2).refreshBody();
        platforms.create(600,  400,  "ground");
        platforms.create(50,  250,  "ground");
        platforms.create(750,  220,  "ground");

        // Pravi se igrač
        player = this.physics.add.sprite(100, 450, "player");

        // Postavlja se skakutanje igraču
        player.setBounce(0.2);

        // Zabranjuje mu se da izađe sa scene
        player.setCollideWorldBounds(true);
        player.body.setGravityY(300);

        /*
        * Prave se animacije igrača
        */

        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
            frameRate: 10, 
            repeat: -1 // Znači da se ponavlja u petlji
        });

        this.anims.create({
            key: "turn",
            frames: [ { key: "player", frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("player", { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        // Postavljaju se ulazni događaji za kontrolu igrača
        cursors = this.input.keyboard.createCursorKeys();

        // Pravi se grupa zvezdica
        // Pošto hoćemo da mrdaju i da skakuću bice dinamički objekti
        stars = this.physics.add.group({
            key: "star",
            // Prva se pravi podrazumevano, pa će ih biti ukupno 12
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        stars.children.iterate(function (child) {
            // Svakoj zvezdici se dodeljuje malo drugačije poskakivanje
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        // Pravi se grupa bombica
        bombs = this.physics.add.group();

        // Rezultat
        scoreText = this.add.text(16, 16, "score: 0", { fontSize: "32px", fill: "#000" });

        // Podešavaju se kolizije igrača, platformi i zvezdica
        this.physics.add.collider(player, platforms);
        this.physics.add.collider(stars, platforms);
        this.physics.add.collider(bombs, platforms);

        /* Razlika između collider i overlap je samo u tome što se kod collider
        odmah odbijaju elementi, odnosno primenjuje se odgovarajuća fizika,
        dok kod overlap ne */
        this.physics.add.overlap(player, stars, collectStar, null, this);
        this.physics.add.collider(player, bombs, hitBomb, null, this);

        var button = this.add.image(800-16, 16, "fullscreen", 0).setOrigin(1, 0).setInteractive();

        button.on("pointerup", function () {

            if (this.scale.isFullscreen)
            {
                button.setFrame(0);
                this.scale.stopFullscreen();
            }
            else
            {
                button.setFrame(1); 
                this.scale.startFullscreen();
            }

        }, this);

    }

    update()
    {
        if (gameOver)
        {
            score = 0;
            gameOver = false;
            this.scene.start("Menu");
            return;
        }

        if  (cursors.left.isDown)  
        { 
            player.setVelocityX(-160); 
            player.anims.play("left",  true);  
        }  
        else if (cursors.right.isDown)  
        { 
            player.setVelocityX(160); 
            player.anims.play("right",  true);  
        }  
        else  
        { 
            player.setVelocityX(0); 
            player.anims.play("turn");  
        }  

        // Proveravamo i da li telo dodiruje zemlju, u suprotom bi mogao
        // da skače iz vazduha
        if  (cursors.up.isDown && player.body.touching.down)  
        { 
            player.setVelocityY(-500);  
        }
    }
}

function collectStar (player, star)  
{
    this.sound.play("ping");
    // Kada se sudare hoćemo da zvezdica nestane
    star.disableBody(true,  true); 

    score +=  10; 
    scoreText.setText("Score: "  + score);  

    // Ako nema više zvezdica koje igrač nije pokupio bacamo nove 
    if (stars.countActive(true) === 0)
    {
        stars.children.iterate(function (child) {
            // enableBody(reset, x, y, enableGameObject, showGameObject)
            child.enableBody(true, child.x, 0, true, true);
        });
   

    // Postavljamo slučajno x koordinatu bombe sa druge strane igrača
    // Da mu damo šansu :)
    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    // Pravimo bombicu
    var bomb = bombs.create(x, 16, "bomb");
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20); 
}                   
}

function hitBomb (player, bomb)
{ 
    this.sound.play("death");
    this.physics.pause();

    player.setTint(0xff0000);
    player.anims.play("turn");

    gameOver = true;
} 

