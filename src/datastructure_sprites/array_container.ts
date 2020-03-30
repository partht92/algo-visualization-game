import 'phaser';
import {VariableContainer} from './variable_container'
import { MoveCounter } from '../game_world_sprites/move_counter';

import Events = Phaser.Input.Events;

class ArrayContainer extends Phaser.GameObjects.Container {
    /**
     * A container with [VariableContainer] as childeren horizontally
     * aligned
     */

    activatedChild: VariableContainer

    constructor(scene: Phaser.Scene, 
                x: integer, 
                y: integer, 
                cellTexture: string, 
                digitTexture: string, 
                valueArray: integer[]) {
        super(scene, x, y);

        this.scene.add.existing(this);
        
        // Enable event propogation to children
        // scene.input.setTopOnly(false); 

        // Make the array draggable
        // this.makeDraggable(scene);

        //  Create some sprites - positions are relative to the Container x/y
        let children = []
        valueArray.forEach((val, idx) => {
            let varCont = new VariableContainer(scene, 115*idx, 0, val, cellTexture, digitTexture);
            children.push(varCont);
        });

        this.add(children);

        this.on('cellClicked', this.childClickHandler);     
    }

    makeDraggable(scene: Phaser.Scene) {
        this.setInteractive(new Phaser.Geom.Rectangle(0, 0, 400, 300), Phaser.Geom.Rectangle.Contains);
        scene.input.setDraggable(this);
        scene.input.enableDebug(this);
        this.on(Events.DRAG, function (pointer, dragX, dragY) {
            console.log("dragging at the array level");
            this.x = dragX;
            this.y = dragY;
        });
    }

    childClickHandler(container : VariableContainer) {
        console.log("cell clicked");
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