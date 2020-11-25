import React, { Component } from 'react';

import Divider from '@material-ui/core/Divider';

import Loading from '../tools/Loading';
import { Courses } from '../../../lib/CourseCollection';

import CertificateGallery from '../certificates/CertificateGallery';

import WarningIcon from '@material-ui/icons/Warning';
import SchoolIcon from '@material-ui/icons/School';
import InfoIcon from '@material-ui/icons/Info';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class MyCertificates extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
    }
  }

  componentDidMount() {
    this.props.getSubscribedCourses(() => this.getSubscribedCourses());
    this.getSubscribedCourses();
  }

  componentWillReceiveProps() {
    this.getSubscribedCourses();
  }

  getSubscribedCourses = () => {
    this.setState({
      courses: [],
      loading: true,
    }, () => {
      let user = Meteor.users.find({_id: Meteor.userId()}).fetch();
      this.buildCourses(user[0].profile.courses);
    })
  }

  buildCourses = (courses) => {
    let ids = [];
    courses.map(course => {
      ids.push(course.courseId);
    });
    Tracker.autorun(() => {
      let coursesInformation = Courses.find(
        { _id: {
          $in: ids
        }}
      ).fetch();
      courses.map(course => {
        coursesInformation.map(information => {
          information._id === course.courseId ?
          course.information = information : undefined
        })
      });
      this.setState({
        courses: courses,
        loading: false,
      });
    });
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return(
      <div className="subscriptions-dashboard-container">
        <p className="management-title">{this.props.language.myCertificates}<SchoolIcon className="management-title-icon"/></p>
        <Divider/>
	{console.log("despues de divider")}
        {
          this.state.loading ?
            <div className="dashboard-loading-container">
              <Loading message="Loading certificates..."/>
            </div>
          :
          <div>
            {
              this.state.courses.length ?
                <div className="subscriptions-dashboard-result">
                  {
                //    this.state.courses.map((course, index) => {
                  //    return (
                        <CertificateGallery

                        />
                    //  )
                   // })
                  }
                </div>
              :
              <div className="empty-dashboard">
                <div className="empty-dashboard-row">
                  <p className="empty-dashboard-text">{this.props.language.youAreNotSubscribed}</p>
                  <InfoIcon className="empty-dashboard-icon"/>
                </div>
                <Button onClick={() => this.props.showComponent('courses')} variant="contained" color="primary" className="empty-dashboard-button">{this.props.language.checkOutCourses}</Button>
              </div>
            }
          </div>
        }
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-confirmation"
          aria-describedby="alert-dialog-confirmation"
          disableBackdropClick={true}
        >
          <DialogTitle className="success-dialog-title" id="alert-dialog-title">{this.state.dialogConfirmationTitle}</DialogTitle>
          <DialogContent className="success-dialog-content">
            <DialogContentText className="success-dialog-content-text" id="alert-dialog-description">
              {this.state.dialogConfirmationContentText}
            </DialogContentText>
            <WarningIcon className="warning-dialog-icon"/>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handleClose()} color="primary" autoFocus>
              {this.props.language.cancel}
            </Button>
            <Button onClick={() => this.state.confirmAction()} color="primary" autoFocus>
              {this.props.language.confirm}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}
