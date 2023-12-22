import axios from 'axios'
import React, {useEffect, useState} from 'react'
import { Container, Grid } from '@mui/material';
import styles from "../../../styles/createCourse.module.css"
import {Button} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import {useRouter} from 'next/router';
import Tooltip from '@mui/material/Tooltip';

const imageLink = process.env.NEXT_PUBLIC_CDN;

function EditCourse() {

  const router = useRouter()
  
  const [data, setData] = useState({
    id: "",
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
  })

  useEffect(()=>{
    if (!localStorage.getItem("role")){
      router.replace("/login")
    }else if (localStorage.getItem("role") != "training_center"){
      router.replace("/404")
    }
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    console.log(router.query.id)
    if (router.query.id){
      axios.get(`${domain}/api/courses/getCourse/${router.query.id}`, config)
      .then(res => {
        let tempData = data
        tempData.id = res.data._id
        tempData.title = res.data.courseTitle
        tempData.fees = res.data.fees
        tempData.phone = res.data.enquiryPhoneNo
        tempData.location = res.data.location
        tempData.startingDate = res.data.startingDate.slice(0,10)
        tempData.endingDate = res.data.endDate.slice(0,10)
        tempData.workingTimeFrom = res.data.workingTimeFrom
        tempData.workingTimeTo = res.data.workingTimeTo
        tempData.workingDays =  "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday"
        tempData.description = res.data.description
        setFile(res.data.thumbnail)
        console.log(tempData)
        setData({...tempData})
      })
      .catch(err => {
        console.log(err.response)
      })
    }
  }, [router.asPath])

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
  })

  const [file, setFile] = useState("static/pilot-coverPic.png")
  useEffect(()=>{
    try{
      console.log(typeof file)
      uploadImg()
    }
    catch{
      console.log("Catch")
    }
  }, [file])
  
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

  const uploadImg = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    let formData = new FormData()
    console.log(file)
    formData.append("file", file)
    formData.append("test", "Test")
    axios.post(`${domain}/api/courses/updateCourseThumbnail/${data.id}`, formData, config)
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
      }
      axios.post(`${domain}/api/courses/updateCourse/${router.query.id}`, tempData, config)
      .then(res => {
        console.log(res)
        alert("Course updated")
        router.push("/training-center-dashboard/activities")
      })
      .catch(err => {
        console.log(err.response)
        alert("Error")
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
  }

  return (
    <Container maxWidth = "xxl" className = {styles.Container}>
      <div className = {styles.courseSubContainer}>
        <h2>Edit course</h2>
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
                <img src={file && typeof file != "string"?URL.createObjectURL(file):`${imageLink}/1800x500/${file}`} alt="" width="100%" className = {styles.courseThumbnail} />
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
            <Grid item xs = {12}>
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
export default EditCourse