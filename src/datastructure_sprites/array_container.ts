import 'phaser';
import {VariableContainer} from './variable_container'
import { MoveCounter } from '../game_world_sprites/move_counter';

class ArrayContainer extends Phaser.GameObjects.Container {
    /**
     * A container with [VariableContainer] as childeren horizontally
     * aligned
     */

    constructor(scene: Phaser.Scene, 
                x: integer, 
                y: integer, 
                cell_texture: string, 
                digit_texture: string, 
                value_array: integer[], 
                move_counter: MoveCounter) {
        super(scene, x, y);

        this.scene.add.existing(this);

        //  Create some sprites - positions are relative to the Container x/y
        let children = []
        value_array.forEach((val, idx) => {
            children.push(new VariableContainer(scene, -200 + 115*idx, 0, val, cell_texture, digit_texture, move_counter));
        });

        this.add(children);
    }
}

export {ArrayContainer};