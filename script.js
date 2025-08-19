// the main function to make the minesweeper game
function generateGame(width = 6, height = 5, mines = 8) {
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

    // setup the field
    let field = Array(height).fill(null).map(() => Array(width).fill(0));

    // put the mines in random spots
    let minesPlaced = 0;
    while (minesPlaced < mines) {
        let y = Math.floor(Math.random() * height);
        let x = Math.floor(Math.random() * width);
        if (field[y][x] !== mineEmoji) {
            field[y][x] = mineEmoji;
            minesPlaced++;
        }
    }

    // figure out the numbers for the other spots
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (field[y][x] === mineEmoji) {
                continue;
            }
            let adjacentMines = 0;
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    let newY = y + dy;
                    let newX = x + dx;
                    if (newY >= 0 && newY < height && newX >= 0 && newX < width && field[newY][newX] === mineEmoji) {
                        adjacentMines++;
                    }
                }
            }
            field[y][x] = numberEmojis[adjacentMines];
        }
    }

    // build the final text, ensuring line breaks are correct
    let output = '';
    for (let y = 0; y < height; y++) {
        let separator = (output === '') ? '' : '\n';
        let fullRowString = field[y].join('');

        // Try to add the full row first
        if (output.length + separator.length + fullRowString.length <= characterLimit) {
            output += separator + fullRowString;
            continue;
        }

        // If the full row doesn't fit, add a partial row and finish
        output += separator;
        for (let cell of field[y]) {
            if (output.length + cell.length <= characterLimit) {
                output += cell;
            } else {
                break; // Stop adding cells
            }
        }
        break; // Stop adding rows
    }
    return output;
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
