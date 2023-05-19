class Chest extends Sprite {
    constructor({ position, imageSrc, frameRate, frameBuffer, scale = 0.1, loop = false, awaitLoop = true, contents = undefined }) {
        super({ position, imageSrc, frameRate, frameBuffer, scale, loop, awaitLoop })
        this.position = position;
        this.hitbox = {
            position: {
                x: this.position.x + 32,
                y: this.position.y + 44,
            },
            width: 32,
            height: 20,
        }
        this.opened = false;
        this.contents = contents;

    }

    open() {
        if(this.opened) return;
        pickUps.push(new Sprite({
            position: {
                x: this.hitbox.position.x + 8,
                y: this.hitbox.position.y - 10,
            },
            imageSrc: this.contents.imageSrc,
            frameRate: this.contents.frameRate,
            frameBuffer: this.contents.frameBuffer,
            scale: this.contents.scale,
        }))
        console.log(pickUps);
        this.opened = true;
    }

    // showHitbox() {
    //     c.fillStyle = 'rgba(255, 0, 0, 0.2)'
    //     c.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height);

    // }
}
