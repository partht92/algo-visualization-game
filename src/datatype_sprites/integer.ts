import 'phaser';

class IntegerType extends Phaser.GameObjects.Container {
    value: integer;

    constructor(scene: Phaser.Scene, x: integer, y: integer, digit_texture: string, value: integer, scale: number){
        super(scene, x, y);

        scene.add.existing(this);
        this.value = value;
        
        let children = [];
        if( value == 0) {
            let digit = this.addDigitSprite(scene, 0, x, y, digit_texture, scale);
            children.push(digit);
        }
        else {
            let offset = 0;
            while(value > 0) {
                let curr_digit = value%10;
                value = Math.floor(value/10);
                
                let digit = this.addDigitSprite(scene, curr_digit, x-offset, y, digit_texture, scale);
                offset += digit.width*scale;
                children.push(digit);
            }
        }

        this.add(children);
    }

    addDigitSprite( scene: Phaser.Scene, 
                    digitValue: integer, 
                    x: integer, 
                    y: integer, 
                    digit_texture: string, 
                    scale: number ): Phaser.GameObjects.Sprite {
        let digit = scene.add.sprite(x, y, digit_texture);
        digit.setFrame(String(digitValue) + '.png');
        digit.setScale(scale);

        return digit;
    }
}

export {IntegerType};