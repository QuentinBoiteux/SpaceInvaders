let video = document.querySelector('.video')
let game = document.querySelector('.game')
let skip = document.querySelector('.skip')
let skipped = false
document.addEventListener("DOMContentLoaded", () => {
    console.log("hello")
    video.play()
});

skip.style.animation = 'heart 10s linear infinite '


console.log(skipped)
document.addEventListener("keyup", e => {
    if (skipped == false) {
        if (e.key === 's') {
            skipped = true
            console.log(skipped)
            video.currentTime = 91200;
        }
    }
});

let videoEnd = false
video.addEventListener('ended', myHandler, false);
function myHandler() {
    videoEnd = true
    let video2 = document.querySelector('.video2')
    let video3 = document.querySelector('.video3')
    let start = false
    let bossMusic = new Audio('Hyper - Spoiler - Cyberpunk 2077 OST.mp3')
    let winningSound = new Audio('winLevel.wav')
    let beam = new Audio('beam.mp3');
    let myAudio = new Audio('Atom.mp3');
    let hitted = new Audio('touch.wav')
    let overSound = new Audio('GameOver.wav')
    let explosion = new Audio('explosion.wav')
    let enemyLaser = new Audio('enemy-laser.mp3')
    let laserAndMissileExplosion = new Audio('missile-laser.mp3')
    overSound.loop = explosion.loop = false;
    let alienEx = new Audio('alien-ex.mp3')
    let nextDimension = new Audio('nextDimension.mp3')
    let departMinutes = 2
    let alreadyDead = false
    let temps = departMinutes * 60
    const timerElement = document.getElementById("timer")
    let pauseEnable = true



    if (typeof myAudio.loop == 'boolean') {
        myAudio.loop = true;
    }
    else {
        myAudio.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play();
        }, false);
    }
    function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
        // Check x and y for overlap
        if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2) {
            return false;
        }
        return true;
    }

    let startScreen = document.querySelector('#startScreen')
    let gameOver = document.querySelector('#gameOver')
    let win = document.querySelector('.winner');
    let cont = document.querySelector('.continue')
    let live1 = document.querySelector('.live1')
    let live2 = document.querySelector('.live2')
    let score = document.querySelector('#score')
    let scoreCount = 0
    let secs = 0;

    if (videoEnd == true) {
        game.style.display = "block"
        video.style.display = "none"
        skip.style.display = "none"
        skipped = true
        nextDimension.play()
        document.addEventListener("keyup", ev => {
            if (ev.key === ' ' && start == false) {
                let timer = setInterval(() => {
                    secs++;
                    console.log(secs);
                }, 1000);
                nextDimension.pause()
                start = true
                myAudio.play()
                live1.style.display = "block"
                live2.style.display = "block"
                if (start == true) {
                    startScreen.style.display = "none"
                    timerElement.style.display = "block"
                }
                let player = document.querySelector('.player');
                const invadersContainer = document.getElementById('invaders-container');
                let pause = document.querySelector('.pauser')
                let bullet = document.querySelector(".bullet")
                let choose = document.querySelector('.choose')
                //let invad = document.getElementsByClassName('invaders')
                if (start == true) {
                    player.style.display = "block"
                }

                // array to store the invaders
                let hitCountBoss = 0
                var invaderArr = [];
                var bossArr = []
                var speed = 3;
                var bossSpeed = 3;
                let numberOfInvaders = 1;
                let numberOfBoss = 1
                let enemyDead = numberOfInvaders;
                let level = false
                // function to create the invaders
                function createInvaders() {
                    // generate random position and movement direction for each invader
                    for (let i = 0; i < numberOfInvaders; i++) {
                        var posX = Math.floor(Math.random() * document.querySelector('#invaders-container').clientWidth);
                        var posY = Math.floor(Math.random() * document.querySelector('#invaders-container').clientHeight);
                        var direction = Math.random() > 0.5 ? 1 : -1;
                        var element = document.createElement("div");
                        element.style.position = "absolute"
                        element.style.left = posX + "px";
                        element.style.top = posY + "px";
                        element.classList.add('invaders')
                        invadersContainer.appendChild(element);
                        var invader = { alive: true, posX: posX, posY: posY, direction: direction, element: element };
                        invaderArr.push(invader);
                    }

                }

                function createBoss() {
                    var posX = Math.floor(Math.random() * document.querySelector('#invaders-container').clientWidth);
                    var posY = Math.floor(Math.random() * document.querySelector('#invaders-container').clientHeight);
                    var direction = Math.random() > 0.5 ? 1 : -1;
                    var element = document.createElement("div");
                    element.style.position = "absolute"
                    element.style.left = posX + "px";
                    element.style.top = posY + "px";
                    element.classList.add('BOSS')
                    invadersContainer.appendChild(element);
                    var boss = { alive: true, posX: posX, posY: posY, direction: direction, element: element };
                    bossArr.push(boss);


                }


                function moveInvaders() {
                    invaderArr.forEach(invader => {
                        if (!paused) {
                            // update the position of the invader based on its direction and speed
                            let posX = invader.posX + (invader.direction * speed);
                            let posY = invader.posY;
                            // update the position of the HTML element
                            invader.element.style.left = posX + "px";
                            invader.element.style.top = posY + "px";
                            if (posX < 0) {
                                invader.direction = -invader.direction;
                                posX = 0;
                            } else if (posY < 0) {
                                invader.direction = -invader.direction;
                                posY = 0;
                            } else if (posX > document.querySelector('#invaders-container').clientWidth - 40) {
                                invader.direction = -invader.direction;
                                posX = document.querySelector('#invaders-container').clientWidth - 40;
                            } else if (posY > document.querySelector('#invaders-container').clientHeight) {
                                invader.direction = -invader.direction;
                                posY = document.querySelector('#invaders-container').clientHeight;
                            }

                            invader.posX = posX;
                            invader.posY = posY;
                            /* if(checkCollision(invader)){
                                 console.log('hi')
                             }*/
                        }
                    });
                }

                function moveBoss() {

                    bossArr.forEach(boss => {
                        if (!paused) {
                            let dodgeBoss = Math.floor(Math.random() * 100)
                            // update the position of the invader based on its direction and speed
                            let posX = boss.posX + (boss.direction * bossSpeed * 2);
                            let posY = boss.posY;
                            // update the position of the HTML element
                            boss.element.style.left = posX + "px";
                            boss.element.style.top = posY + "px";

                            if (posX < 0) {
                                boss.direction = -boss.direction;
                                posX = 0;
                            } else if (posY < 0) {
                                boss.direction = -boss.direction;
                                posY = 0;
                            } else if (dodgeBoss == 0) {
                                boss.direction = -boss.direction

                            } else if (posX > document.querySelector('#invaders-container').clientWidth - 150) {
                                boss.direction = -boss.direction;
                                posX = document.querySelector('#invaders-container').clientWidth - 150;
                            } else if (posY > document.querySelector('#invaders-container').clientHeight) {
                                boss.direction = -invader.direction;
                                posY = document.querySelector('#invaders-container').clientHeight;
                            }

                            boss.posX = posX;
                            boss.posY = posY;
                            /* if(checkCollision(invader)){
                                 console.log('hi')
                             }*/
                        }
                    });

                }

                let dead = false
                let fired = false
                let playerX = 0;
                let playerY = document.querySelector('.player').getBoundingClientRect().top + -75;
                let bulletX = playerX
                let bulletY = 0
                let array = []
                let paused = false
                let bulletEnnemies = [];
                let probabilityToFire = 4;
                let maxEnnemiesBullets = 10;
                const SPEED_MISSILE = 5;

                document.addEventListener("keyup", event => {
                    if (event.key == "p" && pauseEnable == true) {
                        clearInterval(timer)
                        if (bossFight == false) {
                            myAudio.pause()
                        }
                        if (bossFight == true) {
                            bossMusic.pause()
                        }
                        beam.pause()
                        if (paused == false) {
                            paused = true
                            pause.style.display = "block"
                            choose.style.display = "block"
                            clearInterval(timerInterval)
                        } else if (paused == true) {
                            if (bossFight == false) {
                                myAudio.play()
                            }
                            if (bossFight == true) {
                                bossMusic.play()
                            }
                            paused = false
                            pause.style.display = "none"
                            choose.style.display = "none"
                            timer = setInterval(() => {
                                secs++;
                                console.log(secs);
                            }, 1000);
                            timerInterval = setInterval(() => {
                                let minutes = parseInt(temps / 60, 10)
                                let secondes = parseInt(temps % 60, 10)
                                minutes = minutes < 10 ? "0" + minutes : minutes
                                secondes = secondes < 10 ? "0" + secondes : secondes
                                timerElement.innerText = `${minutes}:${secondes}`
                                temps = temps <= 0 ? 0 : temps - 1
                                if (temps == 0) {
                                    Over()
                                }
                            }, 1000)
                        }
                    }
                })

                document.addEventListener("keyup", event => {
                    if (paused == true) {
                        if (event.key == "a") {
                            window.location.reload()
                            paused = false
                        }
                    }
                })
                let hit = false
                if (paused == false) {
                    document.addEventListener("keydown", event => {
                        if (!array.includes(event.key)) {
                            array.push(event.key)
                        }
                        //console.log(array)
                    });
                    document.addEventListener("keyup", event => {
                        removeItemOnce(array, event.key)
                    })

                    document.addEventListener("load", loop())
                    //console.log(playerX)
                    if (playerX == "") {
                        playerX = 0
                    }
                    function loop() {
                        //console.log(playerX)
                        if (array.includes("ArrowLeft") && !paused) {
                            if (playerX > 0) {
                                playerX -= 8;
                            }
                        }
                        if (array.includes("ArrowRight") && !paused) {
                            if (playerX < document.querySelector('#invaders-container').clientWidth - 80) {
                                playerX += 8;
                            }
                        }
                        if (array.includes(" ") && fired == false && !paused) {
                            bullet.style.display = "block";
                            fired = true
                            bulletX = playerX + 35
                            bulletY = playerY + -60
                            beam.play()

                        }
                        if (fired == true && !paused) {
                            if (bulletY < 0) {
                                bullet.style.display = "none";
                                fired = false
                                hit = false
                                bulletY = playerX
                            }
                            //console.log(bulletY) 
                            bulletY -= 15;
                            if (!(bullet.style.display == "none")) {
                                invaderArr.forEach(invader => {
                                    if (!invader.alive) return;

                                    let posX = invader.posX;
                                    let posY = invader.posY;
                                    if (rectIntersect(bulletX, bulletY, 18, 60, posX, posY, 30, 40)) {
                                        enemyDead -= 1
                                        if (enemyDead == 0) {
                                            level = true
                                            Win();
                                        }
                                        hit = true
                                    } else {
                                        hit = false
                                    }
                                    if (hit == true) {
                                        scoreCount += 150
                                        score.innerText = "score: " + `${scoreCount}`
                                        alienEx.play()
                                        invader.element.style.animation = "boom 1s"
                                        setTimeout(function () {
                                            invader.element.remove();

                                        }, 300);

                                        invader.alive = false;
                                        bullet.style.display = "none";
                                    }
                                    //console.log(posX, posY, bulletX, bulletY)
                                })
                                if (hit == false && bulletY < 0) {
                                    if (scoreCount >= 25) {
                                        scoreCount -= 25
                                        score.innerText = "score: " + `${scoreCount}`
                                    }
                                }
                                bossArr.forEach(boss => {
                                    if (!boss.alive) return;

                                    let posX = boss.posX;
                                    let posY = boss.posY;
                                    if (rectIntersect(bulletX, bulletY, 18, 60, posX, posY, 150, 150)) {
                                        hit = true
                                    } else {
                                        hit = false
                                    }
                                    if (hit == true) {
                                        hitCountBoss++
                                        console.log(hitCountBoss)
                                        alienEx.play()
                                        boss.element.classList.add('blink')
                                        setTimeout(() => boss.element.classList.remove('blink'), 800);
                                        bullet.style.display = "none";
                                    }
                                    if (hitCountBoss == 10) {
                                        bossSpeed = 6
                                    }
                                    if (hitCountBoss == 15) {
                                        scoreCount += 1000
                                        score.innerText = "score: " + `${scoreCount}`
                                        alienEx.play()
                                        boss.element.style.animation = "boom 1s"
                                        numberOfBoss = 0
                                        setTimeout(function () {
                                            boss.element.remove();
                                        }, 300);

                                        boss.alive = false;
                                        bullet.style.display = "none";
                                    }
                                    if (numberOfBoss == 0) {
                                        Win();
                                    }
                                    //console.log(posX, posY, bulletX, bulletY)
                                })
                                if (hit == false && bulletY < 0) {
                                    if (scoreCount >= 25) {
                                        scoreCount -= 25
                                        score.innerText = "score: " + `${scoreCount}`
                                    }
                                }
                            }
                        }
                        //console.log(bulletY)
                        bullet.style.top = `${bulletY}px`;
                        bullet.style.left = `${bulletX}px`;
                        player.style.left = `${playerX}px`;
                        requestAnimationFrame(loop)
                    }

                    function removeItemOnce(arr, value) {
                        var index = arr.indexOf(value);
                        if (index > -1) {
                            arr.splice(index, 1);
                        }
                        return arr;
                    }
                }


                if (!paused) {
                    var timerInterval = setInterval(() => {
                        let minutes = parseInt((temps / 60), 10)
                        let secondes = parseInt(temps % 60, 10)
                        minutes = minutes < 10 ? "0" + minutes : minutes
                        secondes = secondes < 10 ? "0" + secondes : secondes

                        timerElement.innerText = `${minutes}:${secondes}`
                        temps = temps <= 0 ? 0 : temps - 1
                        if (temps == 0) {
                            Over()
                        }
                    }, 1000)
                }
                //console.log(departMinutes, temps)
                let bossFight = false
                function Over() {
                    pauseEnable = false
                    clearInterval(timer)
                    clearInterval(timerInterval)
                    dead = true
                    myAudio.pause()
                    beam.pause()
                    paused = true
                    gameOver.style.display = "block"
                    if (dead == true && !alreadyDead) {
                        player.style.animation = 'boom 5s'
                        setTimeout(function () {
                            player.style.display = 'none'
                        }, 700);
                        overSound.play()
                        explosion.play()
                        alreadyDead = true
                        console.log(player)
                    }
                    document.addEventListener("keydown", event => {
                        if (event.key == "a") {
                            window.location.reload()
                            dead = false
                        }
                    })
                }
                let countWin = 0
                function Win() {
                    countWin++
                    winningSound.play()
                    win.style.display = "block"
                    cont.style.display = "block"
                    if (countWin < 5) {
                        pauseEnable = false
                        cont.innerHTML = 'press C to continue to level' + " " + `${countWin + 1}`
                    } else {
                        pauseEnable = false
                        clearInterval(timerInterval)
                        clearInterval(timer)
                        win.style.display = "none"
                        cont.style.display = "none"
                        video3.style.display = "block"
                        game.style.display = "none"
                        bossMusic.pause()
                        video3.play()
                        skip.style.display = "block"
                        let skippers2 = false
                        document.addEventListener("keydown", event => {
                            if (event.key == 's' && skippers2 == false) {
                                skippers2 = true
                                video3.currentTime = 23000
                            }
                            video3.addEventListener('ended', myLastHandler, false);
                            function myLastHandler() {
                                let subBtn = document.querySelector('.submitBtn');
                                let theScore = document.querySelector('.theScore');
                                let theTimer = document.querySelector('.theTimer');
                                let btnForm = document.querySelector('.visibleForm');
                                let Form = document.querySelector('.formBox')
                                btnForm.style.display = "block"
                                btnForm.addEventListener('click', function () {
                                    btnForm.style.display = "none";
                                    Form.style.visibility = "visible";
                                    let score = scoreCount
                                    console.log(score)
                                    theScore.value = score;
                                    theTimer.value = secs;
                                    console.log(theScore)
                                })
                                skippers2 = true
                                skip.style.display = "none"
                                cont.style.animation = "none"
                                video3.pause()
                                win.style.display = "block"
                                cont.style.display = "block"
                                cont.style.marginTop = "25%"
                                cont.innerHTML = "Final score : " + `${scoreCount}`
                                //playAgain = document.querySelector('.playAgain')
                                game.style.display = "block"
                                video3.style.display = "none"
                                //playAgain.style.display = "block"
                                /*document.addEventListener("keydown", event => {
                                    if (event.key == "a") {
                                        window.location.reload()
                                        paused = false
                                    }
                                });*/
                            }
                        });
                    }
                    document.addEventListener("keydown", event => {
                        if (level == true) {
                            if (enemyDead == 0 && countWin < 4) {
                                if (event.key == "c") {
                                    pauseEnable = true
                                    timerElement.innerText = `${'02'}:${'00'}`
                                    temps = departMinutes * 60
                                    numberOfInvaders *= 2
                                    speed *= 1.36
                                    if (probabilityToFire !== 1) {
                                        probabilityToFire -= 1
                                    }
                                    enemyDead = numberOfInvaders
                                    win.style.display = 'none'
                                    cont.style.display = 'none'
                                    createInvaders()
                                    level = false
                                }
                            }
                            if (enemyDead == 0 && countWin == 4) {
                                if (event.key == "c") {
                                    pauseEnable = true
                                    skip.style.display = "block"
                                    video2.play()
                                    video2.style.display = "block"
                                    game.style.display = "none"
                                    myAudio.pause()
                                    level = false
                                    bossFight = true
                                    let skipper = false
                                    document.addEventListener("keyup", event => {
                                        if (event.key == "s" && skipper == false) {
                                            skipper = true
                                            console.log(skipped)
                                            video2.currentTime = 49000;
                                        }
                                    });
                                    video2.addEventListener('ended', myHandlers, false);
                                    function myHandlers() {
                                        skipper = true
                                        skip.style.display = "none"
                                        video2.style.display = "none"
                                        video2.pause()
                                        game.style.display = "block"
                                        bossMusic.play()
                                        timerElement.innerText = `${'02'}:${'00'}`
                                        temps = departMinutes * 60
                                        win.style.display = 'none'
                                        cont.style.display = 'none'
                                        createBoss()
                                    }
                                }
                            }
                            console.log(countWin)
                        }
                    })

                }
                const shootEnnemies = () => {
                    for (let i = 0; i < invaderArr.length; i++) {
                        let fireChance = Math.floor(Math.random() * probabilityToFire);
                        //console.log(fireChance)
                        if (fireChance == 0 && bulletEnnemies.length <= maxEnnemiesBullets && invaderArr[i].alive) {
                            enemyLaser.play()
                            let element = document.createElement("div");
                            element.classList.add("invader-shot");
                            element.style.top = invaderArr[i].posY + 20 + "px";
                            element.style.left = invaderArr[i].posX + "px";
                            bulletEnnemies.push(element);
                            document.getElementById('invaders-container').appendChild(element);

                        }

                    }
                }
                const shootBoss = () => {
                    for (let i = 0; i < bossArr.length; i++) {
                        let fireChance = Math.floor(Math.random() * (probabilityToFire / 5));
                        if (fireChance == 0 && bulletEnnemies.length <= maxEnnemiesBullets && bossArr[i].alive) {
                            enemyLaser.play()
                            let element = document.createElement("div");
                            element.classList.add("invader-shot");
                            element.style.top = bossArr[i].posY + 30 + "px";
                            element.style.left = bossArr[i].posX + 28 + "px";
                            element.style.background = "url('" + "laserBoss.png" + "')"
                            element.style.backgroundRepeat = "no-repeat"
                            element.style.backgroundSize = 'contain'
                            element.style.width = 100 + "px"
                            element.style.height = 100 + "px"
                            element.style.transform = 'rotate(-180deg)'
                            bulletEnnemies.push(element);
                            document.getElementById('invaders-container').appendChild(element);

                        }
                    }
                }
                const shootBoss2 = () => {
                    console.log("hi")
                    for (let i = 0; i < bossArr.length; i++) {
                        let fireChance = Math.floor(Math.random() * (probabilityToFire));
                        if (fireChance == 0 && bulletEnnemies.length <= maxEnnemiesBullets && bossArr[i].alive) {
                            enemyLaser.play()
                            let element = document.createElement("div");
                            element.classList.add("invader-shot");
                            element.style.top = bossArr[i].posY + 30 + "px";
                            element.style.left = bossArr[i].posX + 28 + "px";
                            element.style.background = "url('" + "laserBoss.png" + "')"
                            element.style.backgroundRepeat = "no-repeat"
                            element.style.backgroundSize = 'contain'
                            element.style.width = 100 + "px"
                            element.style.height = 100 + "px"
                            element.style.transform = 'rotate(-180deg)'
                            bulletEnnemies.push(element);
                            document.getElementById('invaders-container').appendChild(element);

                        }
                    }
                }

                const shootBoss3 = () => {
                    console.log("hi")
                    for (let i = 0; i < bossArr.length; i++) {
                        let fireChance = Math.floor(Math.random() * (probabilityToFire));
                        if (fireChance == 0 && bulletEnnemies.length <= maxEnnemiesBullets && bossArr[i].alive) {
                            enemyLaser.play()
                            let element = document.createElement("div");
                            element.classList.add("invader-shot");
                            element.style.top = bossArr[i].posY + 30 + "px";
                            element.style.left = bossArr[i].posX + 28 + "px";
                            element.style.background = "url('" + "laserBoss.png" + "')"
                            element.style.backgroundRepeat = "no-repeat"
                            element.style.backgroundSize = 'contain'
                            element.style.width = 100 + "px"
                            element.style.height = 100 + "px"
                            element.style.transform = 'rotate(-180deg)'
                            bulletEnnemies.push(element);
                            document.getElementById('invaders-container').appendChild(element);

                        }
                    }
                }

                let hoho = false
                let countLive = 0
                let lastUpdate = 0
                const update = (deltaTime) => {
                    updateId = requestAnimationFrame(update);

                    moveInvaders();
                    moveBoss();
                    if (!paused) {
                        if (!lastUpdate || deltaTime - lastUpdate >= 1 * 1000) {
                            lastUpdate = deltaTime

                            shootEnnemies();
                            shootBoss();
                            if (hitCountBoss > 9) {
                                setTimeout(function () {
                                    shootBoss2();
                                }, 300);
                                setTimeout(function () {
                                    shootBoss3();
                                }, 600);
                            }

                        }

                        for (let i = 0; i < bulletEnnemies.length; i++) {
                            const x = parseInt(bulletEnnemies[i].style.left.replace("px", ""))
                            const y = parseInt(bulletEnnemies[i].style.top.replace("px", "")) + SPEED_MISSILE;
                            bulletEnnemies[i].style.top = y + "px";
                            if (y > window.innerHeight) {
                                bulletEnnemies[i].style.display = "none";
                                bulletEnnemies.splice(i, 1);
                            }
                            //console.log(playerX, playerY, x, y)
                            if (rectIntersect(x, y, 60, 20, bulletX, bulletY, 18, 60) && bullet.style.display == "block") {
                                bulletEnnemies[i].style.animation = 'laserBoom 1s'
                                laserAndMissileExplosion.play()
                                bullet.style.display = "none"
                                setTimeout(function () {
                                    bulletEnnemies[i].style.display = "none"
                                    bulletEnnemies[i].remove();
                                    bulletEnnemies.splice(i, 1)
                                }, 100);

                            }
                            if (rectIntersect(x, y, 60, 20, playerX, playerY, 50, 80)) {
                                hoho = true
                                bulletEnnemies[i].remove();
                                bulletEnnemies.splice(i, 1)
                                countLive += 1
                                console.log(countLive)
                                console.log(alreadyDead)
                                console.log(countLive)
                            }
                            if (countLive == 1 && hoho == true) {
                                if (scoreCount >= 50) {
                                    scoreCount -= 50
                                    score.innerText = "score: " + `${scoreCount}`
                                }
                                player.style.animation = "blink 0.8s"
                                live2.style.display = "none"
                                hitted.play()
                                hoho = false
                            }
                            if (countLive == 2) {
                                if (scoreCount >= 100) {
                                    scoreCount -= 50
                                }
                                score.innerText = "score: " + `${scoreCount}`
                                live1.style.display = "none"
                                player.style.display = "block"
                                Over()
                            }
                        }
                    }
                }
                createInvaders();
                requestAnimationFrame(update);
                requestAnimationFrame(setInterval)

            }
        });
    }
}
