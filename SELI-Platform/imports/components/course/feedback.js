import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AccessibilityIcon from "@material-ui/icons/Accessibility";
import InfoIcon from "@material-ui/icons/Info";
import WarningIcon from "@material-ui/icons/Warning";
import HelpIcon from "@material-ui/icons/Help";
import LiveHelpIcon from "@material-ui/icons/LiveHelp";
import Help from "./stepHelp";
import Decision from "./decisionHelp";

const useStyles = makeStyles(theme => ({
  iconButton: {
    verticalAlign: "baseline",
    padding: ".4em",
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  a11yValid: {
    color: "#00897b"
  },
  a11yInvalid: {
    color: "#e53935"
  },
  error: {
    color: "#e53935"
  },
  helperText: {
    color: "rgba(0, 0, 0, 0.54)",
    fontSize: "0.75rem",
    textAlign: "left",
    fontWeight: "400",
    lineHeight: "1.66",
    letterSpacing: "0.03333em"
  },
  fakeButton: {
    border: "1px solid",
    padding: ".2em",
    minWidth: "fit-content",
    display: "inline-block"
  }
}));

/*
	error: boolan --> if there's error on accessibility validation
	id: string --> id of form component
	tipMs: string --> small help presented inline
	step: [hp5Helper || textHelper|| imagePurposeHelper_info|| imagePurposeHelper_deco|| imagePurposeHelper_txt|| imagePurposeHelper_cplx|| imageAltHelper_info|| imageAltHelper_txt|| imageAltHelper ] --> help with i,age examples presented as popover
	guide: [imgPurposeCond]
 */
export default function FeedbackHelp(props) {
  const classes = useStyles();
  //console.log("Accesibility HELP ERROR",props)

  const { validation, tipMsg, describedBy, stepHelp, decisionHelp, language } = props;

  return (
    <React.Fragment>
      <div className={classes.helperText} id={describedBy} component="span">
        <span>
          {
          tipMsg!=null?
            <div className="feedback-container">
              <InfoIcon aria-label="Tip" /> {tipMsg}
            </div>
            :
            undefined    
          }
          
        </span>
        {validation.a11y && (
          <div
            className={
              validation.a11y.valid ? classes.a11yValid : classes.a11yInvalid
            }
          >
            <div className="feedback-container">
              <AccessibilityIcon />
              {validation.a11y.valid
                ? language.Passedaccessibilityvalidation
                : language.Accessibilityfault}
            </div>
          </div>
        )}
        {validation.error && (
          <div role="alert" className={classes.error}>
            <div className="feedback-container">
              <WarningIcon aria-label="Error" /> {validation.errorMsg}
            </div>
          </div>
        )}
      </div>
      {/* There is a bug in codesandbox o I can't use a Button now */}
      {/* <Button
        variant="contained"
        className={classes.button}
        startIcon={<HelpIcon />}
        id={describedBy+ "_helpButton"}
      >
        More details
      </Button> */}
      <div className="feedback-container">
        {stepHelp && (
          <Help
            helpsTips={props.stepHelp.helpsTips.analysisTipsHelps}
            helper={stepHelp.step}
            aria-label="Accessibilit tip"
            text={stepHelp.stepLabel}
            color="primary"
            buttonLabel={props.language.feedback_a11y_helpStep_button}
            useStyle={classes.iconButton}
          />
        )}
        {decisionHelp && (
          <Decision
            caller={decisionHelp.name}
            buttonLabel="Help me decide"
            useStyle={classes.iconButton}
            ariaLabel="Accessibilit help"
            // color="secondary"
          />
        )}
      </div>
    </React.Fragment>
  );
}
