import React, { useState, useEffect } from "react";
import { Container } from "@mui/material";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Image from "next/image";
import styles from "../../styles/courseListing.module.css";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import StarPurple500SharpIcon from "@mui/icons-material/StarPurple500Sharp";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import popup from "../../styles/popup.module.css";
import Dialog from "@mui/material/Dialog";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Loader from "../../components/loader";
import Slide from "@mui/material/Slide";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import axios from "axios";
import Alert from "@mui/material/Alert";

const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const imageLink = process.env.NEXT_PUBLIC_CDN;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

function CourseListing() {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(0),
    color: theme.palette.text.secondary,
    overflow: "hidden",
    height: "100%",
  }));

  const [courses, setCourses] = useState([]);
  const [filterData, setFilterData] = useState({courseTitle: "", location: ""});
  const [enquiredCourses, setEnquiredCourses] = useState([]);
  const [isPilot, setIsPilot] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userErrorPopup, setUserErrorPopup] = useState(false);
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [enquiryData, setEnquiryData] = useState({
    message: "Can I know the enrolment procedure?",
  });
  const [enquireId, setEnquireId] = useState(null)

  const getEnquiredCourses = () => {
    if (!isPilot) {
      setIsPilot(true);
    }
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .get(`${domain}/api/courses/pilotEnquiredCourses`, config)
      .then((res) => {
        let tempEnquiredCourses = [];
        for (var i = 0; i < res.data.length; i++) {
          tempEnquiredCourses.push(res.data[i].courseId);
        }
        setEnquiredCourses([...tempEnquiredCourses]);
        console.log(res.data);
        console.log(tempEnquiredCourses);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    axios
      .get(`${domain}/api/courses/allCourses`)
      .then((res) => {
        setCourses([...res.data]);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    if (localStorage && localStorage.getItem("role") == "pilot"){
      getEnquiredCourses();
    }
    if(localStorage && localStorage.getItem("role")) {
      setIsLoggedIn(true)
    }
  }, []);

  const closeEnquirePopup = () => {
    setEnquireId(null);
    setEnquiryData({ message: "Can I know the enrolment procedure?" });
  };

  const enquiryMsgChangeHandler = (e) => {
    setEnquiryData({ message: e.target.value });
  };

  const postEnquiry = () => {
    setEnquiryLoading(true);
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      };
      axios
        .post(`${domain}/api/courses/createCourseEnquiry/${enquireId}`, {message: enquiryData.message}, config)
        .then((res) => {
          console.log(res.data);
          setEnquiryLoading(false);
          setEnquireId(null)
          getEnquiredCourses();
        })
        .catch((err) => {
          console.log(err);
          setEnquiryLoading(false);
          setEnquireId(null)
          alert("Something went wrong. Please try again");
        });
    setEnquiryData({ message: "Can I know the enrolment procedure?" });
  };

  const enquireCourse = (id) => {
    if (!isPilot) {
      setUserErrorPopup(true);
    } else {
      setEnquireId(id)
    }
  };

  const getFilteredData = (value)=>{
    console.log("Filter success")
    console.log(value)
    axios.get(`${domain}/api/courses/allFilteredCourses/?courseTitle=${value.courseTitle}&location=${value.location}`)
    .then(res => {
      console.log("Filter success")
      console.log(res.data)
      setCourses([...res.data])
    })
    .catch(err => {
      console.log("Filter failed")
      console.log(err)
    })
  }

  const changeHandler = (e) => {
    let temp_filter = filterData
    temp_filter[e.target.name] = e.target.value
    setFilterData({...temp_filter})
    getFilteredData(temp_filter)
  }

  return (
    <>
      <Container
        maxWidth="xxl"
        sx={{ padding: "50px 0px", background: "rgb(243, 243, 243)" }}
      >
        <Grid container className={styles.courseFilterInputContainer}>
          <Grid item xs={6} className={styles.courseFilterInputIconContainer}>
            <SearchIcon className={styles.courseFilterInputIcon} />
            <input
              type="text"
              className={`${styles.courseFilterInput} ${styles.courseFilterInputFirst}`}
              placeholder="Title of the course"
              name="courseTitle"
              value = {filterData.courseTitle}
              onChange = {changeHandler}
            />
          </Grid>
          <Grid item xs={6} className={styles.courseFilterInputIconContainer}>
            <LocationOnOutlinedIcon className={styles.courseFilterInputIcon} />
            <input
              type="text"
              className={styles.courseFilterInput}
              placeholder="Location of the training center"
              name="location"
              value = {filterData.location}
              onChange = {changeHandler}
            />
          </Grid>
        </Grid>
        {
          !courses.length
          ?<Alert severity="info" >
            No course based on your search.
          </Alert>
          :""
        }
        
        <Grid container spacing={3}>
          {courses.map((course, index) => {
            return (
              <Grid item xs={12} sm={6} md={6} lg={4} xl={3} key={index}>
                <Item>
                  <div className={styles.courseImageContainer}>
                    <Image
                      alt="Mountains"
                      src={`${imageLink}/600x167/${course.thumbnail}`}
                      layout="fill"
                      objectFit="contain"
                      className={styles.courseImage}
                    />
                  </div>
                  <div className={styles.courseDetailsContainer}>
                    <StarPurple500SharpIcon
                      fontSize="small"
                      sx={
                        course.rating > 0
                          ? { color: "gold" }
                          : { color: "#c5c5c5" }
                      }
                    />
                    <StarPurple500SharpIcon
                      fontSize="small"
                      sx={
                        course.rating > 1
                          ? { color: "gold" }
                          : { color: "#c5c5c5" }
                      }
                    />
                    <StarPurple500SharpIcon
                      fontSize="small"
                      sx={
                        course.rating > 2
                          ? { color: "gold" }
                          : { color: "#c5c5c5" }
                      }
                    />
                    <StarPurple500SharpIcon
                      fontSize="small"
                      sx={
                        course.rating > 3
                          ? { color: "gold" }
                          : { color: "#c5c5c5" }
                      }
                    />
                    <StarPurple500SharpIcon
                      fontSize="small"
                      sx={
                        course.rating > 4
                          ? { color: "gold" }
                          : { color: "#c5c5c5" }
                      }
                    />
                    <Link href={`/course/${course._id}`}>
                      <a className={styles.courseTitle}>{course.courseTitle}</a>
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
                      {course.location}
                    </p>
                    <p className={styles.CourseContent}>
                      <CalendarMonthOutlinedIcon sx={{ color: "#00e7fc" }} />{" "}
                      {course.startingDate.slice(0, 10)} -{" "}
                      {course.endDate.slice(0, 10)}
                    </p>
                    <p className={styles.CourseContent}>
                      <AccessTimeOutlinedIcon sx={{ color: "#00e7fc" }} />{" "}
                      {`${course.workingTimeFrom} - ${course.workingTimeTo}`}
                    </p>
                    <p className={styles.courseDescription}>
                      {course.description}
                    </p>
                    <h3 className={styles.courseFeeEnquiryContainer}>
                      ${course.fees}
                      <Button
                        className="enquire2"
                        style={
                          enquiredCourses.includes(course._id)
                            ? { opacity: 0.5 }
                            : { opacity: 1 }
                        }
                        onClick={() => enquireCourse(course._id)}
                        disabled={enquiredCourses.includes(course._id)}
                      >
                        Enquire
                      </Button>
                    </h3>
                  </div>
                </Item>
              </Grid>
            );
          })}
        </Grid>
        <Dialog
          open = {enquireId}
          onClose = {closeEnquirePopup}
          keepMounted
          aria-describedby="alert-dialog-slide-description"
        >
        <div className={popup.popupContainer}>
          <div className={popup.closeBtn} onClick={closeEnquirePopup}>
            <CloseRoundedIcon style={{ fontSize: "30px" }} /> 
          </div>
          <div className={popup.popupHead}>
            Enquire to course to initialize chat
          </div>

          <label className="inputLabel" htmlFor="message">
            Message
          </label>

          <textarea
            id="message"
            type="text"
            className="inputBox"
            placeholder="Message"
            style={{
              height: "100px",
              paddingTop: "10px",
              width: "100%",
              resize: "none",
            }}
            value={enquiryData.message}
            onChange={enquiryMsgChangeHandler}
          />
          <div className="input_error_msg" id="message_error">
            Message is required
          </div>
          <center>
            {enquiryLoading ? (
              <div className={popup.popupSubmit}>
                <Loader />
                Starting
              </div>
            ) : (
              <button className={popup.popupSubmit} onClick={postEnquiry}>
                Start Chat
              </button>
            )}
          </center>
        </div>
        </Dialog>
        <Dialog
          open={userErrorPopup}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setUserErrorPopup(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <div className="popupContainer">
            <CloseRoundedIcon
              className="popupClose"
              onClick={() => setUserErrorPopup(false)}
            />
            <div className="popupTitle">
              You are not pilot. Login as pilot to enquire course.
            </div>
            <center>
              {isLoggedIn ? (
                <div className="popupLoginBtn" onClick={() => setUserErrorPopup(false)}>Close</div>
              ) : (
                <>
                  <Link href="/login">
                    <div className="popupLoginBtn">Login/Signup</div>
                  </Link>
                </>
              )}
            </center>
          </div>
        </Dialog>
      </Container>
    </>
  );
}

// userErrorPopup

export default CourseListing;
