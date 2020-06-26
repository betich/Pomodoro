import React from 'react';
import './App.css';

const Label = (props) => {
  return (
    <div className="panel">
      <label htmlFor={props.lengthId} id={props.labelId}>{props.label}</label>
      <div className="inline">
        <button id={props.decrementId} onClick={props.onClick} value="-">-</button>
        <div id={props.lengthId}>{props.lengthNum}</div>
        <button id={props.incrementId} onClick={props.onClick} value="+">+</button>
      </div>
    </div>
  );
}

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      time: 25 * 60,
      isOn: false,
      sessionTime: 25,
      breakTime: 5,
      type: "Session"
    }
    this.setTimer = this.setTimer.bind(this);
    this.clockFormat = this.clockFormat.bind(this);
    this.changeTimer = this.changeTimer.bind(this);
    this.handleSession = this.handleSession.bind(this);
    this.handleBreak = this.handleBreak.bind(this);
    this.swapType = this.swapType.bind(this);
    this.reset =  this.reset.bind(this);
  }

  handleSession(e) {
    this.changeTimer("sessionTime", e.target.value, this.state.sessionTime, "Session");
  }

  handleBreak(e) {
    this.changeTimer("breakTime", e.target.value, this.state.breakTime, "Break");
  }

  changeTimer(stateToChange, operator, currentLength, timerType) {
    if (!this.state.isOn) {
      if (this.state.type !== timerType) {
        if (operator === "-" && currentLength !== 1 ) {
          this.setState({ [stateToChange]: currentLength - 1 });
        } else if (operator === "+" && currentLength !== 60) {
          this.setState({ [stateToChange]: currentLength + 1 });
        } 
      } else {
        if (operator === "-" && currentLength !== 1 ) {
          this.setState({
            [stateToChange]: currentLength - 1,
            time: currentLength * 60 - 60
          });
        } else if (operator === "+" && currentLength !== 60) {
          this.setState({
            [stateToChange]: currentLength + 1,
            time: currentLength * 60 + 60
          });
        }
      }
    }
  }

  swapType() {
    if (this.state.type === "Session") {
      this.setState({ 
        type: "Break",
        time: this.state.breakTime * 60
      });
    } else if (this.state.type === "Break") {
      this.setState({ 
        type: "Session",
        time: this.state.sessionTime * 60
      });
    }
  }

  clockFormat() {
    let min = Math.floor(this.state.time / 60);
    let sec = Math.floor(this.state.time - min * 60);
    if (sec < 10) {
      sec = '0' + sec;
    }
    if (min < 10) {
      min = '0' + min;
    }
    return (min + ":" + sec)
  }
  
  setTimer() {
    this.setState({ isOn: !this.state.isOn }, () => {
      if (this.state.isOn) {
        this.timer = setInterval(() => {
          if (this.state.time <= 0) {
            this.setState({ isOn: false }, () => {
              this.beep.play();
              clearInterval(this.timer);
              this.swapType();
              this.setTimer();
            });
          } else { 
            this.setState({ time: this.state.time - 1 }, () => {
              let initialTime = this.state.type === 'Session' ? this.state.sessionTime * 60 : this.state.breakTime * 60;
              this.progress.style.width = 100 - (this.state.time / initialTime * 100) + "%";
            });
          }
        }, 1000);
      } else {
        clearInterval(this.timer);
        this.timer = null;
      }
    })
  }

  reset() {
    this.setState({
      time: 25 * 60,
      isOn: false,
      sessionTime: 25,
      breakTime: 5,
      type: 'Session'
    }, () => {
      clearInterval(this.timer);
      this.timer = null;
      this.beep.pause();
      this.beep.currentTime = 0;
      this.progress.style.width = 0;
    });
  }

  render() {
    let timerIsOn = this.state.isOn ? "Stop" : "Start";
    return (
      <div>
        <h1 id="time-left">{this.clockFormat()}</h1>
        <p id="timer-label">{this.state.type}</p>
        <div id="timer">
          <div id="progress" ref={(ref) => { this.progress = ref }}></div>
        </div>
        <button onClick={this.setTimer} id="start_stop">{timerIsOn}</button>
        <button onClick={this.reset} id="reset">Reset</button>
        <audio
          preload="auto" id="beep"
          src="https://www.dl.dropboxusercontent.com/s/rlcsfml0ed9wi3p/beep.mp3"
          ref={(audio) => {
            this.beep = audio;
          }}
        >
        </audio>
        <Label 
          incrementId="session-increment"
          decrementId="session-decrement"
          lengthId="session-length"
          labelId="session-label"
          lengthNum={this.state.sessionTime}
          label="Session"
          type="session"
          onClick={this.handleSession}
        />
        <Label 
          incrementId="break-increment"
          decrementId="break-decrement"
          lengthId="break-length"
          labelId="break-label"
          lengthNum={this.state.breakTime}
          label="Break"
          type="break"
          onClick={this.handleBreak}
        />
      </div>
    );
  }
}

function App() {
  return (
    <div>
      <h1>Pomodoro</h1>
      <Timer />
    </div>
  );
}

export default App;
