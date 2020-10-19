import Checkbox from "@material-ui/core/Checkbox";
import NativeSelect from "@material-ui/core/NativeSelect";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import MaterialTable from "material-table";
import React,{useEffect} from "react";
import FeedbackHelp from "../feedback";
import tableIcons from '../design/icons';
import {onlySpaces} from '../../../../lib/textFieldValidations';

const useStyles = makeStyles(theme => ({}));
export default function Presentation(props) {
  const {language,handleSelectResourcesIntoLessons,type, handleSelectResourcesLessons, courseInformation,handleSelectResources, parentIndex, tools, lessonIndex}=props

  useEffect(()=>{
    if(type==='lessonInto'){
      setState(prevState=>{
        return {
          ...prevState,
          data: courseInformation[parentIndex].lessons[lessonIndex].tools[1].items,
        }
      })
    } else {
      setState(prevState=>{
        return {
          ...prevState,
          data: courseInformation[parentIndex].tools[1].items,
        }
      })
    }
  },[])
  
  const classes = useStyles();
  const { supplementary } = props;
  const itemsTypes = { 1: "unity", 2: "h5p", 3: "other" };
  function selectOptions(options) {
    let rows = [];
    for (let [key, value] of Object.entries(options)) {
      // console.log(`${key}: ${value}`);
      rows.push(
        <React.Fragment>
          <option value={key}>{value}</option>
        </React.Fragment>
      );
    }

    return rows;
  }

  const [state, setState] = React.useState({
    columns: [
      {
        title: language.title,
        field: "title",
        editComponent: props => (
            <TextField
              type="text"
              error={
                !props.value &&
                props.rowData.validateInput &&
                props.rowData.submitted
                  ? props.rowData.error
                  : false
              }
              helperText={
                !props.value &&
                props.rowData.validateInput &&
                props.rowData.submitted
                  ? language.required
                  : ""
              }
              value={props.value ? props.value : ""}
              onChange={e => {
                if (props.rowData.validateInput) {
                  props.rowData.validateInput = false;
                }
                props.onChange(e.target.value);
              }}
            />
        )
      },
      {
        title: language.audiencetype,
        field: "type",
        lookup: itemsTypes,
        editComponent: props => {
          return (
           
              <NativeSelect
                value={props.value ? props.value : ""}
                onChange={e => {
                  if (props.rowData.validateInput) {
                    props.rowData.validateInput = false;
                  }

                  props.onChange(e.target.value);
                }}
                name="gameType"
                inputProps={{
                  id: "gameType-"
                }}
              >
                {selectOptions(itemsTypes)}
              </NativeSelect>
          
          );
        }
      },
      {
        title: language.ExternalResource,
        field: "external",
        type: "boolean",
         editComponent: props => (
       
            <Checkbox
              {...props}
              checked={props.rowData.external ===true}
              disabled={props.rowData.type == 2}
              onChange={e => {
                props.rowData.external=e.target.checked;
                props.onChange(e.target.checked);
              }}
            />
         
        ) 
      },

      
      {
        title: language.ExternalURL,
        field: "url",
        editComponent: props => (
          <React.Fragment>
            <TextField
              type="url"
              inputProps={{
                pattern:
                  "/https?://(www.)?[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/"
              }}
              required={!props.rowData.external}
              disabled={!props.rowData.external}
              error={
                props.rowData.external &&
                !props.value &&
                props.rowData.validateInput &&
                props.rowData.submitted
                  ? props.rowData.error
                  : false
              }
              helperText={
                props.rowData.external &&
                !props.value &&
                props.rowData.validateInput &&
                props.rowData.submitted
                  ? language.required
                  : ""
              }
              value={props.rowData.external===false? ''  :props.value ? props.value : "" }
              onChange={e => {
                if (props.rowData.validateInput) {
                  props.rowData.validateInput = false;
                }

                props.onChange(e.target.value);
              }}
            />
          </React.Fragment>
        )
      }
    ],
    data: [
      
    ]
  });

  return (
    <React.Fragment>
      <MaterialTable
        icons={tableIcons(language.Additem)}
        title={language.Games}
        options={{ search: false, actionsColumnIndex: 4 }}
        columns={state.columns}
        data={state.data}
        editable={{
          onRowAdd: newData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                if(newData.external===false){newData.url=''}
              newData.submitted = true;
              if(newData.type===undefined){newData.type="1"}
              if (!newData.title || onlySpaces(newData.title)) {
                newData.error = true;
                newData.label = language.required;
                newData.helperText = language.Namerequired;
                newData.validateInput = true;
                reject();
                return;
              }
              resolve();
              setState(prevState => {
                const data = [...prevState.data];
                data.push(newData);
                let tool=tools;
                if(type==='lessonInto'){
                  // tool[1].items=data;
                  handleSelectResourcesIntoLessons(parentIndex,data, lessonIndex, 1)
                }else{
                  tool[1].items=data;
                  handleSelectResources(parentIndex, tool)
                }   
                return { ...prevState, data };
              });
              }, 600);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                newData.submitted = true;
                if(newData.external===false){newData.url=''}
                if (!newData.title || onlySpaces(newData.title)) {
                  newData.error = true;
                  newData.label = language.required;
                  newData.helperText = language.Namerequired;
                  newData.validateInput = true;
                  reject();
                  return;
                }
                resolve();
                if (oldData) {
                  setState(prevState => {
                    const data = [...prevState.data];
                    data[data.indexOf(oldData)] = newData;
                    let tool=tools;
                    if(type==='lessonInto' ){
                      //tool[1].items=data;
                      handleSelectResourcesIntoLessons(parentIndex,data, lessonIndex, 1)
                    }else{
                      tool[1].items=data;
                      handleSelectResources(parentIndex, tool)
                    }
                    return { ...prevState, data };
                  });
                }
              }, 600);
            }),
          onRowDelete: oldData =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                setState(prevState => {
                  const data = [...prevState.data];
                  data.splice(data.indexOf(oldData), 1);
                  let tool=tools;
                  if(type==='lessonInto'){
                    // tool[1].items=data;
                    handleSelectResourcesIntoLessons(parentIndex,data, lessonIndex, 1)
                  }else{
                    tool[1].items=data;
                    handleSelectResources(parentIndex, tool)
                  }
                  
                  return { ...prevState, data };
                });
              }, 600);
            })
        }}
        localization={{
          pagination: {
            // labelDisplayedRows: '{from}-{to} of {count}'
            labelRowsSelect: language.rows,
            firstAriaLabel: language.firstPage,
            firstTooltip: language.firstPage,
            previousAriaLabel: language.previousPage,
            previousTooltip: language.previousPage,
            nextAriaLabel: language.nextPage,
            nextTooltip: language.nextPage,
            lastAriaLabel: language.lastPage,
            lastTooltip: language.lastPage
          },
          toolbar: {
            // nRowsSelected: '{0} row(s) selected'
          },
          header: {
            actions: "" //removed title of action column
          },
          body: {
            emptyDataSourceMessage: language.Nogames,
            addTooltip: language.add,
            deleteTooltip: language.delete,
            editTooltip: language.edit,
            editRow: {
              deleteText: `${language.deleteItemBelow}, ${language.wantProceed}`,
              cancelTooltip: language.cancel,
              saveTooltip: language.save
            }
          }
        }}
      />
      <FeedbackHelp
        validation={{
          error: false,
          errorMsg: "",
          errorType: "",
          a11y: null
        }}
        tipMsg={language.GamesMatarial}
        describedBy={"i05-helper-text"}
      />
      <br/>
    </React.Fragment>
  );
}
