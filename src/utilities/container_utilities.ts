import 'phaser';

class ContainerUtilities {
    getSize(container: Phaser.GameObjects.Container) {
        let xTop = Number.POSITIVE_INFINITY
        let yTop = Number.POSITIVE_INFINITY
        container.iterate(function(childObject: Phaser.GameObjects.Container|Phaser.GameObjects.Sprite) {
            if(childObject.x < xTop)
                xTop = childObject.x
            if(childObject.y < yTop)
                yTop = childObject.y
        });
    }
}

export {ContainerUtilities};