import 'phaser';
import {IntegerType} from '../datatype_sprites/integer';

class MoveCounter extends Phaser.GameObjects.Container {
    currentValue: number;
    valueObject: IntegerType;
    scene: Phaser.Scene;
    digitTexture: string;

    constructor(scene: Phaser.Scene, x: integer, y: integer, cell_texture: string, digitTexture: string) {
        super(scene, x, y)

        scene.add.existing(this);

        this.scene = scene;
        this.digitTexture = digitTexture;
        this.currentValue = 0;

        // Setup the value sprite
        this.valueObject = new IntegerType(scene, 0, 0, digitTexture, this.currentValue, 0.25);
        // Setup the cell sprite
        let cell = scene.add.sprite(0, 0, cell_texture)
        
        // Overlay the cell with the digit
        this.add([cell, this.valueObject]);

        // Register event handler for the moveCounter
        scene.events.on('incrementCounter', this.incrementCounter, this);
    }

    incrementCounter() {
        this.remove(this.valueObject);
        this.valueObject = new IntegerType(this.scene, 0, 0, this.digitTexture, ++this.currentValue, 0.25);
        this.add(this.valueObject);
    }

}

export {MoveCounter};
