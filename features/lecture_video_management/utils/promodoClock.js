const Timer = require("timer-for-pomodoro");

// Create a Timer instance with desired time values
const timer = new Timer(25, 5, 4); // 25 minutes of work, 5 minutes of break, 4 rounds

// Subscribe to timer events
timer.subscribe((currentTime) => {
  // TODO: change the UI here
});

// TODO: implement the clocks

function start_timer() {
  timer.start();
}

function stop_timer() {
  timer.pause();
}

function next_state() {
  timer.next();
}

function reset_timer() {
  timer.stop();
}

function get_time() {}
