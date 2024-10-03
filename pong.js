const canvas = document.getElementById('pongCanvas');
const context = canvas.getContext('2d');

// Ball object
let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 15,
    speedX: 6,
    speedY: 6,
    color: 'white'
};

// Paddle object
let paddleWidth = 15, paddleHeight = 120;
let player = { x: 20, y: (canvas.height - paddleHeight) / 2, width: paddleWidth, height: paddleHeight, color: 'white', speedY: 0 };
let computer = { x: canvas.width - paddleWidth - 20, y: (canvas.height - paddleHeight) / 2, width: paddleWidth, height: paddleHeight, color: 'white', speedY: 0 };

// Movement variables
let playerSpeed = 6; 
let computerSpeed = 8; // Increased AI paddle speed for more challenge
let keysPressed = {};

// Scores
let playerScore = 0;
let computerScore = 0;
let winningScore = 10; // Set a target score for winning

// Draw ball
function drawBall() {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fillStyle = ball.color;
    context.fill();
    context.closePath();
}

// Draw paddle
function drawPaddle(x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

// Draw score
function drawScore() {
    context.font = "40px Arial";
    context.fillStyle = "white";
    context.fillText(playerScore, canvas.width / 4, 50);
    context.fillText(computerScore, 3 * canvas.width / 4, 50);
}

// Handle key down and key up for smooth paddle movement
window.addEventListener('keydown', function (e) {
    keysPressed[e.key] = true;
});
window.addEventListener('keyup', function (e) {
    keysPressed[e.key] = false;
});

// Move paddles based on key press
function movePaddles() {
    if (keysPressed['ArrowUp'] && player.y > 0) {
        player.y -= playerSpeed;
    }
    if (keysPressed['ArrowDown'] && player.y < canvas.height - player.height) {
        player.y += playerSpeed;
    }
}

// AI Movement for the computer paddle
function moveComputer() {
    let targetY = ball.y - (computer.height / 2); // Aim for the center of the ball
    if (targetY > computer.y + 10) {
        computer.y += computerSpeed; // Move down
    } else if (targetY < computer.y - 10) {
        computer.y -= computerSpeed; // Move up
    }

    // Prevent computer paddle from moving out of bounds
    if (computer.y < 0) {
        computer.y = 0;
    } else if (computer.y + computer.height > canvas.height) {
        computer.y = canvas.height - computer.height;
    }
}

// Move ball and detect collisions
function moveBall() {
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Ball collision with top and bottom
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.speedY = -ball.speedY;
    }

    // Ball collision with player paddle
    if (ball.x - ball.radius < player.x + player.width && ball.y > player.y && ball.y < player.y + player.height) {
        ball.speedX = -ball.speedX;
    }

    // Ball collision with computer paddle
    else if (ball.x + ball.radius > computer.x && ball.y > computer.y && ball.y < computer.y + computer.height) {
        ball.speedX = -ball.speedX;
    }

    // Ball goes out of bounds (left or right)
    if (ball.x + ball.radius > canvas.width) {
        playerScore++;
        resetBall('player');
    } else if (ball.x - ball.radius < 0) {
        computerScore++;
        resetBall('computer');
    }

    // Check if someone won
    if (playerScore === winningScore || computerScore === winningScore) {
        endGame();
    }
}

// Reset ball position after scoring
function resetBall(winner) {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    
    // Change ball's direction based on who won the point
    ball.speedX = winner === 'player' ? -6 : 6;
}

// End game and declare the winner
function endGame() {
    let winner = playerScore === winningScore ? "Player" : "Computer";
    alert(`${winner} wins!`);
    
    // Reset scores and restart game
    playerScore = 0;
    computerScore = 0;
    resetBall('player');
}

// Update game logic
function update() {
    movePaddles();
    moveComputer(); // Call the AI movement
    moveBall();
}

// Render game objects
function render() {
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles, ball, and score
    drawPaddle(player.x, player.y, player.width, player.height, player.color);
    drawPaddle(computer.x, computer.y, computer.width, computer.height, computer.color);
    drawBall();
    drawScore();
}

// Game loop
function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

gameLoop();
