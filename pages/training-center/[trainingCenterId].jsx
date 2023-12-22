import { Alert, Grid } from "@mui/material";
import { Container } from "@mui/system";
import React from "react";
import HistoryIcon from "@mui/icons-material/History";
import BadgeIcon from "@mui/icons-material/Badge";
import LanguageIcon from "@mui/icons-material/Language";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import css from "../../styles/company.module.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import PhoneIcon from "@mui/icons-material/Phone";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import StarPurple500SharpIcon from "@mui/icons-material/StarPurple500Sharp";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import popup from "../../styles/popup.module.css";
import styles from "../../styles/courseListing.module.css";
import Image from "next/image";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import axios from "axios";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";

const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const imageLink = process.env.NEXT_PUBLIC_CDN;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(0),
  color: theme.palette.text.secondary,
  overflow: "hidden",
  height: "100%",
}));

function TrainingCenterLanding() {
  const router = useRouter();
  const [enquiredCourses, setEnquiredCourses] = useState([]);
  const [isPilot, setIsPilot] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userErrorPopup, setUserErrorPopup] = useState(false);

  const [trainingCenterData, setTrainingCenterData] = useState({
    courses: [],
  });

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
    if (router.query.trainingCenterId) {
      axios
        .get(
          `${domain}/api/courses/allTrainingCenterCourses/${router.query.trainingCenterId}`
        )
        .then((res1) => {
          axios
            .get(
              `${domain}/api/trainingCenter/getTrainingCenterDetailsId/${router.query.trainingCenterId}`
            )
            .then((res2) => {
              try {
                let tempTrainingCenterData = trainingCenterData;
                tempTrainingCenterData.profilePic = res2.data.userId.profilePic;
                tempTrainingCenterData.coverPic = res2.data.userId.coverPic;
                tempTrainingCenterData.courses = res1.data;
                tempTrainingCenterData.trainingCenterName =
                  res2.data.centerName;
                tempTrainingCenterData.tagline = res2.data.tagline;
                tempTrainingCenterData.businessContactNo =
                  res2.data.centerPhoneNo;
                tempTrainingCenterData.businessMailID = res2.data.centerEmailId;
                tempTrainingCenterData.location = res2.data.location;
                tempTrainingCenterData.country = res2.data.country;
                tempTrainingCenterData.establishedYear =
                  res2.data.establishedYear;
                tempTrainingCenterData.description = res2.data.description;
                tempTrainingCenterData.trainingCenterImages = res2.data.images;
                tempTrainingCenterData.memberSince = res2.data.createdAt;
                tempTrainingCenterData.website = res2.data.website;
                setTrainingCenterData({
                  ...tempTrainingCenterData,
                });
              } catch {
                alert("error");
                router.push("/404");
              }
            })
            .catch((err) => {
              // router.push("/404")
            });
          console.log(res.data);
        })
        .catch((err) => {
          // router.push("/404")
        });
    }
    if (localStorage && localStorage.getItem("role") == "pilot") {
      getEnquiredCourses();
    }
  }, [router.asPath]);

  const [enquirePopup, setEnquirePopup] = useState(false);
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [enquiryData, setEnquiryData] = useState({
    message: "",
  });

  const closeEnquirePopup = () => {
    setEnquirePopup(false);
  };

  const enquiryMsgChangeHandler = (e) => {
    setEnquiryData({ message: e.target.value });
  };

  const postEnquiry = () => {
    setEnquiryLoading(true);
    setEnquiryData({ message: "" });
    setEnquirePopup(false);
    setEnquiryLoading(false);
  };

  const enquireCourse = (id) => {
    if (!isPilot) {
      setUserErrorPopup(true);
    } else {
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      };
      setEnquirePopup(true);
      axios
        .post(`${domain}/api/courses/createCourseEnquiry/${id}`, {}, config)
        .then((res) => {
          console.log(res.data);
          alert("Enquired successfully");
          getEnquiredCourses();
        })
        .catch((err) => {
          console.log(err);
          alert("Something went wrong. Please try again");
        });
    }
  };

  return (
    <div>
      <Container maxWidth="xxl">
        <div style={{ padding: "30px 0px" }}>
          <Grid container spacing={2}>
            <Grid item xl={8} lg={8} md={8} sm={12} xs={12}>
              <div
                style={{ position: "relative", borderRadius: "10px" }}
                className={css.leftDiv}
              >
                <img
                  src={`${imageLink}/${trainingCenterData.coverPic}`}
                  className={css.coverPic}
                  alt={trainingCenterData.coverPic}
                />
                {/* <BookmarkAddOutlinedIcon className={css.bookmark} /> */}
                <div className={css.profilePicNameContainer}>
                  <div className={css.profilePic}>
                    <img
                      src={`${imageLink}/${trainingCenterData.profilePic}`}
                      style={{
                        height: "100%",
                        width: "100%",
                        borderRadius: "50%",
                      }}
                      alt={trainingCenterData.profilePic}
                    />
                  </div>
                  <div className={css.nameDiv}>
                    <div className={css.companyName}>
                      {trainingCenterData.trainingCenterName}
                    </div>
                    {trainingCenterData.tagline && (
                      <div className={css.industry}>
                        {trainingCenterData.tagline}
                      </div>
                    )}

                    <div className={css.country}>
                      {trainingCenterData.location &&
                        trainingCenterData.location}
                      {trainingCenterData.location && ","} &nbsp;
                      {trainingCenterData.country}
                    </div>
                  </div>
                </div>
              </div>

              <div className={css.contentDiv}>
                {trainingCenterData.description && (
                  <>
                    <div className={css.add}>Description</div>
                    <div className={css.desc}>
                      {trainingCenterData.description}
                    </div>
                  </>
                )}
                <></>

                <>
                  <div className={css.add}>Active Courses</div>
                  {trainingCenterData.courses.length == 0 ? (
                    <Alert severity="info" sx={{ marginBottom: "20px" }}>
                      No Courses Yet
                    </Alert>
                  ) : (
                    <Grid container spacing={3}>
                      {trainingCenterData.courses.map((course, index) => {
                        return (
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={12}
                            lg={6}
                            xl={4}
                            key={index}
                          >
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
                                  <a className={styles.courseTitle}>
                                    {course.courseTitle}
                                  </a>
                                </Link>
                                <p className={styles.CourseContent}>
                                  <LocationOnOutlinedIcon
                                    sx={{ color: "#00e7fc" }}
                                  />
                                  {course.location}
                                </p>
                                <p className={styles.CourseContent}>
                                  <CalendarMonthOutlinedIcon
                                    sx={{ color: "#00e7fc" }}
                                  />{" "}
                                  {course.startingDate.slice(0, 10)} -{" "}
                                  {course.endDate.slice(0, 10)}
                                </p>
                                <p className={styles.CourseContent}>
                                  <AccessTimeOutlinedIcon
                                    sx={{ color: "#00e7fc" }}
                                  />{" "}
                                  {`${course.workingTimeFrom} - ${course.workingTimeTo}`}
                                </p>
                                <p className={styles.courseDescription}>
                                  {course.description}
                                </p>
                                <h3
                                  className={styles.courseFeeEnquiryContainer}
                                >
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
                  )}
                </>
              </div>
            </Grid>
            <Grid
              item
              xl={4}
              lg={4}
              md={4}
              sm={12}
              xs={12}
              sx={{ position: "relative" }}
            >
              <div
                className={css.rightDiv}
                style={{ position: "sticky", top: "80px" }}
              >
                <div className={css.add}>Additional Details</div>
                {trainingCenterData.website && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <div>
                      <LanguageIcon />
                    </div>
                    <div style={{ marginLeft: "15px" }}>
                      <div className={css.rightHead}>Website</div>
                      <div className={css.rightDesc}>
                        {trainingCenterData.website}
                      </div>
                    </div>
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <div>
                    <PhoneIcon />
                  </div>
                  <div style={{ marginLeft: "15px" }}>
                    <div className={css.rightHead}>Business Contact No.</div>
                    <div className={css.rightDesc}>
                      +91 {trainingCenterData.businessContactNo}
                    </div>
                  </div>
                </div>
                {trainingCenterData.establishedYear && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <div>
                      <CalendarTodayOutlinedIcon />
                    </div>
                    <div style={{ marginLeft: "15px" }}>
                      <div className={css.rightHead}>Established Year</div>
                      <div className={css.rightDesc}>
                        {trainingCenterData.establishedYear}
                      </div>
                    </div>
                  </div>
                )}
                {trainingCenterData.businessMailID && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <div>
                      <MailOutlineIcon />
                    </div>
                    <div style={{ marginLeft: "15px" }}>
                      <div className={css.rightHead}>Business Mail ID</div>
                      <div className={css.rightDesc}>
                        {trainingCenterData.businessMailID}
                      </div>
                    </div>
                  </div>
                )}
                {trainingCenterData.memberSince ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <div>
                      <CalendarTodayOutlinedIcon />
                    </div>
                    <div style={{ marginLeft: "15px" }}>
                      <div className={css.rightHead}>Nexdro Member since</div>
                      <div className={css.rightDesc}>
                        {`${trainingCenterData.memberSince.slice(
                          8,
                          10
                        )}-${trainingCenterData.memberSince.slice(
                          5,
                          7
                        )}-${trainingCenterData.memberSince.slice(0, 4)}`}
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </Grid>
          </Grid>
        </div>
      </Container>
      {/* <Dialog
        open={enquirePopup}
        onClose={closeEnquirePopup}
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
      </Dialog> */}
      {/* <Dialog
        open={loginPopup}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setLoginPopup(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="popupContainer">
          <ClearRoundedIcon
            className="popupClose"
            onClick={() => setLoginPopup(false)}
          />
          <div className="popupTitle">
            You aren&#39;t logged into Nexdro. Please login to continue?
          </div>
          <center>
            <Link href="/login">
              <div className="popupLoginBtn">Login/Signup</div>
            </Link>
          </center>
        </div>
      </Dialog>
      <Dialog
        open={noPilot}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setNoPilot(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="popupContainer">
          <ClearRoundedIcon
            className="popupClose"
            onClick={() => setNoPilot(false)}
          />
          <div className="popupTitle">
            Only Pilots are allowed to save jobs at the moment. Please login
            with a pilot account.
          </div>
        </div>
      </Dialog> */}
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
              <div
                className="popupLoginBtn"
                onClick={() => setUserErrorPopup(false)}
              >
                Close
              </div>
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
    </div>
  );
}

export default TrainingCenterLanding;
