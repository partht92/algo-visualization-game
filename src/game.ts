import 'phaser';
import { ArrayContainer } from './datastructure_sprites/array_container';
import { MoveCounter } from './game_world_sprites/move_counter';
import { SubmitSpace } from './game_world_sprites/submit_space';
import { AnswerResponse } from './answerResponse';
import { ProblemStatementSpace } from './game_world_sprites/problem_statement_space';

import Events = Phaser.Input.Events;
import { VariableContainer } from './datastructure_sprites/variable_container';

export default class Demo extends Phaser.Scene
{
    constructor ()
    {
        super('demo');
    }

    preload ()
    {
        this.load.atlas('cell_state', 'assets/cell/cell_state.png', 'assets/cell/cell_state.json');
        this.load.atlas('digit', 'assets/digits/digit.png', 'assets/digits/digit.json');
        this.load.bitmapFont('test_font', 'assets/test_font/font.png', 'assets/test_font/font.fnt');
    }

    create ()
    {
        let submitSpace = new SubmitSpace(this, 0, this.scale.height-100, this.answerValidator);

        let moveCounter = new MoveCounter(this, this.scale.width-60, 60, 'cell_state', 'digit');

        let array = new ArrayContainer(this, 450, 200, 'cell_state', 'digit', [4,5,6,7,10]);

        let variableCopyHolder = new VariableContainer(this, 450, 400, 0, 'cell_state', 'digit');

        let problemStatement = new ProblemStatementSpace(this, 0, 0, "Find Maximum Number");
    }

    answerValidator(answer: any) {
        if(answer.name == VariableContainer.name) {
            if(answer.value == 10) 
                return AnswerResponse.CORRECT_ANSWER
            else 
                return AnswerResponse.INCORRECT_ANSWER
        }
        else {
            return AnswerResponse.INCORRECT_TYPE
        }
    }
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#99ddff',
    width: 1000,
    height: 600,
    scene: Demo
};

const game = new Phaser.Game(config);
