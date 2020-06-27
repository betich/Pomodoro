import React from 'react';
import './App.css';

const Label = (props) => {
  return (
    <div className="panel">
      <h4 className="length-label"><label htmlFor={props.lengthId} id={props.labelId}>{props.label} length</label></h4>
      <div className="inline">
        <button className="icon arrow" id={props.decrementId} onClick={props.onClick} value="-">
          <i className="fas fa-arrow-down"></i>
        </button>
        <div className="length" id={props.lengthId}>{props.lengthNum}</div>
        <button className="icon arrow" id={props.incrementId} onClick={props.onClick} value="+">
          <i className="fas fa-arrow-up"></i>
        </button>
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
    this.changeTimer("sessionTime", e.currentTarget.value, this.state.sessionTime, "Session");
  }

  handleBreak(e) {
    this.changeTimer("breakTime", e.currentTarget.value, this.state.breakTime, "Break");
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
        // Already Started Countdown
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
      this.progress = 0;
      this.timer = null;
      this.beep.pause();
      this.beep.currentTime = 0;
    });
  }

  render() {
    let timerIsOn = this.state.isOn ? <i className="fas fa-pause"></i> : <i className="fas fa-play"></i>;
    return (
      <div>
        <header>
          <h1 id="title">Pomodoro</h1>
          <h1 id="time-left">{this.clockFormat()}</h1>
          <div className="inline">
            <button className="icon" onClick={this.setTimer} id="start_stop">{timerIsOn}</button>
            <button className="icon" onClick={this.reset} id="reset">
              <i className="fas fa-undo"></i>
            </button>
          </div>
        </header>
        <main>
          <div id="timer">
            <div id="progress" ref={(ref) => { this.progress = ref }}></div>
          </div>
          <h2 id="timer-label">{this.state.type}</h2>
          <div id="panel-container">  
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
        </main>
        <audio
          preload="auto" id="beep"
          src="https://www.dl.dropboxusercontent.com/s/rlcsfml0ed9wi3p/beep.mp3"
          ref={(audio) => {
            this.beep = audio;
          }}
        ></audio>
      </div>
    );
  }
}

function App() {
  return (
    <div>
      <Timer />
      <div id="credit">
        <p>by <a href="https://www.github.com/betich" target="_blank">betich</a></p>
      </div>
    </div>
  );
}

export default App;
