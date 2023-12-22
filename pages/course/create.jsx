import axios from 'axios'
import React, {useEffect, useState} from 'react'
import { Container, Grid } from '@mui/material';
import styles from "../../styles/createCourse.module.css"
import {Button} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import {useRouter} from 'next/router';
import Tooltip from '@mui/material/Tooltip';
import dynamic from "next/dynamic";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

function CreateCourse() {

  const router = useRouter()

  useEffect(()=>{
    if (!localStorage.getItem("role")){
      router.replace("/login")
    }else if (localStorage.getItem("role") != "training_center"){
      router.replace("/404")
    }
  })

  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();

  if (dd < 10) {
    dd = '0' + dd;
  }
 
  if (mm < 10) {
    mm = '0' + mm;
  } 
     
  today = yyyy + '-' + mm + '-' + dd;

  const domain = process.env.NEXT_PUBLIC_LOCALHOST;

  const [data, setData] = useState({
    title: "",
    fees: "",
    phone: "",
    location: "",
    startingDate: "",
    endingDate: "",
    workingTimeFrom: "",
    workingTimeTo: "",
    workingDays: "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday",
    description: "",
    level: "Beginner",
    language: "",
    syllabus: "",
    courseIncludes: "",
    certificate: "",
    discount: "",
    faqs: [
      {
        question: "",
        answer: "",
      },
    ],
    instructorName: "",
    instructorRole: "",
    instructorDescription: "",
    instructorProfilePic: "",
  })

  const [syllabus, setSyllabus] = useState("")
  const [courseIncludes, setCourseIncludes] = useState("")

  const [errorFields, setErrorFields] = useState({
    title: {error: false, message: ""},
    fees: {error: false, message: ""},
    phone: {error: false, message: ""},
    location: {error: false, message: ""},
    startingDate: {error: false, message: ""},
    endingDate: {error: false, message: ""},
    workingTimeFrom: {error: false, message: ""},
    workingTimeTo: {error: false, message: ""},
    workingDays: {error: false, message: ""},
    description: {error: false, message: ""},
    level: {error: false, message: ""},
    language: {error: false, message: ""},
    syllabus: {error: false, message: ""},
    courseIncludes: {error: false, message: ""},
    certificate: {error: false, message: ""},
    discount: {error: false, message: ""},
    instructorName: {error: false, message: ""},
    instructorRole: {error: false, message: ""},
    instructorDescription: {error: false, message: ""},
    instructorProfilePic: {error: false, message: ""},
  })
  
  const [file, setFile] = useState("")
  const fileChangeHandler = (e) => {
    if(e.target.files.length){
      console.log("Image selected")
      var img = new Image();
      img.onload = function () {
        console.log("Image loaded")
        let width = this.width
        let height = this.height
        console.log(width + "x" + height)
        if (width < 1100 || height < 500){
          alert(`Image resolution should be minimum 1100x500, current file size is ${width}x${height}`)
          return
        }
        let accepted_file_extension=["jpg", "jpeg", "png"]
        let file_extension = e.target.files[0].name.split(".")[1]
        let file_type = e.target.files[0].type.split("/")[0]
  
        if (accepted_file_extension.includes(file_extension) && file_type == "image"){
          console.log("File changed")
          setFile(e.target.files[0])
        }else{
          alert("Selected file is not an image")
        }
      }
      img.onerror = function () {
        alert("Selected file is not an image")
      };
      img.src = URL.createObjectURL(e.target.files[0]);
    }
  }

  const instructorFileChangeHandler = (e) => {
    let temp_data = data
    if (e.target.files){
      temp_data.instructorProfilePic = e.target.files[0]
      setData({...temp_data})
    }
  }

  const certificateChangeHandler = (e) => {
    let temp_data = data
    if (e.target.files){
      temp_data.certificate = e.target.files[0]
      setData({...temp_data})
    }
  }

  const uploadImg = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    let formData = new FormData()
    formData.append("file", file)
    formData.append("test", "Test")
    axios.post(`${domain}/api/courses/updateCourseThumbnail/63aece88895d1a8f47fe97d6r/`, formData, config)
    .then(res => {
      console.log(res.data)
    })
    .catch(err => {
      console.log(err.response)
    })
  }

  const submitForm = (e) => {
    e.preventDefault()
    let requiredFields = ["title","fees","phone","location","startingDate","endingDate","workingTimeFrom","workingTimeTo","workingDays","description"]
    let error = false
    let tempErrorFields = errorFields

    function setError(focusField, message){
      tempErrorFields[focusField].error=true
      tempErrorFields[focusField].message=message
      if (!error){
        document.getElementById(focusField).focus()
      }
      error = true
    }

    if (data.title != "" && data.title.length<3){
      setError("title", "Title should have minimum 3 characters")
    }
    if (data.title.length > 100){
      setError("title", `Title should not exceed 100 characters`)
    }
    if (data.fees != "" && data.fees<1){
      setError("fees", `Fees should be minimum 1`)
    }
    if (data.fees>99999){
      setError("fees", `Fees should not be more than 5 digit number`)
    }
    if (data.phone != "" && data.phone.length < 7){
      setError("phone", `Phone number should be minimum 7 characters`)
    }
    if (data.phone.length > 14){
      setError("phone", `Phone number should not exceed 14 characters`)
    }
    if (data.location != "" && data.location.length < 3){
      setError("location", `Location should be minimum 3 characters`)
    }
    if (data.location.length > 200){
      setError("location", `Location should not exceed 200 characters`)
    }
    if (data.description != "" && data.description.length < 200){
      setError("description", `Description should have minimum 200 characters`)
    }
    if (data.description.length > 1500){
      setError("description", `Description should not exceed 1500 characters`)
    }

    for (var i=0; i< requiredFields.length; i++){
      if (data[requiredFields[i]] === ""){
        setError(requiredFields[i], `This field is required`)
      }
    }

    setErrorFields({...tempErrorFields})
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (!error){
      const tempData = {
        courseTitle: data.title,
        fees: data.fees,
        enquiryPhoneNo: data.phone,
        location: data.location,
        startingDate: data.startingDate,
        endDate: data.endingDate,
        workingDays: data.workingDays,
        workingTimeFrom: data.workingTimeFrom,
        workingTimeTo: data.workingTimeTo,
        description: data.description,
        active: true,
        level: data.level,
        language: data.language,
        syllabus: syllabus,
        courseIncludes: courseIncludes,
        discount: data.discount,
        faqs: data.faqs,
        instructorName: data.instructorName,
        instructorRole: data.instructorRole,
        instructorDescription: data.instructorDescription,
        
      }
      axios.post(`${domain}/api/courses/createCourse`, tempData, config)
      .then(res => {
        console.log(res.data)
        let instFormData = new FormData()
        let certificate = new FormData()
        instFormData.append("file", data.instructorProfilePic)
        certificate.append("file", data.certificate)
        axios.post(`${domain}/api/courses/updateCourseInstructorImg/${res.data._id}/`, instFormData, config)
            .then(res => {
              console.log(res.data)
            })
            .catch(err => {
              console.log(err.response)
            })
        axios.post(`${domain}/api/courses/updateCourseCertificate/${res.data._id}/`, certificate, config)
            .then(res => {
              console.log(res.data)
            })
            .catch(err => {
              console.log(err.response)
            })
        if (file !== ""){
          let formData = new FormData()
          formData.append("file", file)
          formData.append("test", "Test")
          axios.post(`${domain}/api/courses/updateCourseThumbnail/${res.data._id}/`, formData, config)
          .then(response => {
            console.log(response.data)
            router.push("/training-center-dashboard/activities")
          })
          .catch(err => {
            console.log(err.response)
            router.push("/training-center-dashboard/activities")
          })
        }else{
          console.log("Else")
          router.push("/training-center-dashboard/activities")
        }
      })
      .catch(err => {
        console.log(err.response)
        alert("Something went wrong. Please try again")
      })
    }
  }

  const changeHandler = (e) => {
    if (e.target.id == "phone"){
      if (!Number(e.target.value) && e.target.value!=""){
        return
      }
    }
    setData({
      ...data,
      [e.target.id]: e.target.value
    })
    let tempErrorFields = errorFields
    tempErrorFields[e.target.id].error = false
    tempErrorFields[e.target.id].message = ""
    setErrorFields({...tempErrorFields})
    console.log(data)
  }

  const faqChangeHandler = (e, index) => {
    console.log(e.target.value)
    console.log(e.target.name)
    console.log(index)
    let temp_data = data
    temp_data["faqs"][index][e.target.name] = e.target.value
    setData({...temp_data})
  }

  const addFaqs = () => {
    let temp_data = data
    temp_data.faqs.push({
      question: "",
      answer: "",
    })
    setData({...temp_data})
  }

  let onEditorCourseIncludeStateChange = (editorState) => {
    let data1 = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setCourseIncludes(data1);
    setData({
      ...data,
      courseIncludes: editorState,
    });
  };

  let onEditorSyllabusStateChange = (editorState) => {
    let data1 = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    setSyllabus(data1);
    setData({
      ...data,
      syllabus: editorState,
    });
  };

  return (
    <Container maxWidth = "xxl" className = {styles.Container}>
      <div className = {styles.courseSubContainer}>
        <h2>Create course</h2>
        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officiis, saepe quisquam alias iste non nostrum quia exercitationem atque ratione quidem laborum. Quam, eius nam? Blanditiis architecto earum, sunt dolores inventore illum!</p>
      </div>
      <div className = {styles.courseSubContainer}>
        <form onSubmit = {submitForm}>
          <Grid container columnSpacing={3}>
            <Grid item xs = {12}>
              <div className = {styles.courseThumbnailContainer}>
                <label className = {styles.courseThumbnailEditContainer}>
                  <Tooltip title="Select image of resolution 1100x500">
                    <EditIcon className = {styles.courseThumbnailEditIcon}/>
                  </Tooltip>
                  <input type = "file" onChange = {fileChangeHandler} style = {{display: "none"}} className = {styles.courseThumbnailEditInput} accept=".jpg, .jpeg, .png"/>
                </label>
                <img src={file?URL.createObjectURL(file):"https://d3lh8dfkp7q6os.cloudfront.net/static/pilot-coverPic.png"} alt="" width="100%" className = {styles.courseThumbnail} />
              </div>
            </Grid>
            <Grid item xs = {12} md = {6}>
              <label htmlFor="title" className='inputLabel'>Course title</label>
              <input type="text" id="title" className="inputBox" name = "title" value = {data.title} onChange = {changeHandler}/>
              <div className="input_error_msg" id="salary_error" style = {{display:errorFields.title.error?"block":"none", textTransform: "initial"}}>{errorFields.title.message}</div>
            </Grid>
            <Grid item xs = {12} md = {6}>
              <label htmlFor="fees" className='inputLabel'>Course fees</label>
              <input type="number" id="fees" className="inputBox" name = "fees" value = {data.fees} onChange = {changeHandler}/>
              <div className="input_error_msg" id="salary_error" style = {{display:errorFields.fees.error?"block":"none", textTransform: "initial"}}>{errorFields.fees.message}</div>
            </Grid>
            <Grid item xs = {12} md = {6}>
              <label htmlFor="discount" className='inputLabel'>Discount</label>
              <input type="number" id="discount" className="inputBox" name = "discount" value = {data.discount} onChange = {changeHandler}/>
              <div className="input_error_msg" id="salary_error" style = {{display:errorFields.discount.error?"block":"none", textTransform: "initial"}}>{errorFields.discount.message}</div>
            </Grid>
            <Grid item xs = {12} md = {6}>
              <label htmlFor="phone" className='inputLabel'>Enquiry phone No</label>
              <input type="text" id="phone" className="inputBox" name = "phone" value = {data.phone} onChange = {changeHandler}/>
              <div className="input_error_msg" id="salary_error" style = {{display:errorFields.phone.error?"block":"none", textTransform: "initial"}}>{errorFields.phone.message}</div>
            </Grid>
            <Grid item xs = {12} md = {6}>
              <label htmlFor="location" className='inputLabel'>Location</label>
              <input type="text" id="location" className="inputBox" name = "location" value = {data.location} onChange = {changeHandler}/>
              <div className="input_error_msg" id="salary_error" style = {{display:errorFields.location.error?"block":"none", textTransform: "initial"}}>{errorFields.location.message}</div>
            </Grid>
            <Grid item xs = {12} md = {6}>
              <label htmlFor="startingDate" className='inputLabel'>Starting data</label>
              <input type="date" id="startingDate" className="inputBox" name = "startingDate" value = {data.startingDate} onChange = {changeHandler} min={today} max = {data.endingDate}/>
              <div className="input_error_msg" id="salary_error" style = {{display:errorFields.startingDate.error?"block":"none", textTransform: "initial"}}>{errorFields.startingDate.message}</div>
            </Grid>
            <Grid item xs = {12} md = {6}>
              <label htmlFor="endingDate" className='inputLabel'>Ending date</label>
              <input type="date" id="endingDate" className="inputBox" name = "endingDate" value = {data.endingDate} onChange = {changeHandler} min = {data.startingDate}/>
              <div className="input_error_msg" id="salary_error" style = {{display:errorFields.endingDate.error?"block":"none", textTransform: "initial"}}>{errorFields.endingDate.message}</div>
            </Grid>
            <Grid item xs = {12} md = {6}>
              <label htmlFor="workingTimeFrom" className='inputLabel'>Working time from</label>
              <input type="time" id="workingTimeFrom" className="inputBox" name = "workingTimeFrom" value = {data.workingTimeFrom} onChange = {changeHandler} max={data.workingTimeTo}/>
              <div className="input_error_msg" id="salary_error" style = {{display:errorFields.workingTimeFrom.error?"block":"none", textTransform: "initial"}}>{errorFields.workingTimeFrom.message}</div>
            </Grid>
            <Grid item xs = {12} md = {6}>
              <label htmlFor="workingTimeTo" className='inputLabel'>Working time to</label>
              <input type="time" id="workingTimeTo" className="inputBox" name = "workingTimeTo" value = {data.workingTimeTo} onChange = {changeHandler} min = {data.workingTimeFrom}/>
              <div className="input_error_msg" id="salary_error" style = {{display:errorFields.workingTimeTo.error?"block":"none", textTransform: "initial"}}>{errorFields.workingTimeTo.message}</div>
            </Grid>
            <Grid item xs = {12} md = {6}>
              <label htmlFor="level" className='inputLabel'>Level</label>
              <select id="level" className="inputBox" name = "level" onChange = {changeHandler} value = {data.level}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advance</option>
              </select>
              <div className="input_error_msg" id="salary_error" style = {{display:errorFields.level.error?"block":"none", textTransform: "initial"}}>{errorFields.level.message}</div>
            </Grid>
            <Grid item xs = {12} md = {6}>
              <label htmlFor="language" className='inputLabel'>Language</label>
              <input type="text" id="language" className="inputBox" name = "language" value = {data.language} onChange = {changeHandler}/>
              <div className="input_error_msg" id="salary_error" style = {{display:errorFields.language.error?"block":"none", textTransform: "initial"}}>
                {errorFields.language.message}
              </div>
            </Grid>
            <Grid item xs = {12} md = {6}>
              <label htmlFor="certificate" className='inputLabel'>Certificate</label>
              <div>
                <input type="file" id="certificate" name = "certificate" onChange = {certificateChangeHandler} min = {data.certificate}/>
              </div>
              <div className="input_error_msg" id="salary_error" style = {{display:errorFields.certificate.error?"block":"none", textTransform: "initial"}}>
                {errorFields.certificate.message}
              </div>
            </Grid>
            <Grid item xs = {12} md = {6}>
              <label htmlFor="syllabus" className='inputLabel'>Syllabus</label>
              <Editor
                editorState={data.syllabus}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                stripPastedStyles={true}
                onEditorStateChange={onEditorSyllabusStateChange}
                toolbar={{
                  options: ["inline", "list", "history"],
                  inline:{
                    options: ["bold", "italic", "underline"]
                  },
                  list: {
                  options: ["unordered", "ordered"],
                  }
                  }}
                  style={{backgroundColor:"#fff"}}
                  
              />
              <div className="input_error_msg" id="salary_error" style = {{display:errorFields.syllabus.error?"block":"none", textTransform: "initial"}}>{errorFields.syllabus.message}</div>
            </Grid>
            <Grid item xs = {12}  md = {6}>
              <label className="inputLabel" htmlFor="courseIncludes">
                Course includes
              </label>
              <Editor
                editorState={data.courseIncludes}
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                stripPastedStyles={true}
                onEditorStateChange={onEditorCourseIncludeStateChange}
                toolbar={{
                  options: ["inline", "list", "history"],
                  inline:{
                    options: ["bold", "italic", "underline"]
                  },
                  list: {
                  options: ["unordered", "ordered"],
                  },
                  }}
                  style={{backgroundColor:"#fff"}}
              />
              <div className="input_error_msg" id="salary_error" style = {{display:errorFields.courseIncludes.error?"block":"none", textTransform: "initial"}}>{errorFields.courseIncludes.message}</div>
            </Grid>
            <Grid item xs = {12}  md = {12}>
              <label className="inputLabel" htmlFor="description">
                Description
              </label>
              <textarea
                type="text"
                className="inputBox"
                style={{
                  height: "150px",
                  resize: "none",
                  paddingTop: "10px",
                }}
                placeholder="Short description about your course"
                id="description"
                name = "description"
                value={data.description}
                onChange={changeHandler}
              />
              <div className="input_error_msg" id="salary_error" style = {{display:errorFields.description.error?"block":"none", textTransform: "initial"}}>{errorFields.description.message}</div>
            </Grid>
            <Grid item xs = {12}>
              <label className="inputLabel" htmlFor="question0">
                FAQ&#39;s
              </label>
              {data.faqs.map((faq, index) => {
                return(
                  <Grid container columnSpacing={3} key = {index}>
                    <Grid item xs = {12}  md = {6}>
                      <label className="inputLabel" htmlFor={`question${index}`}>
                        Question
                      </label>
                      <input type="text" id={`question${index}`} className="inputBox" name = "question" value = {faq.question} onChange = {(e)=>faqChangeHandler(e, index)}/>
                    </Grid>
                    <Grid item xs = {12}  md = {6}>
                      <label className="inputLabel" htmlFor={`answer${index}`}>
                        Answer
                      </label>
                      <input type="text" id={`answer${index}`} className="inputBox" name = "answer" value = {faq.answer} onChange = {(e)=>faqChangeHandler(e, index)}/>
                    </Grid>
                  </Grid>
                )
              })}
              <Button onClick = {addFaqs} variant="contained" className = "formBtn4" style = {{float: "right"}}>Add FAQ&#39;s</Button>
              <div className="input_error_msg" id="salary_error" style = {{display:errorFields.description.error?"block":"none", textTransform: "initial"}}>{errorFields.description.message}</div>
            </Grid>
            <Grid item xs = {12}>
              <h4>Instructor</h4>
            </Grid>
            <Grid item xs = {12} md = {6}>
              <label htmlFor="instructorName" className='inputLabel'>Instructor name</label>
              <input type="text" id="instructorName" className="inputBox" name = "instructorName" value = {data.instructorName} onChange = {changeHandler}/>
              <div className="input_error_msg" id="salary_error" style = {{display:errorFields.instructorName.error?"block":"none", textTransform: "initial"}}>
                {errorFields.instructorName.message}
              </div>
            </Grid>
            <Grid item xs = {12} md = {6}>
              <label htmlFor="instructorRole" className='inputLabel'>Instructor role</label>
              <input type="text" id="instructorRole" className="inputBox" name = "instructorRole" value = {data.instructorRole} onChange = {changeHandler}/>
              <div className="input_error_msg" id="salary_error" style = {{display:errorFields.instructorRole.error?"block":"none", textTransform: "initial"}}>
                {errorFields.instructorRole.message}
              </div>
            </Grid>
            <Grid item xs = {12} md = {6} style = {{marginBottom: "20px"}}>
              <label htmlFor="instructorProfilePic" className='inputLabel'>Instructor profile picture</label>
              <div>
                <input type="file" accept='image/*' id="instructorProfilePic" name = "instructorProfilePic" onChange = {instructorFileChangeHandler} min = {data.instructorProfilePic}/>
              </div>
              <div className="input_error_msg" id="salary_error" style = {{display:errorFields.instructorProfilePic.error?"block":"none", textTransform: "initial"}}>
                {errorFields.instructorProfilePic.message}
              </div>
            </Grid>
            <Grid item xs = {12}  md = {12}>
              <label className="inputLabel" htmlFor="instructorDescription">
                Instructor description
              </label>
              <textarea
                type="text"
                className="inputBox"
                style={{
                  height: "150px",
                  resize: "none",
                  paddingTop: "10px",
                }}
                placeholder="Short description about your course"
                id="instructorDescription"
                name = "instructorDescription"
                value={data.instructorDescription}
                onChange={changeHandler}
              />
              <div className="input_error_msg" id="salary_error" style = {{display:errorFields.instructorDescription.error?"block":"none", textTransform: "initial"}}>{errorFields.instructorDescription.message}</div>
            </Grid>
          </Grid>
          
            <Button
              className="formBtn9 mb-10 mt-10"
              style={{ textTransform: "capitalize" }}
              type = "submit"
            >
              Save Course
            </Button>
        </form>
      </div>
      
    </Container>
  )
}
export default CreateCourse