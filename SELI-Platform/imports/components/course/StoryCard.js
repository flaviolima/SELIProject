import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Meteor } from 'meteor/meteor';

import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import SchoolIcon from '@material-ui/icons/School';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Fade from 'react-reveal/Fade';
import UnsubscribeIcon from '@material-ui/icons/Unsubscribe';
import CommentIcon from '@material-ui/icons/Comment';

import Loading from '../tools/Loading';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Comment from '../../components/student/comments/Comment';

import {Comments} from '../../../lib/CommentsCollection';
import { StudentLog } from '../../../lib/StudentLogCollection';
import { withStyles } from '@material-ui/core/styles';
import { data } from 'jquery';
var ColorThief = require('color-thief');

const useStyles =theme => ({
	root: {
		display: "flex",
		flexWrap: "wrap",
		"& > *": {
			margin: theme.spacing(1),
			width: theme.spacing(16),
			height: theme.spacing(16)
		}
	},
	card: {
		maxWidth: 345,
		//  maxHeight: 450,
		display: "tabel-cell",
		paddingRight: "1em"
	},
	media: {
		height: 0,
		paddingTop: "56.25%" // 16:9
	},
	searchbar: {
		//padding: '2px 4px',
		display: "flex",
		alignItems: "center",
		maxWidth: "95vw",
		minWidth: "95vw",
		background: "black",
		"& *": {
			color: "white"
		}
	},
	input: {
		marginLeft: theme.spacing(1),
		flex: 1
	},
	iconButton: {
		padding: 10
	},
	divider: {
		height: 28,
		margin: 4
	}
});

class StoryCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      label: '',
      subscribed: false,
      UsersStoryUserName: 'abc',
      StoryImageURL: '',
      description: '',
      descriptionScenes: '',
      descriptionStories: '',
      Categories: [],
    }
    // database düzenlemesi gerekiyor eski derslerin categorisi olmadığı için patlıyor.
    var categoryNames = this.props.course.activity.categories.map((category) => category);
    for (var i = 0; i < categoryNames.length; i++) {
    if(categoryNames[i]) {
    var categoryInfo = categoryNames[i];
    if(categoryInfo !== null){
      this.state.Categories.push(categoryInfo) ;
      }
    }
  }
    this.state.descriptionScenes = this.props.course.activity.data.map(item => item.english);
    if(this.props.course.activity.data.map(item => item.description)[0]){
      this.state.descriptionStories = this.props.course.activity.data.map(item => item.description.english); 
    }
    else{
      var descriptionData = this.props.course.activity.data.map(item => item.scripts)[0];
      var descriptionEnglish = descriptionData.map(a => a.script.english);
      this.state.descriptionStories = descriptionEnglish;
    }
    if (this.state.descriptionStories == null ){
      this.state.description = this.state.descriptionScenes;
    }else{
      this.state.description = this.state.descriptionStories;
    }
    
    var labelname = this.props.course.activity.name;
    this.state.label= labelname.toString();
    var UserIDInfo = this.props.course.activity.user;
    let UsersStoryId= Meteor.users.findOne({_id: UserIDInfo});
    if(UsersStoryId != undefined) {
      this.state.UsersStoryUserName= UsersStoryId.username;

    }

  }
  componentDidMount() {
    this.getImageColors();
    // this.getKeyWords();
    // this.checkSubscriptions();
    
  }

  // getKeyWords = () => {
  //   let keyWords = this.props.course.keyWords;
  //   let label = '';
  //   keyWords.map((keyWord, index) => {
  //     label = label + keyWord;
  //     index + 1 === keyWords.length ? undefined : label = label + ", "
  //   })
  //   this.setState({
  //     label: label,
  //   });
  // }

  getImageColors() {
    var colorThief = new ColorThief();
    var courseImage = new Image(500, 500);
    var DataType = this.props.course.activity.data.map(data => data.type);

    if(DataType[0]) {
      this.props.course.activity.data.map((data, index) => {
        var obje = data.image;
        this.state.StoryImageURL = obje.link;
      });
      var courseImageURLroute = this.state.StoryImageURL;

    }else {
      this.props.course.activity.data.map((data, index) => {
        var obje = data.images.map(item => item.file.link);
        this.state.StoryImageURL = obje;
    
    });
    courseImageURLroute = this.state.StoryImageURL;

  }
    courseImage.src = courseImageURLroute;


    let self = this;
    courseImage.addEventListener('load', function() {
      let mainColor = colorThief.getColor(courseImage);
      let mainContrastColor = self.getContrastColor(self.fullColorHex(mainColor[0], mainColor[1], mainColor[2]));
      mainColor = self.fullColorHex(mainColor[0], mainColor[1], mainColor[2]);
      mainColor = `#${mainColor}`;
      mainContrastColor = `#${mainContrastColor}`;
      self.setState({
        mainColor: mainColor,
        mainContrastColor: mainContrastColor,
      })
    });
  }

  rgbToHex (rgb) {
    var hex = Number(rgb).toString(16);
    if (hex.length < 2) {
      hex = "0" + hex;
    }
    return hex;
  };

  fullColorHex(r, g, b) {
    var red = this.rgbToHex(r);
    var green = this.rgbToHex(g);
    var blue = this.rgbToHex(b);
    return red+green+blue;
  };

  getContrastColor(hexColor) {
    var r = parseInt(hexColor.substr(0, 2), 16);
    var g = parseInt(hexColor.substr(2, 2), 16);
    var b = parseInt(hexColor.substr(4, 2), 16);
    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#212121' : '#FFFFFF';
  }

  componentWillReceiveProps() {
    // this.checkSubscriptions();
  }

  checkSubscriptions = () => {
    let subscribed = this.props.userCourses.findIndex(course => course.courseId === this.props.course._id);
    if (subscribed > -1){
      this.setState({
        subscribed: true,
      });
    }
  }

  handleClose = () => {
    this.setState({
      open: false,
    });
  }

  showComments = () => {
    this.setState({
      open: true,
      loading: true,
    }, () => {
      Tracker.autorun(() => {
        let comments = Comments.find({story: this.props.course._id, show: true}).fetch();
        if (comments.length) {
          this.setState({
            commentResults: true,
            comments: comments,
            loading: false,
          });
        }
        else {
          this.setState({
            commentResults: false,
            loading: false,
          });
        }
      });
    })
  }

  redirect = url => {
    this.props.history.push({
      pathname: url,
      state: {
        language: this.props.language,
      }
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
      
          <Card className="course-card">
            <CardActionArea >
              <CardHeader
                avatar={
                  <Avatar
                    style={{backgroundColor: this.state.mainColor, color: this.state.mainContrastColor}}
                    aria-label="recipe"
                    className="course-card-avatar"
                  >
                     <h2>{this.props.course.title.charAt(0).toUpperCase()}</h2>
                  </Avatar>
                }
                className="course-card-header"
                title={
                  <h2 className="MuiTypography-root MuiCardHeader-title MuiTypography-body2 MuiTypography-displayBlock">{this.props.course.activity.name}</h2>
                }
                subheader={
                  <h3 className="MuiTypography-root MuiCardHeader-subheader MuiTypography-body2 MuiTypography-colorTextSecondary MuiTypography-displayBlock">{this.props.course.activity.name}</h3>
                }
              /> 
              <CardMedia
                className={classes.media}
                image={this.state.StoryImageURL}
                title={this.state.label}                
              />
              <CardContent >
                <Typography variant="body2" color="textSecondary" component="p">
                  {this.state.description}
                </Typography>
                <Typography className="course-card-extra-information" variant="overline" color="textSecondary" component="p">
                  {`${this.props.language.author}: ${this.state.UsersStoryUserName}`}
                </Typography>
                <Typography className="course-card-extra-information" variant="overline" color="textSecondary" component="p">
                  {`Categories : ${this.state.Categories}`}
                </Typography>
              </CardContent>
              <CardActions  disableSpacing>
                <Link className="button-link MuiButtonBase-root MuiButton-root MuiButton-outlined course-card-button"
                  target="_blank"
                  to={{
                    pathname: "/story",
                    hash: this.props.course._id,
                    state: { fromDashboard: true },
                  }}
                  onClick={() => 
                    {
                      StudentLog.insert({ "UserId": Meteor.userId(), "CourseId" : this.props.course._id, 
                      "Datetime": new Date(), "Action": "Story Preview" });
                    }}
                >
                  {this.props.language.storyPreview}
                </Link>
                {/* {
                  !this.state.subscribed ?
                    <Tooltip title={this.props.language.subscribeJoin}>
                      <IconButton
                        disabled={this.props.disabled}
                        onClick={() => this.props.subscribe(this.props.course._id)}
                        className="course-card-icon-button"
                        aria-label="join course"
                      >
                        <SchoolIcon className="course-card-icon"/>
                      </IconButton>
                    </Tooltip>
                  :
                  <Tooltip title={this.props.language.unsubscribeToolti}>
                    <IconButton
                      className="course-card-icon-button"
                      disabled={this.props.disabled}
                      onClick={() => this.props.unsubscribe(this.props.course._id)}
                      aria-label="left course"
                    >
                      <UnsubscribeIcon className="course-card-icon"/>
                    </IconButton>
                  </Tooltip>
                } */}
                <Tooltip title={this.props.language.courseCommentsTooltip}>
                  <IconButton
                    className="course-card-icon-button"
                    onClick={() => this.showComments()}
                    aria-label="left course"
                  >
                    <CommentIcon className="course-card-icon"/>
                  </IconButton>
                </Tooltip>
              </CardActions>
            </CardActionArea>
          </Card>
        
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-confirmation"
          aria-describedby="alert-dialog-confirmation"
          className="comments-dialog"
          disableBackdropClick={true}
        >
          <DialogTitle className="comment-dialog-title">
            {this.props.language.comments}
          </DialogTitle>
          <DialogContent className="comments-dialog-content">
            {
              this.state.loading ?
                <Loading message={this.props.language.loadingComments}/>
              :
              <div>
                {
                  this.state.commentResults ?
                    <div className="comments-result-container">
                      {
                        this.state.comments.map((comment, index) => {
                          return(
                            <Comment
                              comment={comment}
                              commentOf={this.props.language.commentOf}
                            />
                          )
                        })
                      }
                    </div>
                  :
                  <div className="comments-result-container">
                    <div className="center-row">
                      <DialogContentText className="success-dialog-content-text" id="alert-dialog-description">
                        {this.props.language.noCommentsText}
                      </DialogContentText>
                    </div>
                    <div className="center-row">
                      <CommentIcon className="comments-result-icon"></CommentIcon>
                    </div>
                  </div>
                }
              </div>
            }
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default  withStyles(useStyles)(StoryCard)