import React, { Component } from 'react';
import Waveform from './Waveform';
import { ContextMenu, ContextMenuTrigger } from "react-contextmenu";

import AddIcon from '@material-ui/icons/Add';
import ImageIcon from '@material-ui/icons/Image';
import ShortTextIcon from '@material-ui/icons/ShortText';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';

import Fab from '@material-ui/core/Fab';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';

import ArrowForward from '@material-ui/icons/ArrowForward';
import ArrowBack from "@material-ui/icons/ArrowBack";

export default class StorytellingObject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      audioDuration: 0,
      actionsPosition: 0,
      parentZoom: 29,
      scale: 5,
    }
  }

  componentDidMount() {
  }

  setCurrentTime = (time) => {
    let actionsPosition = this.getPosition(time, 39);
    if (actionsPosition < 0) {
      actionsPosition = 0;
    }
    this.setState({
      actionsPosition,
    })
  }

  getSingleDuration = (audioDuration) => {
    this.setState({
      audioDuration,
    })
  }

  zoomIn = () => {
    let zoom = this.state.parentZoom + this.state.scale;
    this.scaling(zoom);
  }

  zoomOut = () => {
    let zoom = this.state.parentZoom - this.state.scale;
    this.scaling(zoom);
  }

  scaling = (scaleRate) => {
    if (scaleRate >=4 && scaleRate <=204) {
      this.setState({
        parentZoom: scaleRate,
      }, () => {
        this.setState({
          actionsPosition: 0,
        })
      })
    }
  }

  getPosition = (timestamp, offset) => {
    if (this.state.audioDuration === 0 || timestamp/this.state.audioDuration > 1) {
      return this.state.audioDuration * this.state.parentZoom - offset;
    } else {
      return timestamp * this.state.parentZoom - offset;
    } 
  }

  addContent = (type) => {
    let time = this.refs.wave.getTime();
    if (type === 'image') {
      this.props.addSingleImage(time);
    } else {
      this.props.addSingleScript(time);
    }
  }

  play = () => {
    if (this.props.node.audio && this.props.node.audio !== "")
    this.refs.wave.play();
  }

  pause = () => {
    if (this.props.node.audio && this.props.node.audio !== "")
    this.refs.wave.pause();
  }

  stop = () => {
    if (this.props.node.audio && this.props.node.audio !== "")
    this.refs.wave.stop();
  }

  render() {
    return(
      <div className="storytelling-item-full-container-time">
        {
          this.props.node.images.length ?
            <div className="storytelling-item-actions-time">
              {
                this.props.node.images.map((image, imageIndex) => {
                  return(
                    <React.Fragment>
                      <ContextMenuTrigger id={`i${this.props.index}${imageIndex}`}>
                        <Paper
                          tabIndex="0"
                          elevation={8}
                          className="storytelling-item-images-scene-time"
                          onClick={() => this.props.handleContent(this.props.index, imageIndex, 'image')}
                          onKeyDown={() => this.props.handleContent(this.props.index, imageIndex, 'image')}
                          style={{left: `calc(${this.getPosition(image.timestamp, 64)}px)`}}
                        >
                          <div
                            className="file-image-preview"
                            style={{
                              backgroundImage:  image.file === "" ? "none" : `url(${image.file.link})`,
                              transform: `rotate(${image.rotate}deg)`,
                            }}
                          ></div>
                        </Paper>
                      </ContextMenuTrigger>
                      <Paper
                        tabIndex="0"
                        elevation={8}
                        className="storytelling-selected-empty-container-time"
                        style={{left: `calc(${this.getPosition(image.timestamp, 2)}px)`}}
                      ></Paper>
                      <ContextMenu className="right-click-menu" id={`i${this.props.index}${imageIndex}`}>
                        <Paper elevation={8}>
                          <List className="navigation-options-list" dense={true} component="nav" aria-label="navigation-options">
                            <ListItem onClick={() => this.props.handleContent(this.props.index, imageIndex, 'image', 'edit')} button>
                              <ListItemIcon>
                                <EditIcon />
                              </ListItemIcon>
                              <ListItemText primary={this.props.language.edit} />
                            </ListItem>
                            <ListItem onClick={() => this.props.handleContent(this.props.index, imageIndex, 'image', 'delete')} button>
                              <ListItemIcon>
                                <CancelIcon />
                              </ListItemIcon>
                              <ListItemText primary={this.props.language.delete} />
                            </ListItem>
                          </List>
                        </Paper>
                      </ContextMenu>
                    </React.Fragment>
                  )
                })
              }
            </div>
          :
            undefined
        }
        <ContextMenuTrigger id={`a${this.props.index}`}>
          <Paper
            tabIndex="0"
            elevation={8}
            className="storytelling-item-node-scene-time"
            onClick={() => this.props.handleNode(this.props.index)}
            onKeyDown={() => this.props.handleNode(this.props.index)}
          >
            {
              this.props.node.audio === "" ?
                <div className="storytelling-no-wave">
                  {this.props.language.noAudioUploaded}
                </div>
              :
                <div className="storytelling-wave" style={{width: `${this.state.audioDuration * this.state.parentZoom}px`}}>
                  <Waveform 
                    ref="wave"
                    src={this.props.node.audio.link}
                    zoom={this.state.parentZoom}
                    sendAction={this.props.sendAction.bind(this)}
                    setCurrentTime={this.setCurrentTime.bind(this)}
                    getSingleDuration={this.getSingleDuration.bind(this)}
                  />
                </div>
            }
          </Paper>
        </ContextMenuTrigger>
        <ContextMenu className="right-click-menu" id={`a${this.props.index}`}>
          <Paper elevation={8}>
            <List className="navigation-options-list" dense={true} component="nav" aria-label="navigation-options">
              <ListItem onClick={() => this.props.handleNode(this.props.index, 'edit')} button>
                <ListItemIcon>
                  <EditIcon />
                </ListItemIcon>
                <ListItemText primary={this.props.language.edit} />
              </ListItem>
              { 
                this.props.index !== 0 || this.props.length > 1 ?
                  <ListItem onClick={() => this.props.handleNode(this.props.index, 'delete')} button>
                    <ListItemIcon>
                      <CancelIcon />
                    </ListItemIcon>
                    <ListItemText primary={this.props.language.delete} />
                  </ListItem>
                :
                  undefined
              }
            </List>
          </Paper>
        </ContextMenu>
        <div className="storytelling-item-actions-time">
          <div
            id="actions-bar"
            className="storytelling-item-father-fab-time" 
            style={{left: `calc(${this.state.actionsPosition}px)`}}
          >
            {
              this.props.index !== 0 ?
                <Tooltip
                  title={this.props.language.moveAudioBack}
                  enterDelay={1000}
                  leaveDelay={10}
                >
                  <Fab
                    className="storytelling-item-fab-time"
                    size="small"
                    onClick={() => this.props.moveNodeUp(this.props.index)}
                  >
                    <ArrowBack className="storytelling-item-fab-icon-time" fontSize="small"/>
                  </Fab>
                </Tooltip>
              :
                undefined
            }
            {
              this.props.index !== this.props.length - 1 && this.props.length > 1 ?
                <Tooltip
                  title={this.props.language.moveAudioForward}
                  enterDelay={1000}
                  leaveDelay={10}
                >
                  <Fab
                    className="storytelling-item-fab-time"
                    size="small"
                    onClick={() => this.props.moveNodeDown(this.props.index)}
                  >
                    <ArrowForward className="storytelling-item-fab-icon-time" fontSize="small"/>
                  </Fab>
                </Tooltip>
              :
                undefined
            }
            {
              this.props.node.audio === "" ? undefined :
                <Tooltip
                  title={this.props.language.addImage}
                  enterDelay={1000}
                  leaveDelay={10}
                >
                  <Fab
                    className="storytelling-item-fab-time"
                    size="small"
                    onClick={() => {this.props.handleNode(this.props.index), this.addContent('image')}}
                  >
                    <ImageIcon className="storytelling-item-fab-icon-time" fontSize="small"/>
                  </Fab>
                </Tooltip>
            }
            {
              this.props.node.audio === "" ? undefined :
                <Tooltip
                  title={this.props.language.addScript}
                  enterDelay={1000}
                  leaveDelay={10}
                >
                  <Fab
                    className="storytelling-item-fab-time"
                    size="small"
                    onClick={() => {this.props.handleNode(this.props.index), this.addContent('script')}}
                  >
                    <ShortTextIcon className="storytelling-item-fab-icon-time" fontSize="small"/>
                  </Fab>
                </Tooltip>
            }
            <Tooltip
              title={this.props.language.addAudio}
              leaveTouchDelay={0}
              enterDelay={1000}
              leaveDelay={10}
            >
              <Fab
                className="storytelling-item-fab-time"
                size="small"
                onClick={() => this.props.addSingleNode(this.props.index)}
              >
                <AddIcon className="storytelling-item-fab-icon-time" fontSize="small"/>
              </Fab>
            </Tooltip>
          </div>
        </div>
        {
          this.props.node.scripts.length ?
            <div className="storytelling-item-actions-time">
              {
                this.props.node.scripts.map((script, scriptIndex) => {
                  return(
                    <React.Fragment>
                      <Paper
                        tabIndex="0"
                        elevation={8}
                        className="storytelling-selected-script-container-time"
                        style={{left: `calc(${this.getPosition(script.timestamp, 2)}px)`}}
                      ></Paper>
                      <ContextMenuTrigger id={`s${this.props.index}${scriptIndex}`}>
                        <Paper
                          tabIndex="0"
                          elevation={8}
                          className="storytelling-item-scripts-scene-time"
                          onClick={() => this.props.handleContent(this.props.index, scriptIndex, 'script')}
                          onKeyDown={() => this.props.handleContent(this.props.index, scriptIndex, 'script')}
                          style={{left: `calc(${this.getPosition(script.timestamp, 96)}px)`}}
                        >
                          <p className="storytelling-script-time">{script.script[this.props.languageType]}</p>
                        </Paper>
                      </ContextMenuTrigger>
                      <ContextMenu className="right-click-menu" id={`s${this.props.index}${scriptIndex}`}>
                        <Paper elevation={8}>
                          <List className="navigation-options-list" dense={true} component="nav" aria-label="navigation-options">
                            <ListItem onClick={() => this.props.handleContent(this.props.index, scriptIndex, 'script', 'delete')} button>
                              <ListItemIcon>
                                <CancelIcon />
                              </ListItemIcon>
                              <ListItemText primary={this.props.language.delete} />
                            </ListItem>
                          </List>
                        </Paper>
                      </ContextMenu>
                    </React.Fragment>
                  )
                })
              }
            </div>
          :
            undefined
        }
      </div>
    )
  }
}