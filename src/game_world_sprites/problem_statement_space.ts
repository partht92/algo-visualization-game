import 'phaser';

import Events = Phaser.Input.Events;

class ProblemStatementSpace extends Phaser.GameObjects.Container {
    problemStatement: string

    private slidableWindow: Phaser.GameObjects.Graphics
    private resizeButtion: Phaser.GameObjects.Graphics
    private problemStatementText: Phaser.GameObjects.BitmapText
    private isOpen: boolean = true;

    constructor(scene: Phaser.Scene, x: number, y: number, problemStatement: string) {
        super(scene, x, y);

        this.problemStatement = problemStatement;
        this.scene = scene;

        this.scene.add.existing(this);

        this.slidableWindow = this.renderSlidableWindow();
        this.resizeButtion = this.renderResizeButton();
        this.renderProblemStatementInSpace(problemStatement);

        this.add([this.resizeButtion, this.slidableWindow, this.problemStatementText]);
        this.bringToTop(this.problemStatementText);
    }

    private renderProblemStatementInSpace(problemStatement: string) {
        this.problemStatementText = this.scene.add.bitmapText(0, 0, 'test_font', problemStatement, 20);
        this.problemStatementText.setX(this.scene.scale.width/6 - this.problemStatementText.width/2);
        this.problemStatementText.setY((this.scene.scale.height - 100)/2 - this.problemStatementText.height/2);
        this.add(this.problemStatementText);
    }

    private renderResizeButton(): Phaser.GameObjects.Graphics {
        let resizeButton = this.scene.add.graphics();
        
        let hitArea = new Phaser.Geom.Circle(this.scene.scale.width/3, (this.scene.scale.height - 100)/2, 30)
        resizeButton.fillStyle(0xDBDBDB, 1);
        resizeButton.fillCircleShape(hitArea);

        resizeButton.setInteractive(hitArea, Phaser.Geom.Circle.Contains);

        resizeButton.on(Events.POINTER_UP, function(){
            console.log('The resize button clicked!');
            if(this.isOpen) {
                this.scene.tweens.add({
                    targets: this,
                    x: -1 * this.scene.scale.width/3,
                    delay: 0,
                    duration: 5,
                    ease: 'Power2'
                });
            }
            else {
                this.scene.tweens.add({
                    targets: this,
                    x: 0,
                    delay: 0,
                    duration: 5,
                    ease: 'Power2'
                });
            }

            this.isOpen = !this.isOpen;

        }, this);

        return resizeButton;
    }

    private renderSlidableWindow(): Phaser.GameObjects.Graphics {
        let slidableWindow = this.scene.add.graphics();

        let statementRectangle = new Phaser.Geom.Rectangle(0, 0, this.scene.scale.width/3, this.scene.scale.height - 100);
        slidableWindow.fillStyle(0xDBDBDB, 1);
        slidableWindow.fillRectShape(statementRectangle);

        return slidableWindow;
    }
}

export {ProblemStatementSpace};