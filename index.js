const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const GRID_HEIGHT = 3;
const GRID_WIDTH = 3;

const main = () => {
    const cells = [[null, null, null], [null, null, null], [null, null, null]];
    ask(cells, true);
};

const ask = (cells, isX) => {
    readline.question('Which cells ?', (cell) => {
        if (cell === 'stop') {
            readline.close();
            return;
        }

        cell = cell.split(' ');
        if (cells[parseInt(cell[0])][parseInt(cell[1])] !== null) {
            console.log(`Cell ${cell} is already set`);
            display(cells, isX);
        } else {
            cells[parseInt(cell[0])][parseInt(cell[1])] = isX ? 'X' : 'O';
            display(cells, !isX);
        }
    });
};

const display = (cells, isX) => {
    grid(cells);
    ask(cells, isX);
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
