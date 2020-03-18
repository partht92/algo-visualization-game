import 'phaser';
import {IntegerType} from '../datatype_sprites/integer'
import { MoveCounter } from '../game_world_sprites/move_counter';

class VariableContainer extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, 
                x: number, 
                y: number, 
                value: integer, 
                cell_texture: string, 
                digit_texture: string, 
                move_counter: MoveCounter) {
        super(scene, x, y);
        scene.add.existing(this);
        
        // Setup the value sprite
        let digit = new IntegerType(scene, 0, 0, digit_texture, value, 0.25);

        // Setup the cell sprite
        let cell = scene.add.sprite(0, 0, cell_texture)
        cell.setInteractive();

        cell.on('pointerdown', function() {
            console.log('variable pointerover');
            this.setFrame('cell_empty.png');
            move_counter.incrementCounter();
        });

        cell.on('pointerup', function() {
            console.log('variable pointerout');
            this.setFrame('cell_coloured.png');
        });

        // Overlay the cell with the digit
        this.add([cell, digit]);
        this.bringToTop(cell)
    }
}

export {VariableContainer};