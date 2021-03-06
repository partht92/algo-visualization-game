import 'phaser';
import {ContainerUtilities} from '../utilities/container';

import Events = Phaser.Input.Events;

class VariableContainer extends Phaser.GameObjects.Container {
    contentVisible: number = 0
    cell: Phaser.GameObjects.Sprite
    digit: Phaser.GameObjects.BitmapText 
    value: integer
    cellTexture: string
    digitTexture: string
    zone: Phaser.GameObjects.Zone

    readonly name = VariableContainer.name;

    private containerCopy: Phaser.GameObjects.Container

    private static canBeSubmitted = true;

    constructor(scene: Phaser.Scene, 
                x: number, 
                y: number, 
                value: integer, 
                cellTexture: string, 
                digitTexture: string,
                disableDragGraphic: boolean = false) {
        super(scene, x, y);
        scene.add.existing(this);

        // Initialized class properties
        this.value = value;
        this.cellTexture = cellTexture;
        this.digitTexture = digitTexture;
        
        // Setup the value sprite
        this.digit = this.scene.add.bitmapText(0, 0, 'test_font', value.toString(), 30);
        this.digit.setOrigin(0.5);

        // Setup the cell sprite
        this.cell = scene.add.sprite(0, 0, cellTexture)
        this.cell.setInteractive();
        this.cell.input.dropZone = true;
        this.cell.name = 'VariableContainerCell'

        // Overlay the cell with the digit
        this.add([this.cell, this.digit]);

        // Register event handlers
        this.cell.on(Events.POINTER_DOWN, this.cellClickHandler, this);

        // Make variable container draggable
        this.setupDragEventHandlers(x,y);

        if(!disableDragGraphic) {
            ContainerUtilities.addDragGraphic(scene, this);
        }

        this.bringToTop(this.cell);
    }

    /**
     * Disable the drop zone attached to the {@link VariableContainer}
     */
    private disableZone() {
        this.cell.input.dropZone = false;
    }

    /**
     * Destroys {@param containerCopy} of the {@link VariableContainer}
     */
    private destroyCopy() {
        this.containerCopy.destroy();
        this.containerCopy = null;
    }

    /**
     * Sets up the event handlers for dragging
     * @param x co-ordinate of the copy when drag is initiated
     * @param y co-ordinate of the copy when drag is initiated
     */
    private setupDragEventHandlers(x:number, y: number) {
        this.scene.input.setDraggable(this.cell);

        this.cell.on(Events.DRAG_START, function (pointer, dragX, dragY) {
            if(!this.containerCopy) {
                // When the dragging starts, create a copy of the Variable Container
                this.containerCopy = new VariableContainer(
                    this.scene, 
                    dragX, 
                    dragY, 
                    this.value, 
                    this.cellTexture, 
                    this.digitTexture,
                    true
                );
                // Set transparency level
                this.containerCopy.setAlpha(0.5);
                // NOTE: Disable the zone, to prevent dropping into it's own zone!
                this.containerCopy.disableZone();
                // Make sure the copy has the same visibility as the original
                if(this.contentVisible)
                    this.containerCopy.toggleState();
                this.scene.add.existing(this.containerCopy);
            }
        }, this);

        this.cell.on(Events.DRAG, function (pointer, dragX, dragY) {
            // While dragging, update the position on the screen
            if(this.contentVisible) {
                this.containerCopy.x = this.x + dragX + ((this.parentContainer) ? this.parentContainer.x : 0);
                this.containerCopy.y = this.y + dragY + ((this.parentContainer) ? this.parentContainer.y : 0);
            }
        }, this);

        this.cell.on(Events.DROP, function(pointer, target){ 
            if(target.name == 'VariableContainerCell') {
                // Only trigger an update when not dropping onto itself
                if(target.parentContainer !== this) {
                    // Update the value of the contaier being dropped in
                    target.parentContainer.updateValue(this.value);
                    // Emit a message notifying about the move
                    this.scene.events.emit('incrementCounter');
                }
                target.parentContainer.cell.clearTint();
            }  
        }, this);

        this.cell.on(Events.DRAG_END, function (pointer, dragX, dragY, dropped) {
            // Simply destroy the copy when the dragging ends
            this.destroyCopy();
    
        }, this);

        this.cell.on(Events.DRAG_ENTER, function (pointer, dropZone) {
            if(dropZone.name == 'VariableContainerCell') {
                // Indicate that a drop zone has been entered
                dropZone.parentContainer.cell.setTint(0x00ff00);
            }
    
        }, this);
    
        this.cell.on(Events.DRAG_LEAVE, function (pointer, dropZone) {
            if(dropZone.name == 'VariableContainerCell') {
                // Indicate that the drop zone has been exited
                dropZone.parentContainer.cell.clearTint();
            }
        }, this);
    }

    /**
     * Handle the event when a cell is clicked which does 2 things:
     * 1. Emits an event to show that a move has been made to increment the 
     *    move counter
     * 2. Emits an event for the parent container to show that one of it's
     *    children have been clicked
     */
    private cellClickHandler(){
        // console.log("handling visibility");

        // Emit event signling a valid move being made
        if(!this.contentVisible) {
            this.toggleState();
            this.scene.events.emit('incrementCounter');
        }

        // Inform parent container that the cell has been clicked
        if(this.parentContainer)
                this.parentContainer.emit('cellClicked', this);
    }

    /**
     * Toggles whether the value is visible or not
     */
    toggleState() {
        if(this.contentVisible ^ 1) {
            this.cell.setFrame('cell_empty.png');
        }
        else {
            this.cell.setFrame('cell_coloured.png');
        }
        this.contentVisible ^= 1;
    }

    /**
     * Updates the value of the {@link VariableContainer}
     * @param newValue new value to update to 
     */
    updateValue(newValue: number) {
        this.remove(this.digit);
        this.digit = this.scene.add.bitmapText(0, 0, 'test_font', newValue.toString(), 30); 
        this.digit.setOrigin(0.5);
        this.value = newValue;
        this.add(this.digit);
        this.bringToTop(this.cell);
        console.debug('updated value for', this);
    }
}

export {VariableContainer};