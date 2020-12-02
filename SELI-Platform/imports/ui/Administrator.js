import React from 'react';

import { Meteor } from 'meteor/meteor';

import MainMenu from '../components/navigation/MainMenu';
import AppBar from '../components/navigation/AppBar';

import Presentation from '../components/navigation/Presentation';
import TutorRequestList from '../components/administrator/TutorRequestList';
import DisabilitieRequestList from '../components/administrator/DisabilitieRequestList';
import RequirementsRequestList from '../components/administrator/RequirementsRequestList';
import TutorsList from '../components/administrator/TutorsList';
import StudentsList from '../components/administrator/StudentsList';
import CoursesList from '../components/administrator/CoursesList';
import BugsList from '../components/administrator/BugsList';
import CommentsList from '../components/administrator/CommentsList';
import DisabilitiesList from '../components/administrator/DisabilitiesList';
import RequirementsList from '../components/administrator/RequirementsList';
import ControlSnackbar from '../components/tools/ControlSnackbar';
import Loading from '../components/tools/Loading';
import AccountManagement from '../components/user/AccountManagement';

import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from '../style/theme';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import {checkUserType} from '../../lib/userSesions';

import english from '../../lib/translation/english';
import spanish from '../../lib/translation/spanish';
import portuguese from '../../lib/translation/portuguese';
import polish from '../../lib/translation/polish';
import turkish from '../../lib/translation/turkish';
import DashboardComponent from '../components/dashboard/dashboard';

export default class Tutor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      component: 'home',
      language: english,
    }
  }

  componentDidMount(){
    this.setState({
      chekingSesion: true,
    }, () => {
      Meteor.call("GetUser", (error, response) =>  {
        checkUserType(response, 'administrator', this.props.history);
        this.setState({
          user: response,
          chekingSesion: false,
        });
      });
    });
  }

  logOut = () => {
    Meteor.logout((error) => {
      this.props.history.push('/');
    })
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
  }

  showComponent = (component) => {
    this.setState({
      component: component,
    });
  }

  handleControlMessage = (show, message, showAction, action, actionMessage, course) => {
    if (show) {
      if (action === 'savedList') {
        action = () => this.showComponent('saved');
      }
      else if (action === 'preview') {
        action = () => this.showPreview();
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

  editCourse = (course) => {
    this.setState({
      courseToEdit: course,
    }, () => {
      this.showComponent('edit');
    });
  }

  render() {
    return(
      <div>
        <MuiThemeProvider theme={theme}>
          <div id="outer-container">
            {
              this.state.user !== undefined ?
                <MainMenu
                  user={this.state.user}
                  language={this.state.language}
                  showComponent={this.showComponent.bind(this)}
                />
              :
              undefined
            }
            <main id="page-wrap">
              <AppBar
                setLanguage={this.setLanguage.bind(this)}
                language={this.state.language}
                user={this.state.user}
                logOut={this.logOut.bind(this)}
                showComponent={this.showComponent.bind(this)}
              />
              {
                this.state.component === 'home' ?
                  <Presentation
                    language={this.state.language}
                  />
                :
                undefined
              }
              {
                this.state.component === 'bugs' ?
                  <BugsList
                    user={this.state.user}
                    language={this.state.language}
                    handleControlMessage={this.handleControlMessage.bind(this)}
                  />
                :
                undefined
              }
              {
                this.state.component === 'tutorRequests' ?
                  <TutorRequestList
                    user={this.state.user}
                    language={this.state.language}
                    handleControlMessage={this.handleControlMessage.bind(this)}
                  />
                :
                undefined
              }
              {
                this.state.component === 'disabilitieRequests' ?
                  <DisabilitieRequestList
                    user={this.state.user}
                    language={this.state.language}
                    handleControlMessage={this.handleControlMessage.bind(this)}
                  />
                :
                undefined
              }
              {
                this.state.component === 'dashboard' ?
                    <DashboardComponent/>
                  :
                    undefined
                }
                {
                this.state.component === 'requirementRequests' ?
                  <RequirementsRequestList
                    user={this.state.user}
                    language={this.state.language}
                    handleControlMessage={this.handleControlMessage.bind(this)}
                  />
                :
                undefined
              }
              {
                this.state.component === 'tutors' ?
                  <TutorsList
                    user={this.state.user}
                    language={this.state.language}
                    handleControlMessage={this.handleControlMessage.bind(this)}
                  />
                :
                undefined
              }
              {
                this.state.component === 'students' ?
                  <StudentsList
                    user={this.state.user}
                    language={this.state.language}
                    handleControlMessage={this.handleControlMessage.bind(this)}
                  />
                :
                undefined
              }
              {
                this.state.component === 'courses' ?
                  <CoursesList
                    user={this.state.user}
                    language={this.state.language}
                    handleControlMessage={this.handleControlMessage.bind(this)}
                  />
                :
                undefined
              }
              {
                this.state.component === 'disabilities' ?
                  <DisabilitiesList
                    user={this.state.user}
                    language={this.state.language}
                    handleControlMessage={this.handleControlMessage.bind(this)}
                  />
                :
                undefined
              }
              {
                this.state.component === 'requirements' ?
                  <RequirementsList
                    user={this.state.user}
                    language={this.state.language}
                    handleControlMessage={this.handleControlMessage.bind(this)}
                  />
                :
                undefined
              }
              {
                this.state.component === 'comments' ?
                  <CommentsList
                    user={this.state.user}
                    language={this.state.language}
                    handleControlMessage={this.handleControlMessage.bind(this)}
                  />
                :
                undefined
              }
              {
                this.state.component === 'account' ?
                  <AccountManagement
                    user={this.state.user}
                    language={this.state.language}
                    handleControlMessage={this.handleControlMessage.bind(this)}
                    showErrorFunction={showError => this.showError = showError}
                    reRender={this.forceUpdate.bind(this)}
                  />
                :
                undefined
              }
            </main>
          </div>
          <ControlSnackbar
            showControlMessage={this.state.showControlMessage}
            showControlAction={this.state.showControlAction}
            controlMessage={this.state.controlMessage}
            controlAction={this.state.controlAction}
            controlActionMessage={this.state.controlActionMessage}
            handleControlMessage={this.handleControlMessage.bind(this)}
          />
          <Dialog
            open={this.state.chekingSesion}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-confirmation"
            aria-describedby="alert-dialog-confirmation"
            disableBackdropClick={true}
            disableEscapeKeyDown={true}
          >
            <DialogTitle className="success-dialog-title" id="alert-dialog-title">Checking sesion please wait</DialogTitle>
            <DialogContent className="success-dialog-content">
              <Loading message='Loading user...'/>
            </DialogContent>
          </Dialog>
        </MuiThemeProvider>
      </div>
      );
    }
  }
