// Game settings
const WIDTH = 20;
const HEIGHT = 10;

const EXIT_X = 7; // Example X coordinate for the exit
const EXIT_Y = 9;  // Example Y coordinate for the exit

const PLAYER = '@';
const WALL = '#';
const FLOOR = '.';
const EXIT = 'E';
const CHEST = 'C';
const SCROLL = 'S';

// Function to get the initial game state
function getInitialGameState() {
    return {
        playerX: 1,
        playerY: 1,
        chests: [
            { x: 5, y: 2, opened: false, content: "a roll of 3D Printing Filament!" },
            { x: 14, y: 6, opened: false, content: "an Orange Pi 5 Plus Single Board Computer!" }
        ],
        scrolls: [
            { x: 4, y: 8, read: false, text: "a scroll that says: 'You are lonely, because Human Nature is inherently selfish.'" },
            { x: 15, y: 3, read: false, text: "a scroll that says: 'It's ok to live in your own world, just don't let it be a comfort zone.'" }
        ],
        map: [
            "####################",
            "#@.................#",
            "#..##C###...C......#",
            "#..#....#......S...#",
            "#..#....#..........#",
            "#..######..........#",
            "#.......C..........#",
            "#...............####",
            "#...S..............#",
            "#######E############"
        ]
    };
}

// Initialize game state
let gameState = getInitialGameState();

// Typewriter effect management
let typewriterTimeout; // Store the typewriter timeout
const typewriterElementId = 'game-message'; // The element id for the typewriter effect

// Draw the game map
function drawMap() {
    let output = '';
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            let symbol = gameState.map[y][x];

            // Draw unopened chests
            if (gameState.chests.some(chest => chest.x === x && chest.y === y && !chest.opened)) {
                symbol = CHEST;
            }

            // Draw unread scrolls
            if (gameState.scrolls.some(scroll => scroll.x === x && scroll.y === y && !scroll.read)) {
                symbol = SCROLL;
            }

            // Ensure the exit is drawn if it's at this position
            if (x === EXIT_X && y === EXIT_Y) {
                symbol = EXIT;
            }

            output += symbol;
        }
        output += '\n';
    }
    document.getElementById('game-main').innerText = output;
}

// Typewriter effect function
function typeWriter(text, elementId, speed, callback) {
    const element = document.getElementById(elementId);

    // Clear any existing typewriter timeout
    if (typewriterTimeout) {
        clearTimeout(typewriterTimeout);
    }

    // Clear the element's current content
    element.innerText = '';

    let i = 0;

    function write() {
        if (i < text.length) {
            element.innerText += text.charAt(i);
            i++;
            typewriterTimeout = setTimeout(write, speed);
        } else if (callback) {
            callback();
        }
    }

    write();
}

// Display a message in the message box with typewriter effect
function displayMessage(message) {
    // Stop any ongoing typewriter effect
    if (typewriterTimeout) {
        clearTimeout(typewriterTimeout);
        typewriterTimeout = null;
    }

    // Clear the message area
    const element = document.getElementById(typewriterElementId);
    element.innerText = '';

    // Start the new typewriter effect
    typeWriter(message, typewriterElementId, 75); // Adjust speed as needed
}

// Move the player and handle interactions
function movePlayer(dx, dy) {
    let newX = gameState.playerX + dx;
    let newY = gameState.playerY + dy;

    // Check if new position is within bounds
    if (newX < 0 || newX >= WIDTH || newY < 0 || newY >= HEIGHT) return;

    // Check for walls
    if (gameState.map[newY][newX] === WALL) return;

    // Check for chests
    let chest = gameState.chests.find(chest => chest.x === newX && chest.y === newY);
    if (chest && !chest.opened) {
        displayMessage(`You found ${chest.content}`);
        chest.opened = true;
    }

    // Check for scrolls
    let scroll = gameState.scrolls.find(scroll => scroll.x === newX && scroll.y === newY);
    if (scroll && !scroll.read) {
        displayMessage(`You read ${scroll.text}`);
        scroll.read = true;
    }

    // Check if player reached the exit
    if (newX === EXIT_X && newY === EXIT_Y) {
        displayMessage('You found the exit! Congratulations!');

        // Delay the reset by 3 seconds
        setTimeout(function() {
            videoFirstTime = false;  // Set videoFirstTime to false
            scrollToFirstVideo();    // Scroll to the first video
        }, 3000);

        return;
    }

    // Update map: set the current position to floor, move player
    gameState.map[gameState.playerY] = gameState.map[gameState.playerY].substring(0, gameState.playerX) + FLOOR + gameState.map[gameState.playerY].substring(gameState.playerX + 1);
    gameState.playerX = newX;
    gameState.playerY = newY;
    gameState.map[gameState.playerY] = gameState.map[gameState.playerY].substring(0, gameState.playerX) + PLAYER + gameState.map[gameState.playerY].substring(gameState.playerX + 1);

    drawMap();
}

// Reset the game
function resetGame() {
    gameState = getInitialGameState();
    drawMap();
}

// Handle key presses for movement (WASD for mobile control)
document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'w':
            movePlayer(0, -1);
            break;
        case 's':
            movePlayer(0, 1);
            break;
        case 'a':
            movePlayer(-1, 0);
            break;
        case 'd':
            movePlayer(1, 0);
            break;
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
            // Reserved for dungeon switching
            break;
    }
});

// Handle button clicks for mobile controls
document.getElementById('move-up').addEventListener('click', function() {
    movePlayer(0, -1);
});
document.getElementById('move-down').addEventListener('click', function() {
    movePlayer(0, 1);
});
document.getElementById('move-left').addEventListener('click', function() {
    movePlayer(-1, 0);
});
document.getElementById('move-right').addEventListener('click', function() {
    movePlayer(1, 0);
});

// Start the game
drawMap();
displayMessage("You are now playing the Game of Life; the Game that is imposed on you, whether you like it or not. Above is our own unique spin of the Wheel of Samsāra, which symbolizes the cyclical nature of a world full of savagery, chaos, and beauty. Below is your mini-map which you may navigate in order to learn more about what's going on. On Desktop, you can use W,A,S,D to move your character. On mobile, just use the arrows on each side of the map. Good luck, have fun!");
