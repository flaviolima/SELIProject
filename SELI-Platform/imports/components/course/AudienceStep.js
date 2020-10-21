import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import RemoveIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import DoneIcon from "@material-ui/icons/Done";
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import WarningIcon from '@material-ui/icons/Warning';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
//import FeedbackHelp from "./feedback";
import FeedbackHelp from "../../components/course/feedback"

//import AccessibilityDialog from '../../components/accessibility/AccessibilityDialog'

//import SimulateButtons from "./simulate";
const useStyles = makeStyles(theme => ({
  root: {
    "& $deleteButton:hover": {
      backgroundColor: "#d91e1822"
      //color: "#d91e18"
    },
    "& $saveButton:hover": {
      backgroundColor: "#00897b22"
      //color: "#d91e18"
    }
  },
  nested: {
    paddingLeft: theme.spacing(4)
  },
  hidden: {
    display: "none"
  },
  addButton: {
    color: theme.palette.secondary.main
  },
  deleteButton: {},
  saveButton: {},
  nav: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#f5f5f5"
  },
  header: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: "#e0e0e0!important"
  }
}));




export default function AudienceApp(props) {
  const { handleComplete, handleSkip, completed, skiped, courseInformation, cancelCounter, language } = props;
  const classes = useStyles();
  //update state of checkboxes

  useEffect(() => {
    loadingData();
  }, []); 

  useEffect(() => {
    loadingData();
  }, [cancelCounter]);

  loadingData = () => {
    if (courseInformation.support.length != 0) {
      if (courseInformation.support[0] && courseInformation.support[0].length) setAudiencesAux();
      if (courseInformation.support[1] && courseInformation.support[1].length) setAudiencesGolAux();
      if (courseInformation.support[2] === undefined) {
        setOtherAudiences([])
      } else {
        setOtherAudiences(courseInformation.support[2])
      }
    }
    //update accessibilty
    if(courseInformation.accessibility.length!=0){
      setaudienceTooltip(courseInformation.accessibility[0]) 
    }
  }

  setAudiencesAux = () => {
    let newAudiences = [...audiences];
    courseInformation.support[0].map((audience, index) => {
      newAudiences[index].isChecked = audience.isChecked;
    });
    setAudiences(newAudiences);
  }

  setAudiencesGolAux = () => {
    let newAudiencesGol = [...audiencesGol];
    courseInformation.support[1].map((audienceGol, index) => {
      newAudiencesGol[index].isChecked = audienceGol.isChecked;
    });
    setAudiencesGol(newAudiencesGol);
  }

  useEffect(()=>{
   // loadingData();
    //ve si al menos uno esta en true
    let validate=false;
    audiences.map((value, index)=>{
      if(value.isChecked===true){
        /* audiencesGol.map((value, index)=>{
          if(value.isChecked===true){
            validate=true;
            props.validate('passAudience')
          }
        }) */
        validate=true;
        props.validate('passAudience')
      }
    })

    otherAudiences.map((value, index)=>{
      console.log("verificar las otras Audeincias;;;;;;", value)
      if(value.label!=undefined){
        if(value.label!=""){
          validate=true;
          props.validate('passAudience')
        }
      }
    })


    if(validate===false){ props.validate('NopassAudience')}
  })
  //course information
  const [open, setopen]= useState(false)
  const [opensnack, setopensnack]= useState(true)
  const [feedbackError, setfeedbackError]=useState(true)
  const [feedbackErrorAudiences, setfeedbackErrorAudiences]=useState(true)
  const [labelindexdelete, setlabelindexdelete]=useState("")
  const [indexdelete,  setindexdelete]=useState(0)
  const [tooltip, settooltip]=useState(false)
  const [courseinformation, setcourseInformation]= useState(courseInformation)
  const [audiences, setAudiences] = useState([
    {
      id: 0,
      value: "StudentsGrad",
      label: language.Graduatestudents,
      isChecked: false
    },
    {
      id: 1,
      value: "StudentsInfor",
      label: language.Informalstudents,
      isChecked: false
    },
    {
      id: 2,
      value: "Teachers",
      label: language.TeachersandProfessors,
      isChecked: false
    },
    { id: 3, 
      value: "Kids", 
      label: language.Preschoolkids, 
      isChecked: false 
    },
    { id: 4, 
      value: "post graduate student", 
      label: language.Postgraduatestudent, 
      isChecked: false 
    },
    { id: 5, 
      value: "pregrade student", 
      label: language.Pregradestudent, 
      isChecked: false 
    },
    { id: 6, 
      value: "High School Students", 
      label: language.HighSchoolStudents, 
      isChecked: false 
    },
    { id: 7, 
      value: "Middle School Students", 
      label: language.MiddleSchoolStudents, 
      isChecked: false 
    },
    { id: 8, 
      value: "Elementary School Students", 
      label: language.ElementarySchoolStudents, 
      isChecked: false 
    }
    
  ]);
  const [audiencesGol,setAudiencesGol]=useState([
    
    {
      id: 0,
      value: "cog",
      label: language.Cognitive,
      isChecked: false
    },
    {
      id: 1,
      value: "Eld",
      label: language.Elderly,
      isChecked: false
    },
    {
      id: 2,
      value: "Hear",
      label: language.Hearing,
      isChecked: false
    },
    {
      id: 3,
      value: "Vis",
      label: language.Hearing,
      isChecked: false
    }
  ]);

  useEffect(() => {
    let newAudiences = [...audiences];
    let newAudiencesGol = [...audiencesGol];
    newAudiences[0].label = language.Graduatestudents;
    newAudiences[1].label = language.Informalstudents;
    newAudiences[2].label = language.TeachersandProfessors;
    newAudiences[3].label = language.Preschoolkids;
    newAudiences[4].label = language.Postgraduatestudent;
    newAudiences[5].label = language.Pregradestudent;
    newAudiences[6].label = language.HighSchoolStudents;
    newAudiences[7].label = language.MiddleSchoolStudents;
    newAudiences[8].label = language.ElementarySchoolStudents;
    newAudiencesGol[0].label = language.Cognitive;
    newAudiencesGol[1].label = language.Elderly;
    newAudiencesGol[2].label = language.Hearing;
    newAudiencesGol[3].label = language.Visual;
    setAudiences(newAudiences);
    setAudiencesGol(newAudiencesGol);
  }, [language.languageIndex]);

  const [otherAudiences, setOtherAudiences] = useState([]);

  const [controlEdit, setControlEdit] = useState({
    tempValue: "",
    adding: false,
    editing: false
  });
  const [saveButton, setsaveButton]=useState(false)
  //tooltips
  const [audienceTooltip, setaudienceTooltip]= useState({
    audienceError: true,
    audienceallError:true,
    audiencegolError: true,
    audienceallgolError:true,
  })
  const [requirementTooltip, setrequirementTooltip]= useState({
    newaudience: language.addNewAudience,
    AddHardware: language.AddHardware,
    AddSoftware: language.AddSoftware,
    errorMsg: language.errorMsg,
    openHardware: language.openHardware,
    openSoftware: language.alreadyAudiences,

  })///messages
  const [message, setmessage]=useState(requirementTooltip.errorMsg)
  const handleCancelEditAudience = index => () => {
    if (controlEdit.adding) deleteAudience(index);
    else {
      let newAudiences = [...otherAudiences];
      newAudiences[index].editing = false;
      setOtherAudiences(newAudiences);
    }
    setControlEdit({ tempValue: "", adding: false, editing: false });
  };
  const handleEditedAudience = index => () => {

    
    let validAudiences= validateAudiences()
    if(validAudiences==="noequal"){
      let newAudiences = [...otherAudiences];
      newAudiences[index].editing = false;
      newAudiences[index].label = controlEdit.tempValue;
      setOtherAudiences(newAudiences);
      setControlEdit({ tempValue: "", adding: false, editing: false });
      let addNewAudiences=courseinformation;
      addNewAudiences.support[2]=otherAudiences
      setcourseInformation(addNewAudiences)
      console.log('courseinformation---',courseinformation)

      audienceTooltip.audienceError=false;
        setaudienceTooltip(audienceTooltip)
    }
    
  };
  function deleteAudience(index) {
    
    let newAudiences = [...otherAudiences];
    if (index === 0) newAudiences = [...newAudiences.slice(1)];
    else if (index === audiences.length - 1)
      newAudiences = [...newAudiences.slice(0, index)];
    else
      newAudiences = [
        ...newAudiences.slice(0, index),
        ...newAudiences.slice(index + 1)
      ];
    setOtherAudiences(newAudiences);
    let addNewAudiences=courseinformation;
    addNewAudiences.support[2]=newAudiences
    setcourseInformation(addNewAudiences)
    //console.log('courseinformation---',courseinformation)
  }
  const handleDeleteAudience = (index) => () => {
    console.log("borrado",tooltip.audienceError)
    
     setopen(true)
     setindexdelete(index)
     setlabelindexdelete(otherAudiences[index].label)
     //audienceTooltip.audienceError=true;
     let ischecked=audiences.filter(audience=>audience.isChecked===false)
     console.log("data*****", audiences, otherAudiences.length, ischecked.length)
     if(ischecked.length==9 && otherAudiences.length==1){
      
      audienceTooltip.audienceError=true;
     }
     
     setaudienceTooltip(audienceTooltip)
     
   
  };
  const handleNewAudience = (e) => {
    let pass= numberAudiences()
    console.log("pass****",pass, e.keyCode)

    if(e.keyCode===32){
      //continue
      console.log(e.keyCode)
    }else{
      if(pass==="valid"){
        setfeedbackError(true)
        setOtherAudiences(prev => [
          ...prev,
          { label: "", editing: true }
        ]);
    
        setControlEdit({
          tempValue: "",
          adding: true,
          editing: true
        }); 
      }else{
        console.log("aqui va toolTip")
        settooltip(true)
        setmessage("You can only add five extra audiences.")
        setControlEdit({
          tempValue: "",
          adding: false,
          editing: false
        });
      }
    }
    
     
  };
  const handleEditAudience = index => () => {
    let newAudiences = [...otherAudiences];
    newAudiences[index].editing = true;

    setOtherAudiences(newAudiences);
    setControlEdit({
      tempValue: otherAudiences[index].label,
      adding: false,
      editing: true
    });
  };
  const handleCheck = (index) => {
      let newAudiences = [...audiences];
      newAudiences[index].isChecked = !newAudiences[index].isChecked;
      setAudiences(newAudiences);
      let addAudicences=courseinformation;
      addAudicences.support[0]=newAudiences
      setcourseInformation(addAudicences) 

      let tooltip=audienceTooltip;
      if(newAudiences[index].isChecked===true){
        tooltip.audienceError=false;
        setaudienceTooltip(tooltip)
        let checks=courseinformation;
        checks.accessibility[0]=tooltip
        setcourseInformation(checks)
      }else if (newAudiences[index].isChecked===false){
        tooltip.audienceError=true;
        setaudienceTooltip(tooltip)
        let checks=courseinformation;
        checks.accessibility[0]=tooltip
        setcourseInformation(checks)
      }
      let count=0;
      audiences.map((audience, index)=>{
        if(audience.isChecked===true){
          count++;
          tooltip.audienceError=false;
          setaudienceTooltip(tooltip)
          console.log("count", count,audiences.length)
          if(count===audiences.length){ 
            tooltip.audienceallError=false;
            setaudienceTooltip(tooltip)
            let checks=courseinformation;
            checks.accessibility[0]=tooltip
            setcourseInformation(checks)
          }
        }else{
          tooltip.audienceallError=true;
          setaudienceTooltip(tooltip)
          let checks=courseinformation;
          checks.accessibility[0]=tooltip
          setcourseInformation(checks)
        }
      })
     
  };
  const handleCheckGol = (index) => {
    let newAudiences = [...audiencesGol];
    newAudiences[index].isChecked = !newAudiences[index].isChecked;
    setAudiencesGol(newAudiences);
    let addAudicencesGol=courseinformation;
    addAudicencesGol.support[1]=newAudiences
    setcourseInformation(addAudicencesGol) 
    
    console.log("pone ne verde tooltip")
    let tooltip=audienceTooltip;
    if(newAudiences[index].isChecked===true){
      tooltip.audiencegolError=false;
      setaudienceTooltip(tooltip)
      let checksgol=courseinformation;
      console.log("checksgol",checksgol)
      checksgol.accessibility[1]=tooltip
      setcourseInformation(checksgol)
    }else if (newAudiences[index].isChecked===false){
      tooltip.audiencegolError=true;
      setaudienceTooltip(tooltip)
      let checksgol=courseinformation;
      console.log("checksgol",checksgol)
     checksgol.accessibility[1]=tooltip
     setcourseInformation(checksgol)
    }
    //save to database 
    
    ///
    let count=0;
    audiencesGol.map((audience, index)=>{
      if(audience.isChecked===true){
        count++;
        tooltip.audiencegolError=false;
        setaudienceTooltip(tooltip)
        console.log("count", count,audiences.length)
        if(count===audiencesGol.length){
          
          tooltip.audienceallgolError=false;
          setaudienceTooltip(tooltip)
        }
      }else{
        tooltip.audienceallgolError=true;
        setaudienceTooltip(tooltip)
      }
    })
    
  };

  function updateTempValue(value, index) {
   // console.log("se va ha editar esto******", index, otherAudiences)
    //delete actual from other audiences requireent camila 
    otherAudiences[index].label=''; //for bug the Unique Validation should not validate against the value of the current field.
    setOtherAudiences(otherAudiences);
    setControlEdit(prev => {
      return { ...prev, tempValue: value };
    });

    console.log("el valor", value)
    
    
    if(/^(?:[A-Za-zñığüşöçİĞÜŞÖÇ0-9_ ]+)*$/.test(value)===false){ //validate characters /^[a-zA-ZñığüşöçİĞÜŞÖÇ0-9 ]*$/;
      setsaveButton(true)
    }else{
      setsaveButton(false)
    }

    if(value.replace(/\s/g,"") == ""){
      setsaveButton(true)
    }

    if(value!="") {
       setfeedbackError(false)
    }
    else{ 
      setfeedbackError(true)
    }
    setmessage(requirementTooltip.errorMsg)
  }
  //methods for validations no repeated values
  const validateAudiences=()=>{
    let audiencesArray=[]
    let otheraudiencesArray=[]
    audiences.map((audience, index)=>{
      audiencesArray.push(audience.label.toLowerCase())
    })
    otherAudiences.map((audience, index)=>{
      otheraudiencesArray.push(audience.label.toLowerCase())
    })
    let valueinArray=audiencesArray.find((audience)=>{return audience===controlEdit.tempValue.toLowerCase() })
    let valueinOtherArray=otheraudiencesArray.find((audience)=>{return audience===controlEdit.tempValue.toLowerCase() })
    if((valueinArray!=undefined) || (valueinOtherArray!=undefined)){
      
      if(valueinArray===undefined){
  
        setfeedbackError(true)
        setmessage(requirementTooltip.openHardware+controlEdit.tempValue+" "+props.language.before)
        return "equal"
      }else if(valueinOtherArray===undefined){
        console.log("coincide777",valueinOtherArray, valueinArray, controlEdit.tempValue)
        setfeedbackError(true)
        setmessage(controlEdit.tempValue+" "+requirementTooltip.openSoftware)
        return "equal"
      }else{
        return "equal"
        
      }
    }else{
      console.log("no coincide")
      return "noequal"
    }   
  }
  //methods for validate only five Audiences
  const numberAudiences=()=>{
    let numberAudiences=otherAudiences.length;
    if (numberAudiences>=5){
      return "invalid"
    }else return "valid"
  }
  const handleClose = () => {  
      setopen(false)
  };
  function handleClosesnack(){
      settooltip(false)
  }
  function SnackbarAudiences(){
    return(
      <Snackbar
          key={Math.random()}
          anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
          }}
          open={opensnack}
          autoHideDuration={17000}
          //onClose={handleClose("snack")}
          message={message}
          action={
          <React.Fragment>
              <IconButton
              aria-label="close"
              color="inherit"
             // className={classes.close}
              onClick={handleClosesnack}
              >
              <CloseIcon />
              </IconButton>
          </React.Fragment>
          }
      />
    )
  }

  return (
    <div className="form-input-container">
      <div className="form-input-steps">
        <h2 id="aud_title">{language.audiences}</h2><br/>
        <h3 id="aud_title">{language.IntendedAudience}</h3>
        <div role="group" aria-labelledby="aud_title">
          <List component="ul" key={"li03"}>
            <FeedbackHelp
              language={language}
              validation={{
                error: false,
                errorMsg: "",
                errorType: "a11y",
                //a11y: { valid: !audienceTooltip.audienceallError }
              }}
              tipMsg={null}
              describedBy={"i04-helper-text"}     
            />
            <ListItem key="aud_SelectAll" dense>
              <Checkbox
                color="secondary"
                edge="start"
                checked={
                  !audiences.some(audience => audience.isChecked === false) 
                }
                // value={audience.value}
                onClick={event => {
                  let newAudiences = [...audiences];
                  newAudiences.forEach(
                    audience => (audience.isChecked = event.target.checked)
                  );
                  setAudiences(newAudiences);
                  let addAudicences=courseinformation;
                  addAudicences.support[0]=newAudiences
                  setcourseInformation(addAudicences)
                  let tooltip=audienceTooltip;
                  if(event.target.checked===true){
                    tooltip.audienceallError=false;
                    tooltip.audienceError=false;
                    setaudienceTooltip(tooltip)
                    let checks=courseinformation;
                    checks.accessibility[0]=tooltip
                    setcourseInformation(checks)
                  }else{
                    tooltip.audienceallError=true;
                    tooltip.audienceError=true;
                    setaudienceTooltip(tooltip)
                    let checks=courseinformation;
                    checks.accessibility[0]=tooltip
                    setcourseInformation(checks)
                  }
                }}
                disableRipple
                inputProps={{
                  "aria-labelledby": "checkbox-list-label-selectAll"
                }}
              />
              {/* </ListItemIcon> */}
              <ListItemText
                id="checkbox-list-label-selectAll"
                primary={language.SelectAll}
              />
            </ListItem>      
            
            {audiences.map((audience, index) => (
              <ListItem key={index} dense>
                {/* {console.log(audience.label) */}
                <Checkbox
                  color="primary"
                  edge="start"
                  checked={audience.isChecked}
                  value={audience.value}
                  onClick={() => handleCheck(audience.id)}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": `checkbox-list-label-${audience.id}`
                  }}
                />
                <ListItemText
                  id={`checkbox-list-label-${audience.id}`}
                  primary={audience.label}
                />
              </ListItem>
            ))}
            
            {otherAudiences.map((audience, index) => (
              <ListItem
                // button={!audience.editing}
                component="li"
                key={"li_aud" + index}
              >
                <ListItemText
                  key={"li_aud" + index + "listeItemTxt"}
                  primary={audience.label}
                  className={audience.editing ? classes.hidden : ""}
                />
                <div className={!audience.editing ? classes.hidden : ""}>
                  <TextField
                    key={"li_aud" + index + "txtField"}
                    className={!audience.editing ? classes.hidden : ""}
                    value={controlEdit.tempValue}
                    onChange={event => updateTempValue(event.target.value, index)}
                  />
                  <FeedbackHelp
                      language={language}
                      validation={{
                        error: feedbackError,
                        errorMsg: message,
                        errorType: "required",
                        //a11y: null
                      }}
                      tipMsg={requirementTooltip.newaudience}
                      describedBy={"i02-helper-text"}
                    />
                </div>

                <ListItemSecondaryAction key={"li_aud" + index + "secAc"}>
                  {audience.editing ? (
                    <React.Fragment>
                      <IconButton
                        key={"li_aud" + index + "btnEditSaveUnit"}
                        edge="end"
                        aria-label={"Save changes"}
                        onClick={handleEditedAudience(index)}
                        className={classes.saveButton}
                        disabled={(controlEdit.tempValue === "" || saveButton===true)}
                      >
                        <DoneIcon />
                      </IconButton>
                      <IconButton
                        key={"li_aud" + index + "btnEditCancelUnit"}
                        edge="end"
                        aria-label={"Cancel changes"}
                        onClick={handleCancelEditAudience(index)}
                        className={classes.deleteButton}
                      >
                        <ClearIcon />
                      </IconButton>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <IconButton
                        key={"li_aud" + index + "btnEditUnit"}
                        edge="end"
                        aria-label={"Edit unit name"}
                        onClick={handleEditAudience(index)}
                        disabled={controlEdit.editing}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        key={"li_aud" + index + "btnDeleteUnit"}
                        edge="end"
                        onClick={handleDeleteAudience(index, 'nodelete')}
                        className={classes.deleteButton}
                      >
                        <RemoveIcon />
                      </IconButton>
                    </React.Fragment>
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            ))}
            
            <ListItem
              key="addaudience"
              button
              onClick={handleNewAudience}
              id="addaudience"
              disabled={controlEdit.editing}
              className={classes.addButton}
            >
              <AddIcon /> <ListItemText primary={language.addNewAudience} />
            </ListItem>

            <FeedbackHelp
              language={language}
              validation={{
                error: audienceTooltip.audienceError,
                errorMsg: "Intended Audience is a mandatory field, select at least one.",
                errorType: "a11y",
              // a11y: { valid: !audienceTooltip.audienceError }
              }}
              tipMsg={language.targetAudience}
              describedBy={"i04-helper-text"}     
            /> 

            {tooltip===true?
              SnackbarAudiences()
              :
              undefined
            }

          </List>
        </div>
        <h3 id="aud_title">{language.InclusionGoals}</h3>
        <div role="group" aria-labelledby="aud_title2">
          <List component="ul" key={"li03"}>
            <FeedbackHelp
              language={language}
              validation={{
                error: false,
                errorMsg: "",
                errorType: "a11y",
                //a11y: { valid: !audienceTooltip.audienceallgolError }
              }}
              tipMsg={null}
              describedBy={"i04-helper-text"}     
            />
            <ListItem key="aud_SelectAll2" dense>
              <Checkbox
                color="secondary"
                edge="start"
                checked={
                  !audiencesGol.some(audiencegol => audiencegol.isChecked === false)
                }
                onClick={event => {
                  let newAudiencesgol = [...audiencesGol];
                  newAudiencesgol.forEach(
                    audiencegol => (audiencegol.isChecked = event.target.checked)
                  );
                  setAudiencesGol(newAudiencesgol);
                  console.log(event.target.checked)
                  
                  let addAudicencesGol=courseinformation;
                  addAudicencesGol.support[1]=newAudiencesgol
                  setcourseInformation(addAudicencesGol)

                  let tooltip=audienceTooltip;
                  if(event.target.checked===true){
                    tooltip.audienceallgolError=false;
                    tooltip.audiencegolError=false;
                    setaudienceTooltip(tooltip)
                  }else{
                    tooltip.audienceallgolError=true;
                    tooltip.audiencegolError=true;
                    setaudienceTooltip(tooltip)
                  } 
                }}
                disableRipple
                inputProps={{
                  "aria-labelledby": "checkbox-list-labelGol-selectAll"
                }}
              />
              {/* </ListItemIcon> */}
              <ListItemText
                id="checkbox-list-label-selectAll"
                primary={language.SelectAll}
              />
            </ListItem>
          
            {audiencesGol.map((audienceGol, index) => (
              <ListItem key={index} dense>
                {/* console.log(audienceGol.label) */}
                <Checkbox
                  color="primary"
                  edge="start"
                  checked={audienceGol.isChecked}
                  value={audienceGol.value}
                  onClick={() => handleCheckGol(audienceGol.id)}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": `checkboxgol-list-label-${audienceGol.id}`
                  }}
                />
                {/* </ListItemIcon> */}
                <ListItemText
                  id={`checkboxgol-list-label-${audienceGol.id}`}
                  primary={audienceGol.label}
                />
              </ListItem>
            ))}
            <FeedbackHelp
                language={language}
                validation={{
                  error: false,
                  errorMsg: "",
                  errorType: "a11y",
                  //a11y: { valid: !audienceTooltip.audiencegolError}
                }}
                tipMsg={language.Validatetheinclusion}
                describedBy={"i04-helper-text"}     
            />
          </List>
        </div>

        <br/>
        <FeedbackHelp
        language={props.language}
          validation={{
            error: false,
            errorMsg: "xxxx",
            errorType: "xxxxxtttt",
            a11y: null
          }}
          tipMsg={language.appropriateOption}
          describedBy={"i05-helper-text"}
          stepHelp={{
            step: "textHelper",
            stepLabel: props.language.CourseAudiencesHelp ,
            helpsTips:props.language.audiencesTipsHelps
          }}
        />
        <Dialog disableBackdropClick={true} onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
          <DialogTitle className="success-dialog-title" id="simple-dialog-title">{language.warning}</DialogTitle>
          <DialogContent className="success-dialog-content">
            <DialogContentText style={{padding: "0 1vw"}}>{`${language.deleteItemBelow}: "${labelindexdelete}" ${language.wantProceed}`}</DialogContentText>
            <WarningIcon className="warning-dialog-icon"/> 
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={() => setopen(false)} color="primary">{language.no}</Button>
            <Button variant="outlined"  color="primary" onClick={() => {
              //setdeleteDialog(true)
              deleteAudience(indexdelete);
              setopen(false)
            }} 
            ><em>{language.yes}</em></Button> 
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
