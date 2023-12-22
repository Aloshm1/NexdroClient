import React from 'react';
import { useRouter } from 'next/router';
import { Container, Grid } from '@mui/material';
import styles from "../../styles/courseLanding.module.css";
import {Button} from '@mui/material';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import Image from 'next/image';
import StarPurple500SharpIcon from "@mui/icons-material/StarPurple500Sharp";
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from "axios";
import parse from "html-react-parser";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Dialog from "@mui/material/Dialog";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import popup from "../../styles/popup.module.css";
import Slide from "@mui/material/Slide";

const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const imageLink = process.env.NEXT_PUBLIC_CDN;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

function CourseLandingPage() {
  let [ratingPopup, setRatingPopup] = useState(false);
  const router = useRouter()
  const [active, setActive] = useState("")
  const [review, setReview] = useState("")
  const [courseDetails, setCourseDetails] = useState({})
  const [reviewList, setReviewList] = useState([])
  let [status, setStatus] = useState(false);
  let [rating, setRating] = useState(3);


  const getReviews = () => {
    axios.get(`${domain}/api/courses/courseReviews/${router.query.courseId}`)
    .then(res => {
      setReviewList(res.data)
    })
    .catch(err => {
      console.log(err)
    })
  }

  useEffect(()=>{
    getReviews()
    let query = router.asPath.split("#")
    if (query.length > 1){
      setActive(query[1])
    }
    axios.get(`${domain}/api/courses/getCourse/${router.query.courseId}`)
    .then(res => {
      console.log(res.data)
      if (res.data){
        let temp_data = res.data
        try{
          temp_data.faqs = JSON.parse(res.data.faqs)
        }catch{}
        setCourseDetails({...temp_data})
      }
    })
    .catch(err => {
      console.log(err)
    })
  }, [router.asPath])

  const handleReviewChange = (e) => {
    setReview(e.target.value)
  }

  const submitReviewForm = () => {
    if (review.length > 3){
      setRatingPopup(true)
    }
  }

  let createReview = () => {
    setReview("")
    setStatus(!status)
    setRatingPopup(false)
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    let ratings = {
      message: review,
      rating: rating
    }
    axios.post(`${domain}/api/courses/createCourseReview/${router.query.courseId}`, ratings,  config)
    .then(res => {
      getReviews()
    })
    .catch(err => {
      alert("Failed")
    })
  }

  let changeRating = (item) => {
    setRating(item);
  };

  return (
    <div className = {styles.courseLandingOuterContainer}>
      <Container>
        <Grid container spacing={5}>
          <Grid item xs = {12} lg = {8}>
            <h3 className = {styles.courseTitle}>{courseDetails.courseTitle}</h3>
            <div className = {styles.courseReviewsContainer}>
              <p className = {styles.courseReviewsTag}>Rating</p>
              <div className = {styles.courseTestimonialRatingContainer}>
                <StarPurple500SharpIcon
                  fontSize="small"
                  sx={{ color: courseDetails.rating>=1?"gold":"#c5c5c5" }}
                />
                <StarPurple500SharpIcon
                  fontSize="small"
                  sx={{ color: courseDetails.rating>=2?"gold":"#c5c5c5" }}
                />
                <StarPurple500SharpIcon
                  fontSize="small"
                  sx={{ color: courseDetails.rating>=3?"gold":"#c5c5c5" }}
                />
                <StarPurple500SharpIcon
                  fontSize="small"
                  sx={{ color: courseDetails.rating>=4?"gold":"#c5c5c5" }}
                />
                <StarPurple500SharpIcon
                  fontSize="small"
                  sx={{ color: courseDetails.rating>=5?"gold":"#c5c5c5" }}
                />
                <span className = {styles.courseRatingCount}>{courseDetails.rating}</span>
              </div>
            </div>
            <div className = {styles.courseShareAndDetailsContainer}>
              <div>
                <p className = {styles.courseShareAndDetailsContentKey}>Last Update</p>
                <p className = {styles.courseShareAndDetailsContentValue}>{courseDetails.updatedAt?`${courseDetails.updatedAt.slice(8,10)}-${courseDetails.updatedAt.slice(5,7)}-${courseDetails.updatedAt.slice(0,4)}`:""}</p>
              </div>
              <div>
                <p className = {styles.courseShareAndDetailsContentKey}>Level</p>
                <p className = {styles.courseShareAndDetailsContentValue}>{courseDetails.level || "Beginner"}</p>
              </div>
              <div>
                <p className = {styles.courseShareAndDetailsContentKey}>Students</p>
                <p className = {styles.courseShareAndDetailsContentValue}>{courseDetails.studentsEnrolled || "0"}</p>
              </div>
              <div>
                <p className = {styles.courseShareAndDetailsContentKey}>Language</p>
                <p className = {styles.courseShareAndDetailsContentValue}>{courseDetails.language || "English"}</p>
              </div>
              <Button variant="contained" className = {styles.courseShareAndDetailsContentBtn}><ShareOutlinedIcon sx = {{marginRight: "10px"}} fontSize="medium"/> Share</Button>
            </div>
            <div className={styles.courseThumbnailContainer}>
              <Image
                alt="Mountains"
                src={`${imageLink}/700x300/${courseDetails.thumbnail}`}
                layout='fill'
                className = {styles.courseThumbnail}
              />
            </div>
            <div className = {styles.courseTabsContainer}>
              <Link href = "#overview">
                <a className = {`${styles.courseTab} ${active === "overview" || active === "" ? styles.courseTabActive:""}`}>Overview</a>
              </Link>
              <Link href = "#syllabus">
                <a className = {`${styles.courseTab} ${active === "syllabus"? styles.courseTabActive:""}`}>Syllabus</a>
              </Link>
              <Link href = "#certificate">
                <a className = {`${styles.courseTab} ${active === "certificate"? styles.courseTabActive:""}`}>Certificate</a>
              </Link>
              <Link href = "#instructors">
                <a className = {`${styles.courseTab} ${active === "instructors"? styles.courseTabActive:""}`}>Instructor</a>
              </Link>
              <Link href = "#faqs">
                <a className = {`${styles.courseTab} ${active === "faqs"? styles.courseTabActive:""}`}>FAQ</a>
              </Link>
              
            </div>
            <div className = {styles.courseTabContentContainer}>
              <h4 className = {styles.courseTabContentTitle} id = "overview">Overview</h4>
              <p>{courseDetails.description}</p>
            </div>
            <div className = {styles.courseTabContentContainer}>
              <h4 className = {styles.courseTabContentTitle} id = "syllabus">Syllabus</h4>
              <div id = "syllabusContent">
                {
                  parse(String(courseDetails.syllabus)) || <h5 className='taCenter' style = {{width: "100%", color: "#c5c5c5"}}>Not given</h5>
                }
              </div>
              
            </div>
            <div className = {styles.courseTabContentContainer}>
              <h4 className = {styles.courseTabContentTitle} id = "certificate">Certificate</h4>
              {courseDetails.certificate?
              <>
                <div className = {styles.courseCertificateContainer}>
                  <Image
                    alt="Mountains"
                    src={`${imageLink}/1200x806/${courseDetails.certificate}`}
                    layout='fill'
                    className = {styles.courseCertificate}
                  />
                </div>
              </>
              :<h5 className='taCenter' style = {{width: "100%", color: "#c5c5c5"}}>Not given</h5>}
            </div>
              {courseDetails.instructorName?
            <div className = {styles.courseTabContentContainer}>
              <h4 className = {styles.courseTabContentTitle} id = "instructors">Instructor</h4>
                <div className = {styles.courseInstructorContainer}>
                <div className = {styles.courseInstructorImgContainer}>
                  <Image
                    alt="Mountains"
                    src={`${imageLink}/100x100/${courseDetails.instructorProfilePic}`}
                    height={"70px"}
                    width={"70px"}
                    objectFit="contain"
                    className = {styles.courseInstructorImg}
                  />
                </div>
                <div className = {styles.courseInstructorContainerContainer}>
                  <h5 className = {styles.courseInstructorName}>{courseDetails.instructorName}</h5>
                  <p className = {styles.courseInstructorRole}>{courseDetails.instructorRole || "Not mentioned"}</p>
                  <p className = {styles.courseInstructorDescription}>{courseDetails.instructorDescription}</p>
                </div>
              </div>
            </div>
            :""}
            <div className = {`${styles.courseTabContentContainer} ${styles.mb_0}`}>
              <h4 className = {styles.courseTabContentTitle} id = "faqs">FAQ&#39;s</h4>
              { 
                courseDetails.faqs
                ?courseDetails.faqs.map((faq, index) => {
                  return(
                    <>
                      <h5>{faq.question}</h5>
                      <p className = {styles.courseFaq}>{faq.answer}</p>
                    </>
                  )
                })
                  
                :<h5 className='taCenter' style = {{width: "100%", color: "#c5c5c5"}}>Not given</h5>
              }
            </div>
          </Grid>
          <Grid item xs = {12} lg = {4}>
            <div className = {styles.courseRightContainer}>
              <div className = {styles.CourseRightSection}>
                <h4 className = {styles.courseDiscountPrice}>${courseDetails.fees}</h4>
                {courseDetails.discount?
                  <h6 className = {styles.coursePrice}><span className = "line-through">${courseDetails.fees + ((courseDetails.fees/100)*20)}</span><span className = {styles.courseDiscount}>20% off</span></h6>:""

                }
                <Button variant="contained" className = {styles.courseChatEnquireBtn1}>LIVE CHAT</Button>
                <Button variant="outlined" className = {styles.courseChatEnquireBtn2}>ENQUIRY</Button>
              </div>
              <div className = {styles.CourseRightSection} >
                <h5 className = {styles.CourseRightTitle}>This course includes</h5>
                {courseDetails.courseIncludes?
                  <div id = "courseIncludes">
                    {parse(String(courseDetails.courseIncludes))}
                  </div>
                  :<h5 className='taCenter' style = {{width: "100%", color: "#c5c5c5"}}>No details</h5>
                }
              </div>
              <div className = {`${styles.CourseRightSection} ${styles.bb_0}`}>
                <div className = {styles.reviewWriteReviewContainer}>
                  <h5 className = {styles.CourseRightTitle}>Reviews</h5>
                  <button
                    className={styles.writeReview}
                    onClick={() => setStatus(!status)}
                  >
                    {status 
                      ? "Close"
                      :"Write Review"
                    }
                  </button>
                </div>
                {status 
                  ? <>
                    <input className = "inputBox" onChange = {handleReviewChange} value = {review} />
                    <Button variant="contained" className = {styles.courseChatEnquireBtn1} onClick = {submitReviewForm}>Submit</Button>
                  </>
                  :""
                }
                {reviewList.map((item, index) => {
                  return(
                    <div className = {styles.courseTestimonialContainer} key = {index}>
                      <div className = {styles.courseTestimonialImgContainer}>
                        <Image
                          alt="Mountains"
                          src={`${imageLink}/100x100/${item.reviewById.profilePic}`}
                          height={"66px"}
                          width={"66px"}
                          objectFit="contain"
                          className = {styles.courseTestimonialImg}
                        />
                      </div>
                      <div>
                        <h5 className = {styles.courseTestimonialName}>{item.reviewById.name}</h5>
                        <div className = {styles.courseTestimonialRatingContainer}>
                          <StarPurple500SharpIcon
                            fontSize="small"
                            sx={{ color: item.rating>=1?"gold": "#c5c5c5"}}
                          />
                          <StarPurple500SharpIcon
                            fontSize="small"
                            sx={{ color: item.rating>=2?"gold": "#c5c5c5"}}
                          />
                          <StarPurple500SharpIcon
                            fontSize="small"
                            sx={{ color: item.rating>=3?"gold": "#c5c5c5"}}
                          />
                          <StarPurple500SharpIcon
                            fontSize="small"
                            sx={{ color: item.rating>=4?"gold": "#c5c5c5"}}
                          />
                          <StarPurple500SharpIcon
                            fontSize="small"
                            sx={{ color: item.rating>=5?"gold": "#c5c5c5"}}
                          />
                          <span className = {styles.courseRatingCount}>{item.rating}.0</span>
                        </div>
                      </div>
                    </div>
                  )
                })
                }
                {reviewList.length == 0?<h5 className='taCenter' style = {{width: "100%", color: "#c5c5c5"}}>No reviews</h5>:""}
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>
      <Dialog
        open={ratingPopup}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setRatingPopup(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className={"sharePopupContainer"}>
          <div className={"sharePopupTitle"}>Choose Rating</div>
          <div style={{ marginTop: "15px" }}>
            <span
              style={{
                display: "inline-flex",
                color: "gold",
                fontSize: "50px",
                cursor: "pointer",
              }}
            >
              {rating >= 1 ? (
                <StarRoundedIcon
                  sx={{ color: "gold", fontSize: "30px" }}
                  onClick={() => changeRating(1)}
                />
              ) : (
                <StarBorderRoundedIcon
                  sx={{ color: "gold", fontSize: "30px" }}
                  onClick={() => changeRating(1)}
                />
              )}
              {rating >= 2 ? (
                <StarRoundedIcon
                  sx={{ color: "gold", fontSize: "30px" }}
                  onClick={() => changeRating(2)}
                />
              ) : (
                <StarBorderRoundedIcon
                  sx={{ color: "gold", fontSize: "30px" }}
                  onClick={() => changeRating(2)}
                />
              )}
              {rating >= 3 ? (
                <StarRoundedIcon
                  sx={{ color: "gold", fontSize: "30px" }}
                  onClick={() => changeRating(3)}
                />
              ) : (
                <StarBorderRoundedIcon
                  sx={{ color: "gold", fontSize: "30px" }}
                  onClick={() => changeRating(3)}
                />
              )}
              {rating >= 4 ? (
                <StarRoundedIcon
                  sx={{ color: "gold", fontSize: "30px" }}
                  onClick={() => changeRating(4)}
                />
              ) : (
                <StarBorderRoundedIcon
                  sx={{ color: "gold", fontSize: "30px" }}
                  onClick={() => changeRating(4)}
                />
              )}
              {rating >= 5 ? (
                <StarRoundedIcon
                  sx={{ color: "gold", fontSize: "30px" }}
                  onClick={() => changeRating(5)}
                />
              ) : (
                <StarBorderRoundedIcon
                  sx={{ color: "gold", fontSize: "30px" }}
                  onClick={() => changeRating(5)}
                />
              )}
            </span>
          </div>
          <center>
            <button className={popup.popupSubmit} onClick={createReview}>
              Submit
            </button>
          </center>
        </div>
      </Dialog>
    </div>
  )
}

export default CourseLandingPage