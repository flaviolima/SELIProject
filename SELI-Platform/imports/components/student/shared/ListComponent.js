import React from 'react';
import { makeStyles, emphasize } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import './style.css'
import { LineWeight } from 'material-ui-icons';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(2, 0, 1),
  },
  line:{
      lineHeight: '80%',
  }
}));

//Andres Heredia// 
export default function Lista(props) {
  const classes = useStyles();

  const Audiences=()=>{
      return(
        <div className='resources'>
          
          
                {   
                    props.data[0]!=undefined?
                        props.data[0].map((value,index)=>(
                            value.isChecked===true ?
                                <p className='elemntoflist' key={value.id}>{value.label}</p>
                            :
                            undefined    
                        ))
                    :
                    undefined
                }
                {
                    props.data[2]!=undefined ?
                    props.data[2].map((value,index)=>(//other Audiences
                        <p  className='elemntoflist' key={value.label}>
                            {value.label}
                        </p>    
                    ))
                    :
                    undefined
                }  
                {
                    props.data[1]!=undefined?
                        props.data[1].map((value,index)=>(//Inclusion Goals  
                            value.isChecked===true ?
                                <p className='elemntoflist' key={value.id}>
                                    {value.label}
                                </p>
                            :
                            undefined    
                        ))
                        :
                    undefined
                } 
           
        {/* <div>
            <div className='crnheading'>
                <h4>This course is designed to be inclusive for:</h4>
            </div>
        </div>  */}
                {/* <ul className='resources'>
                    {
                        props.data[1].map((value,index)=>(//Inclusion Goals  
                            value.isChecked===true ?
                                <li className='elemntoflist' key={value.id}>
                                    {value.label}
                                </li>
                            :
                            undefined    
                        ))
                    }
                </ul> */}
        </div>
        
      )
  }

  const AudiencesMainContent=()=>{
    return(
      <div>
                <ul className='resourcesMainContent'>
                    <li className='crnheading'>This course is designed for these target audiences:</li>
                    {
                    props.data[0].map((value,index)=>(
                        value.isChecked===true ?
                            <li className='elemntoflist' key={value.id}>{value.label}</li>
                        :
                        undefined    
                    ))
                    }
                    {
                        props.data[2]!=undefined ?
                        props.data[2].map((value,index)=>(//other Audiences
                            <li  className='elemntoflist' key={value.label}>
                                {value.label}
                            </li>    
                        ))
                        :
                        undefined
                    }     
                </ul>
                
               
                
        
             
                <ul className='resourcesMainContent'>
                    {
                        props.data[1]!=undefined ?
                            <li className='crnheading'>This course is designed to be inclusive for:</li>
                            :
                        undefined
                    }  
                    {
                        props.data[1]!=undefined ?
                            props.data[1].map((value,index)=>(//Inclusion Goals  
                                value.isChecked===true ?
                                    <li className='elemntoflist' key={value.id}>
                                        {value.label}
                                    </li>
                                :
                                undefined    
                        ))
                        :
                        undefined
                    }
                </ul> 
            </div>
      
    )
}
  
  const LearningGoals=()=>{
      return(
          <React.Fragment>
              <div>
                  <br/>
                  <strong className='descriptiontext'>Cognitive Domain Objectives:</strong>

                  {console.log("el error--->", props.data)}
                  {
                    (props.data.analyzing.length!=0 && props.data.analyzing!=undefined) ?
                    <ul >
                        {
                            props.data.analyzing.map((value,index)=>(
                                <li >
                                    {value.aux+': '+value.label}
                                </li>
                            ))
                        }
                    </ul>
                    :
                    undefined
                  }

                  {
                    (props.data.creating.length!=0 && props.data.creating!=undefined)?
                    <ul >
                        {
                            props.data.creating.map((value,index)=>(
                                <li >
                                    {value.aux+': '+value.label}
                                </li>
                            ))
                        }
                    </ul>
                    :
                    undefined    
                  }
                  {
                    (props.data.evaluating.length!=0 && props.data.evaluating!=undefined) ?
                    <ul >
                        {
                            props.data.evaluating.map((value,index)=>(
                                <li >
                                    {value.aux+': '+value.label}
                                </li>
                            ))
                        }
                    </ul>
                    :
                    undefined
                  }
                  {
                    (props.data.remembering.length!=0 && props.data.remembering!=undefined )?
                    <ul >
                        {
                            props.data.remembering.map((value,index)=>(
                                <li >
                                    {value.aux+': '+value.label}
                                </li>
                            ))
                        }
                    </ul>
                    :
                    undefined
                  }
                  
                  {
                    (props.data.understanding.length!=0 && props.data.understanding!=undefined)?
                    <ul >
                        {
                            props.data.understanding.map((value,index)=>(
                                <li >
                                    {value.aux+': '+value.label}
                                </li>
                            ))
                        }
                    </ul>
                    :
                    undefined
                  }
              </div>
          </React.Fragment>
      )
  }

  const LearningOutcomes=()=>{
      return(
        <React.Fragment>
            <div>
                {
                    props.data.contents.length!=0?
                    props.data.contents.map((value,index)=>(
                        <ul >
                            
                               
                                    <li >
                                        {value.aux+': '+value.label}
                                    </li>
                               
                            
                        </ul>
                    ))
                    :
                    undefined
                }
                {
                    props.data.skills.length!=0?
                    props.data.skills.map((value,index)=>(
                        <ul >
                            
                                
                                    <li >
                                        {value.aux+': '+value.label}
                                    </li>
                                
                        </ul>
                    ))
                    :
                   undefined
                }
                {
                     props.data.values.length!=0?
                     props.data.values.map((value,index)=>(
                        <ul >
                           
                                    <li >
                                        {value.aux+': '+value.label}
                                    </li>
                            
                        </ul>
                     ))
                     :
                     undefined
                }
            </div>
        </React.Fragment>
      )
  }

  const LearningOutcomesMainContent=()=>{
    return(
      <React.Fragment>
          <div>
              {
                  props.data.contents.length!=0?
                  props.data.contents.map((value,index)=>(
                      <ul className='resources' >
                          
                             
                                  <li >
                                     to {value.aux+' '+value.label}
                                  </li>
                             
                          
                      </ul>
                  ))
                  :
                  undefined
              }
              {
                  props.data.skills.length!=0?
                  props.data.skills.map((value,index)=>(
                      <ul className='resources'>
                          
                              
                                  <li >
                                     to {value.aux+' '+value.label}
                                  </li>
                              
                      </ul>
                  ))
                  :
                 undefined
              }
              {
                   props.data.values.length!=0?
                   props.data.values.map((value,index)=>(
                      <ul className='resources'>
                         
                                  <li className='resources'>
                                      to {value.aux+' '+value.label}
                                  </li>
                          
                      </ul>
                   ))
                   :
                   undefined
              }
          </div>
      </React.Fragment>
    )
}
  return (
    <div >
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <div >
            <div dense={true}>
                {
                props.title==='Audiences'?
                <Audiences/>
                :
                props.title==='LearningGoals'?
                <LearningGoals/>
                :
                props.title==='LearningOutcomes'?
                <LearningOutcomes/>
                :
                props.title==='LearningOutcomesMainContent'?
                <LearningOutcomesMainContent/>
                :
                props.title==='AudiencesMainContent'?
                <AudiencesMainContent/>
                :
                undefined
                }
              
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}