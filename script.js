// the main function to make the minesweeper game
function generateGame(maxRows = 6) {
    // figure out if we do 4 or 5 columns
    let width = Math.random() < 0.5 ? 4 : 5;
    // decide how many mines to add based on the size
    let mines = Math.ceil(width * maxRows * 0.22);

    let mineEmoji = '||:boom:||';
    let numberEmojis = [
        ':o:',
        '||:one:||',
        '||:two:||',
        '||:three:||',
        '||:four:||',
        '||:five:||',
        '||:six:||',
        '||:seven:||',
        '||:eight:||'
    ];
    let characterLimit = 190;

    // make the empty grid
    let field = Array(maxRows).fill(null).map(() => Array(width).fill(0));

    // put the mines in random spots
    let minesPlaced = 0;
    while (minesPlaced < mines) {
        let y = Math.floor(Math.random() * maxRows);
        let x = Math.floor(Math.random() * width);
        if (field[y][x] !== mineEmoji) {
            field[y][x] = mineEmoji;
            minesPlaced++;
        }
    }

    // --- PASS 1: Do a quick calculation to figure out the final height of the grid ---
    // (This first calculation might have incorrect numbers at the bottom, which is okay)
    for (let y = 0; y < maxRows; y++) {
        for (let x = 0; x < width; x++) {
            if (field[y][x] === mineEmoji) continue;
            let adjacentMines = 0;
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (dx === 0 && dy === 0) continue;
                    let newY = y + dy, newX = x + dx;
                    if (newY >= 0 && newY < maxRows && newX >= 0 && newX < width && field[newY][newX] === mineEmoji) {
                        adjacentMines++;
                    }
                }
            }
            field[y][x] = numberEmojis[adjacentMines];
        }
    }

    let finalHeight = 0;
    let tempOutput = '';
    for (let y = 0; y < maxRows; y++) {
        let rowString = field[y].join('');
        let newOutput = tempOutput + (tempOutput ? '\n' : '') + rowString;
        if (newOutput.length <= characterLimit) {
            tempOutput = newOutput;
            finalHeight++;
        } else {
            break;
        }
    }

    // --- PASS 2: Re-calculate the numbers correctly using the finalHeight as the boundary ---
    for (let y = 0; y < finalHeight; y++) {
        for (let x = 0; x < width; x++) {
            // Re-check original mine placement, since the number emojis overwrote the zeros
            let isMine = false;
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    let newY = y + dy, newX = x + dx;
                    if (newY >= 0 && newY < finalHeight && newX >= 0 && newX < width && field[newY][newX] === mineEmoji) {
                        isMine = true;
                        break;
                    }
                }
                if(isMine) break;
            }
            if(field[y][x] === mineEmoji) continue;

            let adjacentMines = 0;
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (dx === 0 && dy === 0) continue;
                    let newY = y + dy, newX = x + dx;
                    // This is the crucial fix: we now use finalHeight for the boundary
                    if (newY >= 0 && newY < finalHeight && newX >= 0 && newX < width && field[newY][newX] === mineEmoji) {
                        adjacentMines++;
                    }
                }
            }
            field[y][x] = numberEmojis[adjacentMines];
        }
    }

    // Build the final string using the fully corrected grid data
    let finalRows = field.slice(0, finalHeight);
    return finalRows.map(row => row.join('')).join('\n');
}

// hook everything up to the html page
let generateBtn = document.getElementById('generate-btn');
let copyBtn = document.getElementById('copy-btn');
let outputTextarea = document.getElementById('output');

generateBtn.addEventListener('click', () => {
    let game = generateGame();
    outputTextarea.value = game;
});

copyBtn.addEventListener('click', () => {
    if (outputTextarea.value) {
        navigator.clipboard.writeText(outputTextarea.value);
        copyBtn.textContent = 'Copied!';
        // change it back after a couple seconds
        setTimeout(() => {
            copyBtn.textContent = 'Copy to Clipboard';
        }, 2000);
    }
});
