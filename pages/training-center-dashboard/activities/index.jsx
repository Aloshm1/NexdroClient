import React, { useEffect, useState } from 'react'
import TrainingCenterActivities from "../../../components/layouts/TrainingCenterActivities";
import Grid from "@mui/material/Grid";
import styles from "../../../styles/courseListing.module.css"
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import StarPurple500SharpIcon from '@mui/icons-material/StarPurple500Sharp';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/router';
import axios from 'axios';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import Slide from "@mui/material/Slide";

const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const imageLink = process.env.NEXT_PUBLIC_CDN;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Courses() {

  const router = useRouter()

  const [courses, setCourses] = useState([]);
  const [deleting, setDeleting] = useState([])
  const [deleteId, setDeleteId] = useState(null)

  useEffect(()=>{
    if (localStorage.getItem("role") != "training_center"){
      router.replace("/404")
    }
  }, [])

  const deleteCourse = () => {
    setDeleteId(null)
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    let tempDeleting = deleting
    tempDeleting.push(deleteId)
    setDeleting([...tempDeleting])

    axios.get(`${domain}/api/courses/deleteCourse/${deleteId}`, config)
    .then(res => {
      setCourses(res.data)
      tempDeleting.splice(tempDeleting.indexOf(deleteId), 1)
      setDeleting([...tempDeleting])
    })
    .catch(err => {
      alert("Something went wrong")
      tempDeleting.splice(tempDeleting.indexOf(deleteId), 1)
      setDeleting([...tempDeleting])
    })
  }

  useEffect(()=>{
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.get(`${domain}/api/courses/allUserCourses`, config)
    .then(res => {
      console.log(res.data)
      setCourses([...res.data])
    })
    .catch(err => {
      console.log(err.response)
    })
  }, [router.asPath])

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(0),
    color: theme.palette.text.secondary,
    overflow: "hidden",
    height: "100%",
  }));

  return (
    <div>
      <div className={styles.createCourseBtnContainer}>
        <Link href = "/course/create"><a>
          <Button className = "formBtn8">
            Add course
          </Button>
        </a></Link>
      </div>
      {courses.length == 0
        ?<Alert severity="info">
          You dont have any courses to list. <Link href = "/course/create"><a style={{ textDecoration: "underline" }}>Add course</a></Link>
        </Alert>
        :<Grid container spacing={3}>
        {courses.map((course, index) => {
          return (
            <Grid item xs = {12} sm = {6} xl = {4} key = {index}>
              <Item>
                <div className={styles.courseImageContainer}>
                  <Image
                    alt='Mountains'
                    src={`${imageLink}/600x167/${course.thumbnail}`}
                    layout='fill'
                    objectFit='contain'
                    className = {styles.courseImage}
                  />
                  <div className = {styles.courseEditIcon}>
                    <Link href = {`/course/edit/${course._id}`}>
                      <a>
                        <IconButton>
                          <EditIcon />
                        </IconButton>
                      </a>
                    </Link>
                    <IconButton onClick = {()=>setDeleteId(course._id)} disabled = {deleting.includes(course._id)}>
                      {deleting.includes(course._id)
                        ?<AutoDeleteIcon color='error'/>
                        :<DeleteIcon color='error'/>
                      }
                    </IconButton>
                  </div>
                </div>
                <div className={styles.courseDetailsContainer}>
                  <StarPurple500SharpIcon fontSize="small" sx = {course.rating>0?{color:"gold"}:{color: "#c5c5c5"}}/>
                  <StarPurple500SharpIcon fontSize="small" sx = {course.rating>1?{color:"gold"}:{color: "#c5c5c5"}}/>
                  <StarPurple500SharpIcon fontSize="small" sx = {course.rating>2?{color:"gold"}:{color: "#c5c5c5"}}/>
                  <StarPurple500SharpIcon fontSize="small" sx = {course.rating>3?{color:"gold"}:{color: "#c5c5c5"}}/>
                  <StarPurple500SharpIcon fontSize="small" sx = {course.rating>4?{color:"gold"}:{color: "#c5c5c5"}}/>
                  <Link href = {`/course/${course._id}`}>
                    <a className={styles.courseTitle}>
                      {course.courseTitle}
                    </a>
                  </Link>
                  <p className={styles.CourseContent}><LocationOnOutlinedIcon sx={{ color: "#00e7fc" }} />{course.location}</p>
                  <p className={styles.CourseContent}><CalendarMonthOutlinedIcon sx={{ color: "#00e7fc" }} /> {course.startingDate.slice(0,10)} - {course.endDate.slice(0,10)}</p>
                  <p className={styles.CourseContent}><AccessTimeOutlinedIcon sx={{ color: "#00e7fc" }} /> {`${course.workingTimeFrom} - ${course.workingTimeTo}`}</p>
                  <p className = {styles.courseDescription}>{course.description}</p>
                  <h3 className={styles.courseFeeEnquiryContainer}>${course.fees}<Link href = {`/training-center-dashboard/activities/course/enquiries/${course._id}`}><a><Button className="enquire2">Enquiries</Button></a></Link></h3>
                </div>
              </Item>
            </Grid>
          )
        })}
      </Grid>
      }
      <Dialog
        open={deleteId}
        TransitionComponent={Transition}
        keepMounted
        onClose={()=>setDeleteId(null)}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="popupContainer">
          <ClearRoundedIcon
            className="popupClose"
            onClick={()=>setDeleteId(null)}
          />
          <div className="popupTitle" style={{ textAlign: "left" }}>
            Delete course?
          </div>
          <div className="popupSubTitle">
            Are you sure you want to delete?
          </div>
          <center>
            <div className="popupLoginBtn" onClick={deleteCourse}>
              Delete
            </div>
          </center>
        </div>
      </Dialog>
    </div>
  )
}

Courses.Layout = TrainingCenterActivities;
export default Courses