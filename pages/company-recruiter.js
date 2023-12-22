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
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import DroneImage from "../images/drone_image.png";
import Image from "next/image";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Alert from '@mui/material/Alert';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import Link from "next/link"
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Timeline from "@mui/lab/Timeline";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import Carousel from "react-material-ui-carousel";
import companyProImg from "../images/companypro.gif";

// Img Company Pro
import CreateChatSvg from "../images/company_pro/create chat request.svg";
import DirectHireSvg from "../images/company_pro/direct hire proposal.svg";
import FindExpertsSvg from "../images/company_pro/find the experts.svg";
import HireQuicklySvg from "../images/company_pro/hire quickly.svg";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const images = [
  {
    label: "Find the Experts from our seamless Networks",
    imgPath: FindExpertsSvg,
    fontFamily: 'roboto-regular',
  },
  {
    label: "Send the Direct Hire Proposal",
    imgPath: DirectHireSvg,
    fontFamily: 'roboto-regular',
  },
  {
    label: "Create Chat Request (Chat With Pilots)",
    imgPath: CreateChatSvg,
    fontFamily: 'roboto-regular',
  },
  {
    label: "Hire Quickly",
    imgPath: HireQuicklySvg,
    fontFamily: 'roboto-regular',
  },
];

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
  background: "#fff"
}));

function CompanyPro() {
  const [yearly, setYearly] = useState(false);
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState("");
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [expanded, setExpanded] = React.useState("");
  const [notCompanyPopup, setNotCompanyPopup] = useState(false)
  const [subscribeAlert, setSubscribeAlert] = useState(false);

  const steps2 = [
    {
      label: "Find the Experts from our seamless Networks",
      description: ``,
    },
    {
      label: "Send the Direct Hire Proposal",
      description: ``,
    },
    {
      label: "Create Chat Request (Chat With Pilots)",
      description: ``,
    },
    {
      label: "Hire Quickly",
      description: ``,
    },
  ]
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  useEffect(() => {
    setIsLoggedin(Boolean(localStorage.getItem("role")));
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.get(`${domain}/api/companyplan/getAllCompanyPlans`).then((res) => {
      console.log(res.data);
      setPlans(res.data);
    });
    let role = localStorage.getItem("role");
    // if (role === "pilot") {
    //   Router.push("/pilot-pro");
    // } else if (role && role !== "company") {
    //   Router.push("/no-page-found");
    // }
    // axios.get(`${domain}/api/subscription/getSubscriptions`).then((res) => {
    //   console.log(res.data);
    //   setPlans(res.data);
    // });
    if (localStorage.getItem("role") === "company") {
      axios
        .get(`${domain}/api/company/getCompanySubscription`, config)
        .then((res) => {
          console.log(res.data);
          try {
            if (res.data.subscription) {
              setCurrentPlan(res.data.subscription.planName);
              setYearly(res.data.subscription.planName.includes("Quaterly"));
            }
          } catch {
            console.log(res.data);
          }
        });
    }
  }, []);

  const buyAddon = (link) => {
    if (!isLoggedin){
      Router.push("/login")
    }
    else if (localStorage.getItem("role") !== "company"){
      setNotCompanyPopup(true)
    }
    else if (currentPlan !== "" && currentPlan !== "free"){
      Router.push(link)
    }
    else{
      setSubscribeAlert(true)
    }
  }

  const handleMonthYearChange = () => {
    setYearly(!yearly);
  };

  const redirectCheckoutPage = (link) => {
    let role = localStorage.getItem("role")
    if (!isLoggedin || role === "company"){
      Router.push(link)
    }
    else{
      setNotCompanyPopup(true)
    }
  }

  const scrolllToPlan = () => {
    var element = document.getElementById("pricingPlans")
    element.scrollIntoView({behavior: "smooth", inline: "nearest"});
  }

  return (
    <>
    <Container className="Container" sx = {{paddingBottom: {sm:"30px"}}} maxWidth = "xxl">
   
      <Grid container columnSpacing={2} sx = {{paddingBottom: {sm:"40px"}}}>
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
          <h4 className={styles.companyProTitle}>
            Engage with Pilots <br /> according to your needs
          </h4>
          <p className={styles.companyProContent}>
            Nexdro Offering the widest range of{" "}
            <span style={{ fontFamily: "roboto-bold" }}>Droners Networking</span>{" "}
            to hire them based on your business needs{" "}
            <span style={{ fontFamily: "roboto-bold" }}>2x Faster</span>. Find the{" "}
            <span style={{ fontFamily: "roboto-bold" }}>Best Drone Pilots</span>{" "}
            based upon your jobs requirements Full-Time or Part time (Freelance)
            work.
          </p>
          <p>
            Just Follow 4 Simple steps to find your qualified Drone Pilots to
            fit your Jobs.
          </p>
          {/* <button onClick = {scrolllToPlan} className = "formBtn2">Plans</button> */}
        </Grid>
        <Grid item xxl={6} xl={6} lg={6} md={6} sm={12} xs={12}sx={{ display: { xs: 'none', md: 'block' } }}>
          <div
            className={styles.companyProRightPng}
            style={{ textAlign: "right" }}
          >
            <Image src={companyProImg} alt="" />
          </div>
        </Grid>
      </Grid>
      <Grid container columnSpacing={2} style = {{position: "relative"}}>
        <Grid item xxl={4} xl={4} lg={4} md={6} sm={12} xs={12}>
          <div className={styles.companyProHighlightsContainer1} style = {{position: "sticky", top: "70px"}}>
            <h5>Highlights</h5>
            <p className={styles.companyProHighlights1}>
              <DoneIcon className={styles.tickIcon1} sx={{ marginRight: "7px" }} />
              Hire the Drone Experts Globally
            </p>
            <p className={styles.companyProHighlights1}>
              <DoneIcon className={styles.tickIcon1} sx={{ marginRight: "7px" }} />
              Filter the Pilots based upon your budget
            </p>
            <p className={styles.companyProHighlights1}>
              <DoneIcon className={styles.tickIcon1} sx={{ marginRight: "7px" }} />
              Hire Full time / part time workers
            </p>
            <p className={styles.companyProHighlights1}>
              <DoneIcon className={styles.tickIcon1} sx={{ marginRight: "7px" }} />
              Industries/Skills based filter
            </p>
            <p className={styles.companyProHighlights1}>
              <DoneIcon className={styles.tickIcon1} sx={{ marginRight: "7px" }} />
              Filter the pilots who owned the Drone
            </p>
            <p className={styles.companyProHighlights1}>
              <DoneIcon className={styles.tickIcon1} sx={{ marginRight: "7px" }} />
              Verified Pilots (i) (Email/Contact Number Verified)
            </p>
            <p className={styles.companyProHighlights1}>
              <DoneIcon className={styles.tickIcon1} sx={{ marginRight: "7px" }} />
              24/7 Customer Supports
            </p>
          </div>
        </Grid>
        <Grid item xxl={8} xl={8} lg={8} md={6} sm={12} xs={12} style={{ margin: "auto" }}
        >
          <h5 className={styles.companyProTitle}>
            Post Jobs (Job List Directory)
          </h5>
          <div>
            <Grid container spacing={2.5}>
              <Grid item xxl={6} xl={6} lg={6} md={6} sm={6} xs={12}>
                <div className={styles.companyProPostJobContainer}>
                  <h5>Post the Job</h5>
                  <p className={styles.companyProPostJobContent}>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Perferendis, adipisci.
                  </p>
                </div>
              </Grid>
              <Grid item xxl={6} xl={6} lg={6} md={6} sm={6} xs={12}>
                <div className={styles.companyProPostJobContainer}>
                  <h5>Let pilots to apply your Job</h5>
                  <p className={styles.companyProPostJobContent}>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Perferendis, adipisci.
                  </p>
                </div>
              </Grid>
              <Grid item xxl={6} xl={6} lg={6} md={6} sm={6} xs={12}>
                <div className={styles.companyProPostJobContainer}>
                  <h5>Verify the Number of Applications</h5>
                  <p className={styles.companyProPostJobContent}>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Perferendis, adipisci.
                  </p>
                </div>
              </Grid>
              <Grid item xxl={6} xl={6} lg={6} md={6} sm={6} xs={12}>
                <div className={styles.companyProPostJobContainer}>
                  <h5>Choose / Hire Quickly</h5>
                  <p className={styles.companyProPostJobContent}>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Perferendis, adipisci.
                  </p>
                </div>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
      </Container>
      <div style={{ backgroundColor: "#eaf1f1", margin: "30px 0px 0px 0px" }}>
        <Container className="Container" sx={{ paddingTop: {xs:"30px",sm:"50px"}, paddingBottom: {xs:"0",sm:"50px"} }} maxWidth = "xxl">
        <p className={styles.companyProstepperContent}>Direct Hire through <span style={{ textDecoration: "underline" }}>
                4 simple steps
              </span></p>
          <Grid container spacing={2.5} style={{ alignItems: "center" }}>
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
                    <div key={i} style = {{pointerEvents: "none", cursor: "pointer"}}>
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
              <Timeline
                sx={{
                  [`& .${timelineItemClasses.root}:before`]: {
                    flex: 0,
                    padding: 0,
                  },
                }}
              >
                {steps2.map((step, index) => (
                  <TimelineItem key={index}>
                    <TimelineSeparator>
                      <span className="timeline_count">{index + 1}</span>
                      {steps2.length - 1 != index &&
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
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
              {!isLoggedin &&
                <button className="formBtn7" onClick = {()=>Router.push("/register")} style = {{marginBottom: "20px"}}>Create Free Account Now</button>
              }
            </Grid>
          </Grid>
        </Container>
      </div>
      {/* <Container>
      <h2 style={{ textAlign: "center" }} id = "pricingPlans">Pricing Plans</h2>
      <p className={styles.headingContent} style = {{margin: "20px 0px"}}>
        Get connect with our World #1 Drone Pilots Networking for your future
        Hiring. Find our plans and choose the best suites for your needs.
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
        Quarterly (10% discount)
      </div>
      {plans.length >= 1 ? (
        <>
          <Grid container spacing={2.5}>
            <Grid item xxl={4} xl={4} lg={4} md={6} sm={6} xs={12}>
              <div className={styles.plan1}>
                <div className={styles.circle1}>
                  <div className={styles.circle2}></div>
                </div>
                <div className={styles.planTitle}>Basic</div>
                <div className={styles.planPrice}>Free</div>
                <div className={styles.btnContainer}>
                  {isLoggedin ? (
                    <Button
                      className={styles.btn1}
                      style={{ pointerEvents: "none" }}
                    >
                      Basic plan
                    </Button>
                  ) : (
                    <Button
                      className={styles.btn1}
                      onClick={() => Router.push("/register")}
                    >
                      Register
                    </Button>
                  )}
                </div>
                <div className={styles.planItems}>
                  <DoneIcon className={styles.tickIcon1} />
                  No of active Jobs : {plans[0].activeJobs}
                </div>
                <div className={styles.planItems}>
                  <DoneIcon className={styles.tickIcon1} />
                  Email proposals (Direct Hire) : {plans[0].directHires}
                </div>
                <div className={styles.planItems}>
                  <DoneIcon className={styles.tickIcon1} />
                  Draft access : {plans[0].draftJobs}
                </div>
                <div className={styles.planItems}>
                  {plans[0].bookmarkPilots ? (
                    <DoneIcon className={styles.tickIcon1} />
                  ) : (
                    <CloseIcon className={styles.tickIcon1} />
                  )}
                  Saving Pilots
                </div>
                <div className={styles.planItems}>
                  {plans[0].suggestedPilots ? (
                    <DoneIcon className={styles.tickIcon1} />
                  ) : (
                    <CloseIcon className={styles.tickIcon1} />
                  )}
                  Suggested Candidated
                </div>
                <div className={styles.planItems}>
                  <CloseIcon className={styles.tickIcon1} />
                  Boost Job
                </div>
                <div className={styles.planItems}>
                  {}
                  {plans[0].proBadge ? (
                    <DoneIcon className={styles.tickIcon1} />
                  ) : (
                    <CloseIcon className={styles.tickIcon1} />
                  )}
                  Verified Recruiter Indication
                </div>
              </div>
            </Grid>
            <Grid item xxl={4} xl={4} lg={4} md={6} sm={6} xs={12}>
              <div className={styles.plan2}>
                <div className={styles.circle3}>
                  <div className={styles.circle4}></div>
                </div>
                <div className={styles.planTitle}>
                  Gold {yearly ? "Quarterly" : "Monthly"}
                </div>
                <div className={styles.planPrice}>
                  {yearly ? "$500.00" : "$50.00"}
                </div>
                <div className={styles.btnContainer}>
                  <Button
                    disabled={
                      (currentPlan === "Gold Monthly" && !yearly) ||
                      (currentPlan === "Gold Quaterly" && yearly)
                    }
                    className={styles.btn2}
                    onClick={() =>
                      redirectCheckoutPage(
                        yearly
                          ? "/company-checkout/gold-yearly"
                          : "/company-checkout/gold-monthly"
                      )
                    }
                  >
                    {(currentPlan === "Gold Monthly" && !yearly) ||
                    (currentPlan === "Gold Quaterly" && yearly)
                      ? "Current plan"
                      : "Upgrade plan"}
                  </Button>
                </div>
                <div className={styles.planItems}>
                  <DoneIcon className={styles.tickIcon1} />
                  No of active Jobs : {plans[yearly ? 3 : 1].activeJobs}
                </div>
                <div className={styles.planItems}>
                  <DoneIcon className={styles.tickIcon1} />
                  Email proposals (Direct Hire) :{" "}
                  {plans[yearly ? 3 : 1].directHires}
                </div>
                <div className={styles.planItems}>
                  <DoneIcon className={styles.tickIcon1} />
                  Draft access : {plans[yearly ? 3 : 1].draftJobs}
                </div>
                <div className={styles.planItems}>
                  {plans[yearly ? 3 : 1].bookmarkPilots ? (
                    <DoneIcon className={styles.tickIcon1} />
                  ) : (
                    <CloseIcon className={styles.tickIcon1} />
                  )}
                  Saving Pilots
                </div>
                <div className={styles.planItems}>
                  {plans[yearly ? 3 : 1].suggestedPilots ? (
                    <DoneIcon className={styles.tickIcon1} />
                  ) : (
                    <CloseIcon className={styles.tickIcon1} />
                  )}
                  Suggested Candidated
                </div>
                <div className={styles.planItems}>
                  <DoneIcon className={styles.tickIcon1} />
                  Boost Job : {plans[yearly ? 3 : 1].boostJob}
                </div>
                <div className={styles.planItems}>
                  {}
                  {plans[yearly ? 3 : 1].proBadge ? (
                    <DoneIcon className={styles.tickIcon1} />
                  ) : (
                    <CloseIcon className={styles.tickIcon1} />
                  )}
                  Verified Recruiter Indication
                </div>
              </div>
            </Grid>
            <Grid item xxl={4} xl={4} lg={4} md={6} sm={6} xs={12}>
              <div className={styles.plan1}>
                <div className={styles.circle1}>
                  <div className={styles.circle2}></div>
                </div>
                <div className={styles.planTitle}>
                  Platinum {yearly ? "Quarterly" : "Monthly"}
                </div>
                <div className={styles.planPrice}>
                  {yearly ? "$1000.00" : "$100.00"}
                </div>
                <div className={styles.btnContainer}>
                  <Button
                    disabled={
                      (currentPlan === "Platinum Monthly" && !yearly) ||
                      (currentPlan === "Platinum Quaterly" && yearly)
                    }
                    className={styles.btn1}
                    onClick={() =>
                      redirectCheckoutPage(
                        yearly
                          ? "/company-checkout/platinum-yearly"
                          : "/company-checkout/platinum-monthly"
                      )
                    }
                  >
                    {(currentPlan === "Platinum Monthly" && !yearly) ||
                    (currentPlan === "Platinum Quaterly" && yearly)
                      ? "Current plan"
                      : "Upgrade plan"}
                  </Button>
                </div>
                <div className={styles.planItems}>
                  <DoneIcon className={styles.tickIcon1} />
                  No of active Jobs : {plans[yearly ? 4 : 2].activeJobs}
                </div>
                <div className={styles.planItems}>
                  <DoneIcon className={styles.tickIcon1} />
                  Email proposals (Direct Hire) :{" "}
                  {plans[yearly ? 4 : 2].directHires}
                </div>
                <div className={styles.planItems}>
                  <DoneIcon className={styles.tickIcon1} />
                  Draft access : {plans[yearly ? 4 : 2].draftJobs}
                </div>
                <div className={styles.planItems}>
                  {plans[yearly ? 4 : 2].bookmarkPilots ? (
                    <DoneIcon className={styles.tickIcon1} />
                  ) : (
                    <CloseIcon className={styles.tickIcon1} />
                  )}
                  Saving Pilots
                </div>
                <div className={styles.planItems}>
                  {plans[yearly ? 4 : 2].suggestedPilots ? (
                    <DoneIcon className={styles.tickIcon1} />
                  ) : (
                    <CloseIcon className={styles.tickIcon1} />
                  )}
                  Suggested Candidated
                </div>
                <div className={styles.planItems}>
                  <DoneIcon className={styles.tickIcon1} />
                  Boost Job : {plans[yearly ? 4 : 2].boostJob}
                </div>
                <div className={styles.planItems}>
                  {}
                  {plans[yearly ? 4 : 2].proBadge ? (
                    <DoneIcon className={styles.tickIcon1} />
                  ) : (
                    <CloseIcon className={styles.tickIcon1} />
                  )}
                  Verified Recruiter Indication
                </div>
              </div>
            </Grid>
          </Grid>
          <>
          <h3 style={{ margin: "30px 0px 10px 0px" }}>Add ons: </h3>
            <Grid container columnSpacing={2.5}>
              <Grid item xxl={3} xl={3} lg={3} md={4} sm={6} xs={12}>
                <div
                  className={styles.addonsPlanContainer}
                  id={styles.addonsPlanContainer1}
                  onClick={() => buyAddon("/company-addon/active-job-addon")}
                >
                  <div style = {{width: "100%"}}>
                    <h5 className={styles.addonsTitle}>Job Addon</h5>
                    <p className={styles.addonsDesc}>Get 2 Active jobs Extra</p>
                    <div className={styles.addonsPriceAndBtn}>
                    <div className={styles.addonsPrice}>$2 </div><button className = {styles.addonsBtn}>Add Now</button>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xxl={3} xl={3} lg={3} md={4} sm={6} xs={12}>
                <div
                  className={styles.addonsPlanContainer}
                  id={styles.addonsPlanContainer2}
                  onClick={() => buyAddon("/company-addon/boost-job-addon")}
                >
                  <div style = {{width: "100%"}}>
                    <h5 className={styles.addonsTitle}>Boost job addon</h5>
                    <p className={styles.addonsDesc}>Boost your job 5 times.</p>
                    <div className={styles.addonsPriceAndBtn}>
                    <div className={styles.addonsPrice}>$5 </div><button className = {styles.addonsBtn}>Add Now</button>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xxl={3} xl={3} lg={3} md={4} sm={6} xs={12}>
                <div
                  className={styles.addonsPlanContainer}
                  id={styles.addonsPlanContainer3}
                  onClick={() => buyAddon("/company-addon/direct-hire-addon")}
                >
                  <div style = {{width: "100%"}}>
                    <h5 className={styles.addonsTitle}>Direct Hire Addon</h5>
                    <p className={styles.addonsDesc}>
                      Get additional 10 Direct Hire.
                    </p>
                    <div className={styles.addonsPriceAndBtn}>
                    <div className={styles.addonsPrice}>$10 </div><button className = {styles.addonsBtn}>Add Now</button>
                    </div>
                  </div>
                </div>
              </Grid>
              <Grid item xxl={3} xl={3} lg={3} md={4} sm={6} xs={12}>
                <div
                  className={styles.addonsPlanContainer}
                  id={styles.addonsPlanContainer4}
                  onClick={() => buyAddon("/company-addon/combo-addon")}
                >
                  <div style = {{width: "100%"}}>
                    <h5 className={styles.addonsTitle}>Combo Addon</h5>
                    <p className={styles.addonsDesc}>
                      2 Active jobs, Boost job 5 and 10 direct hire
                    </p>
                    <div className={styles.addonsPriceAndBtn}>
                    <div className={styles.addonsPrice}>$15 </div><button className = {styles.addonsBtn}>Add Now</button>
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>
          </>
        </>
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
    </Container> */}
    <div
      className="proFaq"
      style={{
        backgroundColor: "#fff",
        padding: "40px 10%" ,
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
      <AccordionSummary
        aria-controls="panel1d-content"
        id="panel1d-header"
      >
        <Typography className="faq_heading">What is the limitation for Pilots search?</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography className="faq_content">No limitations for Pilots search, you can perform N number of search upto find best fits for your Jobs</Typography>
      </AccordionDetails>
    </Accordion>
    <Accordion
      expanded={expanded === `faq2`}
      onChange={handleChange(`faq2`)}
    >
      <AccordionSummary
        aria-controls="panel1d-content"
        id="panel1d-header"
      >
        <Typography className="faq_heading">Are there any limitations for Chat with pilots (Message)?</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography className="faq_content">Absolutely No, You can chat with Drone Pilots until your clarification is clarified. Decision upto yours</Typography>
      </AccordionDetails>
    </Accordion>
    <Accordion
      expanded={expanded === `faq3`}
      onChange={handleChange(`faq3`)}
    >
      <AccordionSummary
        aria-controls="panel1d-content"
        id="panel1d-header"
      >
        <Typography className="faq_heading">Is there any way to evaluate Pilots before Hiring?</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography className="faq_content">Each Pilots have their own profile page, there you can find basic information about the pilots and their professional information like Years of experience, Works done so far (Portfolios), Employment Type, Skills, Industries Experience etc etc</Typography>
      </AccordionDetails>
    </Accordion>
    <Accordion
      expanded={expanded === `faq4`}
      onChange={handleChange(`faq4`)}
    >
      <AccordionSummary
        aria-controls="panel1d-content"
        id="panel1d-header"
      >
        <Typography className="faq_heading">What are the features of the Free Account?</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography className="faq_content">Still you can access all features with limited counts, Please refer to our plans limitations now</Typography>
      </AccordionDetails>
    </Accordion>
    <Accordion
      expanded={expanded === `faq5`}
      onChange={handleChange(`faq5`)}
    >
      <AccordionSummary
        aria-controls="panel1d-content"
        id="panel1d-header"
      >
        <Typography className="faq_heading">How can i Hire the pilots Quickly?</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography className="faq_content">We simplified the drone pilots hiring process with simple 3 steps. Post your Jobs with detailed descriptions (full-time or freelance job) -&gt; Start to receive the Applications -&gt; Choose the Best and Appoint them for your works. <Link href = "/job/create"><a className="link" style = {{color: "#698097"}}>Post your Jobs</a></Link> Now.</Typography>
      </AccordionDetails>
    </Accordion>
    <Accordion
      expanded={expanded === `faq6`}
      onChange={handleChange(`faq6`)}
    >
      <AccordionSummary
        aria-controls="panel1d-content"
        id="panel1d-header"
      >
        <Typography className="faq_heading">How many Job Posts can I make at the same time?</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography className="faq_content">It may vary depending on what plan you have choosen. In Free account you can Post two active Jobs and 5 Draft Jobs, You can keep swap out listings as many times based on your needs. If you want more access you simply go ahead with Pro plans based upon your needs</Typography>
      </AccordionDetails>
    </Accordion>
    <Accordion
      expanded={expanded === `faq7`}
      onChange={handleChange(`faq7`)}
    >
      <AccordionSummary
        aria-controls="panel1d-content"
        id="panel1d-header"
      >
        <Typography className="faq_heading">Can I increase my limits?</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography className="faq_content">Yes,of course, if you want to increase your limits you can simply upgrade higher plans by clicking the upgrade button. Or else with the same plan you are able to purchase multiple, existing plan limitations will be carried forward</Typography>
      </AccordionDetails>
    </Accordion>
    <Accordion
      expanded={expanded === `faq8`}
      onChange={handleChange(`faq8`)}
    >
      <AccordionSummary
        aria-controls="panel1d-content"
        id="panel1d-header"
      >
        <Typography className="faq_heading">Will any charges apply to cancel the subscription?</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography className="faq_content">No, you can cancel your subscription at any time. There is no cancellation fee</Typography>
      </AccordionDetails>
    </Accordion>
    <Accordion
      expanded={expanded === `faq9`}
      onChange={handleChange(`faq9`)}
    >
      <AccordionSummary
        aria-controls="panel1d-content"
        id="panel1d-header"
      >
        <Typography className="faq_heading">Can you send me an invoice?</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography className="faq_content">Invoice will be available on your <Link href = "/company-dashboard/account/subscription"><a className = "link" style = {{color: "#698097"}}>Account dashboard</a></Link> you can download it any time</Typography>
      </AccordionDetails>
    </Accordion>
  </div>
  <Dialog
    open={subscribeAlert}
    TransitionComponent={Transition}
    keepMounted
    onClose={()=>setSubscribeAlert(false)}
    aria-describedby="alert-dialog-slide-description"
  >
    <div className="popupContainer">
      <ClearRoundedIcon className="popupClose" onClick={()=>setSubscribeAlert(false)} />
      <div className = "popupTitle">Subscribe any plans to buy addons.</div>
      <div style = {{textAlign: 'center'}}>
        <div className="popupLoginBtn" onClick={()=>setSubscribeAlert(false)} >Close</div>
      </div>
    </div>
  </Dialog>
  <Dialog
    open={notCompanyPopup}
    TransitionComponent={Transition}
    keepMounted
    onClose={()=>setNotCompanyPopup(false)}
    aria-describedby="alert-dialog-slide-description"
  >
    <div className="popupContainer">
      <ClearRoundedIcon className="popupClose" onClick={()=>setNotCompanyPopup(false)} />
      <div className = "popupTitle">Register as a company to perform these actions.</div>
      <div style = {{textAlign: 'center'}}>
        <div className="popupLoginBtn" onClick={()=>setNotCompanyPopup(false)} >Close</div>
      </div>
    </div>
  </Dialog>
  </>
  );
}

export default CompanyPro;