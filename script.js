//global variables
var continueTimer = true;
var shakeSoundEnabled = { val: true };
var timerSoundEnabled = { val: true };
var gridShakeEnabled = { val: true };
var darkModeEnabled = { val: false };

function startTimer() {
	var display = document.querySelector("#time");
	var timer = 60 * 4,
		minutes,
		seconds;
	var timerInterval = setInterval(function () {
		if (!continueTimer) {
			//stops timer if stop button has been pressed
			display.textContent = "04:00";
			clearInterval(timerInterval);
			return;
		}
		// runs function every 1000ms to change timer display
		minutes = parseInt(timer / 60, 10);
		seconds = parseInt(timer % 60, 10);

		minutes = minutes < 10 ? "0" + minutes : minutes;
		seconds = seconds < 10 ? "0" + seconds : seconds;

		display.textContent = minutes + ":" + seconds;

		if (--timer < 0) {
			//Stop after timer reaches 0
			clearInterval(timerInterval);
			if (timerSoundEnabled.val) {
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
	continueTimer = true;
	if (shakeSoundEnabled.val && gridShakeEnabled.val) {
		//prevents shake sound from playing if grid shaking is off
		playShakeSound();
	}
	showGridShake();
	changeButton();
	startTimer();
}

function showGridShake() {
	// Shuffles grid while sound plays
	if (gridShakeEnabled.val) {
		var id = window.setInterval(newGrid, 200);
		window.setTimeout(function () {
			window.clearInterval(id);
		}, 1800);
	}
	newGrid();
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

function stopGame() {
	//clear timer
	continueTimer = false;
	document.querySelector("#time").textContent = "04:00";

	//clear grid
	for (var i = 0; i < 36; i++) {
		var id = "tile" + i;
		document.getElementById(id).textContent = "";
	}

	//change button back
	changeButton();
}

function checkWord() {
	var inputWord = document.getElementById("inputWord");
	var word = inputWord.value;
	if (word.length < 4) {
		var resultText = "Word must be at least 4 characters.";
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
	}).then(function (response, word) {
		var word = word;
		if (response.status == 200) {
			var resultText = `Word is a valid word.`;
			var resultColor = "green";
		} else if (response.status == 404) {
			var resultText = `Word is not a valid word.`;
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
	clearWord();
	var resultText = document.getElementById("resultText");
	resultText.innerHTML = "";
}

function modalListener() {
	const modal = document.getElementById("wordCheckerModal");
	modal.addEventListener("hide.bs.modal", (event) => clearWordChecker());
}

function addListeners() {
	modalListener();
	switchListeners();
	gridShakeSwitchListener();
}

function switchListeners() {
	const switchIDs = [
		"switchShakingAudio",
		"switchTimerAudio",
		"switchDarkMode",
	];

	for (let i = 0; i < switchIDs.length; i++) {
		let switchElement = document.getElementById(switchIDs[i]);
		switchElement.addEventListener("change", (event) =>
			changeVars(i, switchElement)
		);
	}
}

function changeVars(i, switchElement) {
	var variables = [shakeSoundEnabled, timerSoundEnabled, darkModeEnabled];
	variables[i].val = switchElement.checked;
}

function gridShakeSwitchListener() {
	let switchElement = document.getElementById("switchGridShake");
	switchElement.addEventListener("change", (event) =>
		changeGridVars(switchElement)
	);
}
function changeGridVars(switchElement) {
	var switchShakingAudio = document.getElementById("switchShakingAudio");
	if (switchElement.checked) {
		gridShakeEnabled.val = true;
		switchShakingAudio.disabled = false;
		switchShakingAudio.checked = shakeSoundEnabled.val;
	} else {
		gridShakeEnabled.val = false;
		switchShakingAudio.checked = false;
		switchShakingAudio.disabled = true;
	}
}
