import 'phaser';

class MoveCounter extends Phaser.GameObjects.Container {
    currentValue: number;
    valueObject: Phaser.GameObjects.BitmapText; 
    scene: Phaser.Scene;
    digitTexture: string;

    constructor(scene: Phaser.Scene, x: integer, y: integer, cell_texture: string, digitTexture: string) {
        super(scene, x, y)

        scene.add.existing(this);

        this.scene = scene;
        this.digitTexture = digitTexture;
        this.currentValue = 0;

        // Setup the value sprite
        this.valueObject =  this.scene.add.bitmapText(0, 0, 'test_font', this.currentValue.toString(), 30);
        this.valueObject.setOrigin(0.5);

        // Setup the cell sprite
        let cell = scene.add.sprite(0, 0, cell_texture)
        
        // Overlay the cell with the digit
        this.add([cell, this.valueObject]);

        // Register event handler for the moveCounter
        scene.events.on('incrementCounter', this.incrementCounter, this);
    }

    incrementCounter() {
        this.remove(this.valueObject);
        this.valueObject = this.scene.add.bitmapText(0, 0, 'test_font', (++this.currentValue).toString(), 30);
        this.valueObject.setOrigin(0.5);
        this.add(this.valueObject);
    }

}

export {MoveCounter};
