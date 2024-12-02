const Timer = require("timer-for-pomodoro");

// Create a Timer instance with desired time values
let timer = new Timer(25, 5, 4); // 25 minutes of work, 5 minutes of break, 4 rounds
let stopState = true;

// set up input validation
const inputs = document.querySelectorAll(".time-character");

inputs.forEach((input) => {
  input.addEventListener("input", function (e) {
    // Remove non-numeric characters and limit to 2 digits
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 2);
    // stop the timer when user input something
    timer.stop();
  });
});

function beautifulTimeCharacter(timeCharacter) {
  if (parseInt(timeCharacter) < 10) {
    return `0${timeCharacter}`;
  }

  return timeCharacter;
}

// TODO: implement the round count too !
// when the round count is over, stop the timer and congrast the user ( using different overlay and force them to turn of the learning )

function getTime() {
  const workMinuiteElement = document.getElementById("workMinutes");
  const restMinuiteElement = document.getElementById("restMinutes");
  const roundsElement = document.getElementById("rounds");

  const DEFAULT_WORK_MINUTES = 25;
  const DEFAULT_REST_MINUTES = 5;
  const DEFAULT_ROUNDS = 4;

  const workMinutes =
    workMinuiteElement.value == ""
      ? DEFAULT_WORK_MINUTES
      : workMinuiteElement.value;
  const restMinutes =
    restMinuiteElement.value == ""
      ? DEFAULT_REST_MINUTES
      : restMinuiteElement.value;
  const rounds =
    roundsElement.value == "" ? DEFAULT_ROUNDS : roundsElement.value;

  const newTimer = new Timer(workMinutes, restMinutes, rounds);

  // Subscribe to timer events
  newTimer.subscribe((currentTime) => {
    if (currentTime.status === "work") {
      workSubscribe(currentTime);
    } else if (currentTime.status === "break") {
      restSubscribe(currentTime);
    }
  });

  return newTimer;
}

// FIXME: the video start or video stop SHOULD NOT BE IN THE  SUBSCRIBE FUNCTIONS!
//we should trigger start or stop video in the changing function !

let oneTimePause = false;

function workSubscribe(currentTime) {
  const timerMinuteElement = document.getElementById("timerMinute");
  const timerSecondElement = document.getElementById("timerSecond");
  timerMinuteElement.textContent = beautifulTimeCharacter(currentTime.minutes);
  timerSecondElement.textContent = beautifulTimeCharacter(currentTime.seconds);

  const overlayElement = document.getElementById("fullScreenOverlay");
  // Hide the overlay
  overlayElement.classList.remove("show");

  // start the playing video once !
  // we have to have this variable to avoid the video start when the user click pause
  // this code make sure that the video only start once !
  if (oneTimePause) {
    oneTimePause = false;
    const videoElement = document.getElementById("mainVideo");
    videoElement.play();
  }
}

function restSubscribe(currentTime) {
  const timerMinuteElement = document.getElementById("restTimerMinute");
  const timerSecondElement = document.getElementById("restTimerSecond");

  timerMinuteElement.textContent = beautifulTimeCharacter(currentTime.minutes);
  timerSecondElement.textContent = beautifulTimeCharacter(currentTime.seconds); //currentTime.seconds;

  const overlayElement = document.getElementById("fullScreenOverlay");

  // Show the overlay
  overlayElement.classList.add("show");

  // stop the playing video
  const videoElement = document.getElementById("mainVideo");
  videoElement.pause();
  oneTimePause = true; // reset the one time pause variable for later workSubscribe
  // TODO: implement music player here !
}

function startTimer() {
  // stop the current running timer
  timer.stop();
  timer = getTime();
  timer.start();
  stopState = false;
}

function stopTimer() {
  if (!stopState) {
    stopState = true;
    timer.pause();
  } else {
    stopState = false;
    timer.start();
  }
}

function nextState() {
  timer.next();
}

function resetTimer() {
  timer.stop();
}
