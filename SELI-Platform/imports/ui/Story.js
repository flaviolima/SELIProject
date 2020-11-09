import React, { Component } from 'react';
import { Session } from 'meteor/session';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';

import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from '../style/theme';

import ControlSnackbar from '../components/tools/ControlSnackbar';
import CommentDialog from '../components/student/comments/CommentDialog';
import StorytellingPlayer from '../components/storytelling/StorytellingPlayer';
import StorytellingPlayerTime from '../components/storytelling/StorytellingPlayerTime';

import AppBar from '../components/navigation/AppBar';

import { Activities } from '../../lib/ActivitiesCollection';
import { Comments } from '../../lib/CommentsCollection';

import english from '../../lib/translation/english';
import spanish from '../../lib/translation/spanish';
import portuguese from '../../lib/translation/portuguese';
import polish from '../../lib/translation/polish';
import turkish from '../../lib/translation/turkish';
import {Helmet} from "react-helmet";

export default class Story extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      story: undefined,
      _id: "",
    }
  }

  componentDidMount() {
    Session.set({language: Session.get('language') ? Session.get('language') : english});
    this.setState({
      language: Session.get('language') ? Session.get('language') : english,
    });
    this.setState({
      loadingStory: true,
    }, () => {
      this.state._id = this.props.location.hash.substr(1);
      Tracker.autorun(() => {
        let story = Activities.find({_id: this.state._id}).fetch();
        if (story.length) {
          story = story[0];
          let type = story.activity.type;
          story = story.activity;
          story.nodes = story.data;
          story.data = null;
          this.setState({
            story,
            type,
            loadingStory: false,
          });
        }
        else {
          this.setState({
            story: undefined,
          });
        }
      });
    });
  }

  handleCloseComment = () => {
    this.setState({ openComment: false });
  }

  showCommentDialog = () => {
    this.setState({
      openComment: true,
    });
  }



  sendComment = (comment) => 
  
  {

    let UserID = Meteor.userId() ? Meteor.userId().toString() : 'guest';
    var UserNameByID = Meteor.users.findOne({_id: UserID});
    if(UserNameByID != undefined){
      var UserName = UserNameByID.username;
    }
    Comments.insert({
      comment: comment,
      user: Meteor.userId() !== null ? UserName : "guest" ,
      story: this.state._id,
      show: true,
      date: new Date(),
    }, () => {
      this.handleControlMessage(true, "Comment successfully sent");
    })
  }

  handleControlMessage = (show, message, showAction, action, actionMessage, course) => {
    if (show) {
      if (action === 'subscribed') {
        action = () => this.showComponent('subscribed');
      }
      if (action === 'stories') {
        action = () => this.showComponent('stories');
      }
      this.setState({
        showControlMessage: show,
        controlMessage: message,
        controlAction: action,
        controlActionMessage: actionMessage,
        showControlAction: showAction,
        course: action === 'preview' ? course : undefined
      });
    }
    else {
      this.setState({
        showControlMessage: show,
      });
    }
  }

  setLanguage = (option) => {
    let language = this.state.language;
    if (option === 'Portuguese (PT)') {
      Session.set({language: portuguese});
      language = portuguese;
    }
    else if (option === 'English (US)') {
      Session.set({language: english});
      language = english;
    } 
    else if (option === 'Spanish (ES)') {
      Session.set({language: spanish});
      language = spanish;
    }
    else if (option === 'Polish (PL)') {
      Session.set({language: polish});
      language = polish;
    }
    else if (option === 'Turkish (TR)') {
      Session.set({language: turkish});
      language = turkish;
    }
    this.setState({
      language: language,
    });
    Meteor.call("ChangeLanguague", Meteor.userId(), option, (error, response) =>  {});
  }

  getTitleOfStory() {
    try {
      this.state._id = this.props.location.hash.substr(1);
      let story = Activities.find({ _id: this.state._id}).fetch();
      if(story.length){
        story = story[0];
        story = story.activity;
        if(story.name){
          return story.name;
        }      
      }   
    } catch  {  }    
    return "SELI-Platform";
  }

  getImageUrlForSocial(){
    try{
      this.state._id = this.props.location.hash.substr(1);
    let result = Activities.find({ _id: this.state._id}).fetch();
      if(result.length){
        result = result[0];
        result = result.activity.data;
        result = result[0].images;
        result = result[0].link;
        if(result){
          return result;
        }      
      }
    }
    catch {}
    return "http://" + window.location.hostname + "/seli-logo.png";
  }
  
  render() {
    return(
      <div>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{this.getTitleOfStory()}</title>
          <meta property="og:url"                content={window.location.href} />
          <meta property="og:type"               content="website" />
          <meta property="og:title"              content={this.getTitleOfStory()} />
          <meta property="og:image"              content={this.getImageUrlForSocial()} />
        </Helmet>
        <MuiThemeProvider theme={theme}>
          {  
            this.state.language && Session.get('language') ?  
              <React.Fragment>      
                <div id="outer-container">
                  <main id="page-wrap">
                    <AppBar
                      history={this.props.history}
                      language={this.state.language}
                      setLanguage={this.setLanguage.bind(this)}
                      user={undefined}
                      fromAnotherSource
                    />
                    {
                      !this.state.story || !this.state.type ? undefined :
                        this.state.type === "storytelling" ?
                          <StorytellingPlayer
                            story={this.state.story}
                            comments={true}
                            link={true}
                            showCommentDialog={this.showCommentDialog.bind(this)}
                            language={this.state.language}
                          />
                        :
                          <StorytellingPlayerTime
                            story={this.state.story}
                            comments={true}
                            link={true}
                            showCommentDialog={this.showCommentDialog.bind(this)}
                            language={this.state.language}
                          />
                    }
                  </main>
                </div>
                <CommentDialog
                  open={this.state.openComment}
                  title={this.state.language.leaveCommentStory}
                  handleClose={this.handleCloseComment.bind(this)}
                  sendComment={this.sendComment.bind(this)}
                  handleControlMessage={this.handleControlMessage.bind(this)}
                  language={this.state.language}
                />
                <ControlSnackbar
                  showControlMessage={this.state.showControlMessage}
                  showControlAction={this.state.showControlAction}
                  controlMessage={this.state.controlMessage}
                  controlAction={this.state.controlAction}
                  controlActionMessage={this.state.controlActionMessage}
                  handleControlMessage={this.handleControlMessage.bind(this)}
                />
              </React.Fragment>
            :
              undefined
          }
        </MuiThemeProvider>
      </div>
    )
  }
}
