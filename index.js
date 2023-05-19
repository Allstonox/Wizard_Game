const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;
const scaleFactor = 3;
const scaledCanvas = {
    width: canvas.width / scaleFactor,
    height: canvas.height / scaleFactor,
}

floorCollisions2d = [];
for (let i = 0; i < floorCollisions.length; i += 36) {
    floorCollisions2d.push(floorCollisions.slice(i, i + 36));
}

const floorCollisionBlocks = [];
floorCollisions2d.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 202) {
            floorCollisionBlocks.push(
                new CollisionBlock({
                    position: {
                        x: x * 16,
                        y: y * 16,
                    },
                })
            )
        }
    })
})

platformCollisions2d = [];
for (let i = 0; i < platformCollisions.length; i += 36) {
    platformCollisions2d.push(platformCollisions.slice(i, i + 36));
}

const platformCollisionBlocks = [];
const chests = [];
let lastSymbol = 0;
platformCollisions2d.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if (symbol === 202) {
            platformCollisionBlocks.push(
                new CollisionBlock({
                    position: {
                        x: x * 16,
                        y: y * 16,
                    },
                    height: 4,
                })
            )
            if (Math.random() > 0 && lastSymbol === 0) {
                chests.push(
                    new Chest({
                        position: {
                            x: x * 16 - 32,
                            y: y * 16 - 64,
                        },
                        imageSrc: './img/Purple_Chest_Spritesheet_Scaled_20X.png',
                        frameRate: 4,
                        frameBuffer: 10,
                        contents: chestItems[Math.floor((Math.random()) * chestItems.length)],
                    })
                )
                console.log(chests[chests.length - 1].contents);
            }
        }
        lastSymbol = symbol;
    })
})

const gravity = 0.1;

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: './img/background.png',
    frameRate: 1,
})

const player = new Player({
    position: {
        x: 100,
        y: 300,
    },
    imageSrc: './img/Wizard/Wizard_Idle_Spritesheet_Scaled_20X.png',
    frameRate: 2,
    frameBuffer: 60,
    animations: {
        Idle: {
            imageSrc: './img/Wizard/Wizard_Idle_Spritesheet_Scaled_20X.png',
            frameRate: 2,
            frameBuffer: 60,
            loop: true,
        },
        Walk: {
            imageSrc: './img/Wizard/Wizard_Walk_Spritesheet_Scaled_20X.png',
            frameRate: 8,
            frameBuffer: 10,
            loop: true,
        },
        Jump: {
            imageSrc: './img/Wizard/Wizard_Idle_Spritesheet_Scaled_20X.png',
            frameRate: 2,
            frameBuffer: 60,
            loop: true,
        },
        Fall: {
            imageSrc: './img/Wizard/Wizard_Idle_Spritesheet_Scaled_20X.png',
            frameRate: 2,
            frameBuffer: 60,
            loop: true,
        },
        Attack: {
            imageSrc: './img/Wizard/Wizard_Attack_Spritesheet_Scaled_20X.png',
            frameRate: 3,
            frameBuffer: 10,
            loop: false,
        },

        IdleLeft: {
            imageSrc: './img/Wizard/Wizard_IdleLeft_Spritesheet_Scaled_20X.png',
            frameRate: 2,
            frameBuffer: 60,
            loop: true,
        },
        WalkLeft: {
            imageSrc: './img/Wizard/Wizard_WalkLeft_Spritesheet_Scaled_20X.png',
            frameRate: 8,
            frameBuffer: 10,
            loop: true,
        },
        JumpLeft: {
            imageSrc: './img/Wizard/Wizard_IdleLeft_Spritesheet_Scaled_20X.png',
            frameRate: 2,
            frameBuffer: 60,
            loop: true,
        },
        FallLeft: {
            imageSrc: './img/Wizard/Wizard_IdleLeft_Spritesheet_Scaled_20X.png',
            frameRate: 2,
            frameBuffer: 60,
            loop: true,
        },
        AttackLeft: {
            imageSrc: './img/Wizard/Wizard_AttackLeft_Spritesheet_Scaled_20X.png',
            frameRate: 3,
            frameBuffer: 10,
            loop: false,
        },
    },
    collisionBlocks: {
        floorCollisionBlocks,
        platformCollisionBlocks,
    }
});

const personalChest = new Chest({
    position: {
        x: 45,
        y: 336,
    },
    imageSrc: './img/Purple_Chest_Spritesheet_Scaled_20X.png',
    frameRate: 4,
    frameBuffer: 20,
});

let projectiles = [];
let pickUps = [];

const keys = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    space: {
        pressed: false,
    },
    f: {
        pressed: false,
    }
}

const backgroundImageHeight = 432;

const camera = {
    position: {
        x: 0,
        y: -backgroundImageHeight + scaledCanvas.height,
    },
}

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'white';
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.save();
    c.scale(scaleFactor, scaleFactor);
    c.translate(camera.position.x, camera.position.y);
    background.update();
    chests.forEach(chest => {
        chest.update();
    });
    personalChest.update();
    floorCollisionBlocks.forEach(collisionBlock => {
        collisionBlock.update();
    })
    platformCollisionBlocks.forEach(collisionBlock => {
        collisionBlock.update();
    })
    pickUps.forEach(item => {
        item.update();
    });
    player.update();
    player.velocity.x = 0;
    if (keys.f.pressed) {
        if(collision({object1: personalChest.hitbox, object2: player.hitbox})) {
            personalChest.awaitLoop = false;
            personalChest.open();
            keys.f.pressed = false;
        } 
        chests.forEach(chest => {
            if(collision({object1: chest.hitbox, object2: player.hitbox})) {
                chest.awaitLoop = false;
                chest.open();
                keys.f.pressed = false;
                return;
            } 
        });
    }
    if (keys.space.pressed) {
        if (player.lastDirection === 'right' && keys.space.pressed) {
            player.switchSprite('Attack');
            projectiles.push(new Projectile({
                position: {
                    x: player.hitbox.position.x + player.hitbox.width,
                    y: player.hitbox.position.y + (player.hitbox.height / 8),
                },
                imageSrc: './img/Wizard/Slice_Attack_Spritesheet_Scaled_20X.png',
                frameRate: 4,
                frameBuffer: 15,
                scale: 0.1,
                direction: 'right',
            }));
            keys.space.pressed = false;
            // console.log(projectiles);
        }
        else if (player.lastDirection === 'left' && keys.space.pressed) {
            player.switchSprite('AttackLeft');
            projectiles.push(new Projectile({
                position: {
                    x: player.hitbox.position.x - player.hitbox.width,
                    y: player.hitbox.position.y + (player.hitbox.height / 8),
                },
                imageSrc: './img/Wizard/Slice_AttackLeft_Spritesheet_Scaled_20X.png',
                frameRate: 4,
                frameBuffer: 15,
                scale: 0.1,
                direction: 'left',
            }));
            keys.space.pressed = false;
        }
    }
    else if (keys.a.pressed) {
        player.switchSprite('WalkLeft');
        player.velocity.x = -1;
        player.lastDirection = 'left';
        player.checkPanCameraRight({ scaledCanvas, camera });
    }
    else if (keys.d.pressed) {
        player.switchSprite('Walk');
        player.velocity.x = 1;
        player.lastDirection = 'right';
        player.checkPanCameraLeft({ scaledCanvas, camera });
    }
    else if (player.velocity.y === 0) {
        if (player.lastDirection === 'right') player.switchSprite('Idle');
        else player.switchSprite('IdleLeft');
    }
    if (player.velocity.y < 0) {
        player.checkPanCameraDown({ scaledCanvas, camera });
        if (player.lastDirection === 'right') player.switchSprite('Jump');
        else player.switchSprite('JumpLeft');
    }
    if (player.velocity.y > 0) {
        player.checkPanCameraUp({ scaledCanvas, camera });
        if (player.lastDirection === 'right') player.switchSprite('Fall');
        else player.switchSprite('FallLeft');
    }

    projectiles.forEach(projectile => {
        projectile.update();
        projectile.move();
    });
    c.restore();
}
animate();

window.addEventListener('keydown', (event) => {
    // console.log(event);
    switch (event.key) {
        case 'a':
            keys.a.pressed = true;
            break;

        case 'd':
            keys.d.pressed = true;
            break;

        case 'w':
            if (player.velocity.y <= 0 && player.grounded) {
                player.velocity.y = -4;
                player.grounded = false;
            }
            break;

        case ' ':
            keys.space.pressed = true;
            break;

        case 'f':
            keys.f.pressed = true;
            break;
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'a':
            keys.a.pressed = false;
            break;

        case 'd':
            keys.d.pressed = false;
            break;

        case ' ':
            keys.space.pressed = false;
            break;

        case 'f':
            keys.f.pressed = false;
            break;
    }
}); 