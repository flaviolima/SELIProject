import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import ScaleLoader from 'react-spinners/ScaleLoader';

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import SubtitlesIcon from '@material-ui/icons/Subtitles';

import Slide from '@material-ui/core/Slide';
import ReactPlayer from 'react-player';
import AudioPlayer from 'react-h5-audio-player';
import Fullscreen from "react-full-screen";

import TextAlternatives from '../accessibility/alternative/TextAlternatives';

const HIDE_TIME = 4000;

export default class MediaPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showControls: false,
      media: this.props.media,
      playing: false,
      fullScreen: false,
      muted: false,
      started: false,
      playedSeconds: 0,
      volume: 0.8,
      timeLabel: "00:00",
      captions: [],
      hasA11y: false,
      disableCaptions: true,
    }
  }

  componentDidMount = () => {
    if (this.props.media.attributes.accessibility.dataField) {
      this.setState({hasA11y: true})
      if(this.props.media.attributes.accessibility.dataField.fileTranscription && this.props.media.attributes.accessibility.dataField.fileTranscription.length>0){
        var caption = [{kind: 'subtitles', src: this.props.media.attributes.accessibility.dataField.fileTranscription[0].link, default: true}];
        this.setState({
          disableCaptions: false,
          captions: caption,
          tracks: caption
        })
      }
    }
  }

  handleInactivity() {
    this.setState({
      showControls: true,
    });
    setTimeout(() => {
      this.setState({
        showControls: false,
      });
    }, HIDE_TIME);
  }

  handlePlayPause = () => {
    this.setState({ playing: !this.state.playing })
  }

  handleToggleFullscreen = () => {
    this.setState({ fullScreen: !this.state.fullScreen });
  }

  handleToggleMute = () => {
    this.setState({ muted: !this.state.muted });
  }

  handleBuffer = () => {
    this.setState({
      isBuffering: true,
    })
  }

  handleBufferEnd = () => {
    this.setState({
      isBuffering: false,
    })
  }

  handleProgress = state => {
    this.toTimeLabel(state.playedSeconds);
    this.setState({
      playedSeconds: state.playedSeconds,
    })
    // We only want to update time slider if we are not currently seeking
    if (!this.state.seeking) {
      this.setState(state)
    }
  }

  handleStart = () => {
    this.setState({
      started: true,
      playing: true,
    })
  }

  handleSeekChange = (e, newValue) => {
    var newFloatValue = parseFloat(newValue);
    this.toTimeLabel(newValue);
    this.setState({ playedSeconds: newFloatValue })
    this.player.seekTo(newFloatValue);
    this.handleSeekChangeA11y(newFloatValue);
  }

  handleSeekChangeA11y = (value) => {
    if (this.props.media.attributes.accessibility.dataField && this.props.media.attributes.accessibility.dataField.signLanguage==="no" && this.props.media.attributes.accessibility.dataField.fileVideoSignal[0]!=null){
      var videoTime = value;
      var videoSignTime = this.refs.videoSign.getDuration();
      if (videoTime > videoSignTime) {
        this.refs.videoSign.seekTo(videoSignTime, 'seconds');
      } else {
        this.refs.videoSign.seekTo(videoTime, 'seconds');
      }
    }
  }

  handleVolumeChange = (e, newValue) => {
    this.setState({
      volume: parseFloat(newValue)
    }, () => {
      this.state.volume === 0 ? this.setState({muted: true}) : this.setState({muted: false})
    });
  }

  handleDuration = (duration) => {
    this.setState({ duration })
  }

  ref = player => {
    this.player = player
  }

  toTimeLabel = (playedSeconds) => {
    let dateObj = new Date(playedSeconds * 1000);
    let hours = dateObj.getUTCHours();
    let minutes = dateObj.getUTCMinutes();
    let seconds = dateObj.getSeconds();

    let timeLabel = minutes.toString().padStart(2, '0') + ':' +
    seconds.toString().padStart(2, '0');
    this.setState({
      timeLabel: timeLabel,
    });
  }

  a11yContent = () => {
    return (
      <div className={!this.state.fullScreen && "media-a11y-container"}>
        {
          this.props.media.type === 'video' && this.props.media.attributes.accessibility.dataField.signLanguage==="no" && this.props.media.attributes.accessibility.dataField.fileVideoSignal[0]!=null?
            <div className={!this.state.fullScreen && "AudioPlayer"}>
              {
                !this.state.fullScreen &&
                <Typography className="course-item-card-subtitle" variant="subtitle1" style={{color: "white"}}>
                  {`${this.props.language.signLanguage}:`}
                </Typography>
              }
              <Paper
                square
                elevation={15}
                className={!this.state.fullScreen ? "media-player-a11y-container" : "media-player-a11y-container-fullscreen"}
              >
                <ReactPlayer
                  ref="videoSign"
                  className="media-player-a11y-video"
                  id="video-sign-language"
                  controls={false}
                  playing={this.state.playing && this.state.started}
                  url={this.props.media.attributes.accessibility.dataField.fileVideoSignal[0].link}
                  volume={0}
                />
              </Paper>
            </div>
          :
            undefined   
        }
        {
          !this.state.fullScreen && this.props.media.type === 'video' && this.props.media.attributes.accessibility.dataField!=undefined && this.props.media.attributes.accessibility.dataField.fileAudioDescription[0]!=null ?
            <div className="AudioPlayer">
              <Typography className="course-item-card-subtitle" variant="subtitle1" style={{color: "white"}}>
                {`${this.props.language.audioDescription}:`}
              </Typography>
              <AudioPlayer volume src={this.props.media.attributes.accessibility.dataField.fileAudioDescription[0].link}/>
            </div>
          :      
            undefined
        }
        {
          !this.state.fullScreen &&
          <TextAlternatives
            fromMediaPlayer
            item={this.props.media}
            language={this.props.language}
          ></TextAlternatives>
        }
      </div>
    )
  }

  handleChange = () => {
    if (this.state.captions.length) {
      this.setState({captions: []});
    } else {
      this.setState({captions: this.state.tracks});
    }
    if (this.state.playing) {
      this.handlePlayPause();
    }
  }

  render() {
    return(
      <div style={{width: '100%'}}>
        {
          this.props.media.type === 'video' ?
            <Fullscreen
              enabled={this.state.fullScreen}
              onChange={fullScreen => this.setState({fullScreen})}
            >
              <div
                className={this.state.fullScreen ? "media-player-container-full" : "media-player-container"}
              >
                <div className="fullscreen-media-container">
                  <ReactPlayer
                    onMouseMove={!this.state.showControls ? () => this.handleInactivity() : undefined}
                    ref={this.ref}
                    url={this.state.media.attributes.video.link}
                    className={this.state.hasA11y && !this.state.fullScreen ? "video-media-player-a11y" : "video-media-player"}
                    controls={false}
                    playing={this.state.playing}
                    onProgress={this.handleProgress}
                    muted={this.state.muted}
                    volume={this.state.volume}
                    onSeek={e => this.handleSeek}
                    onDuration={this.handleDuration}
                    onStart={this.handleStart}
                    onBuffer={this.handleBuffer}
                    onBufferEnd={this.handleBufferEnd}
                    config={{file: {
                      /* attributes: {
                        crossOrigin: 'true'
                      }, */
                      tracks: this.state.captions
                    }}}
                  />
                  {this.state.hasA11y && this.a11yContent()}
                </div>
                <Slide direction="left" in={this.state.showControls} mountOnEnter unmountOnExit timeout={{enter: 0, exit: 0}}>
                  <Paper
                    square
                    elevation={15}
                    className={this.state.fullScreen || !this.state.hasA11y ? "media-player-controllers-container" : "media-player-controllers-container-a11y"}
                  >
                    <IconButton onClick={this.handlePlayPause} className="media-player-icon-button">
                      {
                        !this.state.playing ?
                          <PlayArrowIcon className="media-player-icon"/>
                        :
                        <PauseIcon className="media-player-icon"/>
                      }
                    </IconButton>
                    <Typography className="media-player-medium-label" variant="overline" display="block" gutterBottom>
                      {this.state.timeLabel}
                    </Typography>
                    <Slider
                      step={1 / (this.state.duration)}
                      min={0}
                      max={this.state.duration}
                      valueLabelDisplay="off"
                      value={this.state.playedSeconds}
                      color="secondary"
                      onChange={(event, newValue) => this.handleSeekChange(event, newValue)}
                      className="media-player-slider"
                    />
                    <IconButton
                      onClick={this.handleToggleMute}
                      className="media-player-icon-button"
                    >
                      {
                        !this.state.muted && this.state.volume !== 0 ?
                          <VolumeUpIcon className="media-player-icon"/>
                        :
                        <VolumeOffIcon className="media-player-icon"/>
                      }
                    </IconButton>
                    <Slider
                      step={0.1}
                      min={0}
                      max={1}
                      value={this.state.volume}
                      onChange={(event, newValue) => this.handleVolumeChange(event, newValue)}
                      color="secondary"
                      valueLabelDisplay="auto"
                      className="media-player-slider-small"
                    />
                    <IconButton 
                      disabled={this.state.disableCaptions} 
                      onClick={() => this.handleChange()} 
                      className={this.state.captions && this.state.captions.length ? "media-player-icon-button" : "media-player-icon-button-des" }
                    >
                      <SubtitlesIcon className="media-player-icon"/>
                    </IconButton>
                    <IconButton
                      onClick={this.handleToggleFullscreen}
                      className="media-player-icon-button"
                    >
                      {
                        !this.state.fullScreen ?
                          <FullscreenIcon className="media-player-icon"/>
                        :
                        <FullscreenExitIcon className="media-player-icon"/>
                      }
                    </IconButton>
                  </Paper>
                </Slide>
              </div>
              {
                this.state.isBuffering ?
                  <div className="media-player-loading-container">
                    <ScaleLoader
                      color={getComputedStyle(document.documentElement).getPropertyValue('--secondary')}
                      width={12}
                      radius={2}
                      margin="5px"
                      height={100}
                    />
                  </div>
                :
                undefined
              }
            </Fullscreen>
          :
          undefined
        }
        {
          this.props.media.type === 'image' ?
            <div className="fullscreen-media-container">
              <Paper
                square
                elevation={15}
                className={this.state.hasA11y ? "image-media-player-paper-a11y" : "image-media-player-paper"}
              >
                <div 
                  className="image-media-show"
                  style={{
                    backgroundImage: `url(${this.state.media.attributes.image.link})`,
                    //transform: `rotate(${this.state.imageValue && this.state.imageValue.rotate ? this.state.imageValue.rotate : 0}deg)`,
                  }}
                >
                </div>
              </Paper>
              {this.state.hasA11y && this.a11yContent()}
            </div>
          :
          undefined
        }
      </div>
    )
  }
}
