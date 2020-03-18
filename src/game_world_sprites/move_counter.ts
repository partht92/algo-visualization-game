import 'phaser';
import {IntegerType} from '../datatype_sprites/integer';

class MoveCounter extends Phaser.GameObjects.Container {
    current_value: number;
    value_object: IntegerType;
    scene: Phaser.Scene;
    digit_texture: string;

    constructor(scene: Phaser.Scene, x: integer, y: integer, cell_texture: string, digit_texture: string) {
        super(scene, x, y)

        scene.add.existing(this);

        this.scene = scene;
        this.digit_texture = digit_texture;
        this.current_value = 0;

        // Setup the value sprite
        this.value_object = new IntegerType(scene, 0, 0, digit_texture, this.current_value, 0.25);
        // Setup the cell sprite
        let cell = scene.add.sprite(0, 0, cell_texture)
        
        // Overlay the cell with the digit
        this.add([cell, this.value_object]);
    }

    incrementCounter() {
        console.log(this.current_value);
        this.remove(this.value_object);
        this.value_object = new IntegerType(this.scene, 0, 0, this.digit_texture, ++this.current_value, 0.25);
        this.add(this.value_object);
        console.log(this.current_value);
    }

}

export {MoveCounter};
