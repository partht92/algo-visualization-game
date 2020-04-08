import 'phaser';
import {VariableContainer} from './variable_container'
import { MoveCounter } from '../game_world_sprites/move_counter';
import { ContainerUtilities } from '../utilities/container';

import Events = Phaser.Input.Events;

class ArrayContainer extends Phaser.GameObjects.Container {
    /**
     * A container with [VariableContainer] as childeren horizontally
     * aligned
     */

    activatedChild: VariableContainer

    readonly name = ArrayContainer.name;

    private static canBeSubmitted = true;

    constructor(scene: Phaser.Scene, 
                x: integer, 
                y: integer, 
                cellTexture: string, 
                digitTexture: string, 
                valueArray: integer[]) {
        super(scene, x, y);

        this.scene.add.existing(this);

        //  Create some sprites - positions are relative to the Container x/y
        let children = []
        valueArray.forEach((val, idx) => {
            let varCont = new VariableContainer(scene, 115*idx, 0, val, cellTexture, digitTexture, true);
            children.push(varCont);
        });

        this.add(children);

        ContainerUtilities.addDragGraphic(scene, this);

        this.on('cellClicked', this.childClickHandler);  
    }

    childClickHandler(container : VariableContainer) {
        if(container !== this.activatedChild) {
            if(this.activatedChild)
                this.activatedChild.toggleState();
            this.activatedChild = container;     
        }
        if(!container.contentVisible) {
            this.activatedChild = null;
        }
    }
}

export {ArrayContainer};