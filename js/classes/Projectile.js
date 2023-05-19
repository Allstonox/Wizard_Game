class Projectile extends Sprite {
    constructor({ position, direction, imageSrc, frameRate, frameBuffer, scale = 0.1, collisionBlocks, animations }) {
        super({ position, imageSrc, frameRate, frameBuffer, scale })
        this.position = position;
        this.velocity = {
            x: 0,
            y: 0,
        }
        this.direction = direction;
    }
    move() {
        if(this.direction === 'right') this.position.x+=2;
        else this.position.x-=2;
    }
}