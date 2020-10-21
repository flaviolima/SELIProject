import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import ItemFeedback from '../../accessibility/ItemFeedback';
import Link from '@material-ui/core/Link';
import TextAlternatives from '../../accessibility/alternative/TextAlternatives';
import AudioPlayer from 'react-h5-audio-player';
//import CheckboxLabels from './CheckBox';

export default class AudioItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      signalShow:'',
      autoplay:false,
      key:78,
      shortlongDescription:'',
      captions:'nocaptions'
    }
  }

  openExternalLink = () => {
    var win = window.open(this.props.item.attributes.externalLink, '_blank');
    win.focus();
  }

  checkboxaudio=(event,name)=>{
    console.log("event and name", event, name)
    if(event===true && name==='signLanguage'){//Videosignal
      this.setState({
        signalShow: "signalShow"
      })
    }
    else if(event===false && name==='signLanguage'){
      this.setState({
        signalShow:'nosignalShow',
      })
    }
  }

  playAudio=(event)=>{
    if(this.state.signalShow==='signalShow'){
      this.setState({
        autoplay:true,
        key:Math.random()
      })
    }
  }

/*   checkBoxLabels=()=>{
    return(
      <div className="checkBoxItem">
        {
          this.props.item.attributes.accessibility.dataField===undefined?
            undefined
          :
            <div className="checkBoxItem">    
                <div className="checkboxstyle">
                  <CheckboxLabels
                      language={this.props.language}
                      checkbox={this.checkbox}
                      type="shortLongDescription"
                      label={this.props.language.textAlternatives}
                  />
                </div>
                <div>
                  {
                    this.props.item.attributes.accessibility.isA11Y[2].is_a11y===true?
                      <div className="checkboxstyle">
                        <CheckboxLabels
                            language={this.props.language}
                            checkbox={this.checkbox}
                            type="captions"
                            label={this.props.language.audioTranscription}
                        />
                      </div>
                      :
                      undefined
                  }
                </div>
                
            </div>
        }
        
      </div>
    )
  }

  checkbox=(event, name)=>{
    //console.log("event and name", event, name)
    if(event===true && name==='shortLongDescription'){
      this.setState({
        shortlongDescription:'shortlongDescription',
      })
    }
    else if(event===false && name==='shortLongDescription'){
      this.setState({
        shortlongDescription:'noshortlongDescription'
      })
    }else if(event===true && name==='captions'){
      this.setState({
        captions:'captions'
      })
    }else if(event===false && name==='captions'){
      this.setState({
        captions:'nocaptions'
      })
      var player = document.getElementById("audio"); 
      player.pause()
        
    }
  } */

  signalText=()=>{
    const contentState = convertFromRaw(this.props.item.attributes.accessibility.dataField.longDescription);
    const editorState = EditorState.createWithContent(contentState);
    return editorState
  }

  textAlternatives=()=>{
    return(
      <TextAlternatives
        item={this.props.item}
        language={this.props.language}
      ></TextAlternatives>
    )
  }

  audioPlayer=()=>{
    return(
      <Card tabIndex="-1" raised className="course-item-audio-card">
        <div className="course-item-audio-card-details">
          <CardMedia
            className="course-item-audio-card-image"
            image="/audio-gra.svg"
            title="Live from space album cover"
            tabIndex="-1"
          />
          <CardContent tabIndex="-1" className="course-item-audio-card-content">
            <Typography tabIndex="-1" className="course-item-card-subtitle" variant="subtitle1" color="textSecondary">
              {this.props.item.attributes.source === 'upload' ? this.props.language.audioFile : this.props.language.recordedAudio}
            </Typography>
            <Typography tabIndex="-1" className="course-item-card-title" gutterBottom variant="h5" component="h2">
              {` ${this.props.item.attributes.title}`}
            </Typography>
          </CardContent>
        </div>
        <div
          id={"audio_" + this.props.item.id}
          className="course-item-audio-card-controls2"
          aria-describedby={"audio_" + this.props.item.id + "_transcriptText"}
          aria-labelledby={"audio_" + this.props.item.id + "_shortDescr"}
        >
          {
            this.props.item.attributes.audio &&
            <AudioPlayer 
              volume
              src={this.props.item.attributes.audio.link}
              onPlay={this.playAudio}
            />
          }
            {/* <Tooltip title={this.props.language.addToMyLibrary}>
              <Link className="course-item-audio-card-icon-button" aria-label="add to favorites">
                <FolderSpecialIcon className="course-item-audio-card-icon"/>
              </Link>
            </Tooltip>  */}
            {
              this.props.item.attributes.externalLink !== '' ?
                <Link onClick={() => this.openExternalLink()} className="course-item-video-card-media-button MuiButtonBase-root MuiButton-root MuiButton-text course-item-video-card-media-button MuiButton-textPrimary MuiButton-textSizeSmall MuiButton-sizeSmall" size="small" color="primary">
                  {this.props.language.externalLink}
                </Link>
              :
                undefined
            }
        </div>
      </Card> 
    )
  }

  //Functions for  Transcription
  audioCaption=(event)=>{
    var cues = Array.prototype.slice.call(document.querySelectorAll(".cue"));
    console.log(cues)
    var player = document.getElementById("audio");
    console.log("PALYER",player)
    
        var target = event.target;
        var key = event.which.toString();
        console.log("target", target, "key", key);
    
         if (key.match(/38|40/)) { //ARRIBA O ABAJO
          var index = cues.indexOf(target);
          var direction = key.match(/40/) ? 1 : -1;
          var length = cues.length;

          if (index + direction < length && index + direction >= 0) {
            cues[index + direction].focus();
          }
        } else if (key.match(/32|13/)) {
          //space or enter
          console.log("enter", target.getAttribute("data-time"));
          var start = parseFloat(target.getAttribute("data-time"));
          player.currentTime = start;
          player.play(); 
        } 
  }

  mouseClick=(event)=>{
    var player = document.getElementById("audio");
    var target = event.target;
    var start = parseFloat(target.getAttribute("data-time"));
    player.currentTime = start;
    console.log("el player", player, start)
    player.play(); 
  }
  
  componentDidMount=()=>{
        var cues = Array.prototype.slice.call(document.querySelectorAll(".cue"));
        var player = document.getElementById("audio");
        //console.log("audio update------------------------", this.state.captions)
        var speaking = document.getElementById("speaking");
        //console.log("PLAYER",player)

        if( player!=null ){
          player.addEventListener("timeupdate", function() {
            if (player.paused || player.ended) {
              return;
            }
            // scroll to currently playing time offset
            var current = 0;
            for (var i = 0; i < cues.length; i++) {
              var cueTime = cues[i].getAttribute("data-time");
            // console.log("cueTime", cueTime);
              if (i + 1 === cues.length && player.currentTime >= parseFloat(cueTime)) {
                current = i;
          
              } else if (
                player.currentTime >= parseFloat(cueTime) &&
                player.currentTime < parseFloat(cues[i + 1].getAttribute("data-time"))
              ) {
                current = i;
          
              } else {
                cues[i].classList.remove("current");
              }
            }
          
            if (cues[current].className.indexOf("current") === -1)
              cues[current].className += " current";
          
            if (cues[current].getAttribute("aria-live") === "rude") {
              speaking.innerHTML = "[Captions]" + cues[current].innerHTML;
            }
          });
        }
  }

  render() {
    return(
      <div className="content-box">
        <div className="image-content-item">
          <div className="audio-item-container">
            {/* this.checkBoxLabels() */}
            {
              this.props.item.attributes.accessibility.dataField!=undefined && this.props.item.attributes.accessibility.dataField.longDescriptionPosition ==='top'?
                this.textAlternatives()
              :
                undefined
            } 
            <Card raised className="course-item-audio-card">         
              {this.audioPlayer()}
            </Card> 
            {
              this.props.item.attributes.accessibility.dataField !=undefined && this.props.item.attributes.accessibility.dataField.longDescriptionPosition ==='bottom'?
                this.textAlternatives()
              :
                undefined
            }   
          </div>
        </div>
        { this.props.fromProgram &&
          <ItemFeedback
            accessibility={this.props.item.attributes.accessibility}
            language={this.props.language}
          />
        }
      </div>
      );
    }
  }
