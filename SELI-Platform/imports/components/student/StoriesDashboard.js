import React, { Component } from 'react';
import Divider from '@material-ui/core/Divider';
import Loading from '../../components/tools/Loading';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from '../../style/theme';
import { Courses } from '../../../lib/CourseCollection';
import StoryCard from '../../components/course/StoryCard';
import InfoIcon from '@material-ui/icons/Info';
import { Activities } from '../../../lib/ActivitiesCollection';
import AppBar from '../../components/navigation/AppBar'


import {
	Avatar,
	Grid,
	Paper,
	Button,
	Typography,
	Card,
	CardHeader,
	CardMedia,
	CardContent,
	CardActions
} from "@material-ui/core";
import CourseSearch from './courseSearch'
import StorySearch from './StorySearch'
import { IoLogoClosedCaptioning } from 'react-icons/io';

export default class StoriesDashboard extends React.Component {
  constructor(props) {
    console.log("StoriesDashboard", props)
    super(props);
    this.state = {
      categoryName: [],
      activeData: [],
      categoryList: [],
      fullyCognitive:[], 
      fullyHearing:[],
      fullyVisually:[],
      texttoSearch:'',
      accessibilitie:{},
      generalDetailedFlag:false,
      courses: [],
      publishedCourses:[],
      mysuscribdedCourses:[],
      myFiltersuscribdedCourses:[],
      myFilterSeliCourses:[],
      myFilterThree:[],
      flagCourses:false,
      myFilterThreeSeli:[],
      myflagCourses:false,
      coursesbyEnglish:[],
      coursesbySpanish:[],
      coursesbyPortuguese:[],
      coursesbyPolish:[],
      coursesbyTurkish:[],
      languageTag:[],
      durationTag:false,
      coursesbyDuration:[],
      audiencesTag:false,
      coursesbyAudiences:[],
      coursesbyTutors:[],
      tutorsTag:false,
      onlineCourses:[],
      onlineTag:false,
      flagMostRecent:false,
      orsearch:[],
      duration:[],
      online:false,
      onsearchflag:false,
      dataProps:[],
      propData: [],
    }
    
  }

  componentWillMount() {//antes de render
    Tracker.autorun(() => {
      let courses = Activities.find({}).fetch();
      this.state.publishedCourses=courses

      this.setState(this.state)
        if(this.props.searchText){
          this.setState({
            courses: this.props.searchText,
          });
          this.props.cleanSearchText();
        } else {
          this.setState({
            courses: courses,
          });
        }
    });

    //Search on the suscribded Course List
    this.state.publishedCourses.map((course, indexCourse)=>{
      course.title=course.activity.name.toLowerCase()
    })
    // this.searchMyCourses()
    this.searchSELICourses()
    console.log("conpnet will mount", this.state.publishedCourses)
  }

  componentDidUpdate(prevProps, prevState){
    console.log("componentDidUpdate",prevState, this.state, prevProps)
    if (prevProps.searchText !== this.props.searchText ){
      if(this.props.searchText){
        this.setState({
          courses: this.props.searchText,
        });
        this.props.cleanSearchText();
      }
    }
    if (prevProps.texttoSearch !== this.props.texttoSearch ){
      // this.searchMyCourses()
      this.searchSELICourses()
    } 

    if((prevState.flagCourses!=this.state.flagCourses) ||(prevState.generalDetailedFlag!=this.state.generalDetailedFlag)){
      console.log("cabio estado")
      // this.searchMyCourses()
      this.searchSELICourses()
    }
    if(prevState.flagMostRecent!=this.state.flagMostRecent){
      console.log("busqueda por most recent Compnent did Update")
    }
  }

  searchMyCourses=()=>{
    //put in lowercase te titles of the courses to improve the search
    let titleMyCourses=[]
     this.props.user.profile.courses.map((course, courseIndex)=>{
        let indexRegistered=this.state.publishedCourses.findIndex(coursespub=>coursespub._id===course.courseId)
        if (indexRegistered!=-1){
          titleMyCourses.push(this.state.publishedCourses[indexRegistered])
        }
    }) 
    this.state.mysuscribdedCourses=titleMyCourses

    if(this.props.texttoSearch!=undefined){
      console.log("this.props.texttoSearch", this.props.texttoSearch)
      let myFiltersuscribdedCourses=this.state.mysuscribdedCourses.filter(course => course.title.search(this.props.texttoSearch.toLowerCase()) !=-1);
      // let myFiltersuscribdedCoursesSub=this.state.mysuscribdedCourses.filter(course => course.subtitle.search(this.props.texttoSearch.toLowerCase()) !=-1);
      this.state.myFiltersuscribdedCourses=myFiltersuscribdedCourses.concat()
      //ordena por alfabeto
      this.state.myFiltersuscribdedCourses.sort(function (a, b) {
        if (a.title > b.title) {
          return 1;
        }
        if (a.title < b.title) {
          return -1;
        }
        return 0;
      });
      this.setState(this.state)
      //console.log("Cursos suscritos con titulo y filtrado",titleMyCourses, myFiltersuscribdedCourses )
    }else{//if the search is undefined or empty
      this.state.myFiltersuscribdedCourses=this.state.mysuscribdedCourses
      this.state.myFiltersuscribdedCourses.sort(function (a, b) {
        if (a.title > b.title) {
          return 1;
        }
        if (a.title < b.title) {
          return -1;
        }
        return 0;
      });
      this.setState(this.state)
    }
  }

  searchSELICourses=()=>{
    console.log("searchSELICourses", this.state, this.props )
    if(this.props.texttoSearch!=undefined){
      let myFilterSeliCourses=this.state.publishedCourses.filter(course => course.title.search(this.props.texttoSearch.toLowerCase()) !=-1);
    this.state.myFilterSeliCourses=myFilterSeliCourses
    this.setState(this.state)
   // console.log("Seli Courses y Filtrados: ",this.state.publishedCourses, myFilterSeliCourses )
    }else{//if the search is undefined or empty
      this.state.myFilterSeliCourses=this.state.publishedCourses
      this.state.myFilterSeliCourses.sort(function (a, b) {
        if (a.title > b.title) {
          return 1;
        }
        if (a.title < b.title) {
          return -1;
        }
        return 0;
      });
      this.setState(this.state)
    } 
  }

  paperSearchMyCourses=(title, arrayCourses)=>{
    console.log("papersearchMycourses")
    if(arrayCourses.length >3  && this.state.myflagCourses===true){
      this.state.myFilterThree=arrayCourses
    } 
    else if(arrayCourses.length >3 && this.state.myflagCourses===false){
      this.state.myFilterThree=[arrayCourses[0],arrayCourses[1],arrayCourses[2]]
    }else{
      this.state.myFilterThree=arrayCourses
    }
      return(
        <Paper component="article" elevation={0}>
          <header className='headersearch'>
            <h2>{title}</h2>
          </header>
          <div className='subheader'>Showing {this.state.myFilterThree.length} of {arrayCourses.length} subscribed stories that correspond to your search.</div>
          <div  className="courses-dashboard">
            <div className="courses-dashboard-result">
            {
              this.state.myFilterThree.map((course, index) => {
                return(
                  <StoryCard
                    course={course}
                    index={index}
                    language={this.props.language}
                    disabled={this.props.disabled}
                    userCourses={this.props.user.profile.courses}
                    // subscribe={this.props.subscribe.bind(this)}
                    // unsubscribe={this.props.unsubscribe.bind(this)}
                    key={index}
                  />
                ) 
              })
            }
            </div>
            <div className='buttonsearch'>
            {
              arrayCourses.length >3?
                <Button variant="outlined" color="primary" onClick={()=>this.setState({myflagCourses:!this.state.myflagCourses})}>
                  {this.state.myflagCourses===false? 'See more stories': 'Less content'}
                </Button>
                :
                undefined
            }
          </div>  
        </div> 
        </Paper>
      )
  }

  paperSearchSeli=(title, arrayCourses)=>{
    if(arrayCourses.length >3  && this.state.flagCourses===true){
      this.state.myFilterThreeSeli=arrayCourses
    } 
    else if(arrayCourses.length >3 && this.state.flagCourses===false){
      this.state.myFilterThreeSeli=[arrayCourses[0],arrayCourses[1],arrayCourses[2]]
    }else{
      this.state.myFilterThreeSeli=arrayCourses
    }
      return(
        <Paper component="article" elevation={0}>
          <header className='headersearch'>
            <h2>{title}</h2>
          </header>
          <div className='subheader'>Showing {this.state.myFilterThreeSeli.length} of {arrayCourses.length} subscribed stories that correspond to your search. </div>
          <div  className="courses-dashboard">
            <div className="courses-dashboard-result">
              {
                this.state.myFilterThreeSeli.map((course, index) => {
                  return(
                    <StoryCard
                      course={course}
                      index={index}
                      language={this.props.language}
                      disabled={this.props.disabled}
                      userCourses={this.props.user.profile.courses}
                      // subscribe={this.props.subscribe.bind(this)}
                      // unsubscribe={this.props.unsubscribe.bind(this)}
                      key={index}
                    />
                  ) 
                })
              }
            </div>
            <div className='buttonsearch'>
              {
              arrayCourses.length >3?
                <Button  variant="outlined" color="primary" onClick={()=>this.setState({flagCourses:!this.state.flagCourses})}>           
                  {this.state.flagCourses===false? 'See more stories': 'Less content'}
                </Button>
                :
                undefined
              }  
            </div>       
          </div>  
        </Paper>
      )
  }
  paperSupportNews=(title)=>{
    return(
      <Paper component="article" elevation={0}>
        <header className='subheader'>
          <h2>{title}</h2>
        </header>
        <CardContent className='headersearch'>
          <Typography
            variant="body2" color="textSecondary" component="div">
            There are no search results.
          </Typography>
        </CardContent>
      </Paper>
    )
  }

  getParamsofSearch=(params)=>{
    this.setState({
      accessibilitie:params
    })
    let fullyCognitive=[]
    let partialCognitive=[]
    let inaccessibleCognitive=[]
    let fullyHearing=[]
    let partialHearing=[]
    let inaccessibleHearing=[]
    let fullyVisual=[]
    let partialVisual=[]
    let inaccessibleVisual=[]
     this.state.publishedCourses.map((course,indexCourse)=>{
      //cognitve
      if(course.report!=undefined){
        if(course.report[2]===100){
          fullyCognitive.push(course)
        }else if((course.report[2]<100 && course.report[2]>50)){
          partialCognitive.push(course)
        }else if(course.report[2]<50){
          inaccessibleCognitive.push(course)
        }
      }
      //hearing
      if(course.report!=undefined){
        if(course.report[1]===100){
          fullyHearing.push(course)
        }else if((course.report[1]<100 && course.report[1]>50)){
          partialHearing.push(course)
        }else if(course.report[1]<50){
          inaccessibleHearing.push(course)
        }
      }
      //visual
      if(course.report!=undefined){
        if(course.report[0]===100){
          fullyVisual.push(course)
        }else if((course.report[0]<100 && course.report[0]>50)){
          partialVisual.push(course)
        }else if(course.report[0]<50){
          inaccessibleVisual.push(course)
        }
      }

      this.setState({
        inaccessibleCognitive:inaccessibleCognitive,
        inaccessibleHearing:inaccessibleHearing,
        inaccessibleVisual:inaccessibleVisual,
        generalDetailedFlag:true,
        fullyCognitive:fullyCognitive,
        partialCognitive:partialCognitive,
        fullyHearing:fullyHearing,
        partialHearing:partialHearing,
        fullyVisual:fullyVisual,
        partialVisual:partialVisual
      })

      //console.log("Muestra los full cognitive, parciale e ianccesibles: ",fullyCognitive, partialCognitive, inaccessibleCognitive)
      //console.log("Muestra los full hearing, parciale e ianccesibles: ",fullyHearing, partialHearing, inaccessibleHearing)
      //console.log("Muestra los full visual, parciale e ianccesibles: ",fullyVisual, partialVisual, inaccessibleVisual)
      
    }) 

  }

  
  getParamsLanguage=(language)=>{
    console.log("getParamsLangauge, myflagCourses---->",language, this.state.publishedCourses)
    let coursesbyEnglish=[]
    let coursesbySpanish=[]
    let coursesbyPortuguese=[]
    let coursesbyPolish=[]
    let coursesbyTurkish=[]
    this.state.publishedCourses.map((course,indexCourse)=>{
      if(course.language!=undefined){
        if(course.language===0){//english
          coursesbyEnglish.push(course)
        }else if(course.language===1){
          coursesbySpanish.push(course)
        }
        else if(course.language===2){
          coursesbyPortuguese.push(course)
        }
        else if(course.language===3){
          coursesbyPolish.push(course)
        }
        else if(course.language===4){
          coursesbyTurkish.push(course)
        }
      }
    })
    this.setState({
      languageTag:language,
      coursesbyEnglish:coursesbyEnglish,
      coursesbySpanish:coursesbySpanish,
      coursesbyPortuguese:coursesbyPortuguese,
      coursesbyPolish:coursesbyPolish,
      coursesbyTurkish:coursesbyTurkish,
    })

  }

  getParamsDuration=(duration, flag)=>{
    console.log("getParamsDuration, myflagCourses---->",duration, this.state.publishedCourses)
    this.setState({
      duration:duration
    })
    let coursesbyDuration=[]
    this.state.publishedCourses.map((course,indexCourse)=>{
      
      if(course.duration!=undefined){
        let durationNumber=''
        if(Number.isInteger(course.duration)===false){
          durationNumber=parseInt(course.duration.split(':')[0])
          console.log("ddddddd",course.duration, durationNumber)
          if(durationNumber>duration[0] && durationNumber<duration[1]){
            coursesbyDuration.push(course)
          }
        }
      }
    })
    this.setState({
      durationTag:flag,
      coursesbyDuration:coursesbyDuration
    })
  }

  getParamsAudiences=(audiences)=>{
    console.log("getParamsAudiences, myflagCourses---->",audiences, this.state.publishedCourses)
    
    let coursesbyAudiences=[]
    this.state.publishedCourses.map((course,indexCourse)=>{
      if(course.support.length===2){
        //console.log("course.support[0]",course.support)
        //console.log("longitud",course.support[0].length)
        if(Array.isArray(course.support[0])){   
          course.support[0].map((audience, indexAudience)=>{
            if(audience.value==="StudentsGrad" && audience.isChecked===true && audiences.Graduatestudents===true){
              coursesbyAudiences.push(course)
            }
            if(audience.value==="StudentsInfor" && audience.isChecked===true && audiences.Informalstudents===true){
              coursesbyAudiences.push(course)
            }
            if(audience.value==="Teachers" && audience.isChecked===true && audiences.TeachersandProfessors===true){
             coursesbyAudiences.push(course)
           }
           if(audience.value==="Kids" && audience.isChecked===true && audiences.Preschoolkids===true){
             coursesbyAudiences.push(course)
           }
           if(audience.value==="post graduate student" && audience.isChecked===true && audiences.Postgraduatestudent===true){
             coursesbyAudiences.push(course)
           }
           if(audience.value==="pregrade student" && audience.isChecked===true && audiences.Pregradestudent===true){
             coursesbyAudiences.push(course)
           }
           if(audience.value==="High School Students" && audience.isChecked===true && audiences.HighSchoolStudents===true){
             coursesbyAudiences.push(course)
           }
           if(audience.value==="Middle School Students" && audience.isChecked===true && audiences.MiddleSchoolStudents===true){
             coursesbyAudiences.push(course)
           }
           if(audience.value==="Elementary School Students" && audience.isChecked===true && audiences.ElementarySchoolStudents===true){
             coursesbyAudiences.push(course)
           }
           if(audience.isChecked===true){
             this.setState({
               audiencesTag:true,
             })
           }
          })
         }
        }
      })
       
    this.setState({
      coursesbyAudiences:coursesbyAudiences
    })


  }
  getParamsTutors=(tutors)=>{
     console.log("Resultados de busqueda getParamsTutors",tutors)  
    let coursesbyTutors=[]
    Object.entries(tutors).forEach(([key, value]) => {
      if(value===true){
        this.setState({tutorsTag:true})
        this.state.publishedCourses.filter(course=>{
          course.createdBy.toLowerCase().search(key.toLowerCase()) !=-1?
          coursesbyTutors.push(course)
          :
          undefined
        })
      }     
    });
   
    this.setState({
      coursesbyTutors:coursesbyTutors
    })
  }

  getOnline=()=>{ 
    let onlineCourses=[]
    this.state.publishedCourses.map((course,indexCourse)=>{
      if(course.analysis!=undefined){
        if(course.analysis.length!=0){
          if(course.analysis[1]==='online'){
            this.setState({onlineTag:true})
            onlineCourses.push(course)
          }
        }
     }
    })

    this.setState({
      onlineCourses:onlineCourses
    })
    console.log("getOnlineresults", onlineCourses)
  }

  getOnlineFlag=(flag)=>{
   // console.log("Bandera Online", flag )
    this.state.online=flag
    this.state.accessibilitie.a11yVis=null
    this.state.accessibilitie.a11yHear=null
    this.state.accessibilitie.a11yCog=null
    this.state.onlineTag=false
    this.state.onsearchflag===false
    this.setState(this.state)
    if(flag===true){
      this.state.generalDetailedFlag=true
      this.getOnline()
    }
    if(flag===false){
      this.setState({
        generalDetailedFlag:false,
        onlineTag:false
      })
    }
  }

  getAccessibleFlag=(flag)=>{
    console.log("Bandera Accesibilidad", flag )
    if(flag===true){
      this.state.generalDetailedFlag=true
      this.state.onlineTag=false
      this.state.onsearchflag===false
      //this.setState(this.state.generalDetailedFlag)
      this.getParamsofSearch()
      this.state.accessibilitie.a11yCog='full'
      this.state.accessibilitie.a11yHear='full'
      this.state.accessibilitie.a11yVis='full'
      this.setState({accessibilitie:this.state.accessibilitie})
    }
    if(flag===false){
      this.setState({generalDetailedFlag:false})
    }
  }

  getGeneralSearch=(text)=>{
    console.log("General Search:", text)
    this.state.texttoSearch=text
    this.state.generalDetailedFlag=false
    this.setState(this.state)
    this.searchMyCoursesDetailed()
    this.searchSELICoursesDetailed()
  }

  searchMyCoursesDetailed=()=>{
    //put in lowercase te titles of the courses to improve the search
    let titleMyCourses=[]
     this.props.user.profile.courses.map((course, courseIndex)=>{
        let indexRegistered=this.state.publishedCourses.findIndex(coursespub=>coursespub._id===course.courseId)
        if (indexRegistered!=-1){
          titleMyCourses.push(this.state.publishedCourses[indexRegistered])
        }
    }) 
    this.state.mysuscribdedCourses=titleMyCourses
    this.state.dataProps = this.state.publishedCourses.map(i => i.activity.data);

    for (var i = 0; i < this.state.dataProps.length; i++) {
      var dataInfo = this.state.dataProps[i].map(s=>s.categories);
  if(dataInfo[i] !== undefined) {
      this.state.categoryList = dataInfo[i].category;
  }else {
    for (var i = 0; i < dataInfo.length; i++) {
    if(dataInfo[i] !== undefined) {
    this.state.categoryList = dataInfo[i].category;
      }
    }
  }
}
let myFiltersuscribdedCoursesTitle=this.state.mysuscribdedCourses.filter(course => course.title.search(this.state.texttoSearch.toLowerCase()) !=-1);
// let myFiltersuscribdedCoursesSubTitle=this.state.mysuscribdedCourses.filter(course => course.subtitle.search(this.state.texttoSearch.toLowerCase()) !=-1);
this.state.myFiltersuscribdedCourses=(myFiltersuscribdedCoursesTitle.concat())
this.state.myFiltersuscribdedCourses.sort(function (a, b) {
      if (a.title > b.title) {
        return 1;
      }
      if (a.title < b.title) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
    this.setState(this.state)
    //console.log("Cursos suscritos con titulo y filtrado detailed",titleMyCourses, myFiltersuscribdedCourses )
  }

  searchSELICoursesDetailed=()=>{
    console.log("searchSELICoursesDetailed", this.state, this.props )
    console.log("text to search", this.state.texttoSearch )
    this.state.dataProps = this.state.publishedCourses.map(i => i.activity.data);


    for (var i = 0; i < this.state.dataProps.length; i++) {
      var dataInfo = this.state.dataProps[i].map(s=>s.categories);
  if(dataInfo[i] !== undefined) {
      this.state.categoryList = dataInfo[i].category;
  }else {
    for (var i = 0; i < dataInfo.length; i++) {
    if(dataInfo[i] !== undefined) {
    this.state.categoryList = dataInfo[i].category;
      }
    }
  }

    }
    var activeData = [];
    activeData = this.state.publishedCourses.map(item => item.activity);
    for (var i = 0; i < activeData.length; i++) {

      // for(var i2 = 0; i2 < x[i].length;) {
      if(activeData[i].categories !== null){
        var categoryName = [];
    categoryName = activeData[i];
      }
      // }
    
    }
    console.log(activeData.map(item => item.categories));

var x = activeData.map(item => item.categories);
var y = x[0].map((item) => item);
console.log(y);

    let myFilterSeliCoursesTitle=this.state.publishedCourses.filter(course => course.title.search(this.state.texttoSearch.toLowerCase()) !=-1);
   let myFilterSeliCoursesSubTitle=activeData.filter(course => course.categories[0].search(this.state.texttoSearch.toLowerCase()) !=-1);
   this.state.myFilterSeliCourses=(myFilterSeliCoursesTitle.concat(myFilterSeliCoursesSubTitle));
   this.state.myFilterSeliCourses.sort(function (a, b) {
      if (a.title > b.title) {
        return 1;
      }
      if (a.title < b.title) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });
    this.setState(this.state)
    console.log("Seli Courses y Filtrados Detailed: ",this.state.publishedCourses,  this.state.myFilterSeliCourses )
  }

  sortByMostRecent=()=>{
    //console.log("Sort by most recent",this.state.myFilterSeliCourses)
    let arratosearch=this.state.myFilterSeliCourses;
    arratosearch.sort(function (a, b) {
      return new Date(b.creationDate) - new Date(a.creationDate);
    }); 
    //console.log("Sort by most recent ordenado",arratosearch)
    // let sortmyFiltersuscribdedCourses=this.state.myFiltersuscribdedCourses;
    // sortmyFiltersuscribdedCourses.sort(function (a, b) {
      // return new Date(b.creationDate) - new Date(a.creationDate);
    // }); 
    this.state.flagMostRecent=true
    this.setState(this.state)

  }

  //it is the new functinality for OR search
  OrSearch=(params,languages, audiences, instructors)=>{
    console.log("todos los parametros de busqueda", params,languages, this.state.duration ,audiences, instructors, this.state.online)
    //this.getParamsofSearch()
    console.log("1. First Search params of serach and published courses", this.state.publishedCourses)
    let full=[]
    let searchAL=[]
    let searchALD=[]
    let searchALDI=[]
    let searchALDIO=[]

    if(params.a11yCog==='full' && params.a11yHear==='full' && params.a11yVis==='full'){
      full= this.state.publishedCourses.filter(course=>(
        course.report!=undefined && course.report[2]===100 && course.report[1]===100 && course.report[0]===100
      ))
    }
    if(params.a11yCog==='full' && params.a11yHear==='full' && params.a11yVis==='no-filter'){
      full= this.state.publishedCourses.filter(course=>(
        course.report!=undefined && course.report[2]===100 && (course.report[1]===100) && course.report[0]<=100
      ))
    }
    if(params.a11yCog==='full' && params.a11yHear==='full' && params.a11yVis==='partial'){
      full= this.state.publishedCourses.filter(course=>(
        course.report!=undefined && course.report[2]===100 && (course.report[1]===100) && ((course.report[0]<100 && course.report[0]>50) || course.report[0]===100)
      ))
    }
    if(params.a11yCog==='full' && params.a11yHear==='partial' && params.a11yVis==='no-filter'){
      full= this.state.publishedCourses.filter(course=>(
        course.report!=undefined && course.report[2]===100 && ((course.report[1]<100 && course.report[1]>50) || course.report[1]===100) && course.report[0]<=100
      ))
    }
    if(params.a11yCog==='full' && params.a11yHear==='partial' && params.a11yVis==='partial'){
      full= this.state.publishedCourses.filter(course=>(
        course.report!=undefined && course.report[2]===100 && ((course.report[1]<100 && course.report[1]>50) || course.report[1]===100)  && ((course.report[0]<100 && course.report[0]>50) || course.report[0]===100)
      ))
    }
    if(params.a11yCog==='full' && params.a11yHear==='partial' && params.a11yVis==='full'){
      full= this.state.publishedCourses.filter(course=>(
        course.report!=undefined && course.report[2]===100 && ((course.report[1]<100 && course.report[1]>50) || course.report[1]===100)  && (course.report[0]===100)
      ))
    }
    if(params.a11yCog==='full' && params.a11yHear==='no-filter' && params.a11yVis==='partial'){
      full= this.state.publishedCourses.filter(course=>(
        course.report!=undefined && course.report[2]===100 && (course.report[1]<=100) && ((course.report[0]<100 && course.report[0]>50) || course.report[0]===100)
      ))
    }
    if(params.a11yCog==='full' && params.a11yHear==='no-filter' && params.a11yVis==='full'){
      full= this.state.publishedCourses.filter(course=>(
        course.report!=undefined && course.report[2]===100 && (course.report[1]<=100) && (course.report[0]===100)
      ))
    }
    if(params.a11yCog==='full' && params.a11yHear==='no-filter' && params.a11yVis==='no-filter'){
      full= this.state.publishedCourses.filter(course=>(
        course.report!=undefined && course.report[2]===100 && (course.report[1]<=100) && (course.report[0]<50)
      ))
    }


    //second block

    if(params.a11yCog==='partial' && params.a11yHear==='full' && params.a11yVis==='full'){
      full= this.state.publishedCourses.filter(course=>(
        course.report!=undefined && ((course.report[2]<100 && course.report[2]>50) || course.report[2]===100) && course.report[1]===100 && course.report[0]===100
      ))
    }
    if(params.a11yCog==='partial' && params.a11yHear==='full' && params.a11yVis==='no-filter'){
      full= this.state.publishedCourses.filter(course=>(
        course.report!=undefined && ((course.report[2]<100 && course.report[2]>50) || course.report[2]===100) && (course.report[1]===100) && course.report[0]<=100
      ))
    }
    if(params.a11yCog==='partial' && params.a11yHear==='full' && params.a11yVis==='partial'){
      full= this.state.publishedCourses.filter(course=>(
        course.report!=undefined && ((course.report[2]<100 && course.report[2]>50) || course.report[2]===100) && (course.report[1]===100) && (course.report[0]<100 && course.report[0]>50)
      ))
    }
    if(params.a11yCog==='partial' && params.a11yHear==='partial' && params.a11yVis==='no-filter'){
      full= this.state.publishedCourses.filter(course=>(
        course.report!=undefined && ((course.report[2]<100 && course.report[2]>50) || course.report[2]===100) && ((course.report[1]<100 && course.report[1]>50) || course.report[1]===100) && course.report[0]<=100
      ))
    }
    if(params.a11yCog==='partial' && params.a11yHear==='partial' && params.a11yVis==='partial'){
      full= this.state.publishedCourses.filter(course=>(
        course.report!=undefined && ((course.report[2]<100 && course.report[2]>50) || course.report[2]===100) && ((course.report[1]<100 && course.report[1]>50) || course.report[1]===100) && ((course.report[0]<100 && course.report[0]>50) || course.report[0]===100 )
      ))
    }
    if(params.a11yCog==='partial' && params.a11yHear==='partial' && params.a11yVis==='full'){
      full= this.state.publishedCourses.filter(course=>(
        course.report!=undefined && ((course.report[2]<100 && course.report[2]>50) || course.report[2]===100) && ((course.report[1]<100 && course.report[1]>50) || course.report[1]===100) && (course.report[0]===100)
      ))
    }
    if(params.a11yCog==='partial' && params.a11yHear==='no-filter' && params.a11yVis==='partial'){
      full= this.state.publishedCourses.filter(course=>(
        course.report!=undefined && ((course.report[2]<100 && course.report[2]>50) || course.report[2]===100) && (course.report[1]<=100) && ((course.report[0]<100 && course.report[0]>50) || course.report[0]===100)
      ))
    }
    if(params.a11yCog==='partial' && params.a11yHear==='no-filter' && params.a11yVis==='full'){
      full= this.state.publishedCourses.filter(course=>(
        course.report!=undefined && ((course.report[2]<100 && course.report[2]>50) || course.report[2]===100) && (course.report[1]<=100) && (course.report[0]===100)
      ))
    }
    if(params.a11yCog==='partial' && params.a11yHear==='no-filter' && params.a11yVis==='no-filter'){
      full= this.state.publishedCourses.filter(course=>(
        course.report!=undefined && ((course.report[2]<100 && course.report[2]>50) || course.report[2]===100) && (course.report[1]<=100) && (course.report[0]<=100)
      ))
    }

    //third block

    if(params.a11yCog==='no-filter' && params.a11yHear==='full' && params.a11yVis==='full'){
      full= this.state.publishedCourses.filter(course=>(
        course.report!=undefined && (course.report[2]<=100) && course.report[1]===100 && course.report[0]===100
      ))
    }
    if(params.a11yCog==='no-filter' && params.a11yHear==='full' && params.a11yVis==='no-filter'){
      full= this.state.publishedCourses.filter(course=>(
        course.report!=undefined && (course.report[2]<=100) && (course.report[1]===100) && course.report[0]<=100
      ))
    }
    if(params.a11yCog==='no-filter' && params.a11yHear==='full' && params.a11yVis==='partial'){
      full= this.state.publishedCourses.filter(course=>(
        course.report!=undefined && (course.report[2]<=100) && (course.report[1]===100) && ((course.report[0]<100 && course.report[0]>50) || course.report[0]===100)
      ))
    }
    if(params.a11yCog==='no-filter' && params.a11yHear==='partial' && params.a11yVis==='no-filter'){
      full= this.state.publishedCourses.filter(course=>(
        course.report!=undefined && (course.report[2]<=100) && (course.report[1]<100 && course.report[1]>50) && course.report[0]<=100
      ))
    }
    if(params.a11yCog==='no-filter' && params.a11yHear==='partial' && params.a11yVis==='partial'){
      full= this.state.publishedCourses.filter(course=>(
        course.report!=undefined && (course.report[2]<=100) && ((course.report[1]<100 && course.report[1]>50) || course.report[1]===100) && ((course.report[0]<100 && course.report[0]>50) || course.report[0]===100)
      ))
    }
    if(params.a11yCog==='no-filter' && params.a11yHear==='partial' && params.a11yVis==='full'){
      full= this.state.publishedCourses.filter(course=>(
        course.report!=undefined && (course.report[2]<=100) && ((course.report[1]<100 && course.report[1]>50) || course.report[1]===100) && (course.report[0]===100)
      ))
    }
    if(params.a11yCog==='no-filter' && params.a11yHear==='no-filter' && params.a11yVis==='partial'){
      full= this.state.publishedCourses.filter(course=>(
        course.report!=undefined && (course.report[2]<=100) && (course.report[1]<=100) && ((course.report[0]<100 && course.report[0]>50) || course.report[0]===100)
      ))
    }
    if(params.a11yCog==='no-filter' && params.a11yHear==='no-filter' && params.a11yVis==='full'){
      full= this.state.publishedCourses.filter(course=>(
        course.report!=undefined && (course.report[2]<=100) && (course.report[1]<=100) && (course.report[0]===100)
      ))
    }
    if(params.a11yCog==='no-filter' && params.a11yHear==='no-filter' && params.a11yVis==='no-filter'){
      full= this.state.publishedCourses.filter(course=>(
        course.report!=undefined && (course.report[2]<=100) && (course.report[1]<=100) && (course.report[0]<=100)
      ))
    }
    

    //SEARCH LANGUAGE
    let auxsearchAL1=[]
    let auxsearchAL2=[]
    let auxsearchAL3=[]
    let auxsearchAL4=[]
    let auxsearchAL5=[]

    if(languages.turkish===false && languages.spanish===false && languages.polish===false 
      && languages.portugues===false && languages.english===false){
        searchAL=full
    }else{
        if(languages.english===true){
          auxsearchAL1= full.filter(course=>(
            course.language!=undefined && course.language===0
          ))
        }
        if(languages.portugues===true){
          auxsearchAL2= full.filter(course=>(
            course.language!=undefined && course.language===2
          ))
        }
        if(languages.polish===true){
          auxsearchAL3= full.filter(course=>(
            course.language!=undefined && course.language===3
          ))
        }
        if(languages.spanish===true){
          auxsearchAL4= full.filter(course=>(
            course.language!=undefined && course.language===1
          ))
        }
        if(languages.turkish===true){
          auxsearchAL5= full.filter(course=>(
            course.language!=undefined && course.language===4
          ))
        }
        searchAL=auxsearchAL1.concat(auxsearchAL2).concat(auxsearchAL3).concat(auxsearchAL4).concat(auxsearchAL5)
    }
    

    //SEARCH DURATION
    if(this.state.duration.length!=0){
      searchALD= searchAL.filter(course=>{
        if(course.duration!=undefined){
          let durationNumber=''
          if(Number.isInteger(course.duration)===false){
            durationNumber=parseInt(course.duration.split(':')[0])
            if(durationNumber>=this.state.duration[0] && durationNumber<=this.state.duration[1]){
              return true
            }
          }
        }
     })
    }else{//if is empty
      searchALD=searchAL
    }
    //SEARCH BY INSTRUCTOR  
    Object.entries(instructors).forEach(([key, value]) => {
      if(value===true){
        searchALD.filter(course=>{
          course.createdBy.toLowerCase().search(key.toLowerCase()) !=-1?
          searchALDI.push(course)
          :
          undefined
        })
      }     
    });
    if(searchALDI.length===0){searchALDI=searchALD}

    //SEARCH BY ONLINE
    if(this.state.online===true){
      searchALDI.map(course=>{
        if(course.analysis!=undefined){
          if(course.analysis.length!=0){
            if(course.analysis[1]==='online'){
              searchALDI.push(course)
            }
          }
       }
    })
    }
    if(searchALDIO.length===0){searchALDIO=searchALDI}

    //delete duplicates
    searchALDIO=this.getUnique(searchALDIO,'_id')
    
    console.log("full,searchAL,searchALD,searchALDI,searchALDIO", full, searchAL,searchALD,searchALDI,searchALDIO)
    this.state.accessibilitie.a11yVis=null
    this.state.accessibilitie.a11yHear=null
    this.state.accessibilitie.a11yCog=null
    this.state.onlineTag=false
    this.setState(this.state)
    this.setState({
        orsearch:searchALDIO,
        generalDetailedFlag:true,
        onsearchflag:true
      })
    
  }

  getUnique=(arr, comp)=> {

    // store the comparison  values in array
    const unique =  arr.map(e => e[comp]).map((e, i, final) => final.indexOf(e) === i && i).filter((e) => arr[e]).map(e => arr[e]);

  return unique;
}


  
  render() {
    return(
      
      
      
      <div className="courses-dashboard-container">
        {console.log("recarga", this.state)}
        
        <StorySearch
          getParamsofSearch={this.getParamsofSearch}
          getParamsLanguage={this.getParamsLanguage}
          getParamsDuration={this.getParamsDuration}
          getParamsAudiences={this.getParamsAudiences}
          publishedCourses={this.state.publishedCourses}
          getParamsTutors={this.getParamsTutors}
          getOnlineFlag={this.getOnlineFlag}
          getAccessibleFlag={this.getAccessibleFlag}
          getGeneralSearch={this.getGeneralSearch}
          sortByMostRecent={this.sortByMostRecent}
          OrSearch={this.OrSearch}
        />
        
      
        {
          this.state.generalDetailedFlag===false?
          <div>
            {/* {this.paperSearchMyCourses('My Stories', this.state.myFiltersuscribdedCourses)} */}
            {this.paperSearchSeli('SELI Stories', this.state.myFilterSeliCourses)}
            {this.paperSupportNews('Support')}
            {this.paperSupportNews('News')}
          </div>
          : 
          undefined
          
          //  <div>
              // <React.Fragment>  
          //     {//for  OnlineCourses
          //       this.state.onlineTag===true?
          //       <React.Fragment>
          //         {this.paperSearchMyCourses('100% online courses', this.state.onlineCourses)}
          //       </React.Fragment>
          //       :
          //       undefined
          //     }
          //   </React.Fragment>

          //   <React.Fragment>
          //     {// foraccessibilitie Tag
          //       this.state.accessibilitie.a11yCog==='full'?
          //       <React.Fragment>
          //         {this.paperSearchMyCourses('Fully Cognitive', this.state.fullyCognitive)}
          //       </React.Fragment>
          //       :
          //       undefined
          //     }
          //     {
          //       this.state.accessibilitie.a11yHear==='full'?
          //       <React.Fragment>
          //         {this.paperSearchMyCourses('Fully Hearing', this.state.fullyHearing)}
          //       </React.Fragment>
          //       :
          //       undefined
          //     } 
          //     {
          //       this.state.accessibilitie.a11yVis==='full'?
          //       <React.Fragment>
          //         {this.paperSearchMyCourses('Fully Visual', this.state.fullyVisual)}
          //       </React.Fragment>
          //       :
          //       undefined
          //     }
          //   </React.Fragment>

          //   <React.Fragment>  
          //     {//for  OnlineCourses
          //       this.state.onsearchflag===true?
          //       <React.Fragment>
          //         {this.paperSearchMyCourses('Detailed Search', this.state.orsearch)}
          //       </React.Fragment>
          //       :
          //       undefined
          //     }
            //  </React.Fragment>
          //  </div>
        } 
      </div>
    )
  }
}
