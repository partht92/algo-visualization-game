import 'phaser';

class SizeUtils {
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
                console.log("Recurse Container", child);
                let childRectangle = this.getRectangularBoundary(child);
                curr_min_x = child.x + childRectangle.x;
                curr_min_y = child.y + childRectangle.y;
                curr_max_x = child.x + childRectangle.x + childRectangle.width;
                curr_max_y = child.y + childRectangle.y + childRectangle.height;
            }
            else {
                // Find co-ordinates for a sprite
                console.log("Sprite Size", child);
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

export {SizeUtils}