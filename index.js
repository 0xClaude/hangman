//
// Starting constants
//

// Which words can be used?
const words = [
  "danger",
  "ideology",
  "extreme",
  "outlet",
  "inquiry",
  "smart",
  "sunrise",
  "include",
  "revolution",
  "contribution",
  "memorandum",
  "tradition",
  "colleague",
  "book",
  "progress",
  "strain",
  "happen",
  "climb",
  "finish",
  "rank",
];

// define all the letters in alphabet
const letters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

// how many guesses will we allow?
const maxGuesses = 9;

//
// Variables needed for the gameplay
//

// what word are we looking for?
var secretWord = "";

// The hidden Word displayed on the screen
var hiddenWord = [];

// how often can we fuck up?
// initializing it for the start
var wrongCounter = maxGuesses;

// what letters have we tried already?
// we keep track of this in an array
var guesses = [];

// how many letters have we guessed already?
var guessedLetters = 0;

// How many letters does the secret word have?
// we reset this when we look for a new word
var wordLength = 0;

//
// Game related functions
//
// Buttons controls
//

// enable buttons again if game is (re)started
function enableButtons() {
  for (let x in letters) {
    document.querySelector("#" + letters[x].toLowerCase()).disabled = false;
  }
}

// disable the button once it has been used
function disableButton(letter) {
  document.getElementById(letter.toLowerCase()).disabled = true;
  return;
}

// disable all buttons when game is lost
function disableAllButtons() {
  for (let x in letters) {
    disableButton(letters[x].toLowerCase());
  }
}

//
// Word control
//
// get a random word from the list
function getWord() {
  let newWord =
    words[
      Math.ceil(Math.random(words.length) * words.length) - 1
    ].toUpperCase();
  // define the global variable
  wordLength = newWord.length;
  console.log(newWord);
  return newWord;
}

// replace the word with underlines
function replaceWord(word) {
  for (let i = 0; i < word.length; i++) {
    hiddenWord.push("_");
  }
}

//
// EventListeners
//

// Event Listeners for buttons
function checkClick() {
  let buttons = document.querySelectorAll(".letter");
  for (let i = 0; i < buttons.length; i++) {
    let id = buttons[i].id;
    // checking if the letter is in the secret word,
    // then disabling the button
    document.getElementById(id).addEventListener("click", () => {
      checkLetter(id.toUpperCase(), secretWord);
      disableButton(id);
    });
  }
}

// Event Listeners for keydowns
document.addEventListener("keydown", (e) => {
  let keycode = e.code[e.code.length - 1];
  if (letters.includes(keycode) && wrongCounter > 0) {
    checkLetter(keycode.toUpperCase(), secretWord);
    disableButton(keycode);
  }
});

// "New Word!" Button functionality
// Enable all the letter-buttons and start a new game
// this works whether there is a game running, the user lost
document.querySelector("#newword").addEventListener("click", () => {
  enableButtons();
  startGame();
});

//
// HTML formatting
//

// Update the hidden word
function updateWord() {
  let display = "";
  for (let i = 0; i < hiddenWord.length; i++) {
    display = display + hiddenWord[i] + " ";
  }
  document.querySelector(".guesser").innerHTML = display;
  if (guessedLetters === wordLength) {
    wonGame();
  }
}

// remove the red warning
function removeWarning() {
  document.querySelector(".warnings").innerHTML = "";
}

// remove the red guessings
function removeGuessings() {
  document.querySelector(".guesses").innerHTML = "";
}

// display the remaining guesses
function remainingGuesses(number) {
  document.querySelector(".guesses").innerHTML =
    "You have " + number + " guesses remaining.";
}

//
// Game mechanics
//

// check if the letter is in the word
function checkLetter(letter, word) {
  // Checking if we already tried the letter;
  if (guesses.includes(letter)) {
    document.querySelector(".warnings").innerHTML =
      'You already tried "' + letter.toUpperCase() + '"';
    // remove the warning after 1s
    setTimeout(removeWarning, 1000);
  } else {
    // add the letter to the guessed list
    guesses.push(letter);
    // check if the letter is in the word
    if (word.includes(letter)) {
      replaceLetter(letter);
    } else {
      wrongCounter -= 1;
      // Update the HTML so it shows how many guesses there are left
      remainingGuesses(wrongCounter);
      // If we have no guesses left, the game is lost.
      if (wrongCounter < 1) {
        lostGame();
      }
    }
  }
}

// check if the letter is in the word,
// and if so, replace the _ with the letter
function replaceLetter(letter) {
  for (let i = 0; i < secretWord.length; i++) {
    if (secretWord[i] === letter) {
      hiddenWord[i] = letter;
      guessedLetters += 1;
    }
  }
  updateWord();
}

// reveal the word if the user has lost
function revealword() {
  let reveal = "";
  for (let i = 0; i < secretWord.length; i++) {
    if (hiddenWord[i] === "_") {
      reveal = reveal + '<span class="notguessed">' + secretWord[i] + "</span>";
    } else {
      reveal = reveal + secretWord[i];
    }
  }
  document.querySelector(".guesser").innerHTML = reveal;
}

//
// Game flow control
//

// start a new game
function startGame() {
  // reinitialize the game variables
  hiddenWord = [];
  guesses = [];
  wrongCounter = maxGuesses;
  secretWord = getWord();
  guessedLetters = 0;

  // add EventListeners to the buttons
  checkClick();

  // hide the word you're looking for
  replaceWord(secretWord);
  updateWord();

  document.querySelector("h1").innerHTML = "Hangman";
  document.querySelector(".explainer").innerHTML =
    "Use the alphabet below or the keyboard to guess the word";
}

// You lost the game
function lostGame() {
  // Change text on the page
  document.querySelector("h1").innerHTML = "You Lost";
  document.querySelector(".explainer").innerHTML =
    "Tap the button to start a new game";
  document.querySelector("#newword").innerHTML = "Try again!";

  // reveal the word
  revealword();

  // calling reset functions
  removeWarning();
  disableAllButtons();
  removeGuessings();
}

// You won the game
function wonGame() {
  // Change text on the page
  document.querySelector("h1").innerHTML = "You Won";
  document.querySelector(".explainer").innerHTML =
    "Tap the button to start a new game";
  document.querySelector("#newword").innerHTML = "Play again";

  // calling reset functions
  removeWarning();
  disableAllButtons();
  removeGuessings();
}

//
// Browser is starting
//
// initialize game once the browser starts
startGame();
