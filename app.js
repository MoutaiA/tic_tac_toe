const readline = require('readline').createInterface({
	input: process.stdin,
	output: process.stdout,
});

const GRID_HEIGHT = 3;
const GRID_WIDTH = 3;
const MIN_VALUE_BEFORE_ALGORITHM = 4;
const MIN_VAL_VICTORY = 3;
let numberOfTurn = 1;

const main = async () => {
	const cells = [
		[null, null, null],
		[null, null, null],
		[null, null, null],
	];
	loop(cells, true);
};

const loop = async (cells, isX) => {
	if (numberOfTurn === GRID_HEIGHT * GRID_WIDTH) {
		console.log('The game is a draw');
		readline.close();
		return false;
	}

	const posx = await ask(true);
	if (posx === 'stop') {
		readline.close();
		console.log('Bye');
		return false;
	}
	const posy = await ask(false);
	if (isValidInput(posx, posy, cells)) {
		const sign = isX ? 'X' : 'O';
		cells[posx][posy] = sign;
		display(cells, !isX);
		if (MIN_VALUE_BEFORE_ALGORITHM <= numberOfTurn) {
			const hasWin = checkIsWinner(cells, sign);
			if (hasWin) {
				console.log(`The player with the sign ${sign} have win!`);
				readline.close();
			}
		}
		numberOfTurn++;
	} else {
		display(cells, isX);
	}
};

const ask = (posx) => {
	return new Promise((resolve) => {
		readline.question(`Choose position ${posx ? 'x' : 'y'}\n-> `, (answer) => {
			if (isNaN(parseInt(answer))) {
				console.log('You need to enter a number between 0 & 2');
				return resolve(ask(posx));
			} else {
				resolve(answer);
			}
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

const handleCellDisplay = (str) => (str ? (str === 'X' ? 'X' : 'O') : ' ');

const checkIsWinner = (cells, sign) => {
	const visited = {};

	for (let i = 0; i < cells.length; i++) {
		for (let j = 0; j < cells[0].length; j++) {
			if (!visited.hasOwnProperty(`${i},${j}`)) {
				let counter = 0;
				counter = Math.max(dfsRows(i, j, counter), counter);
				counter = Math.max(dfsCols(i, j, counter), counter);
				if (counter === MIN_VAL_VICTORY) {
					return true;
				}
			}
		}
	}

	function dfsRows(i, j, counter) {
		if (checkIsValid(i, j)) {
			return counter;
		}
		visited[`${i},${j}`] = true;
		counter++;

		counter = Math.max(dfs(i - 1, j, counter), counter);
		counter = Math.max(dfs(i + 1, j, counter), counter);

		return counter;
	}

	const checkIsValid = (i, j) => {
		return (
			i < 0 ||
			i >= GRID_WIDTH ||
			j < 0 ||
			j >= GRID_HEIGHT ||
			cells[i][j] !== sign ||
			visited.hasOwnProperty(`${i},${j}`)
		);
	};

	function dfsCols(i, j, counter) {
		if (checkIsValid(i, j)) {
			return counter;
		}
		visited[`${i},${j}`] = true;
		counter++;

		counter = Math.max(dfs(i, j - 1, counter), counter);
		counter = Math.max(dfs(i, j + 1, counter), counter);
	}

	return false;
};

try {
	main();
} catch (e) {
	console.error(e);
}
