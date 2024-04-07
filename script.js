//global variables
const options = {
	shakeSoundEnabled: {
		element: document.getElementById("switchShakingAudio"),
		value: true,
		update: (option) => (option.value = option.element.checked),
	},
	timerSoundEnabled: {
		element: document.getElementById("switchTimerAudio"),
		value: true,
		update: (option) => (option.value = option.element.checked),
	},
	darkModeEnabled: {
		element: document.getElementById("switchDarkMode"),
		value: false,
	},
	gridShakeEnabled: {
		element: document.getElementById("switchGridShake"),
		value: true,
		update: (option) => {
			if (option.element.checked) {
				option.value = true;
				options.shakeSoundEnabled.element.disabled = false;
				options.shakeSoundEnabled.element.checked =
					options.shakeSoundEnabled.value;
			} else {
				option.value = false;
				options.shakeSoundEnabled.element.checked = false;
				options.shakeSoundEnabled.element.disabled = true;
			}
		},
	},
	timerDisplayEnabled: {
		element: document.getElementById("switchTimerDisplay"),
		value: true,
	},
};

let timerInterval;
const wordCheckerResults = document.querySelector('#word-checker-results')

function startTimer() {
	var display = document.querySelector("#time");
	var timer = 60 * 4,
		minutes,
		seconds;
	timerInterval = setInterval(function () {
		// runs function every 1000ms to change timer display
		minutes = parseInt(timer / 60, 10);
		seconds = parseInt(timer % 60, 10);

		minutes = minutes < 10 ? "0" + minutes : minutes;
		seconds = seconds < 10 ? "0" + seconds : seconds;

		display.textContent = minutes + ":" + seconds;

		if (--timer < 0) {
			//Stop after timer reaches 0
			clearInterval(timerInterval);
			if (options.timerSoundEnabled.value) {
				playTimerSound();
			}
			changeButton();
		}
	}, 1000);
}

function roll() {
	//Chooses a random letter from each die array
	var dice = [
		["A", "A", "A", "F", "R", "S"],
		["A", "A", "E", "E", "E", "E"],
		["A", "A", "E", "E", "O", "O"],
		["A", "A", "F", "I", "R", "S"],
		["A", "B", "D", "E", "I", "O"],
		["A", "D", "E", "N", "N", "N"],
		["A", "E", "E", "E", "E", "M"],
		["A", "E", "E", "G", "M", "U"],
		["A", "E", "G", "M", "N", "N"],
		["A", "E", "I", "L", "M", "N"],
		["A", "E", "I", "N", "O", "U"],
		["A", "F", "I", "R", "S", "Y"],
		["B", "B", "J", "K", "X", "Z"],
		["C", "C", "E", "N", "S", "T"],
		["C", "D", "D", "L", "N", "N"],
		["C", "E", "I", "I", "T", "T"],
		["C", "E", "I", "P", "S", "T"],
		["C", "F", "G", "N", "U", "Y"],
		["D", "D", "H", "N", "O", "T"],
		["D", "H", "H", "L", "O", "R"],
		["D", "H", "H", "N", "O", "W"],
		["D", "H", "L", "N", "O", "R"],
		["E", "H", "I", "L", "R", "S"],
		["E", "I", "I", "L", "S", "T"],
		["E", "I", "L", "P", "S", "T"],
		["E", "M", "T", "T", "T", "O"],
		["E", "N", "S", "S", "S", "U"],
		["G", "O", "R", "R", "V", "W"],
		["H", "I", "R", "S", "T", "V"],
		["H", "O", "P", "R", "S", "T"],
		["I", "P", "R", "S", "Y", "Y"],
		["N", "O", "O", "T", "U", "W"],
		["O", "O", "O", "T", "T", "U"],
		["J", "K", "Qu", "W", "X", "Z"],
		["An", "Er", "He", "In", "Qu", "Th"],
		["E", "I", "O", "?", "?", "?"],
	];

	var letters = [];

	for (var die of dice) {
		var index = Math.floor(Math.random() * 6);
		var letter = die[index];
		letters.push(letter);
	}

	return letters;
}

function shuffle(array) {
	//Shuffles order of selected letters from dice
	let currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex > 0) {
		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}
}

function place(letters) {
	//Changes text of tiles in order of shuffled letters array
	for (var i = 0; i < 36; i++) {
		var id = "tile" + i;
		document.getElementById(id).textContent = letters[i];
	}
}

function newGrid() {
	const letters = roll();
	shuffle(letters);
	place(letters);
}

function fullScreen() {
	//Makes grid full screen on button press
	var grid = document.getElementById("gridholder");
	grid.requestFullscreen();
}

function playShakeSound() {
	//Dice shaking noise
	const shakeSound = new Audio("Dice.mp3");
	shakeSound.play();
}

function playTimerSound() {
	//Time's up noise
	const timerSound = new Audio("Timer.mp3");
	timerSound.play();
}

function play() {
	if (options.shakeSoundEnabled.value && options.gridShakeEnabled.value) {
		//prevents shake sound from playing if grid shaking is off
		playShakeSound();
	}
	showGridShake();
	changeButton();
	startTimer();
}

function showGridShake() {
	// Shuffles grid while sound plays
	if (options.gridShakeEnabled.value) {
		var id = window.setInterval(newGrid, 200);
		window.setTimeout(function () {
			window.clearInterval(id);
		}, 1800);
	}
	newGrid();
}

function stopGame() {
	clearTimer();
	clearGrid();
	changeButton();
}

function clearTimer() {
	clearInterval(timerInterval);
	document.querySelector("#time").textContent = "04:00";
}

function clearGrid() {
	for (var i = 0; i < 36; i++) {
		var id = "tile" + i;
		document.getElementById(id).textContent = "";
	}
}

function changeButton() {
	// Change "Play!" button to say "Stop" while timer is running, and reset to "Play!" after timer ends
	var playBtn = document.getElementById("play");
	if (playBtn.innerText == "Play!") {
		playBtn.innerText = "Stop";
		playBtn.onclick = stopGame;
	} else if (playBtn.innerText == "Stop") {
		playBtn.innerText = "Play!";
		playBtn.onclick = play;
	}
}

function checkWord() {
  clearDefinitions()
	var inputWord = document.getElementById("inputWord");
	var word = inputWord.value;
	if (!word.match("[a-zA-Z]{4,}")) {
		// disallow words < 4 chars, spaces, apostrophes, and foreign characters
		var resultText = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
		<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
		<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
	  </svg> ${word} is not a valid word.`;
		var resultColor = "red";
		var element = document.getElementById("resultText");
		element.innerHTML = resultText;
		element.style.color = resultColor;
	} else {
		callAPI(word);
	}
	clearWord();
}

function callAPI(word) {
	var apiURLstem = "https://api.dictionaryapi.dev/api/v2/entries/en/";
	var apiURL = apiURLstem + word;

	var response = fetch(apiURL, {
		method: "GET",
	}).then(async function (response) {
		if (response.status == 200) {
			var resultText = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
			<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
			<path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
		  </svg> ${word} is a valid word.`;
			var resultColor = "green";
			const json = await response.json()
			const meanings = json.flatMap(entry => entry.meanings)
			const renderedMeanings = meanings.map(renderMeaning)
			wordCheckerResults.append(...renderedMeanings)
		} else if (response.status == 404) {
			var resultText = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
			<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
			<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
		  </svg> ${word} is not a valid word.`;
			var resultColor = "red";
		} else {
			var resultText = `We encountered an error. Please try again`;
			var resultColor = "red";
		}
		var element = document.getElementById("resultText");
		element.innerHTML = resultText;
		element.style.color = resultColor;
	});
}

function clearWord() {
	var inputWord = document.getElementById("inputWord");
	inputWord.value = "";
}

function clearWordChecker() {
  clearDefinitions()
	clearWord();
	var resultText = document.getElementById("resultText");
	resultText.innerHTML = "";
}

function modalListener() {
	const modal = document.getElementById("wordCheckerModal");
	modal.addEventListener("hide.bs.modal", (event) => clearWordChecker());
	modal.addEventListener("shown.bs.modal", (event) => onWordCheckerLoad());
}

function addListeners() {
	modalListener();
	switchListeners();
}

function switchListeners() {
	Object.values(options).forEach((option) => {
		option.element.addEventListener("change", () => {
			option.update(option);
		});
	});
}

function onWordCheckerLoad() {
	var input = document.getElementById("inputWord");
	selectInput(input);
	wordCheckerListener(input);
}

function selectInput(input) {
	input.focus();
	input.select();
}

function wordCheckerListener(input) {
	//runs word checker on enter keypress
	input.addEventListener("keypress", function (event) {
		if (event.key === "Enter") {
			event.preventDefault();
			document.getElementById("btnCheckWord").click();
		}
	});
}

const meaningTemplate = document.querySelector('#definition-template')
const renderMeaning = (meaning) => {
	const { partOfSpeech, definitions } = meaning

	const view = meaningTemplate.content.cloneNode(true);
	const partOfSpeechEl = view.querySelector('.part-of-speech')
	const definitionsEl = view.querySelector('.definitions')
	partOfSpeechEl.innerText = partOfSpeech
	definitions.forEach(definition => {
		const definitionEl = document.createElement('li')
		definitionEl.innerText = definition.definition
		definitionsEl.append(definitionEl)
	})
	
	return view
}

const clearDefinitions = () => {
  while (wordCheckerResults.lastElementChild) {
    wordCheckerResults.removeChild(wordCheckerResults.lastElementChild);
  }
}

