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
	const sign = isX ? 'X' : 'O';
	if (numberOfTurn === GRID_HEIGHT * GRID_WIDTH) {
		//TODO: Vérifier d'abord s'il y a un gagnant
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
		cells[posx][posy] = sign;
		display(cells, !isX);
		if (MIN_VALUE_BEFORE_ALGORITHM <= numberOfTurn) {
			const hasWin = checkIsWinner(cells);
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

const checkIsWinner = (cells) => {
	const visited = {};

	for (let i = 0; i < cells.length; i++) {
		for (let j = 0; j < cells[0].length; j++) {
			if (!visited.hasOwnProperty(`${i},${j}`)) {
				return checkRows(i, j) || checkCols(i, j) || checkDiagonals();
			}
		}
	}

	function checkRows(i, j) {
		const row = cells[i];
		const sign = cells[i][j];
		let isWinner = true;
		for (const el of row) {
			if (el !== sign) {
				isWinner = false;
				break;
			}
		}
		return isWinner;
	}

	function checkCols() {
		const cols = [];
		for (let i = 0; i < GRID_WIDTH; i++) {
			const col = [];
			for (let j = 0; j < GRID_HEIGHT; j++) {
				col.push(cells[j][i]);
			}
			cols.push(col);
		}

		for (const col of cols) {
			let isWinner = true;
			const sign = col[0];
			if (!sign) {
				continue;
			}
			for (const el of col) {
				if (el !== sign) {
					isWinner = false;
					break;
				}
			}
			if (isWinner) {
				return true;
			}
		}

		return false;
	}

	function checkDiagonals() {
		const left = [],
			right = [];
		for (let i = 0; i < GRID_WIDTH; i++) {
			left.push(cells[i][i]);
			right.push(cells[i][GRID_WIDTH - 1 - i]);
		}

		let sign = left[0];
		if (sign) {
			let isWinner = true;
			for (const el of left) {
				if (el !== sign) {
					isWinner = false;
					break;
				}
			}
			if (isWinner) {
				return true;
			}
		}

		sign = right[0];
		if (sign) {
			let isWinner = true;
			for (const el of right) {
				if (el !== sign) {
					isWinner = false;
					break;
				}
			}
			if (isWinner) {
				return true;
			}
		}
		return false;
	}

	return false;
};

try {
	main();
} catch (e) {
	console.error(e);
}
