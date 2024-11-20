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
  });
});

function get_time() {
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
    // TODO: change the UI here
    const timerMinuiteElement = document.getElementById("timerMinuite");
    const timerSecondElement = document.getElementById("timerSecond");
    console.log("hello");
    // console.log(currentTime);
    console.log(timerMinuiteElement);
    console.log(timerSecondElement);
    timerMinuiteElement.textContent = currentTime.minutes;
    timerSecondElement.textContent = currentTime.seconds;
  });

  return newTimer;
}

// Subscribe to timer events
timer.subscribe((currentTime) => {
  const timerMinuiteElement = document.getElementById("timerMinuite");
  const timerSecondElement = document.getElementById("timerSecond");
  console.log("hello");
  // console.log(currentTime);
  console.log(timerMinuiteElement);
  console.log(timerSecondElement);
  timerMinuiteElement.textContent = currentTime.minutes;
  timerSecondElement.textContent = currentTime.seconds;
});

function start_timer() {
  timer = get_time();
  timer.start();
  stopState = false;
}

// TODO: change the button to continue when user hit the pause button
// FIXME: the next state is not working
function stop_timer() {
  if (!stopState) {
    stopState = true;
    timer.pause();
  } else {
    stopState = false;
    timer.start();
  }
}

function next_state() {
  timer.next();
}

function reset_timer() {
  timer.stop();
}
