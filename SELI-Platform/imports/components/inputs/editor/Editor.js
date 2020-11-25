import React, { Component } from 'react';
import { initEditor, changeStyle, changeAligment, link, insertHTML, removeFormat, getInnerHtml } from '../../../../lib/editorUtils';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import LinkButton from './LinkButton';
import StoryButton from './StoryButton';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';

import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from '../../../style/theme.js';

export default class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.links = [];
    this.state = {
      alignment: 'left',
      formats: [],
    }
  }

  setActiveStyle(button, selected){
    if (button === 'bold') {
      this.setState({ boldSelected: selected === "contained" ? "text" : "contained" });
    }
    else if (button === 'italic') {
      this.setState({ italicSelected: selected === "contained" ? "text" : "contained" });
    }
    else if (button === 'underlined') {
      this.setState({ underlinedSelected: selected === "contained" ? "text" : "contained" });
    }
  }

  setActiveAligment(alignment){
    this.setState({
      alignment: alignment,
    })
  }

  componentDidMount(){
    initEditor();
    this.initClickEvent();
    this.props.innerHTML !== '' ? insertHTML(this.props.innerHTML) : this.clearEditor();
  }

  componentWillReceiveProps() {
    
  }

  clearEditor() {

  }

  initClickEvent(){
    var editor = editorIframe.document;
    var win = document.getElementById("editor-iframe").contentWindow;
    let self = this;
    editor.addEventListener("click", function(event) {
      self.checkLastNodeStyle(win.getSelection());
      self.checkLastNodeAligment(win.getSelection());
      //console.log(win.getSelection());
    }, false);
    editor.addEventListener("input", function(event) {
      self.checkLastNodeStyle(win.getSelection());
      self.checkLastNodeAligment(win.getSelection());
      self.getInnerHtml();
    }, false);
    editor.addEventListener("paste", function(event) {
      self.pasteWithNoStyle(event);
    }, false);
    editor.addEventListener("keydown", function(event) {
      if (event.keyCode === 13) {
        removeFormat();
      }
      if (event.keyCode === 9) {
        if (event.shiftKey) {
          self.links[1].focus();
        } else {
          self.links[0].focus();
        }
      }
    });
  }

  getInnerHtml(){
    this.props.getInnerHtml(getInnerHtml());
  }

  pasteWithNoStyle(event){
    var sanitizeHtml = require('sanitize-html');
    let pasteHtml = event.clipboardData.getData('text/html');
    pasteHtml = sanitizeHtml(pasteHtml);
    event.preventDefault();
    insertHTML(pasteHtml);
  }

  isRangeSelection(){
    var editor = editorIframe.document;
    var win = document.getElementById("editor-iframe").contentWindow;
    if (win.getSelection().type === 'Caret') {
      return false;
    }
    if (win.getSelection().type === 'Range') {
      return true;
    }
  }

  getTag(tag){
    if (tag === 'b') {
      return 'b'
    } else if (tag === 'i') {
      return 'i'
    } else if (tag === 'u') {
      return 'u'
    } else if (tag === 'strong') {
      return 'strong'
    }

  }

  checkLastNodeAligment(selection){
    var editor = editorIframe.document;
    let parent = selection.focusNode.parentElement;
    let parents = [];
    if (parent.localName === 'body' || parent.localName === 'html') {
      //console.log('left');
    }
    else if (parent.localName === 'div') {
      //console.log('alig');
      //console.log(parent.attributes[0].value);
    }
    else {
      parent = parent.parentElement;
      if (parent.localName === 'body' || parent.localName === 'html') {
        //console.log('left');
      }
      else if (parent.localName === 'div') {
        //console.log('alig');
        //console.log(parent.attributes[0].value);
      }
      else {
        parent = parent.parentElement;
        if (parent.localName === 'body' || parent.localName === 'html') {
          //console.log('left');
        }
        else if (parent.localName === 'div') {
          //console.log('alig');
          //console.log(parent.attributes[0].value);
        }
        else {
          parent = parent.parentElement;
          if (parent.localName === 'body' || parent.localName === 'html') {
            //console.log('left');
          }
          else if (parent.localName === 'div') {
            //console.log('alig');
            //console.log(parent.attributes[0].value);
          }
        }
      }
    }
  }

  checkLastNodeStyle(selection){
    var editor = editorIframe.document;
    let parent = selection.focusNode.parentElement;
    let parents = [];
    if (parent.localName !== 'body' && parent.localName !== 'html') {
      parents.push(this.getTag(parent.localName));
      parent = parent.parentElement;
      if (parent.localName !== 'body') {
        parents.push(this.getTag(parent.localName));
        parent = parent.parentElement;
        if (parent.localName !== 'body') {
          parents.push(this.getTag(parent.localName));
        }
      }
    }
    if(parents.includes('b') || parents.includes('strong')) {
      this.setActiveStyle('bold', 'text');
    }
    else {
      this.setActiveStyle('bold', 'contained');
    }
    if(parents.includes('i')) {
      this.setActiveStyle('italic', 'text');
    }
    else {
      this.setActiveStyle('italic', 'contained');
    }
    if(parents.includes('u')) {
      this.setActiveStyle('underlined', 'text');
    }
    else {
      this.setActiveStyle('underlined', 'contained');
    }
  }

  render() {
    return(
      <div style={{width: '100%', paddingBottom: '2.5vh'}}>
        <MuiThemeProvider theme={theme}>
          <div className="editor-container">
            <div className="editor-tools">
              <Grid item>
                <ToggleButtonGroup size="small" value={this.state.alignment} exclusive>
                  <ToggleButton ref={(ref) => this.links[1] = ref} key={1} value="left" onClick={() => {changeAligment('justifyLeft'); this.setActiveAligment("left")}}>
                    <Tooltip title={this.props.language.leftAlign}>
                      <FormatAlignLeftIcon className="toggle-button-icon"/>
                    </Tooltip>
                  </ToggleButton>
                  <ToggleButton key={2} value="center" onClick={() => {changeAligment('justifyCenter'); this.setActiveAligment("center")}}>
                    <Tooltip title={this.props.language.centerAlign}>
                      <FormatAlignCenterIcon className="toggle-button-icon"/>
                    </Tooltip>
                  </ToggleButton>
                  <ToggleButton key={3} value="right" onClick={() => {changeAligment('justifyRight'); this.setActiveAligment("right")}}>
                    <Tooltip title={this.props.language.rightAlign}>
                      <FormatAlignRightIcon className="toggle-button-icon"/>
                    </Tooltip>
                  </ToggleButton>
                  <ToggleButton className="last-child-button" key={4} value="justify" onClick={() => {changeAligment('justifyFull'); this.setActiveAligment("justify")}}>
                    <Tooltip title={this.props.language.justify}>
                      <FormatAlignJustifyIcon className="toggle-button-icon"/>
                    </Tooltip>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              <Grid style={{marginLeft: "1vw"}}>
                <ToggleButtonGroup size="small">
                  <ToggleButton color="primary" selected={this.state.boldSelected} onClick={() => {changeStyle('bold'); this.setActiveStyle('bold', this.state.boldSelected)}} value="bold">
                    <FormatBoldIcon />
                  </ToggleButton>
                  <ToggleButton selected={this.state.italicSelected} onClick={() => {changeStyle('italic'); this.setActiveStyle('italic', this.state.italicSelected)}} value="italic">
                    <FormatItalicIcon />
                  </ToggleButton>
                  <ToggleButton selected={this.state.underlinedSelected} onClick={() => {changeStyle('underline'); this.setActiveStyle('underlined', this.state.underlinedSelected)}} value="underlined">
                    <FormatUnderlinedIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              {
                this.props.addLinks ?
                  <Grid style={{marginLeft: "1vw"}}>
                    <ToggleButtonGroup size="small">
                      <LinkButton buttonLabels={this.props.buttonLabels} language={this.props.language}/>
                      { 
                        this.props.stories ?
                          <StoryButton stories={this.props.stories} buttonLabels={this.props.buttonLabels} language={this.props.language}/>
                        : 
                          undefined
                      }
                    </ToggleButtonGroup>
                  </Grid>
                :
                undefined
              }
            </div>
            <div className="editor-area" style={{height: this.props.areaHeight}}>
              <iframe
                id="editor-iframe"
                className="editor-iframe"
                name="editorIframe"
                tabIndex="0"
              >
              </iframe>
            </div>
            <div ref={(ref) => this.links[0] = ref} tabIndex="-1"></div>
          </div>
        </MuiThemeProvider>
      </div>
      )
    }
  }
