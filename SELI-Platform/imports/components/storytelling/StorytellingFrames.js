import React from 'react';

export default class StorytellingFrames extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  getFullName = (time) => {
    Meteor.call("GetUserById", this.props.user, (error, response) =>  {
      if (response) {
        this.setState({fullName: response[0].profile.fullname}, () => {
          this.setTimer(time);
        })
      }
  });
  }

  setTimer = (seconds) => {
    if (this.props.playing) {
      this.setState({seconds,}, () => {this.timer()});
    } else {
      clearInterval(this.myInterval);
    }
  }

  timer = () => {
    this.myInterval = setInterval(() => {
      this.setState({
        seconds: this.state.seconds - 1
      }, () => {
        if (this.state.seconds === 0) {
          clearInterval(this.myInterval)
          if (this.props.intervalFrame === "start") {
            this.props.handleFrame("scenes");
          } else if (this.props.intervalFrame === "end"){
            this.props.handleFrame("none");
          }
        } 
      });
    }, 1000)
  }

  testFrame = () => {
    if (this.props.intervalFrame === "start") {
      this.getFullName(3);
    } else if (this.props.intervalFrame === "end"){
      this.getFullName(4);
    }
  }

  componentDidMount() {
    this.testFrame();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.intervalFrame !== this.props.intervalFrame || prevProps.playing !== this.props.playing) {
      this.testFrame();
    }
  }

  componentWillUnmount() {
    clearInterval(this.myInterval)
  }

  render() {
    return(
      <div>
        {
          this.props.intervalFrame === "start" ?
            <div className="storytelling-player-frame-container">
              <div>
                <div className="storytelling-player-title">{this.props.name}</div>
                <div className="storytelling-player-full-name">{this.state.fullName ? `${this.props.language.author}: ${this.state.fullName}` : undefined}</div>
              </div>
            </div>
          : undefined
        }
        {
          this.props.intervalFrame === "end" ?
            <div className="storytelling-player-frame-container">
              <div>
                <div 
                  className="storytelling-player-end-image"
                  style={{backgroundImage: "url(seli-logo.png)"}}
                />
                <div className="storytelling-player-end-title">{this.props.language.seliLearningPlatform}</div>
                <div className="storytelling-player-end-subtitle">{this.props.name}</div>
                <div className="storytelling-player-end-footer">
                  <div>
                    <div className="storytelling-player-end-tutor">{`${this.props.language.author} / ${this.props.language.tutor}:`}</div>
                    <div className="storytelling-player-end-tutor">{this.state.fullName ? this.state.fullName : undefined}</div>
                    <div className="storytelling-player-end-tutor">{this.props.language.seliProject}</div>
                  </div>
                  <div 
                    className="storytelling-player-end-copyright"
                    style={{backgroundImage: "url(cc.png)"}}
                  />
                </div>
              </div>
            </div>
          : undefined
        }
      </div>
    )
  }
}