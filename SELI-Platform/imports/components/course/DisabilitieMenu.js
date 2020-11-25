import React, {useState, useEffect, useCallback} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Divider from '@material-ui/core/Divider';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

const useStyles = makeStyles(theme => ({
  typography: {
    padding: theme.spacing(2),
  },
  root: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function MenuItem(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [lists, setLists] = React.useState([]);
  //const listsFirst = Disabilities.find().fetch();

  useEffect(() => {
    console.log("el meni de didabilities y propiedades",props)
  

    setLists(props.disabilitieOptions[1]);
  }, [props.disabilitieOptions[1]])

  const handleToggle = index => () => {
    let prevLists = lists;
    console.log("prevLists,index, support",prevLists,index)
    
      prevLists[index].isChecked = !prevLists[index].isChecked;
      /* let allSelected = true;
      for (var i = 0; i < prevLists.length; i++) {
        if (!prevLists[i].isChecked) {
          allSelected = false;
        }
      }
      allSelected ? prevLists[0].isChecked = true : prevLists[0].isChecked = false; */
    
    /* let support = [];
    prevLists.map((option, index) => {
      if (option.isChecked && index > 0) {
        support.push(listsFirst[index-1)
      }
    }) */
    console.log("prevLists,index, support-------",prevLists,index,)
   props.setOption(prevLists);

    
  };

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function getDisabilities() {
    let disabilities = "";
    let disabilitiesCounter = 0;
    for (var i = 0; i < lists.length; i++) {
      if (lists[i].isChecked) {
        disabilities = disabilities + lists[i].label;
        disabilitiesCounter++;
        if (i !== lists.length) {
          disabilities = disabilities + "\n"
        }
      }
    }
    if (disabilitiesCounter === 0) {
      disabilities = props.language.noDisabilitieSelected
    }
    return disabilities;
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      {
        lists && lists.length > 0 ?
          <div>
            <List className="list-menu-container" component="nav" aria-label={props.language.adienceMenu}>
              <ListItem
                button
                aria-haspopup="true"
                aria-controls="lock-menu"
                aria-label="when device is locked"
                onClick={handleClick}
                className="list-button-menu"
              >
                <ListItemIcon className="list-menu-icon">
                  <ArrowDropDownIcon />
                </ListItemIcon>
                <ListItemText
                  className="list-button-menu-text"
                  primary={props.language.accessibilityCheck}
                  secondary={lists[1].isChecked ? props.language.allDisabilitiesSelected : getDisabilities()}
                />
              </ListItem>
            </List>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader" className="list-subheader">
                    {props.language.disabilities.toUpperCase()}
                  </ListSubheader>
                }
                className="menu-list-options-container"
              >
                <Divider light={false}/>
                <div style={{height: "2.5vh"}}></div>
                {lists.map((option, index) => {
                  return(
                    <ListItem className="list-menu-item" onClick={handleToggle(index)} button>
                      <ListItemText primary={option.label} />
                      <ListItemSecondaryAction>
                        <Checkbox
                          edge="end"
                          onChange={handleToggle(index)}
                          checked={option.isChecked}
                          color="primary"
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  )
                })}
              </List>
            </Popover>
          </div>
        : undefined
      }
    </div>
  );
}
