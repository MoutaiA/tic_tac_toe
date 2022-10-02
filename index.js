const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const GRID_HEIGHT = 3;
const GRID_WIDTH = 3;

const main = () => {
    const cells = [[null, null, null], [null, null, null], [null, null, null]];
    loop(cells, true);
};

const loop = async (cells, isX) => {
    const posx = await ask(true);
    if (posx === 'stop') {
        readline.close();
        console.log('bye');
        return;
    }
    const posy = await ask(false);
    if (isValidInput(posx, posy, cells)) {
        cells[posx][posy] = isX ? 'X' : 'O';
        display(cells, !isX);
    } else {
        display(cells, isX);
    }
};

const ask = (posx) => {
    return new Promise((resolve) => {
        readline.question(`Choose position ${posx ? 'x' : 'y'}`, (answer) => {
            resolve(answer);
        });
    });
};

const isValidInput = (x, y, cells) => {
    x = parseInt(x);
    y = parseInt(y);
    if (x < 0 || x > 2 || y < 0 || y > 2) {
        console.log('Position outside the grid');
        return false;
    }
    if (cells[x][y] !== null) {
        console.log('Cell already set');
        return false;
    }
    return true;
};

const display = (cells, isX) => {
    grid(cells);
    loop(cells, isX);
};

const grid = (cells) => {
    let grid = '';
    for (let row = 0; row < GRID_WIDTH; row++) {
        for (let col = 0; col < GRID_HEIGHT; col++) {
            grid += `|${handleCellDisplay(cells[row][col])}`;
        }
        grid += '|\n';
    }
    console.log(grid);
};

const handleCellDisplay = (str) => str ? str === 'X' ? 'X' : 'O' : ' ';

main();
