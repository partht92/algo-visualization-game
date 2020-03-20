import 'phaser';
import { ArrayContainer } from './datastructure_sprites/array_container';
import { MoveCounter } from './game_world_sprites/move_counter';

export default class Demo extends Phaser.Scene
{
    pointerCoordinates: Phaser.GameObjects.Text

    constructor ()
    {
        super('demo');
    }

    preload ()
    {
        this.load.atlas('cell_state', 'assets/cell/cell_state.png', 'assets/cell/cell_state.json');
        this.load.atlas('digit', 'assets/digits/digit.png', 'assets/digits/digit.json')
    }

    create ()
    {
        this.pointerCoordinates = this.add.text(10, 10, '', { fill: '#100000' });

        let moveCounter = new MoveCounter(this, 300, 100, 'cell_state', 'digit');

        let array = new ArrayContainer(this, 400, 300, 'cell_state', 'digit', [4,5,6,7,10]);

        this.registerInteractionHandlers();
    }

    registerInteractionHandlers() {
        this.input.on('gameobjectdown', function (pointer, gameObject)
        {
            gameObject.emit('clicked', gameObject);
        }, this);
    }

    update () 
    {
        let pointer = this.input.activePointer;
        this.pointerCoordinates.setText([
            'x: ' + pointer.worldX,
            'y: ' + pointer.worldY,
            'isDown: ' + pointer.isDown
        ])
    }
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#99ddff',
    width: 800,
    height: 600,
    scene: Demo
};

const game = new Phaser.Game(config);
