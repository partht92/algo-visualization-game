import 'phaser';
import {IntegerType} from '../datatype_sprites/integer'

class VariableContainer extends Phaser.GameObjects.Container {
    contentVisible: number = 0
    cell: Phaser.GameObjects.Sprite

    constructor(scene: Phaser.Scene, 
                x: number, 
                y: number, 
                value: integer, 
                cellTexture: string, 
                digitTexture: string) {
        super(scene, x, y);
        scene.add.existing(this);
        
        // Setup the value sprite
        let digit = new IntegerType(scene, 0, 0, digitTexture, value, 0.25);

        // Setup the cell sprite
        let cell = scene.add.sprite(0, 0, cellTexture)
        cell.setInteractive();

        // Overlay the cell with the digit
        this.add([cell, digit]);
        this.bringToTop(cell);

        this.cell = cell;

        // Register event handlers
        cell.on('clicked', this.cellClickHandler, this);
    }

    cellClickHandler(cell: Phaser.GameObjects.Sprite){
        console.log("handling visibility");
        // console.log(cell);

        this.toggleState();

        // Emit event signling a valid move being made
        if(this.contentVisible)
            this.scene.events.emit('incrementCounter');

        // Inform parent container that the cell has been clicked
        this.parentContainer.emit('cellClicked', this);
    }

    toggleState() {
        if(this.contentVisible ^ 1) {
            this.cell.setFrame('cell_empty.png');
        }
        else {
            this.cell.setFrame('cell_coloured.png');
        }
        this.contentVisible ^= 1;
    }
}

export {VariableContainer};