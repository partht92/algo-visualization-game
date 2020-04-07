import 'phaser';

class SubmitSpace extends Phaser.GameObjects.Container {
    scene: Phaser.Scene

    private hitArea: Phaser.Geom.Rectangle
    private text: Phaser.GameObjects.BitmapText
    private submitGraphic: Phaser.GameObjects.Graphics

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);

        this.scene.add.existing(this);

        this.scene = scene;

        this.text = this.scene.add.bitmapText(0, 0, 'test_font', '[Drag & Drop Answer Here]', 30);
        this.text.setX(this.scene.scale.width/2 - this.text.width/2);
        this.text.setY(50 - this.text.height/2);
        this.text.setAlpha(0.5);

        this.submitGraphic = this.scene.add.graphics();
        this.submitGraphic.name = "SubmitZone";

        this.renderSubmitSpace(100, 0x3FB4EB, 0.6);  
        this.setupSubmitAnswerHandlers();

        this.submitGraphic.on('answerSubmitEntered', function(){
            this.submitGraphic.clear();
            this.renderSubmitSpace(100, 0x3FB4EB, 1);
            this.text.setAlpha(0);
        }, this);

        this.submitGraphic.on('answerSubmitExit', function(){
            this.submitGraphic.clear();
            this.renderSubmitSpace(100, 0x3FB4EB, 0.6);
            this.text.setAlpha(0.5);
        }, this);

        this.add([this.submitGraphic, this.text])
    }

    setupSubmitAnswerHandlers() {
        this.submitGraphic.setInteractive(this.hitArea, Phaser.Geom.Rectangle.Contains);
        this.submitGraphic.input.dropZone = true;
    }

    renderSubmitSpace(height: number, color: number, alpha: number) {
        // Add submit rectangle graphic
        this.hitArea = new Phaser.Geom.Rectangle(0, 0, this.scene.scale.width, height);
        this.submitGraphic.fillStyle(color, alpha);
        this.submitGraphic.fillRectShape(this.hitArea);
    }
}

export {SubmitSpace};