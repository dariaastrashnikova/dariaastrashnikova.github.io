class TicTacToe {
    constructor() {
        this.startGameBtn = document.querySelector('.start-game');
        this.startPage = document.getElementById('start-page');
        this.gameContainer = document.getElementById('game-container');
        this.game = document.querySelector(".game");
        this.res = document.querySelector(".res");
        this.btnGame = document.querySelector(".new-game");
        this.playerMode = document.querySelector(".player-mode");
        this.difficulty = document.querySelector(".difficulty");
        this.fields = document.querySelectorAll(".field");
        this.step = false;
        this.cross = new Cross();
        this.circle = new Circle();
        this.initBound = this.init.bind(this);
        this.comb = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        this.startGameBtn.addEventListener('click', () => {
            this.startPage.style.display = 'none';
            this.gameContainer.style.display = 'block';
        });
    }

    init(e) {
		if (e.target.innerHTML === '') {
			if (!this.step) {
				new Cross().stepCross(e.target);
				this.step = !this.step;
				if (!this.win()) {
					if (this.playerMode.value == "vs-ai") {
						this.aiMove();
					}
				}
			} else { 
				if (this.playerMode.value == "vs-player") {
					new Circle().stepZero(e.target);
					this.step = !this.step;
					this.win(); 
				}
			}
		}
	}

    aiMove() {
        const emptyFields = this.getEmptyFields();

        let moveIndex;
        switch (this.difficulty.value) {
            case "easy":
                moveIndex = Math.floor(Math.random() * emptyFields.length);
                break;
            case "medium":
                moveIndex = this.mediumAiMove(emptyFields);
                break;
            case "hard":
                moveIndex = this.hardAiMove(emptyFields);
                break;
            default:
                moveIndex = Math.floor(Math.random() * emptyFields.length);
        }

        if (emptyFields.length > 0) {
            const targetField = this.fields[emptyFields[moveIndex]];
            new Circle().stepZero(targetField);
            this.step = !this.step;
            this.win();
        }
    }

    mediumAiMove(emptyFields) {
        for (const index of emptyFields) {
            const boardCopy = [...this.getBoardState()];
            boardCopy[index] = "o";
            if (this.checkWin(boardCopy, "o")) {
                return emptyFields.indexOf(index);
            }
            boardCopy[index] = "x";
            if (this.checkWin(boardCopy, "x")) {
                return emptyFields.indexOf(index);
            }
        }
        return Math.floor(Math.random() * emptyFields.length);
    }

    hardAiMove(emptyFields) {
        for (const index of emptyFields) {
            const boardCopy = [...this.getBoardState()];
            boardCopy[index] = "o";
            if (this.checkWin(boardCopy, "o")) {
                return emptyFields.indexOf(index);
            }
        }

        for (const index of emptyFields) {
            const boardCopy = [...this.getBoardState()];
            boardCopy[index] = "x";
            if (this.checkWin(boardCopy, "x")) {
                return emptyFields.indexOf(index);
            }
        }

        return Math.floor(Math.random() * emptyFields.length);
    }
	
	getEmptyFields() {
        const emptyFields = [];
        this.fields.forEach((field, index) => {
            if (field.innerHTML === '') {
                emptyFields.push(index);
            }
        });
        return emptyFields;
    }

    getBoardState() {
        const board = [];
        this.fields.forEach((field) => {
            if (field.classList.contains("x")) {
                board.push("x");
            } else if (field.classList.contains("o")) {
                board.push("o");
            } else {
                board.push("");
            }
        });
        return board;
    }

    minimax(newBoard, player, depth, alpha, beta) {
		const availSpots = this.getEmptyFields();
	
		if (this.checkWin(newBoard, "x")) {
			return { score: -10 + depth };
		} else if (this.checkWin(newBoard, "o")) {
			return { score: 10 - depth };
		} else if (availSpots.length === 0) {
			return { score: 0 };
		}
	
		if (player === "o") {
			let bestScore = -Infinity;
			let bestMove = null;
			for (const index of availSpots) {
				newBoard[index] = player;
				const score = this.minimax(newBoard, "x", depth + 1, alpha, beta).score;
				newBoard[index] = '';
				if (score > bestScore) {
					bestScore = score;
					bestMove = index;
				}
				alpha = Math.max(alpha, bestScore);
				if (alpha >= beta) {
					break;
				}
			}
			return { score: bestScore, index: bestMove };
		} else {
			let bestScore = Infinity;
			let bestMove = null;
			for (const index of availSpots) {
				newBoard[index] = player;
				const score = this.minimax(newBoard, "o", depth + 1, alpha, beta).score;
				newBoard[index] = '';
				if (score < bestScore) {
					bestScore = score;
					bestMove = index;
				}
				beta = Math.min(beta, bestScore);
				if (alpha >= beta) {
					break;
				}
			}
			return { score: bestScore, index: bestMove };
		}
	}	

    newGame() {
        this.step = false;
        this.res.innerText = "";
        this.fields.forEach((item) => {
            item.innerHTML = "";
            item.classList.remove("x", "o", "active");
        });
        this.game.addEventListener("click", this.init.bind(this));
        this.game.addEventListener("click", this.initBound);
    }

    win() {
		let gameOver = false;
		for (let i = 0; i < this.comb.length; i++) {
			if (
				this.fields[this.comb[i][0]].classList.contains("x") &&
				this.fields[this.comb[i][1]].classList.contains("x") &&
				this.fields[this.comb[i][2]].classList.contains("x")
			) {
				gameOver = true;
				setTimeout(() => {
					this.fields[this.comb[i][0]].classList.add("active");
					this.fields[this.comb[i][1]].classList.add("active");
					this.fields[this.comb[i][2]].classList.add("active");
					this.res.innerText = "Выиграл X";
				}, 1500);
				this.game.removeEventListener("click", this.initBound);
				break;
			} else if (
				this.fields[this.comb[i][0]].classList.contains("o") &&
				this.fields[this.comb[i][1]].classList.contains("o") &&
				this.fields[this.comb[i][2]].classList.contains("o")
			) {
				gameOver = true;
				setTimeout(() => {
					this.fields[this.comb[i][0]].classList.add("active");
					this.fields[this.comb[i][1]].classList.add("active");
					this.fields[this.comb[i][2]].classList.add("active");
					this.res.innerText = "Выиграл O";
				}, 1500);
				this.game.removeEventListener("click", this.initBound);
				break;
			}
		}
	
		if (!gameOver && this.getEmptyFields().length === 0) {
			this.res.innerText = "Ничья";
			gameOver = true;
		}
	
		return gameOver;
	}

    checkWin(board, player) {
		for (let i = 0; i < this.comb.length; i++) {
			if (
				board[this.comb[i][0]] === player &&
				board[this.comb[i][1]] === player &&
				board[this.comb[i][2]] === player
			) {
				return true;
			}
		}
		return false;
	}

}

class Cross {
    constructor() {
		this.cross = `<svg class="cross">
			<line class="first" x1="15" y1="15" x2="100" y2="100" stroke="red" stroke-width="10" stroke-linecap="round" />
			<line class="second" x1="100" y1="15" x2="15" y2="100" stroke="red" stroke-width="10" stroke-linecap="round" />
		  	</svg>`;

		this.crossAudio = new Audio("audio/cross.mp3");
	}

	stepCross(target) {
		if (target.innerHTML === '') {
			target.innerHTML = this.cross;
			target.classList.add("x");
			this.crossAudio.play();
		}
	}
}

class Circle {
    constructor() {
		this.circle = `<svg class="circle">
			<circle r="45" cx="58" cy="58" stroke="blue" stroke-width="10" fill="none" stroke-linecap="round" />
		</svg>`;

		this.circleAudio = new Audio("audio/zero.mp3");
	}

	stepZero(target) {
		if (target.innerHTML === '') {
			target.innerHTML = this.circle;
			target.classList.add("o");
			this.circleAudio.play();
		}
	}
}

const ticTacToe = new TicTacToe();
ticTacToe.btnGame.addEventListener("click", ticTacToe.newGame.bind(ticTacToe));
ticTacToe.game.addEventListener("click", ticTacToe.initBound);

document.getElementById("player-mode").addEventListener("change", function() {
    const difficultySelect = document.getElementById("difficulty");
    if (this.value === "vs-ai") {
        difficultySelect.style.display = "block";
    } else {
        difficultySelect.style.display = "none";
    }
});
