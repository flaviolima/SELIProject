import React, { Component } from 'react';
import AudioRecorder from './AudioRecorder';
import AudioPreview from './AudioPreview';
import ImagePreview from './ImagePreview';
import VideoPreview from './VideoPreview';
import FileUpload from '../files/FileUpload';

import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';

import DeleteIcon from '@material-ui/icons/Delete';
import WarningIcon from '@material-ui/icons/Warning';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import InfoIcon from '@material-ui/icons/Info';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import StorytellingStart from './StorytellingStart';
import StorytellingScene from './StorytellingScene';
import StorytellingEnd from './StorytellingEnd';
import StorytellingPlayer from './StorytellingPlayer';
import { Activities } from '../../../lib/ActivitiesCollection';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';
import ReactPlayer from 'react-player';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import AppsIcon from '@material-ui/icons/Apps';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import PublishMethods from './PublishMethods';

const useStyles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: 920,
    height: 650,
  },
  text: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 300,
    },
  }
});

class StorytellingTool extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      story: {
        name: "",
        published: false,
        activityId: undefined,
        courseId: undefined,
        user: Meteor.userId(),
        creationDate: new Date(),
        nodes: [
          {
            type: 'start',
            name: `${this.props.language.start}`,
            description: {
              english: '',
              spanish: '',
              portuguese: '',
              polish: '',
              turkish: '',
            },
            image: '',
            audio: '',
            video: '',
            ordinal: 0,
            _id: 1,
          },
        ],
        isPublic: true,
      },
      saved: undefined,
      selectedNode: 0,
      courses: [],
      activities: [],
      languageType: 'english',
      mediaType: 'image',
      audioType: 'record',
      imageType: 'upload',
      videoType: 'upload',
      stateconsulta: false,
      isyes:false,
      isno:false,
      show: true,
      dataImages: [],
      dataImages1: [],
      dataImagesName:[],
      dataImagesId:[],
      dataAudio: [],
      dataAudio1: [],
      dataAudioName: [],
      dataAudioId: [],
      dataVideo: [],
      dataVideo1: [],
      dataVideoName: [],
      dataVideoId:[],
      img:[],
      renameFile: false,
    }
  }
  
  filterRepitedFiles=(data)=>{
    let filteredArr = data.reduce((acc, current) => {
      let x = acc.find(item => item.name === current.name);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
   
    const filteredItems = filteredArr.filter(item => item != "")
    return filteredItems //Return filtered values
  }

  handleLibraryContent=(value)=>{
    this.updateLibraryContent()
    let Imagesfilter=this.filterRepitedFiles(this.state.dataImages)
    let Audiofilter=this.filterRepitedFiles(this.state.dataAudio)
    let Videofilter=this.filterRepitedFiles(this.state.dataVideo)
    this.setState({
      dataImages1:Imagesfilter,
      dataAudio1:Audiofilter,
      dataVideo1:Videofilter
    })
    
    if (value === "images") {
      this.openDialog("reuse");
    }
    else if (value === "audio") {
      this.openDialog("reuseAudio");
    }
    else {
      this.openDialog("reuseVideo");
    }
  }

  componentDidMount() {
    document.title=this.props.language.storyFlow;
    if (this.props.storyToEdit !== undefined) {
      this.setState({
        story: {
          name: this.props.storyToEdit.activity.name,
          published: this.props.storyToEdit.activity.published,
          activityId: this.props.storyToEdit.activity.activityId,
          courseId: this.props.storyToEdit.activity.courseId,
          user: this.props.storyToEdit.activity.user,
          creationDate: this.props.storyToEdit.activity.date,
          nodes: this.props.storyToEdit.activity.data,
          isPublic: this.props.storyToEdit.activity.public,
        },
        saved: this.props.storyToEdit._id,
      })
    }
    this.updateLibraryContent()
  }

  updateLibraryContent= () =>{ 
    this.setState({
      dataImages:[],
      dataAudio:[],
      dataVideo:[],
    })
    let dataLibraryContent=Activities.find({}).fetch()
    
    var dataLibraryContentCopy = dataLibraryContent.filter(function(value, index, arr){
      if (value.activity.user == Meteor.userId()){
        return value
      }
    });

    dataLibraryContentCopy.map((data)=>{
      if (data.activity.type === "storytelling"){
        let LibraryContent = data.activity.data
        LibraryContent.map((data2)=>{
        let dataImg=data2.image
        let dataAud=data2.audio 
        let dataVid=data2.video 
        this.state.dataImages.push(dataImg)
        this.state.dataAudio.push(dataAud)
        this.state.dataVideo.push(dataVid)
        })
      }
    })
  }
  

  handleClose = () => {
    this.setState({ open: false });
  }
  
  handleClosepublish = () => {
    this.setState({ openpublish: false });
  }

  handleCloseRename = () => {
    this.setState({ renameFile: false });
  }

  handleChange = name => event => {
    
    let story = this.state.story;
    let isPublic = this.state.isPublic;
   
    if (name === 'storyName') {
      story.name = event.target.value;
    }
    if (name === 'name') {
      story.nodes[this.state.selectedNode].name = event.target.value;
    }
    if (name === 'description-english') {
      story.nodes[this.state.selectedNode].description.english = event.target.value;
    }
    if (name === 'description-spanish') {
      story.nodes[this.state.selectedNode].description.spanish = event.target.value;
    }
    if (name === 'description-portuguese') {
      story.nodes[this.state.selectedNode].description.portuguese = event.target.value;
    }
    if (name === 'description-polish') {
      story.nodes[this.state.selectedNode].description.polish = event.target.value;
    }
    if (name === 'description-turkish') {
      story.nodes[this.state.selectedNode].description.turkish = event.target.value;
    }
    if (name === "public") {
      story.isPublic = !story.isPublic;
    }
    this.setState({
      story: story,
    })
  }


  addSingleNode = (index) => {
    let story = this.state.story;
    let newNode = Math.random();
    const image = story.nodes[index].image
    const node = {
      type: 'scene',
      name: `${this.props.language.newScene} ${story.nodes.length}`,
      rotate:0,
      description: {
        english: '',
        spanish: '',
        portuguese: '',
        polish: '',
        turkish: '',
      },
      image: image,
      audio: '',
      video: '',
      ordinal: index + 1,
      _id: newNode,
    };
    story.nodes.splice(index + 1, 0, node);

    this.setState({
      story: story,
      selectedNode: story.nodes.length - 1,
    });
  }

  addEndNode = (index) => {
    let story = this.state.story;
    let newNode = Math.random();
    story.nodes.push({
      type: 'end',
      name: `${this.props.language.end}`,
      rotate:0,
      description: {
        english: '',
        spanish: '',
        portuguese: '',
        polish: '',
        turkish: '',
      },
      image: '',
      audio: '',
      video: '',
      ordinal: story.nodes.length,
      _id: newNode,
    });
    this.setState({
      story: story,
      selectedNode: story.nodes.length - 1,
      mediaType: 'image',
    });
  }

  selectNode = (index) => {
    this.setState({
      selectedNode: index,
    })
    if ((this.state.story.nodes.length - 1) === index){
      this.setState({
        mediaType: 'image',
      })
    }
  }

  openDialog = (action) => {
    this.setState({
      action: action,
      open: true,
    })
  }

  deleteNode = () => {
    let story = this.state.story;
    let selectedNode = this.state.selectedNode;
    if (story.nodes.length === 3) {
      if (story.nodes[2].type === "end" && story.nodes[1].type === "scene") {
        this.props.handleControlMessage(true, this.props.language.storyMustHave)
        this.handleClose();
        return false;
      }
    }
    story.nodes.splice(selectedNode, 1);
    if (selectedNode >= story.nodes.length) {
      selectedNode--;
    }
    this.setState({
      selectedNode: selectedNode,
      story: story,
    }, () => {
      this.handleClose();
    });
  }

  unPickAudioFile(){
    let story = this.state.story;
    story.nodes[this.state.selectedNode].audio = '';
    this.setState({
      story: story,
    });
  }

  unPickVideoFile(){
    let story = this.state.story;
    story.nodes[this.state.selectedNode].video = '';
    this.setState({
      story: story,
      validUrl: false,
      urlMessage: '',
      url: '',
    });
  }
  //This function returns the information of the items of the data base depending on the file type 
  getFileInformation(file){  
    let story = this.state.story;
    story.nodes[this.state.selectedNode][this.state.mediaType] = file;
    this.setState({
      story: story,
    });
  }

  unPickImageFile(){
    let story = this.state.story;
    story.nodes[this.state.selectedNode].image = '';
    this.setState({
      story: story,
    });
  }

  validateStory = (publish) => {
    let story = this.state.story;
    if (story.nodes.length < 3) {
      this.props.handleControlMessage(true, this.props.language.storyMustHave);
      return false;
    }
    if (story.nodes.findIndex(node => node.type === "end") === -1) {
      this.props.handleControlMessage(true, this.props.language.storyMustEnd);
      return false;
    }
    for (var i = 0; i < story.nodes.length; i++) {
      if (story.nodes[i].name === "") {
        this.props.handleControlMessage(true, this.props.language.allScenesMust);
        this.setState({
          selectedNode: i,
          showError: true,
        });
        return false;
      }
      if (story.nodes[i].audio === "" && story.nodes[i].video === "" && i + 1 < story.nodes.length && publish) {
        this.props.handleControlMessage(true, this.props.language.allScenesAudio);
        this.setState({
          selectedNode: i,
        });
        return false;
      }
      if (story.nodes[i].image === "" && story.nodes[i].video === "" && publish) {
        this.props.handleControlMessage(true, this.props.language.allScenesImage);
        this.setState({
          selectedNode: i,
        });
        return false;
      }
    }
    return true;
  }

  handleSaveStory = () => {
    if (this.validateStory()) {
      this.openDialog("save");
    }
  }

  saveStory = () => {
    if (this.state.saved) {
      if (this.state.story.name !== "") {
        //console.log(this.state.story.name, this.state.story.nodes, this.state.story.isPublic )
        Activities.update(
          { _id: this.state.saved},
          { $set: {
            'activity.name': this.state.story.name,
            'activity.data': this.state.story.nodes,
            'activity.public': this.state.story.isPublic,
          }}
          , () => {
            this.props.handleControlMessage(true, this.props.language.storySaved, true, "stories", this.props.language.seeList);
            this.handleClose();
          }
        )
        return true;
      }
      else {
        this.props.handleControlMessage(true, this.props.language.storyNameText);
      }
    }
    else {
      if (this.state.story.name !== "") {
        Activities.insert({
          activity: {
            name: this.state.story.name,
            data: this.state.story.nodes,
            type: "storytelling",
            public: this.state.story.isPublic,
            date: this.state.story.creationDate,
            user: this.state.story.user,
            course: this.state.story.courseId,
          }
        }, () => {
          this.props.handleControlMessage(true, this.props.language.storySaved, true, "stories", this.props.language.seeList);
          this.handleClose();
          this.setState({
            saved: Activities.findOne({"activity.name": this.state.story.name})._id,
          });
        })
        return true;
      }
      else {
        this.props.handleControlMessage(true, this.props.language.storyNameText);
      }
    }
  }

  handlePublishStory = () => {
    if (this.validateStory("publish")) {
      this.openDialog("publish");
    }
  }

  showPreview = () => {
    if (this.validateStory()) {
      this.setState({
        showPreview: true,
      });
    }
  }

  handleReturn = () => {
    this.setState({
      showPreview: false,
    });
  }

  publishOnCourse = (course) => {
    Activities.update(
      { _id: this.state.saved},
      { $set: {
        'activity.name': this.state.story.name,
        'activity.data': this.state.story.nodes,
        'activity.public': this.state.story.isPublic,
        'activity.courseId': course,
      }}
      , () => {
        this.props.handleControlMessage(true, this.props.language.storyPublished);
        this.handleClosepublish();
      }
    )
  }

  handleyes = () => {
    if (this.validateStory() && this.saveStory()) {
      this.setState({
        isyes: true,
        show: false,
        openpublish: true,
        open: false,
        action: "boxpubshow"
      });
    } else {
      this.openDialog("save");
    }
  }
  
  handleno = () => {
    this.setState({
      isno: true,
      show: false,
      action:"nopublish"
  })}

  arrayMoveMutate = (array, from, to) => {
    const startIndex = to < 0 ? array.length + to : to;
    const item = array.splice(from, 1)[0];
    array.splice(startIndex, 0, item);
  };

  changeNodeOrdinal(index, newIndex) {
    //console.log('changeNodeOrdinal ' + index + '  ' +  newIndex);

    let story = this.state.story;
    const fromNode = story.nodes[index];
    const toNode = story.nodes[newIndex];
    // change ordinals
    fromNode.ordinal = newIndex;
    toNode.ordinal = index;

    let selectedNode = this.state.selectedNode;
    if (selectedNode === index) {
      selectedNode = newIndex;
    } else if (selectedNode === newIndex) {
      selectedNode = index;
    }
    
    this.arrayMoveMutate(story.nodes, index, newIndex);

    this.setState({
      story: story,
      selectedNode: selectedNode
    }); 
  }

  moveNodeUp(index) {
    this.changeNodeOrdinal(index, index - 1);
  }
 
  moveNodeDown(index) {
    this.changeNodeOrdinal(index, index + 1);
  }

  selectLanguageType = (newValue) => {
    this.setState({
      languageType: newValue
    })
  };

  selectMediaType = (newValue) => {
    this.setState({
      mediaType: newValue
    })
  };

  selectImageType = (newValue) => {
    this.setState({
      imageType: newValue
    })
  };

  selectAudioType = (newValue) => {
    this.setState({
      audioType: newValue
    })
  };

  selectVideoType = (newValue) => {
    this.setState({
      videoType: newValue
    })
  };

  handleOnDragStart = (e) => {
    e.preventDefault()
  }

  selectColor = (language) => {
    if (this.state.story.nodes[this.state.selectedNode].description[language] === ""){
      return ""
    } else {
      return "secondary.main"
    }
  };

  urlHandleChange = name => event => {
    this.setState({
      showHelperText: false,
      url: event.target.value,
      validUrl: false,
    }, () => {
      this.validateUrl()
    })
  }

  renameHandleChange = name => event => {
    this.setState({
      renameFileTitle: event.target.value,
    });
  }

  validateUrl(){
    let story = this.state.story;
    let url = document.getElementById('url-input').value;
    let isValid = ReactPlayer.canPlay(url);
    let helperColor = '';
    let showHelperText = true;
    let urlMessage = '';
    if (isValid) {
      let video = {
        name: 'externalVideoUrlStorytelling',
        link: url,
      };
      story.nodes[this.state.selectedNode].video = video;
      urlMessage = this.props.language.thePlayerCan;
      helperColor = "#4caf50";
    }
    else {
      story.nodes[this.state.selectedNode].video = '';
      urlMessage = this.props.language.thePlayerCannot;
      helperColor = "#f44336";
    }
    this.setState({
      showHelperText: showHelperText,
      urlMessage: urlMessage,
      helperColor: helperColor,
      validUrl: isValid,
      url: url,
      story: story,
    });
  }

  rotateangle= (rotate)=>{
    this.state.story.nodes[this.state.selectedNode].rotate=rotate
  }

  changeFileName = (fileName, _id) => {
    this.setState({
      renameFile: true,
      renameFileTitle: fileName,
      renameFileId: _id,
    });
  }

  finishChangeFileName = () => {
    let storyId = "";
    let story = this.state.story;
    if (this.state.mediaType === "audio") {
      storyId = Activities.findOne({"activity.data.audio._id": this.state.renameFileId})._id
    } else {
      storyId = Activities.findOne({"activity.data.video._id": this.state.renameFileId})._id
    }
    let newData = Activities.findOne({_id: storyId}).activity.data;
    for (let i = 0; i < newData.length; i++) {
      if (newData[i][this.state.mediaType]._id === this.state.renameFileId){
        newData[i][this.state.mediaType].name = this.state.renameFileTitle;
        if (this.state.saved === storyId) {
          story.nodes[i][this.state.mediaType].name = this.state.renameFileTitle;
          this.setState({
            story: story,
          });
        }
      }
    }
    Activities.update(
      { _id: storyId},
      { $set: {'activity.data': newData}}
    )
    this.handleLibraryContent(this.state.mediaType);
    this.handleCloseRename();
  }

  render() {
    const { classes } = this.props;
    return(
      <React.Fragment>
        {
          !this.state.showPreview ?
            <div className="storytelling-tool-container">
              <div className="storytelling-work-area-full">
                <div className="storytelling-title-area">
                  <h2 className="storytelling-work-area-title">{this.props.language.storyFlow}</h2>
                  {
                    this.state.story.nodes.length >= 2 ?
                      <Button
                        color="primary"
                        className="storytelling-work-preview-button"
                        onClick={() => this.showPreview()}
                      >
                        {this.props.language.storyPreview}
                      </Button>
                    :
                    undefined
                  }
                </div>
                <div className="storytelling-work-area">
                  {
                    this.state.story.nodes.map((node, index) => {
                      return(
                        <React.Fragment>
                          {
                            node.type === 'start' ?
                              <StorytellingStart
                                node={node}
                                nodes={this.state.story.nodes}
                                index={index}
                                selectedNode={this.state.selectedNode}
                                addSingleNode={this.addSingleNode.bind(this)}
                                selectNode={this.selectNode.bind(this)}
                                addNewScene={this.props.language.addNewScene}
                              />
                            :
                            undefined
                          }
                          {
                            node.type === 'scene' ?
                              <StorytellingScene
                                node={node}
                                nodes={this.state.story.nodes}
                                index={index}
                                selectedNode={this.state.selectedNode}
                                addSingleNode={this.addSingleNode.bind(this)}
                                addEndNode={this.addEndNode.bind(this)}
                                selectNode={this.selectNode.bind(this)}
                                moveNodeUp={this.moveNodeUp.bind(this)}
                                moveNodeDown={this.moveNodeDown.bind(this)}
                                language={this.props.language}
                              />
                            :
                            undefined
                          }
                          {
                            node.type === 'end' ?
                              <StorytellingEnd
                                node={node}
                                nodes={this.state.story.nodes}
                                index={index}
                                selectedNode={this.state.selectedNode}
                                selectNode={this.selectNode.bind(this)}
                              />
                            :
                            undefined
                          }
                        </React.Fragment>
                      )
                    })
                  }
                </div>
              </div>
              <div className="storytelling-menu-container">
                <div className="storytelling-menu-header">
                  <h3 className="storytelling-menu-title">
                    <React.Fragment>
                      {
                        this.state.story.nodes[this.state.selectedNode].type === 'start' ?
                          this.props.language.beginningOfTheStory
                        :
                        undefined
                      }

                      {
                        this.state.story.nodes[this.state.selectedNode].type === 'scene' ?
                          <React.Fragment>
                            {`${this.props.language.scene} ${this.state.story.nodes[this.state.selectedNode].ordinal}`}
                          </React.Fragment>
                        :
                        undefined
                      }
                      {
                        this.state.story.nodes[this.state.selectedNode].type === 'end' ?
                          <React.Fragment>
                            {this.props.language.endOfStory}
                          </React.Fragment>
                        :
                        undefined
                      }

                    </React.Fragment>
                  </h3>
                  <div className="center-row">
                    <Button
                      className="storytelling-media-button"
                      variant="outlined"
                      color="primary"
                      onClick={() => this.handleSaveStory()}
                    >
                      {this.props.language.saveStory}
                    </Button>

                    <Button
                      className="storytelling-media-button"
                      variant="outlined"
                      color="primary"
                      onClick={() => this.handlePublishStory()}
                    >
                      {this.props.language.publishStory}
                    </Button>
                    
                  </div>
                  <FormGroup style={{marginTop: "1.5vh"}}>
                    <FormControlLabel
                      control={<Switch size="small" onChange={this.handleChange('public')} checked={this.state.story.isPublic}/>}
                      label={<p className="form-label">{this.props.language.makeStoryPublic}</p>}
                    />
                  </FormGroup>
                </div>
                <div className="storytelling-menu-body-full">
                  { 
                    this.state.story.nodes[this.state.selectedNode].type !== "end" ? 
                      <div className="storytelling-menu-body">
                        <TextField
                          id="node-name-input"
                          label={this.props.language.name}
                          margin="normal"
                          variant="outlined"
                          fullWidth
                          autoComplete={"off"}
                          required
                          value={this.state.story.nodes[this.state.selectedNode].name}
                          onChange={this.handleChange('name')}
                          error={this.state.showError && this.state.story.nodes[this.state.selectedNode].name === ''}
                          helperText={this.props.language.sceneNameHelper}
                        />
                      </div>
                    :
                      undefined
                  }
                  {
                    this.state.story.nodes[this.state.selectedNode].type !== "end" ? 
                      <div className="storytelling-menu-body-aux">
                        <div className="storytelling-menu-body-tabs">
                          <Tabs
                            color="primary"
                            orientation="vertical"
                            value={this.state.languageType}
                            indicatorColor="primary"
                            textColor="primary"
                            className="form-tabs-container"
                            variant="standard"
                            //centered={true}
                          >
                            <Tab value={'english'} onClick={() => this.selectLanguageType('english')} className="form-tab-aux" label={<Box color={this.selectColor('english')}>{this.props.language.english}</Box>}/>
                            <Tab value={'spanish'} onClick={() => this.selectLanguageType('spanish')} className="form-tab-aux" label={<Box color={this.selectColor('spanish')}>{this.props.language.spanish}</Box>}/>
                            <Tab value={'portuguese'} onClick={() => this.selectLanguageType('portuguese')} className="form-tab-aux" label={<Box color={this.selectColor('portuguese')}>{this.props.language.portuguese}</Box>}/>
                            <Tab value={'polish'} onClick={() => this.selectLanguageType('polish')} className="form-tab-aux" label={<Box color={this.selectColor('polish')}>{this.props.language.polish}</Box>}/>
                            <Tab value={'turkish'} onClick={() => this.selectLanguageType('turkish')} className="form-tab-aux" label={<Box color={this.selectColor('turkish')}>{this.props.language.turkish}</Box>}/>
                          </Tabs>
                        </div>
                        <div className="storytelling-menu-body-description">
                          {
                            this.state.languageType === 'english' ?
                              <TextField
                                id="node-description-input"
                                label={`${this.props.language.descriptionIn} ${this.props.language.english}`}
                                margin="normal"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={6}
                                value={this.state.story.nodes[this.state.selectedNode].description.english}
                                onChange={this.handleChange('description-english')}
                                error={this.state.showError && this.state.story.nodes[this.state.selectedNode].description === ''}
                                helperText={this.props.language.sceneDescriptionHelper}
                              />
                            :
                              undefined
                          }
                          {
                            this.state.languageType === 'spanish' ?
                              <TextField
                                id="node-description-input"
                                label={`${this.props.language.descriptionIn} ${this.props.language.spanish}`}
                                margin="normal"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={6}
                                value={this.state.story.nodes[this.state.selectedNode].description.spanish}
                                onChange={this.handleChange('description-spanish')}
                                error={this.state.showError && this.state.story.nodes[this.state.selectedNode].description === ''}
                                helperText={this.props.language.sceneDescriptionHelper}
                              />
                            :
                              undefined
                          }
                          {
                            this.state.languageType === 'portuguese' ?
                              <TextField
                                id="node-description-input"
                                label={`${this.props.language.descriptionIn} ${this.props.language.portuguese}`}
                                margin="normal"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={6}
                                value={this.state.story.nodes[this.state.selectedNode].description.portuguese}
                                onChange={this.handleChange('description-portuguese')}
                                error={this.state.showError && this.state.story.nodes[this.state.selectedNode].description === ''}
                                helperText={this.props.language.sceneDescriptionHelper}
                              />
                            :
                              undefined
                          }
                          {
                            this.state.languageType === 'polish' ?
                              <TextField
                                id="node-description-input"
                                label={`${this.props.language.descriptionIn} ${this.props.language.polish}`}
                                margin="normal"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={6}
                                value={this.state.story.nodes[this.state.selectedNode].description.polish}
                                onChange={this.handleChange('description-polish')}
                                error={this.state.showError && this.state.story.nodes[this.state.selectedNode].description === ''}
                                helperText={this.props.language.sceneDescriptionHelper}
                              />
                            :
                              undefined
                          }
                          {
                            this.state.languageType === 'turkish' ?
                              <TextField
                                id="node-description-input"
                                label={`${this.props.language.descriptionIn} ${this.props.language.turkish}`}
                                margin="normal"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={6}
                                value={this.state.story.nodes[this.state.selectedNode].description.turkish}
                                onChange={this.handleChange('description-turkish')}
                                error={this.state.showError && this.state.story.nodes[this.state.selectedNode].description === ''}
                                helperText={this.props.language.sceneDescriptionHelper}
                              />
                            :
                              undefined
                          }
                        </div>
                      </div>
                    :
                      undefined
                  }
                  <Divider light/>
                  <div className="storytelling-menu-body-aux">
                    <Tabs
                      color="primary"
                      value={this.state.mediaType}
                      indicatorColor="primary"
                      textColor="primary"
                      className={this.state.story.nodes[this.state.selectedNode].type === "end" ? "form-tabs-container" : "form-tabs-container-media"}
                      variant="fullWidth"
                      centered={true}
                    >
                      <Tab value={'image'} onClick={() => this.selectMediaType('image')} className="form-tab" label={this.props.language.image} />
                    </Tabs>
                    { 
                      this.state.story.nodes[this.state.selectedNode].type !== "end" ? 
                        <Tabs
                          color="secondary"
                          value={this.state.mediaType}
                          indicatorColor="secondary"
                          textColor="secondary"
                          className="form-tabs-container-media"
                          variant="fullWidth"
                          centered={true}
                        >
                          <Tab value={'audio'} onClick={() => this.selectMediaType('audio')} className="form-tab" label={this.props.language.audio} />   
                        </Tabs>
                      :
                        undefined
                    }
                    { 
                      this.state.story.nodes[this.state.selectedNode].type !== "end" ? 
                        <Tabs
                          color="primary"
                          value={this.state.mediaType}
                          indicatorColor="primary"
                          textColor="primary"
                          className="form-tabs-container-media"
                          variant="fullWidth"
                          centered={true}
                        >
                          <Tab value={'video'} onClick={() => this.selectMediaType('video')} className="form-tab" label={this.props.language.video} />   
                        </Tabs>
                      :
                        undefined
                    }
                  </div>
                  {
                    this.state.mediaType === 'audio' && this.state.story.nodes[this.state.selectedNode].type !== "end" ?
                      <div className="storytelling-menu-body">
                        <Tabs
                          color="secondary"
                          value={this.state.audioType}
                          indicatorColor="secondary"
                          textColor="secondary"
                          className="form-tabs-container"
                          variant="fullWidth"
                          centered={true}
                        >
                          <Tab value={'record'} onClick={() => this.selectAudioType('record')} className="form-tab" label={this.props.language.record} />
                          <Tab value={'upload'} onClick={() => this.selectAudioType('upload')} className="form-tab" label={this.props.language.upload} />
                          <Tab value={'reuse'} onClick={() => this.selectAudioType('reuse')} className="form-tab" label={this.props.language.reuse} />
                        </Tabs>
                        <br/>
                        {
                          this.state.audioType === 'record' ?
                            this.state.story.nodes[this.state.selectedNode].audio !== '' ?
                              <div className="center-row"> 
                                <Button
                                  className="bar-button"
                                  variant="outlined"
                                  color="secondary"
                                  onClick={() => this.unPickAudioFile()}
                                >
                                  {this.props.language.recordAgain}
                                </Button>
                              </div>
                            :
                              <AudioRecorder
                                getFileInformation={this.getFileInformation.bind(this)}
                              />
                          : 
                            undefined 
                        }
                        {
                          this.state.audioType === 'upload' ?
                            this.state.story.nodes[this.state.selectedNode].audio !== '' ?
                              <div className="center-row"> 
                                <Button
                                  className="bar-button"
                                  variant="outlined"
                                  color="secondary"
                                  onClick={() => this.unPickAudioFile()}
                                >
                                  {this.props.language.changeAudio}
                                </Button>
                              </div>
                            :
                              <FileUpload
                                type='audio'
                                user={Meteor.userId()}
                                accept={'audio/*'}
                                label={this.props.language.uploadAudioButtonLabel}
                                getFileInformation={this.getFileInformation.bind(this)}
                                handleControlMessage={this.props.handleControlMessage.bind(this)}
                                language={this.props.language}
                              /> 
                          : 
                            undefined                     
                        }
                        {
                          this.state.audioType === 'reuse' ?
                            <div className="center-row"> 
                              <Button variant="contained" onClick={() => this.handleLibraryContent("audio")} color="secondary" className="bar-button">             
                                {this.props.language.reuseAudio}
                              </Button>
                            </div>
                          : 
                            undefined                     
                        }
                        <br/>
                        {
                          this.state.story.nodes[this.state.selectedNode].audio !== '' ?
                            <AudioPreview
                              file={this.state.story.nodes[this.state.selectedNode].audio}
                            />
                          :
                            undefined
                        }
                      </div>
                    :
                      undefined
                  }
                  {
                    this.state.mediaType === 'image' ?
                      <div className="storytelling-menu-body">
                        <Tabs
                          color="primary"
                          value={this.state.imageType}
                          indicatorColor="primary"
                          textColor="primary"
                          className="form-tabs-container"
                          variant="fullWidth"
                          centered={true}
                        >
                          <Tab value={'upload'} onClick={() => this.selectImageType('upload')} className="form-tab" label={this.props.language.upload} />
                          <Tab value={'reuse'} onClick={() => this.selectImageType('reuse')} className="form-tab" label={this.props.language.reuse} />
                        </Tabs>
                        <br/>
                        {
                          this.state.imageType === 'upload' ?
                            this.state.story.nodes[this.state.selectedNode].image !== '' ?
                              <div className="center-row"> 
                                <Button
                                  className="bar-button"
                                  variant="outlined"
                                  color="primary"
                                  onClick={() => this.unPickImageFile()}
                                >
                                  {this.props.language.changeImage}
                                </Button>
                              </div>
                            :
                              <FileUpload
                                color='primary'
                                type='image'
                                user={Meteor.userId()}
                                accept={'image/*'}
                                label={this.props.language.uploadImageButtonLabel}
                                getFileInformation={this.getFileInformation.bind(this)}
                                handleControlMessage={this.props.handleControlMessage.bind(this)}
                                language={this.props.language}
                              />
                          : 
                            undefined                     
                        }
                        {
                          this.state.imageType === 'reuse' ?
                            <div className="center-row"> 
                              <Button variant="contained" onClick={() => this.handleLibraryContent("images")} color="primary" className="bar-button">
                                {this.props.language.reuseImg}
                              </Button>	
                            </div>
                          : 
                            undefined                     
                        }
                        {
                          this.state.story.nodes[this.state.selectedNode].image !== '' ?
                            <ImagePreview
                              key={this.state.story.nodes[this.state.selectedNode].rotate}
                              file={this.state.story.nodes[this.state.selectedNode].image}
                              rotateangle={this.rotateangle}
                              rotateAngle={this.state.story.nodes[this.state.selectedNode].rotate}
                            />
                          :
                            undefined
                        }
                      </div>
                    :
                      undefined
                  }
                  {
                    this.state.mediaType === 'video' && this.state.story.nodes[this.state.selectedNode].type !== "end" ?
                      <div className="storytelling-menu-body">
                        <Tabs
                          color="primary"
                          value={this.state.videoType}
                          indicatorColor="primary"
                          textColor="primary"
                          className="form-tabs-container"
                          variant="fullWidth"
                          centered={true}
                        >
                          <Tab value={'url'} onClick={() => this.selectVideoType('url')} className="form-tab" label={this.props.language.byUrlVideo} />
                          <Tab value={'upload'} onClick={() => this.selectVideoType('upload')} className="form-tab" label={this.props.language.upload} />
                          <Tab value={'reuse'} onClick={() => this.selectVideoType('reuse')} className="form-tab" label={this.props.language.reuse} />
                        </Tabs>
                        <br/>
                        {
                          this.state.videoType === 'url' ?
                            this.state.story.nodes[this.state.selectedNode].video !== '' ?
                              <div className="center-row"> 
                                <Button
                                  className="bar-button"
                                  variant="outlined"
                                  color="primary"
                                  onClick={() => this.unPickVideoFile()}
                                >
                                  {this.props.language.changeURL}
                                </Button>
                              </div>
                            :
                              <TextField
                                id="url-input"
                                label="Url"
                                margin="normal"
                                variant="outlined"
                                value={this.state.url}
                                autoFocus={true}
                                onChange={this.urlHandleChange()}
                                className="url-input-storytelling"
                                helperText={ this.state.showHelperText ? <div className="url-helper-text" style={{color: this.state.helperColor}}>{this.state.urlMessage}</div> : undefined }
                              />
                          : 
                            undefined 
                        }
                        {
                          this.state.videoType === 'upload' ?
                            this.state.story.nodes[this.state.selectedNode].video !== '' ?
                              <div className="center-row"> 
                                <Button
                                  className="bar-button"
                                  variant="outlined"
                                  color="primary"
                                  onClick={() => this.unPickVideoFile()}
                                >
                                  {this.props.language.changeVideo}
                                </Button>
                              </div>
                            :
                              <FileUpload
                                color='primary'
                                type='video'
                                user={Meteor.userId()}
                                accept={'video/*'}
                                label={this.props.language.uploadVideoButtonLabel}
                                getFileInformation={this.getFileInformation.bind(this)}
                                handleControlMessage={this.props.handleControlMessage.bind(this)}
                                language={this.props.language}
                              /> 
                          : 
                            undefined                     
                        }
                        {
                          this.state.videoType === 'reuse' ?
                            <div className="center-row"> 
                              <Button variant="contained" onClick={() => this.handleLibraryContent("video")} color="primary" className="bar-button">             
                                {this.props.language.reuseVideo}
                              </Button>
                            </div>
                          : 
                            undefined                     
                        }
                        <br/>
                        {console.log(this.state.story.nodes[this.state.selectedNode].video)}
                        {
                          this.state.story.nodes[this.state.selectedNode].video !== '' ?
                            this.state.story.nodes[this.state.selectedNode].video.name === "externalVideoUrlStorytelling" ?
                              <ReactPlayer controls className="course-creator-preview-player" url={this.state.story.nodes[this.state.selectedNode].video.link}/>
                            :
                              <div className="video-preview-container">
                                <VideoPreview file={this.state.story.nodes[this.state.selectedNode].video}/>
                              </div>
                          :
                            undefined
                        }
                      </div>
                    :
                      undefined
                  }
                </div>
              </div>
              { 
                this.state.story.nodes[this.state.selectedNode].type !== 'start' ?
                  <Tooltip title={this.props.language.deleteThisScene}>
                    <Fab
                      color="secondary"
                      className="storytelling-delete-button"
                      onClick={() => this.openDialog('delete')}
                    >
                      <DeleteIcon/>
                    </Fab>
                  </Tooltip>
                :
                  undefined
              }
            </div>
          :
            <React.Fragment>
              <StorytellingPlayer
                story={this.state.story}
                comments={false}
                link={false}
                language={this.props.language}
              />
              <Button color="primary" onClick={() => this.handleReturn()} className="storytelling-return-button">
                <ArrowBackIcon className="storytelling-return-icon"/>
                {this.props.language.return}
              </Button>
            </React.Fragment>
        }

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-confirmation"
          aria-describedby="alert-dialog-confirmation"
          maxWidth={false}
          disableBackdropClick={true}
        >
          {
            this.state.action === "delete" ?
              <React.Fragment>
                <DialogTitle className="success-dialog-title" id="alert-dialog-title">
                  {this.props.language.deletNode}
                </DialogTitle>
                <DialogContent className="success-dialog-content">
                  <DialogContentText className="success-dialog-content-text" id="alert-dialog-description">
                    {this.props.language.sureDeleteNode}
                  </DialogContentText>
                  <WarningIcon className="warning-dialog-icon"/>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => this.handleClose()} color="primary" autoFocus>
                    {this.props.language.cancel}
                  </Button>
                  <Button variant="outlined" onClick={() => this.deleteNode()} color="primary" autoFocus>
                    {this.props.language.confirm}
                  </Button>
                </DialogActions>
              </React.Fragment>
            :
              undefined
          }
          {
            this.state.action === "save" ?
              <React.Fragment>
                <DialogTitle className="success-dialog-title" id="alert-dialog-title">
                  {this.props.language.saveStory}
                </DialogTitle>
                <DialogContent className="success-dialog-content">
                  <TextField
                    id="story-name-input"
                    label={this.props.language.storyName}
                    placeholder={this.props.language.myStory}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    autoComplete={"off"}
                    required
                    value={this.state.story.name}
                    onChange={this.handleChange('storyName')}
                    helperText={this.props.language.storyNameHelper}
                  />
                  <DialogContentText className="success-dialog-content-text" id="alert-dialog-description">
                    {this.props.language.storyNameText}
                  </DialogContentText>
                  <WarningIcon className="warning-dialog-icon"/>
                </DialogContent>

                <DialogActions>
                  <Button onClick={() => this.handleClose()} color="primary" autoFocus>
                    {this.props.language.cancel}
                  </Button>
                  <Button onClick={() => this.saveStory()} color="primary" autoFocus>
                    {this.props.language.save}
                  </Button>
                </DialogActions>

              </React.Fragment>
            :
              undefined
          }
          {
            this.state.action === "publish" ?
              <React.Fragment>
                <DialogTitle className="success-dialog-title" id="alert-dialog-title">
                  {this.props.language.publishStory}
                </DialogTitle>
                <DialogContent className="success-dialog-content">
                  {console.log(this.state)}
                  {console.log(this.props)}
                  <DialogContentText className="copyright-dialog-content-text" id="alert-dialog-description">
                    <p>{this.props.language.questionpublishstory}</p><br/>
                    <p>        {this.props.language.questionpublishstory001}</p><br/> 
                    <div className="copyright-dialog-content-data">
                      <div>
                        <p>{this.props.language.questionpublishstory003}:</p>
                        <p>{this.props.language.questionpublishstory004}:</p>
                        <p>{this.props.language.questionpublishstory005}:</p>
                      </div>
                      <div style={{"margin-left": "1vw"}}>
                        <p style={{"font-weight": "bold"}}>{this.state.story.name}</p>
                        <p style={{"font-weight": "bold"}}>{this.props.user.username}</p>
                        <p style={{"font-weight": "bold"}}>{this.props.user.profile.fullname}</p>
                      </div>
                    </div>
                  </DialogContentText>
                  <InfoIcon className="warning-dialog-icon"/>
                </DialogContent>
                <DialogActions>
                  <Button variant="outlined"  color="primary" className="bar-button" onClick={() => this.handleyes()}>
                    {this.props.language.yes}
                  </Button>	
                  <Button variant="contained"  color="primary" className="bar-button" onClick={() => this.handleClose()}>
                    {this.props.language.no}
                  </Button>
                </DialogActions>                 
              </React.Fragment>
            :
              undefined
          }   
          
          { 
            this.state.action === "reuse" || this.state.action === "reuseAudio" || this.state.action === "reuseVideo"?
              <React.Fragment>
                <DialogTitle className="dialog-title">
                  <AppBar className="dialog-app-bar" color="primary" position="static">
                    <Toolbar className="dialog-tool-bar-information" variant="dense" disableGutters={true}>
                      <AppsIcon/>
                      <h4 className="dialog-label-title">
                        {this.state.action === "reuse" ? this.props.language.reuseImg : undefined}
                        {this.state.action === "reuseAudio" ? this.props.language.reuseAudio : undefined} 
                        {this.state.action === "reuseVideo" ? this.props.language.reuseVideo : undefined}  
                      </h4>
                      <IconButton
                        id="close-icon"
                        edge="end"
                        className="dialog-toolbar-icon"
                        onClick={this.handleClose}
                      >
                        <CloseIcon/>
                      </IconButton>
                    </Toolbar>
                  </AppBar>
                </DialogTitle>
                {
                  this.state.action === "reuse"?
                    <div className="library-files-container">
                      {this.state.dataImages1.map(tile => (
                        <div className="storytelling-image-library">
                          <div style={{backgroundImage: `url(${tile.link})`}} className="file-image-preview" onDoubleClick={() => {this.getFileInformation(tile), this.handleClose()}}></div>
                        </div> 
                      ))}
                    </div>
                  :
                    undefined
                }
                {
                  this.state.action === "reuseAudio"?
                    <div className="library-files-container">
                      {this.state.dataAudio1.map(tile => (    
                        <div onDoubleClick={() => {this.getFileInformation(tile), this.handleClose()}} className="audio-card-storytelling">
                          <audio 
                            ref="reuseAudio" 
                            className="card-media-audio-storytelling"
                            src={tile.link} 
                            controls
                          />
                          <div className="card-actions-bottom-container" disableSpacing>
                            {`${this.props.language.audioTitle}: ${tile.name}`}
                            <Tooltip title={this.props.language.edit}>
                              <IconButton className="card-button" onClick={() => this.changeFileName(tile.name, tile._id)} aria-label="delete">
                                <EditIcon className="card-icon"/>
                              </IconButton>
                            </Tooltip>
                          </div> 
                        </div>
                      ))}
                    </div>
                  :
                    undefined
                }
                {
                  this.state.action === "reuseVideo"?
                    <div className="library-files-container">
                      {this.state.dataVideo1.map(tile => (    
                        <div onDoubleClick={() => {this.getFileInformation(tile), this.handleClose()}} className="audio-card-storytelling">
                          <div className="card-media-audio-storytelling">
                            {
                              tile.name === "externalVideoUrlStorytelling" ?
                                <ReactPlayer className="course-creator-preview-player" url={tile.link}/>
                              :
                                <div className="video-preview-container-library">
                                  <VideoPreview file={tile}/>
                                </div>
                            }  
                          </div>
                          <div className="card-actions-bottom-container" disableSpacing>
                            {`${this.props.language.videoTitle}: ${tile.name === "externalVideoUrlStorytelling" ? tile.link : tile.name}`}
                            {
                              tile.name === "externalVideoUrlStorytelling" ?
                                undefined
                              :
                                <Tooltip title={this.props.language.edit}>
                                  <IconButton className="card-button" onClick={() => this.changeFileName(tile.name, tile._id)} aria-label="delete">
                                    <EditIcon className="card-icon"/>
                                  </IconButton>
                                </Tooltip>
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  :
                    undefined
                }
                <DialogActions>
                  <div className="dialog-actions-container-reuse">
                    { this.state.action === "reuse" ? this.props.language.audiomessage : this.props.language.videoLibraryMessage}
                  </div>
                </DialogActions>
              </React.Fragment> 
            :
              undefined
          }     
        </Dialog>
        <Dialog
          open={this.state.renameFile} ///true for show
          onClose={this.handleCloseRename}
          aria-labelledby="alert-dialog-confirmation"
          aria-describedby="alert-dialog-confirmation"
        >
          <DialogTitle className="dialog-title">
            <AppBar className="dialog-app-bar" color="primary" position="static">
              <Toolbar className="dialog-tool-bar-information" variant="dense" disableGutters={true}>
                <h4 className="dialog-label-title">{this.props.language.renameFileTitle}</h4>
                <IconButton
                  id="close-icon"
                  edge="end"
                  className="dialog-toolbar-icon"
                  onClick={this.handleCloseRename}
                >
                  <CloseIcon/>
                </IconButton>
              </Toolbar>
            </AppBar>
          </DialogTitle>
          <div className="story-rename-container">
            <TextField
              id="rename-file-input"
              label={this.props.language.fileTitle}
              margin="normal"
              variant="outlined"
              fullWidth
              multiline
              value={this.state.renameFileTitle}
              onChange={this.renameHandleChange()}
            />
          </div>
          <div className="dialog-actions-container">
            <Tooltip title={this.props.language.ok}>
              <Fab onClick={() => this.finishChangeFileName()} aria-label="file name changed" className="dialog-fab" color="primary">
                <DoneIcon />
              </Fab>
            </Tooltip>
          </div>
        </Dialog>
        {/* After publish */}
        <PublishMethods
          user={this.props.user}
          openpublish={this.state.openpublish}
          saved={this.state.saved}
          handleClose={this.handleClose.bind(this)}
          handleClosepublish={this.handleClosepublish.bind(this)}
          handleyes={this.handleyes.bind(this)}
          publishOnCourse={this.publishOnCourse.bind(this)}
          language={this.props.language}
        />
      </React.Fragment>
    )
  }
}
export default withStyles(useStyles)(StorytellingTool)
