// 1. The up-to-date Minesweeper Function
function generateDiscordMinesweeper(width = 6, height = 5, mines = 8) {
    const mineEmoji = '||:boom:||';
    const numberEmojis = [
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
    const characterLimit = 190;

    let field = Array(height).fill(null).map(() => Array(width).fill(0));

    let minesPlaced = 0;
    while (minesPlaced < mines) {
        const y = Math.floor(Math.random() * height);
        const x = Math.floor(Math.random() * width);
        if (field[y][x] !== mineEmoji) {
            field[y][x] = mineEmoji;
            minesPlaced++;
        }
    }

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (field[y][x] === mineEmoji) continue;
            let adjacentMines = 0;
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const newY = y + dy;
                    const newX = x + dx;
                    if (newY >= 0 && newY < height && newX >= 0 && newX < width && field[newY][newX] === mineEmoji) {
                        adjacentMines++;
                    }
                }
            }
            field[y][x] = numberEmojis[adjacentMines];
        }
    }

    let output = '';
    let lastAddedRowIndex = -1;

    for (let y = 0; y < height; y++) {
        const rowString = field[y].join('');
        const prospectiveOutput = output + (output ? '\n' : '') + rowString;
        if (prospectiveOutput.length <= characterLimit) {
            output = prospectiveOutput;
            lastAddedRowIndex = y;
        } else {
            break;
        }
    }

    const nextRowIndex = lastAddedRowIndex + 1;
    if (nextRowIndex < height) {
        const nextRow = field[nextRowIndex];
        for (const cell of nextRow) {
            if (output.length + cell.length <= characterLimit) {
                output += cell;
            } else {
                break;
            }
        }
    }
    return output;
}

// 2. The code that connects the function to the HTML buttons
//    This part was likely missing!
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const outputTextarea = document.getElementById('output');

// Make the "Generate" button call the function
generateBtn.addEventListener('click', () => {
    const gameGrid = generateDiscordMinesweeper();
    outputTextarea.value = gameGrid;
});

// Make the "Copy" button work
copyBtn.addEventListener('click', () => {
    if (outputTextarea.value) {
        navigator.clipboard.writeText(outputTextarea.value);
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = 'Copy to Clipboard';
        }, 2000);
    }
});
