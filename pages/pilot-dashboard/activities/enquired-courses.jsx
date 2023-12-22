import React, {useState, useEffect} from 'react'
import PilotActivities from "../../../components/layouts/PilotActivities";
import axios from "axios";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import styles from "../../../styles/courseListing.module.css";
import StarPurple500SharpIcon from "@mui/icons-material/StarPurple500Sharp";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import Link from "next/link";
import Image from "next/image";
import Alert from "@mui/material/Alert";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';
import Dialog from "@mui/material/Dialog";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import Slide from "@mui/material/Slide";
import Button from "@mui/material/Button";

const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const imageLink = process.env.NEXT_PUBLIC_CDN;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function EnquiredCourses() {

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(0),
    color: theme.palette.text.secondary,
    overflow: "hidden",
    height: "100%",
  }));

  const [courses, setCourses] = useState([])
  const [deleteId, setDeleteId] = useState(false)
  const [deleting, setDeleting] = useState([])

  useEffect(()=>{
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.get(`${domain}/api/courses/pilotEnquiredCoursesDetailed`, config)
    .then(res => {
      console.log(res.data)
      setCourses([...res.data])
    })
    .catch(err => {
      console.log(err)
    })
  }, [])

  const deleteCourse = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    let tempDeleting = deleting
    tempDeleting.push(deleteId)
    setDeleting([...tempDeleting])
    axios.get(`${domain}/api/courses/pilotRemoveEnquiry/${deleteId}`, config)
    .then(res => {
      tempDeleting.splice(tempDeleting.indexOf(deleteId), 1)
      setDeleting([...tempDeleting])
      console.log(res)
      axios.get(`${domain}/api/courses/pilotEnquiredCoursesDetailed`, config)
      .then(res => {
        console.log(res.data)
        setCourses([...res.data])
      })
      .catch(err => {
        console.log(err)
      })
    })
    setDeleteId(false)
    console.log(deleteId)
  }

  return (
    <>
      {!courses.length?
        <Alert severity="info">
          You don&#39;t enquired any courses yet. Find the courses{" "}
          <span style={{ textDecoration: "underline" }}>
            <Link href="/course">here</Link>
          </span>
        </Alert>
        :""
      }
      <Grid container spacing={3}>
          {courses.map((course, index) => {
            return (
              <Grid item xs={12} sm={6} md={12} lg={6} xl={4} key={index}>
                <Item>
                  <div className={styles.courseImageContainer}>
                    <Image
                      alt="Mountains"
                      src={`${imageLink}/600x167/${course.courseId.thumbnail}`}
                      layout="fill"
                      objectFit="contain"
                      className={styles.courseImage}
                    />
                    <div className = {styles.courseEditIcon}>
                      <IconButton onClick = {()=>setDeleteId(course._id)} disabled = {deleting.includes(course._id)}>
                        {deleting.includes(course._id)
                          ?<AutoDeleteIcon color='error'/>
                          :<DeleteIcon color='error'/>
                        }
                      </IconButton>
                  </div>
                  </div>
                  <div className={styles.courseDetailsContainer}>
                    <StarPurple500SharpIcon
                      fontSize="small"
                      sx={
                        course.courseId.rating > 0
                          ? { color: "gold" }
                          : { color: "#c5c5c5" }
                      }
                    />
                    <StarPurple500SharpIcon
                      fontSize="small"
                      sx={
                        course.courseId.rating > 1
                          ? { color: "gold" }
                          : { color: "#c5c5c5" }
                      }
                    />
                    <StarPurple500SharpIcon
                      fontSize="small"
                      sx={
                        course.courseId.rating > 2
                          ? { color: "gold" }
                          : { color: "#c5c5c5" }
                      }
                    />
                    <StarPurple500SharpIcon
                      fontSize="small"
                      sx={
                        course.courseId.rating > 3
                          ? { color: "gold" }
                          : { color: "#c5c5c5" }
                      }
                    />
                    <StarPurple500SharpIcon
                      fontSize="small"
                      sx={
                        course.courseId.rating > 4
                          ? { color: "gold" }
                          : { color: "#c5c5c5" }
                      }
                    />
                    <Link href={`/course/${course.courseId._id}`}>
                      <a className={styles.courseTitle}>{course.courseId.courseTitle}</a>
                    </Link>
                    <Link
                      href={`/training-center/${course.trainingCenterId._id}`}
                    >
                      <a className={styles.courseTrainingCenterName}>
                        {course.trainingCenterId.centerName}
                      </a>
                    </Link>
                    <p className={styles.CourseContent}>
                      <LocationOnOutlinedIcon sx={{ color: "#00e7fc" }} />
                      {course.courseId.location}
                    </p>
                    <p className={styles.CourseContent}>
                      <CalendarMonthOutlinedIcon sx={{ color: "#00e7fc" }} />{" "}
                      {course.courseId.startingDate.slice(0, 10)} -{" "}
                      {course.courseId.endDate.slice(0, 10)}
                    </p>
                    <p className={styles.CourseContent}>
                      <AccessTimeOutlinedIcon sx={{ color: "#00e7fc" }} />{" "}
                      {`${course.courseId.workingTimeFrom} - ${course.courseId.workingTimeTo}`}
                    </p>
                    <p className={styles.courseDescription}>
                      {course.courseId.description}
                    </p>
                    <h3 className={styles.courseFeeEnquiryContainer}>
                      ${course.courseId.fees}
                      <Button
                        className="enquire2"
                        disabled
                      >
                        {course.status}
                      </Button>
                    </h3>
                  </div>
                </Item>
              </Grid>
            );
          })}
        </Grid>
        <Dialog
          open={deleteId}
          TransitionComponent={Transition}
          keepMounted
          onClose={()=>setDeleteId(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <div className="popupContainer">
            <ClearRoundedIcon
              className="popupClose"
              onClick={()=>setDeleteId(false)}
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
    </>
  )
}
EnquiredCourses.Layout = PilotActivities;
export default EnquiredCourses