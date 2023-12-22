import { Container } from "@mui/material";
import React, { useEffect, useState } from "react";
import styles from "../styles/pilotPro.module.css";
import Grid from "@mui/material/Grid";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Router from "next/router";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CircularProgress from "@mui/material/CircularProgress";
import { Redirect } from "next/dist/lib/load-custom-routes";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import Link from "next/link";
import companyProImg from "../images/companypro.gif";
import Image from "next/image";
import { useTheme } from "@mui/material/styles";
import Timeline from "@mui/lab/Timeline";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import Carousel from "react-material-ui-carousel";
import BackupIcon from "@mui/icons-material/Backup";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import PhotoSizeSelectLargeIcon from "@mui/icons-material/PhotoSizeSelectLarge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import WorkIcon from "@mui/icons-material/Work";
import PeopleIcon from "@mui/icons-material/People";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import ChatIcon from "@mui/icons-material/Chat";
import FeedIcon from "@mui/icons-material/Feed";
import CloudUploadTwoToneIcon from "@mui/icons-material/CloudUploadTwoTone";
import BookmarkAddTwoToneIcon from "@mui/icons-material/BookmarkAddTwoTone";

// Img Icons

import BookmarkSvg from "../images/bookmark.svg"
import DirectHireSvg from "../images/Direct hire button.svg"
import DownloadSvg from "../images/Download creative.svg"
import FollowersSvg from "../images/Followers.svg"
import JobNotificationSvg from "../images/Get jobNotification.svg"
import NotificationSvg from "../images/Get notification.svg"
import NewsSvg from "../images/latest news.svg"
import OrderingPortSvg from "../images/ordering portfolios.svg"
import ChatSvg from "../images/Unlimited chats.svg"
import JobListSvg from "../images/unlimited job list.svg"
import UploadBulkSvg from "../images/upload bulk images.svg"
import UploadSvg from "../images/Upload.svg"

// Img Steps
import CreateAccImg from "../images/pilot_pro/Create an account.svg"
import CreateProfSetupImg from "../images/pilot_pro/Create Profile setup.svg"
import GetHiredImg from "../images/pilot_pro/Get hired.svg"
import ShowcaseProfileImg from "../images/pilot_pro/showcase your profile.svg"
import UploadWorksImg from "../images/pilot_pro/Upload your works.svg"

const images = [
  {
    label: "Create an account",
    imgPath: CreateAccImg,
  },
  {
    label: "Complete your profile setup",
    imgPath: CreateProfSetupImg,
  },
  {
    label: "Upload your works",
    imgPath: UploadWorksImg,
  },
  {
    label: "Showcase your profile with top drone Pilots directory",
    imgPath: ShowcaseProfileImg,
  },
  {
    label: "Get Hired",
    imgPath: GetHiredImg,
  },
];

const imageLink = process.env.NEXT_PUBLIC_CDN;
const videoLink = process.env.NEXT_PUBLIC_AWS;
const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `0px solid ${theme.palette.divider}`,
  marginBottom: "20px",
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    {...props}
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
  />
))(({ theme }) => ({
  border: "2px solid #e7e7e7",
  borderRadius: "35px",
  backgroundColor: theme.palette.mode === "dark" ? "#fff" : "#fff",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
    marginTop: "0px",
    marginBottom: "0px",
  },
}));
const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  paddingLeft: theme.spacing(3),
  background: "#fff",
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PilotPro() {
  const theme = useTheme();
  const [activeStep1, setActiveStep1] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [yearly, setYearly] = useState(false);
  const [plans, setPlans] = useState([]);
  const [approvedImages, setApprovedImages] = useState([]);
  const [pendingImages, setPendingImages] = useState([]);
  const [approvedVideos, setApprovedVideos] = useState([]);
  const [pendingVideos, setPendingVideos] = useState([]);
  const [approved3d, setApproved3d] = useState([]);
  const [pending3d, setPending3d] = useState([]);
  const [subDetails, setSubDetails] = useState("");
  const [activeStep, setActiveStep] = React.useState(0);
  const [expanded, setExpanded] = useState("");
  const [notPilotPopup, setNotPilotPopup] = useState(false);
  const [pilotDetails, setPilotDetails] = useState({});
  const [isLoggedin, setIsLoggedin] = useState(false)

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  const addon_features = [
    "Save as Draft Feature",
    "Multiple Image Upload Feature",
    "Immediate Approval of Images",
    "Daily Job Notifications",
    "Profile in suggestions of Top Jobs",
    "Pro Label on your Profile",
    // "Access to rearrange your images to display",
    "Chances to get hired from your shoot pages",
  ];

  const steps = [
    {
      label: "Create an account",
      description: `Create your account with basic detail like name, email, city, password`,
    },
    {
      label: "Complete your profile setup",
      description:
        "Fill with your professional information like experience, skills, employment type, industries.",
    },
    {
      label: "Upload your works",
      description: `Upload your works with a bulk option and organise it on your customised order. share your profile link to this world.`,
    },
    {
      label: "Showcase your profile with top drone Pilots directory",
      description: `Engage your profiles with our drone pilots directory.`,
    },
    {
      label: "Get Hired",
      description: `Start conversation (Job Apply / Direct Hire) with the company and get hired.`,
    },
  ];
  const steps2 = [
    {
      label: "Complete your profile setup 100%",
      description: ``,
    },
    {
      label: "Add your shots (Portfolios)",
      description: ``,
    },
    {
      label: "Keep upto date",
      description: ``,
    },
    {
      label: "Chat with Employers",
      description: ``,
    },
    {
      label: "Get Hired",
      description: ``,
    },
  ];

  const handleMonthYearChange = () => {
    setYearly(!yearly);
  };
  const getAllImages = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.post(`${domain}/api/image/getApprovedImages`, config).then((res) => {
      setApprovedImages(res.data);
    });
    axios.post(`${domain}/api/image/getPendingImages`, config).then((res) => {
      setPendingImages(res.data);
    });
  };
  const getAll3d = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.post(`${domain}/api/image/getApproved3d`, config).then((res) => {
      setApproved3d(res.data);
    });
    axios.post(`${domain}/api/image/getPending3d`, config).then((res) => {
      setPending3d(res.data);
    });
  };
  const getAllVideos = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.post(`${domain}/api/image/getApprovedVideos`, config).then((res) => {
      setApprovedVideos(res.data);
    });
    axios.post(`${domain}/api/image/getPendingVideos`, config).then((res) => {
      setPendingVideos(res.data);
    });
  };
  useEffect(() => {
    let role = localStorage.getItem("role");
    if (role){
      setIsLoggedin(true)
    }
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.get(`${domain}/api/subscription/getSubscriptions`).then((res) => {
      setPlans(res.data);
    });
    axios
      .get(`${domain}/api/pilotSubscription/getMySubscription`, config)
      .then((res) => {
        console.log(res.data);
        setSubDetails(res.data);
        if (res.data.subscription) {
          if (res.data.subscription.plan.includes("Yearly")) {
            setYearly(true);
          }
          setSubDetails(res.data.subscription.plan);
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
    getAllImages();
    getAll3d();
    getAllVideos();
    axios.post(`${domain}/api/user/pilotDetails`, config).then((res) => {
      setPilotDetails(res.data);
    });
  }, []);

  const upgradeGold = () => {
    if (
      subDetails.length > 0 &&
      subDetails.includes("Platinum") &&
      (approvedImages.length + pendingImages.length > plans[1].images ||
        approvedVideos.length + pendingVideos.length > plans[1].videos ||
        approved3d.length + pending3d.length > plans[1].images3d)
    ) {
      setOpen(true);
    } else {
      Router.push(`/pilot-checkout/${plans[yearly ? 3 : 1]._id}`);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteFile = (id, type) => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(`${domain}/api/image/deleteImage/${id}`, config)
      .then((res) => {
        if (type === "image") {
          getAllImages();
        } else if (type === "video") {
          getAllVideos();
        } else {
          getAll3d();
        }
      })
      .catch((err) => {});
  };

  const redirectToPage = () => {
    Router.push(`/pilot-checkout/${plans[yearly ? 3 : 1]._id}`);
  };

  const redirectCheckoutPage = (path, link) => {
    var role = localStorage.getItem("role");
    if (role === "pilot" || !role) {
      if (path === "gold") {
        upgradeGold();
      } else {
        Router.push(link);
      }
    } else {
      setNotPilotPopup(true);
    }
  };

  return (
    <>
      <Container className="Container">
        <Grid container columnSpacing={2} className="mt0">
          <Grid
            item
            xxl={6}
            xl={6}
            lg={6}
            md={6}
            sm={12}
            xs={12}
            // style={{ margin: "auto" }}
            sx={{
              "& .MuiButton-startIcon": { marginTop: "0px" },
              margin: "auto",
            }}
          >
            <h4 className={styles.companyProTitle}>
              Engage with <br /> Drone Pilots Networks
            </h4>

            <p className={styles.companyProContent}>
              Bring your{" "}
              <span style={{ fontFamily: "roboto-bold" }}>exposure</span> to the
              world with help of World class{" "}
              <span style={{ fontFamily: "roboto-bold" }}>
                Drone Pilots Network Portal
              </span>
              , share your awesome shots and{" "}
              <span style={{ fontFamily: "roboto-bold" }}>
                accelerate your career
              </span>
              .
            </p>
            <p>Help your community to motivate and learn techniques.</p>
          </Grid>
          <Grid
            item
            xxl={6}
            xl={6}
            lg={6}
            md={6}
            sm={12}
            xs={12}
            sx={{ display: { xs: "none", md: "block" } }}
          >
            <div
              className={styles.companyProRightPng}
              style={{ textAlign: "right" }}
            >
              <Image src={companyProImg} alt="" />
            </div>
          </Grid>
        </Grid>
      </Container>
      <div style={{ backgroundColor: "#eaf1f1", padding: "50px 0px" }} className="nexdroPlatform">
        <Container>
          <Grid container spacing={2.5} style={{ alignItems: "center" }}>
          <Grid
              item
              xxl={12}
              xl={12}
              lg={12}
              md={12}
              sm={12}
              xs={12}
            >
            <p className={styles.companyProstepperContent}>
              Nexdro is a platform for creative professionals around the world
              to showcase their own work and to discover the creative shot of
              others through{" "}
              <span style={{ textDecoration: "underline" }}>
                5 simple steps
              </span>
            </p>
            </Grid>
            <Grid
              item
              xxl={6}
              xl={6}
              lg={6}
              md={6}
              sm={12}
              xs={12}
            >
              <div
                className={styles.companyProRightPng}
                style={{ textAlign: "left" }}
              >
                <Carousel animation="slide">
                  {images.map((item, i) => (
                    <div key={i} style = {{pointerEvents: "none",}}>
                      <Image
                        src={item.imgPath}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          
                        }}
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
            </Grid>
            <Grid
              item
              xxl={6}
              xl={6}
              lg={6}
              md={6}
              sm={12}
              xs={12}
              style={{ margin: "auto" }}
            >
              {/* <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>
                  {step.label}
                </StepLabel>
                <StepContent>
                  <Typography>{step.description}</Typography>
                  <Box sx={{ mb: 2 }}>
                    <div>
                      {index !== steps.length - 1 &&
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          sx={{ mt: 1, mr: 1, textTransform: "initial" }}
                        >
                          Next
                        </Button>
                      }
                      {index !== 0 &&
                        <Button
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1, textTransform: "initial" }}
                        >
                          Previous
                        </Button>
                      }
                    </div>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper> */}
              <Timeline
                sx={{
                  [`& .${timelineItemClasses.root}:before`]: {
                    flex: 0,
                    padding: 0,
                  },
                }}
              >
                {steps.map((step, index) => (
                  <TimelineItem key={index}>
                    <TimelineSeparator>
                      <span className="timeline_count">{index + 1}</span>
                      {index !== steps.length - 1 &&
                        <TimelineConnector sx={{ width: "1px" }} />
                      }
                      </TimelineSeparator>
                    <TimelineContent sx={{ paddingTop: "0px" }}>
                      <Typography
                        variant="h6"
                        component="span"
                        sx={{
                          fontSize: "20px",
                          color: "#111",
                          fontFamily: "roboto-bold",
                          lineHeight: "initial",
                        }}
                      >
                        {step.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "roboto-regular",
                          opacity: "0.8",
                          lineHeight: "1.5",
                          paddingBottom: "20px",
                        }}
                      >
                        {step.description}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
              {!isLoggedin &&
                <button className="create formBtn7" onClick = {()=>Router.push("/register")} style = {{marginBottom: "20px"}}>Create Free Account Now</button>
              }
            </Grid>
          </Grid>
        </Container>
      </div>
      <Container sx={{ paddingTop: {sm:"50px"}, paddingBottom: {sm:"50px"}  }}>
        <Grid container spacing={2.5} style={{ alignItems: "center" }}>
          <Grid
            item
            xxl={6}
            xl={6}
            lg={6}
            md={12}
            sm={12}
            xs={12}
            style={{ margin: "auto" }}
          >
            <h4 className={styles.companyProTitle}>
              Thousands of Jobs <br /> waiting for you
            </h4>
            <p className={styles.companyProContent}>
              Nexdro is the leading online platform to showcase and discover
              creative job opportunities in Drone industries. It helps employers
              to find qualified drone operators globally at the same time
              it&apos;s giving the hands to the Drone pilots to choose the
              employment possibility.
            </p>
            <p>Get Started - Register as a Qualified Drone Pilots.</p>
          </Grid>
          <Grid
            item
            xxl={6}
            xl={6}
            lg={6}
            md={12}
            sm={12}
            xs={12}
          >
            <Grid container>
              <Grid item xxl={8} xl={8} lg={8} md={8} sm={6} xs={12}>
                <img src="https://demo-nexevo.in/dn/jobs.gif" width="100%" />
              </Grid>
              <Grid item xxl={4} xl={4} lg={4} md={4} sm={6} xs={12} sx = {{display: "flex", alignItems: "center"}}>
                <div className = {styles.tipsToGetJobContainer}>
                  <h5
                    className={styles.companyProTitle}
                    style={{ fontSize: "12px", color: "#4ffea3" }}
                  >
                    Tips to get Jobs Immediately
                  </h5>
                  {/* <Stepper activeStep={steps2.length} orientation="vertical">
                  {steps2.map((step, index) => (
                    <Step key={index}>
                      <StepLabel>{step.label}</StepLabel>
                    </Step>
                  ))}
                </Stepper> */}
                  <Timeline
                    sx={{
                      [`& .${timelineItemClasses.root}:before`]: {
                        flex: 0,
                        padding: 0,
                        
                      },
                      padding: "0px",
                      
                    }}
                  >
                    {steps2.map((step, index) => (
                      <TimelineItem key={index} sx = {{minHeight: "initial"}}>
                        <TimelineSeparator>
                          <span className="timeline_count1"><DoneIcon sx = {{width: "10px", height: "10px"}}/> </span>
                        </TimelineSeparator>
                        <TimelineContent sx={{ paddingTop: "0px", paddingLeft: "10px" }}>
                          <Typography
                            variant="p"
                            component="span"
                            sx={{
                              fontSize: "13px",
                              color: "rgba(0, 0, 0, 0.87)",
                              fontFamily: "roboto-regular",
                              lineHeight: "initial",
                            }}
                          >
                            {step.label}
                          </Typography>
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                </div>
              </Grid>
            </Grid>
            {/* <div
              className={styles.companyProRightPng}
              style={{ textAlign: "right" }}
            >
              <img
                src="https://creazilla-store.fra1.digitaloceanspaces.com/cliparts/1998576/drone-delivery-svg-clipart-sm.png"
                alt=""
              />
            </div> */}
          </Grid>
        </Grid>
      </Container>

      <div
        style={{ background: "rgba(220, 204, 204, 0.16)" }}
      >
        <Container sx={{ paddingTop: {xs:"10px",sm:"50px"}, paddingBottom: {xs:"30px",sm:"50px"} }}>
          <h4
            className={styles.companyProTitle}
            style={{ textAlign: "center" }}
          >
            What&apos;s New on Nexdro?
          </h4>
          <p className={styles.companyProstepperContent}>
            Do you want to explore your creative efforts in this world?. Yes you
            are in the right place.
          </p>
          <Grid container spacing={2.5} style={{ alignItems: "center" }}>
            {/* <Grid
              item
              xxl={6}
              xl={6}
              lg={6}
              md={6}
              sm={12}
              xs={12}
              sx={{ display: { xs: "none", md: "block" } }}
            >
              <div
                className={styles.companyProRightPng}
                style={{ textAlign: "left" }}
              >
                <img
                  src="https://creazilla-store.fra1.digitaloceanspaces.com/cliparts/1998576/drone-delivery-svg-clipart-sm.png"
                  alt=""
                />
              </div>
            </Grid> */}
            <Grid
              item
              xxl={2}
              xl={2}
              lg={2}
              md={3}
              sm={4}
              xs={6}
              className={styles.companyProHighlightsContainerGrid}
            >
              <div className={styles.companyProHighlightsContainer}>
                <span className={styles.companyProHighlights}>
                  <div className={styles.iconContainer} style={{padding: "10px 0 15px 0"}}>
                  <Image src = {UploadSvg} />
                  </div>
                  Upload your shots (Images/Videos) in high pixel
                </span>
              </div>
            </Grid>
            <Grid
              item
              xxl={2}
              xl={2}
              lg={2}
              md={3}
              sm={4}
              xs={6}
              className={styles.companyProHighlightsContainerGrid}
            >
              <div className={styles.companyProHighlightsContainer}>
                <span className={styles.companyProHighlights}>
                  <div className={styles.iconContainer} style={{padding: "10px 0 15px 0"}}>
                    <Image src = {BookmarkSvg} />
                    {/* <BookmarkAddTwoToneIcon className={styles.tickIcon} /> */}
                  </div>
                  Bookmark Jobs
                </span>
              </div>
            </Grid>
            <Grid
              item
              xxl={2}
              xl={2}
              lg={2}
              md={3}
              sm={4}
              xs={6}
              className={styles.companyProHighlightsContainerGrid}
            >
              <div className={styles.companyProHighlightsContainer}>
                <span className={styles.companyProHighlights}>
                  <div className={styles.iconContainer} style={{padding: "10px 0 15px 0"}}>
                  <Image src = {UploadBulkSvg} />
                  </div>
                  Upload Bulk images with in single clicks
                </span>
              </div>
            </Grid>
            <Grid
              item
              xxl={2}
              xl={2}
              lg={2}
              md={3}
              sm={4}
              xs={6}
              className={styles.companyProHighlightsContainerGrid}
            >
              <div className={styles.companyProHighlightsContainer}>
                <span className={styles.companyProHighlights}>
                  <div className={styles.iconContainer} style={{padding: "10px 0 15px 0"}}>
                  <Image src = {OrderingPortSvg} />
                  </div>
                  Ordering your portfolios list with simple drag and drop
                  features
                </span>
              </div>
            </Grid>
            <Grid
              item
              xxl={2}
              xl={2}
              lg={2}
              md={3}
              sm={4}
              xs={6}
              className={styles.companyProHighlightsContainerGrid}
            >
              <div className={styles.companyProHighlightsContainer}>
                <span className={styles.companyProHighlights}>
                  <div className={styles.iconContainer} style={{padding: "10px 0 15px 0"}}>
                  <Image src = {NotificationSvg} />
                  </div>
                  Get Notified Daily for new Job Notifications according to your
                  skills and industries
                </span>
              </div>
            </Grid>
            <Grid
              item
              xxl={2}
              xl={2}
              lg={2}
              md={3}
              sm={4}
              xs={6}
              className={styles.companyProHighlightsContainerGrid}
            >
              <div className={styles.companyProHighlightsContainer}>
                <span className={styles.companyProHighlights}>
                  <div className={styles.iconContainer} style={{padding: "10px 0 15px 0"}}>
                  <Image src = {JobListSvg} />
                  </div>
                  Unlimited job List access
                </span>
              </div>
            </Grid>
            <Grid
              item
              xxl={2}
              xl={2}
              lg={2}
              md={3}
              sm={4}
              xs={6}
              className={styles.companyProHighlightsContainerGrid}
            >
              <div className={styles.companyProHighlightsContainer}>
                <span className={styles.companyProHighlights}>
                  <div className={styles.iconContainer} style={{padding: "10px 0 15px 0"}}>
                  <Image src = {FollowersSvg} />
                  </div>
                  Create your network (Followers)
                </span>
              </div>
            </Grid>
            <Grid
              item
              xxl={2}
              xl={2}
              lg={2}
              md={3}
              sm={4}
              xs={6}
              className={styles.companyProHighlightsContainerGrid}
            >
              <div className={styles.companyProHighlightsContainer}>
                <span className={styles.companyProHighlights}>
                  <div className={styles.iconContainer} style={{padding: "10px 0 15px 0"}}>
                  <Image src = {DownloadSvg} />
                  </div>
                  Download the creatives
                </span>
              </div>
            </Grid>
            <Grid
              item
              xxl={2}
              xl={2}
              lg={2}
              md={3}
              sm={4}
              xs={6}
              className={styles.companyProHighlightsContainerGrid}
            >
              <div className={styles.companyProHighlightsContainer}>
                <span className={styles.companyProHighlights}>
                  <div className={styles.iconContainer} style={{padding: "10px 0 15px 0"}}>
                    <Image src = {DirectHireSvg} />
                  </div>
                  Direct Hire Button on your stunning profile pages
                </span>
              </div>
            </Grid>
            <Grid
              item
              xxl={2}
              xl={2}
              lg={2}
              md={3}
              sm={4}
              xs={6}
              className={styles.companyProHighlightsContainerGrid}
            >
              <div className={styles.companyProHighlightsContainer}>
                <span className={styles.companyProHighlights}>
                  <div className={styles.iconContainer} style={{padding: "10px 0 15px 0"}}>
                  <Image src = {ChatSvg} />
                  </div>
                  Unlimited chats
                </span>
              </div>
            </Grid>
            <Grid
              item
              xxl={2}
              xl={2}
              lg={2}
              md={3}
              sm={4}
              xs={6}
              className={styles.companyProHighlightsContainerGrid}
            >
              <div className={styles.companyProHighlightsContainer}>
                <span className={styles.companyProHighlights}>
                  <div className={styles.iconContainer} style={{padding: "10px 0 15px 0"}}>
                  <Image src = {JobNotificationSvg} />
                  </div>
                  Get New Job Notification on your mailbox
                </span>
              </div>
            </Grid>
            <Grid
              item
              xxl={2}
              xl={2}
              lg={2}
              md={3}
              sm={4}
              xs={6}
              className={styles.companyProHighlightsContainerGrid}
            >
              <div className={styles.companyProHighlightsContainer}>
                <span className={styles.companyProHighlights}>
                  <div className={styles.iconContainer} style={{padding: "10px 0 15px 0"}}>
                  <Image src = {NewsSvg} />
                  </div>
                  Get Latest News Drone news on your mailbox
                </span>
              </div>
            </Grid>
          </Grid>
        </Container>
      </div>
      <Container>
        <h2 style={{ textAlign: "center" }}>Pricing Plans</h2>
      <p className={styles.headingContent}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex rerum, et
        fugit officiis soluta aut voluptatibus. Quis dignissimos exercitationem
        perspiciatis, architecto, tenetur voluptate aut dolore esse optio ea
        quaerat adipisci.
      </p>
      <div className={styles.monthYearSelectContainer}>
        Monthly{" "}
        <label className="switch" style={{ height: "30px" }}>
          <input
            type="checkbox"
            checked={yearly}
            onChange={handleMonthYearChange}
            id="test"
          />
          <span className="slider2 round"></span>
        </label>{" "}
        Yearly (2 months free)
      </div>
        {plans.length >= 1 ? (
        <Grid container spacing={2.5}>
          <Grid item xxl={4} xl={4} lg={4} md={6} sm={6} xs={12}>
            <div className={styles.plan1}>
              <div className={styles.circle1}>
                <div className={styles.circle2}></div>
              </div>
              <div className={styles.planTitle}>{plans[0].name}</div>
              <div className={styles.planDesc}>{plans[0].description}</div>
              <div className={styles.planPrice}>Free</div>
              <div className={styles.btnContainer}>
                {subDetails === "" ? (
                  <Button
                    className={styles.btn1}
                    onClick={() => Router.push("/register")}
                  >
                    Register
                  </Button>
                ) : (
                  <Button
                    className={styles.btn1}
                    style={{ pointerEvents: "none" }}
                  >
                    Basic plan
                  </Button>
                )}
              </div>
              <div className={styles.planItems}>
                <DoneIcon className={styles.tickIcon} />
                Total Image Uploads : {plans[0].images}
              </div>
              <div className={styles.planItems}>
                <DoneIcon className={styles.tickIcon} />
                Total Videos Uploads : {plans[0].videos}
              </div>
              <div className={styles.planItems}>
                <DoneIcon className={styles.tickIcon} />
                Total 3D Uploads : {plans[0].images3d}
              </div>
              {addon_features.map((item, index) => {
                return (
                  <div className={styles.planItems} key={index}>
                    <CloseIcon className={styles.tickIcon} />
                    {item}
                  </div>
                );
              })}
            </div>
          </Grid>
          <Grid item xxl={4} xl={4} lg={4} md={6} sm={6} xs={12}>
            <div className={styles.plan2}>
              <div className={styles.circle3}>
                <div className={styles.circle4}></div>
              </div>
              <div className={styles.planTitle}>
                {plans[yearly ? 3 : 1].name}
              </div>
              <div className={styles.planDesc}>
                {plans[yearly ? 3 : 1].description}
              </div>
              <div className={styles.planPrice}>
                ${plans[yearly ? 3 : 1].price.toFixed(2)}
              </div>
              <div className={styles.btnContainer}>
                <Button
                  className={styles.btn2}
                  disabled={
                    (!yearly && subDetails === "Gold Monthly") ||
                    (yearly && subDetails === "Gold Yearly")
                  }
                  onClick={()=>redirectCheckoutPage("gold")}
                >
                  {(!yearly && subDetails === "Gold Monthly") ||
                  (yearly && subDetails === "Gold Yearly")
                    ? "Current plan "
                    : "Upgrade plan"}
                </Button>
              </div>
              <div className={styles.planItems}>
                <DoneIcon className={styles.tickIcon} />
                Total Image Uploads : {plans[yearly ? 3 : 1].images}
              </div>
              <div className={styles.planItems}>
                <DoneIcon className={styles.tickIcon} />
                Total Videos Uploads : {plans[yearly ? 3 : 1].videos}
              </div>
              <div className={styles.planItems}>
                <DoneIcon className={styles.tickIcon} />
                Total 3D Uploads : {plans[yearly ? 3 : 1].images3d}
              </div>
              {addon_features.map((item, index) => {
                return (
                  <div className={styles.planItems} key={index}>
                    <DoneIcon className={styles.tickIcon} key={index} />
                    {item}
                  </div>
                );
              })}
            </div>
          </Grid>
          <Grid item xxl={4} xl={4} lg={4} md={6} sm={6} xs={12}>
            <div className={styles.plan1}>
              <div className={styles.circle1}>
                <div className={styles.circle2}></div>
              </div>
              <div className={styles.planTitle}>
                {plans[yearly ? 4 : 2].name}
              </div>
              <div className={styles.planDesc}>
                {plans[yearly ? 4 : 2].description}
              </div>
              <div className={styles.planPrice}>
                ${plans[yearly ? 4 : 2].price.toFixed(2)}
              </div>
              <div className={styles.btnContainer}>
                <Button
                  className={styles.btn1}
                  disabled={
                    (!yearly && subDetails === "Platinum Monthly") ||
                    (yearly && subDetails === "Platinum Yearly")
                  }
                  onClick={() =>
                    redirectCheckoutPage("platinum", `/pilot-checkout/${plans[yearly ? 4 : 2]._id}`)
                  }
                >
                  {(!yearly && subDetails === "Platinum Monthly") ||
                  (yearly && subDetails === "Platinum Yearly")
                    ? "Current plan "
                    : "Upgrade plan"}
                </Button>
              </div>
              <div className={styles.planItems}>
                <DoneIcon className={styles.tickIcon} />
                Total Image Uploads : {plans[yearly ? 4 : 2].images}
              </div>
              <div className={styles.planItems}>
                <DoneIcon className={styles.tickIcon} />
                Total Videos Uploads : {plans[yearly ? 4 : 2].videos}
              </div>
              <div className={styles.planItems}>
                <DoneIcon className={styles.tickIcon} />
                Total 3D Uploads : {plans[yearly ? 4 : 2].images3d}
              </div>
              {addon_features.map((item, index) => {
                return (
                  <div className={styles.planItems} key={index}>
                    <DoneIcon className={styles.tickIcon} key={index} />
                    {item}
                  </div>
                );
              })}
            </div>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={2.5}>
          <Grid item xxl={4} xl={4} lg={4} md={6} sm={6} xs={12}>
            <Skeleton style={{ height: "500px", borderRadius: "19px" }} />
          </Grid>
          <Grid item xxl={4} xl={4} lg={4} md={6} sm={6} xs={12}>
            <Skeleton style={{ height: "500px", borderRadius: "19px" }} />
          </Grid>
          <Grid item xxl={4} xl={4} lg={4} md={6} sm={6} xs={12}>
            <Skeleton style={{ height: "500px", borderRadius: "19px" }} />
          </Grid>
        </Grid>
      )}
        <div className={styles.testimonialsContainer}>
          <div className={styles.testimonial}>
            <h4 className={styles.testimonialTitle}>
              &#8220;Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Reiciendis in dolorum, ea nobis perspiciatis esse temporibus ullam
              quia dicta qui?&#8221;
            </h4>
            <div className={styles.testimonialsUserContianer}>
              <div className={styles.testimonialsUserImg}>
                <img
                  src="https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=497"
                  alt=""
                />
              </div>
              <div className={styles.testimonialsUserDetails}>
                <h5>John Doe</h5>
                <p>Lorem Ipsum</p>
              </div>
            </div>
          </div>
        </div>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          onClose={handleClose}
        >
          <div style={{ textAlign: "right" }}>
            <CloseIcon
              style={{
                marginTop: "10px",
                marginRight: "10px",
                cursor: "pointer",
              }}
              onClick={handleClose}
            />
          </div>
          <DialogTitle>
            {"If you want to degrade to Gold you have to delete some files."}
          </DialogTitle>
          <DialogContent sx={{ maxWidth: "900px" }}>
            <DialogContentText id="alert-dialog-slide-description"></DialogContentText>
            {plans.length > 0 && (
              <>
                {approvedImages.length + pendingImages.length >
                  plans[1].images && (
                  <div>
                    <div className={styles.popupSubtitle}>
                      Maximum images: {plans.length >= 1 && plans[1].images}
                    </div>
                    <div className={styles.popupFilesContainer}>
                      {approvedImages.length > 0 && (
                        <>
                          <div className={styles.popupFileTypeName}>
                            Approved Images :{" "}
                          </div>
                          {approvedImages.map((file, index) => {
                            return (
                              <div
                                className={styles.popupFileContainer}
                                key={index}
                              >
                                <img
                                  src={`${imageLink}/200x200/${file.file}`}
                                  alt="approved_files"
                                  className={styles.popupFile}
                                  key={index}
                                />
                                <div className={styles.popupDeleteIcon}>
                                  <DeleteForeverIcon
                                    id={file._id}
                                    onClick={() =>
                                      deleteFile(file._id, "image")
                                    }
                                  />
                                  {/* <CircularProgress
                              size={20}
                                onClick={() => deleteFile(file._id, "image")}
                                sx = {{color: "rgb(163, 0, 0)", display: "none"}}
                              /> */}
                                </div>
                              </div>
                            );
                          })}
                        </>
                      )}
                      {pendingImages.length > 0 && (
                        <>
                          <div className={styles.popupFileTypeName}>
                            Pending Images :{" "}
                          </div>
                          {pendingImages.map((file, index) => {
                            return (
                              <div
                                className={styles.popupFileContainer}
                                key={index}
                              >
                                <img
                                  src={`${imageLink}/200x200/${file.file}`}
                                  alt="approved_files"
                                  className={styles.popupFile}
                                  key={index}
                                />
                                <div className={styles.popupDeleteIcon}>
                                  <DeleteForeverIcon
                                    id={file._id}
                                    onClick={() =>
                                      deleteFile(file._id, "image")
                                    }
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </>
                      )}
                    </div>
                    <hr />
                  </div>
                )}
                {approvedVideos.length + pendingVideos.length >
                  plans[1].videos && (
                  <div>
                    <div className={styles.popupSubtitle}>
                      Maximum videos: {plans.length >= 1 && plans[1].videos}
                    </div>
                    <div className={styles.popupFilesContainer}>
                      {approvedVideos.length > 0 && (
                        <>
                          <div className={styles.popupFileTypeName}>
                            Approved Videos :{" "}
                          </div>
                          {approvedVideos.map((file, index) => {
                            return (
                              <div
                                className={styles.popupFileContainer}
                                key={index}
                              >
                                <video
                                  src={`${videoLink}/${file.file}`}
                                  alt="approved_files"
                                  className={styles.popupFile}
                                  key={index}
                                  playsInline
                                />
                                <div className={styles.popupDeleteIcon}>
                                  <DeleteForeverIcon
                                    id={file._id}
                                    onClick={() =>
                                      deleteFile(file._id, "video")
                                    }
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </>
                      )}
                      {pendingVideos.length > 0 && (
                        <>
                          <div className={styles.popupFileTypeName}>
                            Pending Videos :{" "}
                          </div>
                          {pendingVideos.map((file, index) => {
                            return (
                              <div
                                className={styles.popupFileContainer}
                                key={index}
                              >
                                <video
                                  src={`${videoLink}/${file.file}`}
                                  alt="approved_files"
                                  className={styles.popupFile}
                                  key={index}
                                  playsInline
                                />
                                <div className={styles.popupDeleteIcon}>
                                  <DeleteForeverIcon
                                    id={file._id}
                                    onClick={() =>
                                      deleteFile(file._id, "video")
                                    }
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </>
                      )}
                    </div>
                    <hr />
                  </div>
                )}
                {approved3d.length + pending3d.length > plans[1].images3d && (
                  <div>
                    <div className={styles.popupSubtitle}>
                      Maximum 3D: {plans.length >= 1 && plans[1].images3d}
                    </div>
                    <div className={styles.popupFilesContainer}>
                      {approved3d.length > 0 && (
                        <>
                          <div className={styles.popupFileTypeName}>
                            Approved 3D :{" "}
                          </div>
                          {approved3d.map((file, index) => {
                            return (
                              <div
                                className={styles.popupFileContainer}
                                key={index}
                              >
                                <img
                                  src={`${imageLink}/200x200/${file.file}`}
                                  alt="approved_files"
                                  className={styles.popupFile}
                                  key={index}
                                />
                                <div className={styles.popupDeleteIcon}>
                                  <DeleteForeverIcon
                                    id={file._id}
                                    onClick={() => deleteFile(file._id, "3d")}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </>
                      )}
                      {pending3d.length > 0 && (
                        <>
                          <div className={styles.popupFileTypeName}>
                            Pending 3D :{" "}
                          </div>
                          {pending3d.map((file, index) => {
                            return (
                              <div
                                className={styles.popupFileContainer}
                                key={index}
                              >
                                <img
                                  src={`${imageLink}/200x200/${file.file}`}
                                  alt="approved_files"
                                  className={styles.popupFile}
                                  key={index}
                                />
                                <div className={styles.popupDeleteIcon}>
                                  <DeleteForeverIcon
                                    id={file._id}
                                    onClick={() => deleteFile(file._id, "3d")}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </>
                      )}
                    </div>
                  </div>
                )}
                {open &&
                  approvedImages.length + pendingImages.length <=
                    plans[1].images &&
                  approvedVideos.length + pendingVideos.length <=
                    plans[1].videos &&
                  approved3d.length + pending3d.length <= plans[1].images3d && (
                    <div onClick={redirectToPage()}></div>
                  )}
              </>
            )}
          </DialogContent>
        </Dialog>
      </Container>
      <div className="proFaq"
        style={{
          backgroundColor: "#fff",
          padding: "40px 10%",
        }}
      >
        <h4
          className={styles.companyProTitle}
          style={{ textAlign: "center", marginBottom: "30px" }}
        >
          Frequently asked questions
        </h4>
        <Accordion
          expanded={expanded === `faq1`}
          onChange={handleChange(`faq1`)}
        >
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography className="faq_heading">
              Can i upload images and videos on my profile?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography className="faq_content">
              Yes, you can upload high resolution photos and videos to build
              your strong profile.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === `faq2`}
          onChange={handleChange(`faq2`)}
        >
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography className="faq_heading">
              Are there any limitations for uploaded pictures and videos?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography className="faq_content">
              You have to follow the minimum size restrictions when uploading
              the photos and videos to get the best visibility to the end users.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === `faq3`}
          onChange={handleChange(`faq3`)}
        >
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography className="faq_heading">
              What are the things I should follow while uploading pictures?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography className="faq_content">
              You must be the original photographer of and own the rights to any
              photo you uploaded on Nexdro. Photos do not contain nudity or
              violent imagery. If we found any found by us picture will
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === `faq4`}
          onChange={handleChange(`faq4`)}
        >
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography className="faq_heading">
              How can i create the account?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography className="faq_content">
              Click this link to create your drone pilots accounts. Just follow
              the few simple steps to complete your profile setup.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === `faq5`}
          onChange={handleChange(`faq5`)}
        >
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography className="faq_heading">
              Will my Profile be available publicly?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography className="faq_content">
              As soon as your profile completes your profile link will be
              generated along with your portfolios and it will be accessible by
              using below URL.{" "}
              {(pilotDetails && pilotDetails.userName && (
                <Link href={`/pilot/${pilotDetails.userName}`}>
                  <a className="link">
                    nexdro.com/pilot/{pilotDetails.userName}
                  </a>
                </Link>
              )) ||
                "nexdro.com/pilot/(username)"}
              . And you can share profile URLs with anyone.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === `faq6`}
          onChange={handleChange(`faq6`)}
        >
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography className="faq_heading">
              How to hide my profile from the job board page?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography className="faq_content">
              Yes you can do that, if you are not willing to share your profile
              under our job board directory you can simply disable the button
              Willing to work under your profile My account Section. Click this{" "}
              <Link href="/pilot-dashboard/account">
                <a className="link">link</a>
              </Link>
              .
            </Typography>
          </AccordionDetails>
        </Accordion>
        <p style={{ textAlign: "center", marginTop: "40px", fontSize: "13px" }}>
          For More information please visit our{" "}
          <Link href="/terms-and-conditions">
            <a className="link" style={{ fontFamily: "roboto-bold" }}>
              terms and conditions
            </a>
          </Link>{" "}
          .
        </p>
      </div>
      <Dialog
        open={notPilotPopup}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setNotPilotPopup(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="popupContainer">
          <CloseIcon
            className="popupClose"
            onClick={() => setNotPilotPopup(false)}
          />
          <div className="popupTitle">
            Register as a pilot to perform these actions.
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              className="popupLoginBtn"
              onClick={() => setNotPilotPopup(false)}
            >
              Close
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default PilotPro;
