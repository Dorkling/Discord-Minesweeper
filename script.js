function generateDiscordMinesweeper(width = 6, height = 5, mines = 8) {
    // Define the emojis. Using a non-spoilered zero saves many characters.
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

    // 1. Create an empty grid
    let field = Array(height).fill(null).map(() => Array(width).fill(0));

    // 2. Randomly place the mines
    let minesPlaced = 0;
    while (minesPlaced < mines) {
        const y = Math.floor(Math.random() * height);
        const x = Math.floor(Math.random() * width);
        if (field[y][x] !== mineEmoji) {
            field[y][x] = mineEmoji;
            minesPlaced++;
        }
    }

    // 3. Calculate the numbers for the remaining cells
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (field[y][x] === mineEmoji) {
                continue;
            }

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

    // 4. Build the final string, using as many characters as possible
    let output = '';
    let lastAddedRowIndex = -1;

    // First, add as many FULL rows as will fit
    for (let y = 0; y < height; y++) {
        const rowString = field[y].join('');
        const prospectiveOutput = output + (output ? '\n' : '') + rowString;
        
        if (prospectiveOutput.length <= characterLimit) {
            output = prospectiveOutput;
            lastAddedRowIndex = y;
        } else {
            break; // Stop when the next full row would exceed the limit
        }
    }

    // Next, add individual cells from the following row to fill remaining space
    const nextRowIndex = lastAddedRowIndex + 1;
    if (nextRowIndex < height) { // Check if there is a next row
        const nextRow = field[nextRowIndex];
        for (const cell of nextRow) {
            if (output.length + cell.length <= characterLimit) {
                output += cell;
            } else {
                break; // Stop when the next cell doesn't fit
            }
        }
    }

    return output;
}
