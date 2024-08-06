const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
const gameOverScreen = document.querySelector(".game-over-screen");
const restartButton = document.querySelector(".restart-button");

let gameOver = false;
let foodX, foodY;
let snakeX = 3, snakeY = 3;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;
let isPaused = false;
let gameSpeed = 100;

let level = 1;  // Initialize level
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const foodTypes = [
    { type: 'apple', color: 'red' },
    { type: 'banana', color: 'yellow' },
    { type: 'cherry', color: 'pink' },
    { type: 'grape', color: 'purple' }
];

let currentFood = {};

const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
    currentFood = foodTypes[Math.floor(Math.random() * foodTypes.length)];
};

const obstacles = [
    { x: 10, y: 10 },
    { x: 20, y: 20 },
    { x: 15, y: 15 }
];

const createObstacles = () => {
    let html = '';
    for (let obstacle of obstacles) {
        html += `<div class="obstacle" style="grid-area: ${obstacle.y} / ${obstacle.x};"></div>`;
    }
    return html;
};

const initGame = () => {
    if (gameOver) return handleGameOver();
    if (isPaused) return;

    let html = createObstacles();
    html += `<div class="food" style="grid-area: ${foodY} / ${foodX}; background-color: ${currentFood.color};"></div>`;

    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]);
        score++;
        if (score % 5 === 0) {
            level++;
            gameSpeed -= 10; // Increase speed every 5 points
            clearInterval(setIntervalId);
            setIntervalId = setInterval(initGame, gameSpeed);
        }
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
        document.querySelector(".level").innerText = `Level: ${level}`; // Display level
    }

    snakeX += velocityX;
    snakeY += velocityY;

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="snake" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]};"></div>`;
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }

    for (let obstacle of obstacles) {
        if (snakeX === obstacle.x && snakeY === obstacle.y) {
            gameOver = true;
        }
    }

    playBoard.innerHTML = html;
};

const handleGameOver = () => {
    clearInterval(setIntervalId);
    gameOverScreen.style.display = "flex";
};

const changeDirection = (event) => {
    if (event.key === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (event.key === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (event.key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (event.key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    } else if (event.key === " ") {
        isPaused = !isPaused;
    }
};

const startGame = () => {
    gameOver = false;
    isPaused = false;
    snakeX = 3;
    snakeY = 3;
    velocityX = 0;
    velocityY = 0;
    snakeBody = [];
    score = 0;
    level = 1; // Reset level
    gameSpeed = 100;
    updateFoodPosition();
    setIntervalId = setInterval(initGame, gameSpeed);
    gameOverScreen.style.display = "none";
    document.querySelector(".level").innerText = `Level: ${level}`; // Display level
};

updateFoodPosition();
document.addEventListener("keyup", changeDirection);
controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));
restartButton.addEventListener("click", startGame);
startGame();
