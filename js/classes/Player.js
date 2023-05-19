class Player extends Sprite {
    constructor({ position, imageSrc, frameRate, frameBuffer, scale = 0.1, collisionBlocks, animations }) {
        super({ position, imageSrc, frameRate, frameBuffer, scale })
        this.position = position;
        this.velocity = {
            x: 0,
            y: 0,
        }
        this.collisionBlocks = collisionBlocks;
        this.platformCollisionBlocks = collisionBlocks.platformCollisionBlocks;
        this.animations = animations;
        this.grounded = false;
        this.lastDirection = 'right';
        for(let key in this.animations) {
            const image = new Image();
            image.src = this.animations[key].imageSrc;

            this.animations[key].image = image;
        }
        this.cameraBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            width: 250,
            height: 100,
        } 
    }

    switchSprite(key) {
        if(this.image === this.animations[key].image || !this.loaded) return;
        if(!this.animationFinished && !this.loop) return;
            this.image = this.animations[key].image;
            this.loop = this.animations[key].loop;
            this.animationFinished = false;
            this.frameBuffer = this.animations[key].frameBuffer;
            this.frameRate = this.animations[key].frameRate;
            this.elapsedFrames = 0;
            this.currentFrame = 0;
            this.width = this.scale * (this.image.width / this.frameRate);
            this.height = this.scale * this.image.height;
            // console.log(this.loop);
    }

    updateCameraBox() {
        this.cameraBox.position.x = this.position.x - 50;
        this.cameraBox.position.y = this.position.y;
    }

    checkHorizontalCanvasCollision() {
        if(this.hitbox.position.x + this.hitbox.width + this.velocity.x >=  background.image.width || this.hitbox.position.x + this.velocity.x <=  0) {
            this.velocity.x = 0;
        }
    }

    checkPanCameraLeft({ scaledCanvas, camera }) {
        const cameraBoxRightSide = this.cameraBox.position.x + this.cameraBox.width;

        if(cameraBoxRightSide >= background.image.width) return;

        if(cameraBoxRightSide >= scaledCanvas.width + Math.abs(camera.position.x)) {
            camera.position.x -= this.velocity.x;
            // console.log('translate left');
        }
    }

    checkPanCameraRight({ scaledCanvas, camera }) {
        if(this.cameraBox.position.x <= 0) return;

        if(this.cameraBox.position.x <= Math.abs(camera.position.x)) {
            camera.position.x -= this.velocity.x;
            // console.log('translate left');
        }
    }

    checkPanCameraDown({ scaledCanvas, camera }) {
        if(this.cameraBox.position.y  + this.velocity.y <= 0) return;

        if(this.cameraBox.position.y <= Math.abs(camera.position.y)) {
            camera.position.y -= this.velocity.y;
            // console.log('translate left');
        }
    }

    checkPanCameraUp({ scaledCanvas, camera }) {
        if(this.cameraBox.position.y +this.cameraBox.height + this.velocity.y >= backgroundImageHeight) return;

        if(this.cameraBox.position.y + this.cameraBox.height >= Math.abs(camera.position.y) + scaledCanvas.height) {
            camera.position.y -= this.velocity.y;
            // console.log('translate left');
        }
    }

    update() {
        this.updateFrames();
        this.updateHitbox();
        this.checkHorizontalCanvasCollision();
        this.updateCameraBox();
        // c.fillStyle = 'rgba(255, 0, 0, 0.2)'
        // c.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height);
        // c.fillStyle = 'rgba(0, 255, 0, 0.2)'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height);

        // c.fillStyle = 'rgba(0, 255, 0, 0.2)'
        // c.fillRect(this.cameraBox.position.x, this.cameraBox.position.y, this.cameraBox.width, this.cameraBox.height);
        this.draw();
        player.position.x += player.velocity.x;
        this.updateHitbox();
        this.checkHorizontalCollisions();
        this.applyGravity();
        this.updateHitbox();
        this.checkVerticalCollisions();
    }

    checkHorizontalCollisions() {
        for (let i = 0; i < this.collisionBlocks.floorCollisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks.floorCollisionBlocks[i];
            if (
                collision({
                    object1: this.hitbox,
                    object2: collisionBlock
                })
            ) {
                if(this.velocity.x > 0) {
                    this.velocity.x = 0;

                    const offset = this.hitbox.position.x - this.position.x + this.hitbox.width;
                    
                    this.position.x = collisionBlock.position.x - offset - 0.01;
                    break;
                }
                // console.log('collision');
                
                if(this.velocity.x < 0) {
                    this.velocity.x = 0;

                    const offset = this.hitbox.position.x - this.position.x;

                    this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01;
                    break;
                }
                // console.log('collision');
            };
        }
    }

    applyGravity() {
        this.velocity.y += gravity;
        this.position.y += this.velocity.y;
    }

    checkVerticalCollisions() {
        for (let i = 0; i < this.collisionBlocks.floorCollisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks.floorCollisionBlocks[i];
            if (
                collision({
                    object1: this.hitbox,
                    object2: collisionBlock
                })) {
                this.grounded = true;
                if(this.velocity.y > 0) {
                    this.velocity.y = 0;

                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;

                    this.position.y = collisionBlock.position.y - offset - 0.01;
                    break;
                }
                // console.log('collision');

                if(this.velocity.y < 0) {
                    this.velocity.y = 0;

                    const offset = this.hitbox.position.y - this.position.y;

                    this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01;
                    break;
                }
                // console.log('collision');
            };
        }
        for (let i = 0; i < this.collisionBlocks.platformCollisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks.platformCollisionBlocks[i];
            if (
                platformCollision({
                    object1: this.hitbox,
                    object2: collisionBlock
                })) {
                this.grounded = true;
                if(this.velocity.y > 0) {
                    this.velocity.y = 0;

                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height;

                    this.position.y = collisionBlock.position.y - offset - 0.01;
                    break;
                }
                // console.log('collision');

                // if(this.velocity.y < 0) {
                //     this.velocity.y = 0;

                //     const offset = this.hitbox.position.y - this.position.y;

                //     this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01;
                //     break;
                // }
                // console.log('collision');
            };
        }
    }

    updateHitbox() {
        this.hitbox = {
            position: {
                x: this.position.x + 34,
                y: this.position.y + 30,
            },
            width: 28,
            height: 34,
        }
    }
}