import 'phaser';

import { AnswerResponse } from '../answerResponse';

class SubmitSpace extends Phaser.GameObjects.Container {
    scene: Phaser.Scene

    private hitArea: Phaser.Geom.Rectangle
    private text: Phaser.GameObjects.BitmapText
    private submitGraphic: Phaser.GameObjects.Graphics
    private answerSubmitted: boolean = false

    constructor(scene: Phaser.Scene, x: number, y: number, answerValidator: (any) => string) {
        super(scene, x, y);

        this.scene.add.existing(this);

        this.scene = scene;

        this.renderText('[Drag & Drop Answer Here]', 0.5);

        this.submitGraphic = this.scene.add.graphics();
        this.submitGraphic.name = "SubmitZone";

        this.renderSubmitSpace(100, 0x3FB4EB, 0.6);  
        this.setupSubmitAnswerHandlers();

        this.submitGraphic.on('answerSubmitEntered', function(){ 
            if(!this.answerSubmitted) {
                this.submitGraphic.clear();
                this.renderSubmitSpace(100, 0x3FB4EB, 1);
            }
            this.text.setAlpha(0);
        }, this);

        this.submitGraphic.on('answerSubmitExit', function(){
            if(!this.answerSubmitted) {
                this.submitGraphic.clear();
                this.renderSubmitSpace(100, 0x3FB4EB, 0.6);
            }
            this.text.setAlpha(0.5);
        }, this);

        this.submitGraphic.on('answerSubmitted', function(answer){
            this.answerSubmitted = true;
            this.submitGraphic.clear();
            let validatedAnswer = answerValidator(answer);
            
            if(validatedAnswer == AnswerResponse.CORRECT_ANSWER) {
                this.renderSubmitSpace(100, 0x52C949, 1);
            }
            else {
                this.renderSubmitSpace(100, 0xEA4F4F, 1);
            }
            this.text.destroy();
            this.renderText(validatedAnswer, 1);
            this.add(this.text);
        }, this);

        this.add([this.submitGraphic, this.text])
    }

    setupSubmitAnswerHandlers() {
        this.submitGraphic.setInteractive(this.hitArea, Phaser.Geom.Rectangle.Contains);
        this.submitGraphic.input.dropZone = true;
    }

    renderText(text: string, alpha) {
        this.text = this.scene.add.bitmapText(0, 0, 'test_font', text, 30);
        this.text.setX(this.scene.scale.width/2 - this.text.width/2);
        this.text.setY(50 - this.text.height/2);
        this.text.setAlpha(alpha);
    }

    renderSubmitSpace(height: number, color: number, alpha: number) {
        // Add submit rectangle graphic
        this.hitArea = new Phaser.Geom.Rectangle(0, 0, this.scene.scale.width, height);
        this.submitGraphic.fillStyle(color, alpha);
        this.submitGraphic.fillRectShape(this.hitArea);
    }
}

export {SubmitSpace};