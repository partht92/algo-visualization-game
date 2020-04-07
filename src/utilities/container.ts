import 'phaser';

import Events = Phaser.Input.Events;

class ContainerUtilities {
    static addDragGraphic(scene: Phaser.Scene, gameObject: Phaser.GameObjects.Container) {
        // Get the boundary rectangle
        let boundaryRect = ContainerUtilities.getRectangularBoundary(gameObject);

        // Add array boundary graphic
        let arrayBoundary = scene.add.graphics();
        arrayBoundary.lineStyle(4, 0x99ff00, 1);
        arrayBoundary.strokeRectShape(boundaryRect);

        // Add menu knob
        let dragKnob = scene.add.graphics();
        let dragKnobArea = new Phaser.Geom.Rectangle(boundaryRect.x - 11, boundaryRect.y - 11, 18, 18);
        let dragKnobRenderer = function(hexColor) {
            dragKnob.clear();
            dragKnob.fillStyle(hexColor, 1);
            dragKnob.fillRectShape(dragKnobArea);
        };
        
        // Render the drag knob 
        dragKnobRenderer(0x99ff00);

        // Add dragability to gameobject based on the dragknob
        dragKnob.setInteractive(dragKnobArea, Phaser.Geom.Rectangle.Contains);
        scene.input.setDraggable(dragKnob);

        // Setup drag events
        dragKnob.on(Events.DRAG_START, function(pointer, dragX, dragY) {
            this.initial_x = gameObject.x; 
            this.initial_y =  gameObject.y; 
        }, gameObject);
        
        dragKnob.on(Events.DRAG, function(pointer, dragX, dragY) {
            this.x = this.initial_x + dragX; 
            this.y =  this.initial_y + dragY; 
        }, gameObject);

        dragKnob.on(Events.POINTER_OVER, function() {
            dragKnobRenderer(0x02951b);
        });

        dragKnob.on(Events.POINTER_OUT, function() {
            dragKnobRenderer(0x99ff00);
        });

        dragKnob.on(Events.DROP, function(pointer, target) {
            if(target.name == 'SubmitZone') {
                console.log(target);
                target.emit('answerSubmitted', gameObject);
                this.scene.events.emit('answerSubmitted', gameObject);
            }
        });

        dragKnob.on(Events.DRAG_ENTER, function(pointer, target) {
            if(target.name == 'SubmitZone') {
                target.emit('answerSubmitEntered');
            }
        });

        dragKnob.on(Events.DRAG_LEAVE, function(pointer, target) {
            if(target.name == 'SubmitZone') {
                target.emit('answerSubmitExit');
            }
        });

        // Add the boundary and the dragknob as children of the
        // gameobject passed
        gameObject.add([arrayBoundary, dragKnob]);
    }

    static getRectangularBoundary(container: Phaser.GameObjects.Container): Phaser.Geom.Rectangle {
        // Calculate the width of the conatiner based on it's children
        let x_min = Number.POSITIVE_INFINITY
        let y_min = Number.POSITIVE_INFINITY
        let x_max = Number.NEGATIVE_INFINITY
        let y_max = Number.NEGATIVE_INFINITY
        container.iterate((child: Phaser.GameObjects.Sprite|Phaser.GameObjects.Container) => {
            let curr_min_x;
            let curr_min_y;
            let curr_max_x;
            let curr_max_y;

            if('list' in child) {
                // Check if container and recurse
                console.debug("Recurse Container", child);
                let childRectangle = this.getRectangularBoundary(child);
                curr_min_x = child.x + childRectangle.x;
                curr_min_y = child.y + childRectangle.y;
                curr_max_x = child.x + childRectangle.x + childRectangle.width;
                curr_max_y = child.y + childRectangle.y + childRectangle.height;
            }
            else {
                // Find co-ordinates for a sprite
                console.debug("Sprite Size", child);
                curr_min_x = child.x - child.width/2;
                curr_min_y = child.y - child.height/2;
                curr_max_x = child.x + child.width/2;
                curr_max_y = child.y + child.height/2;
            }

            x_min = Math.min(x_min, curr_min_x);
            x_max = Math.max(x_max, curr_max_x);
            y_min = Math.min(y_min, curr_min_y);
            y_max = Math.max(y_max, curr_max_y);
        });

        
        return new Phaser.Geom.Rectangle(x_min, y_min, x_max - x_min, y_max - y_min);
    }
}

export {ContainerUtilities};