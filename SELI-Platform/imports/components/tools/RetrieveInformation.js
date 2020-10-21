import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';

import {noSpecialCharacters} from '../../../lib/textFieldValidations';

export default class RetrieveInformation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      RetrieveInformation: this.props.RetrieveInformation,
      showError: false,
      passwordToConfirm: '',
    }
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  }; 

  handleChange = name => event => {
    let RetrieveInformation = this.state.RetrieveInformation;
    if (name === 'email') {
      RetrieveInformation.email = event.target.value;
      if (this.state.validEmail) {
        this.setState({
          validatingEmail: false,
          validEmail: false,
          emailResult: false,
        }, () => {
          this.props.handleEmail(false);
        })
      }
    }
    this.setState({
      RetrieveInformation: RetrieveInformation,
    });
  };

  keyController = (event, from) => {
    if (from === "username") {
      if (event.which == 32 || event.keyCode == 32) {
        event.preventDefault();
        return false;
      }
      else {
        noSpecialCharacters(event);
      }
    }
    if (from === "email") {
      if (event.which == 13 || event.keyCode == 13) {
        this.validateEmail();
      }
    }
  } 

  validateEmail = ()  => {
    if (!this.state.validatingEmail) {
      this.state.RetrieveInformation.email !== '' ?
        this.setState({
          validatingEmail: true,
          emailHelperMessage: this.props.language.validatingEmail,
        }, () => {
          Meteor.call("ValidateEmail", this.state.RetrieveInformation.email, (error, response) =>  {
            let message;
            //response=true;
            response ? message = this.props.language.validEmail : message = this.props.language.invalidEmail;
            this.setState({
              emailResult: true,
              validEmail: response,
              emailHelperMessage: message,
            }, () => {
              this.setState({
                validatingEmail: false,
              }, () => {
                this.state.validEmail ? this.props.handleEmail(true) : this.props.handleEmail(false)
              });
            })
          });
        })
      :
      this.setState({
        emailResult: false,
        validatingEmail: false,
      })
    } else {
      this.props.handleControlMessage(true, this.props.language.validatingEmail);
    }
  }

  componentDidMount() {
    this.props.showErrorFunction(() => this.showError());
  }

  showError = () => {
    this.setState({
      showError: true,
    });
  }

  componentWillUnmount(){

  } 

  render() {
    return(

      <div className="form-container">

        <div className="input-container">
          {`${this.props.language.enterEmailtoSent}`}
        </div>
        <div className="input-container">

          <TextField
            id="email-input"
            label={this.props.language.email}
            margin="normal"
            variant="outlined"
            fullWidth
            autoComplete={"off"}
            required
            value={this.state.RetrieveInformation.email}
            onChange={this.handleChange('email')}
            onBlur={() => this.validateEmail()}
            onKeyPress={() => this.keyController(event, 'email')}
            error={this.state.showError && this.state.RetrieveInformation.email === ''}
            helperText={
              <div>
                {
                  this.state.emailResult && !this.state.validatingEmail ?
                    <div className="form-helper-container">
                      {
                        this.state.validEmail ?
                          <div className="success-helper-text">
                            <p>{this.state.emailHelperMessage}</p>
                          </div>
                        :
                        <div className="error-helper-text">
                          <p>{this.state.emailHelperMessage}</p>
                        </div>
                      }
                    </div>
                  :
                  undefined
                }
                {
                  this.state.validatingEmail ?
                    <div className="form-helper-container">
                      <p>{this.state.emailHelperMessage}</p>
                      <LinearProgress className="helper-progress"/>
                    </div>
                  :
                  undefined
                }
              </div>
            }
          />
        </div>
      </div>
      );
    }
  }
