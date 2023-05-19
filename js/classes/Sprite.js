class Sprite {
    constructor({ position, imageSrc, frameRate = 1, frameBuffer = 1, scale = 1, loop = true, awaitLoop = false, currentFrame = 0, animated = true }) {
        this.position = position;
        this.scale = scale;
        this.loaded = false;
        this.image = new Image();
        this.image.onload = () => {
            this.width = this.scale * (this.image.width / this.frameRate);
            this.height = this.scale * this.image.height;
            this.loaded = true;
        }
        this.image.src = imageSrc;
        this.frameRate = frameRate;
        this.currentFrame = currentFrame;
        this.frameBuffer = frameBuffer;
        this.elapsedFrames = 0;
        this.animationFinished = false;
        this.animated = animated;
        this.loop = loop;
        this.awaitLoop = awaitLoop;
    }

    draw() {
        if (!this.image) return;

        const cropbox = {
            position: {
                x: this.currentFrame * (this.image.width / this.frameRate),
                y: 0,
            },
            width: this.image.width / this.frameRate,
            height: this.image.height,
        }

        c.drawImage(this.image, cropbox.position.x, cropbox.position.y, cropbox.width, cropbox.height, this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();
        this.updateFrames();
    }

    updateFrames() {
        if(!this.animated) return;
        if(this.awaitLoop) return;
        this.elapsedFrames++;

        if (this.elapsedFrames % this.frameBuffer === 0) {
            if (this.currentFrame < this.frameRate - 1) this.currentFrame++;
            else {
                if(!this.loop) {
                    this.animationFinished = true;
                    return;
                }
                    this.currentFrame = 0;
            }
        }
    }
}