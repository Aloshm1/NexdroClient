import { Grid } from "@mui/material";
import { Container } from "@mui/system";
import Image from "next/image";
import React, { useEffect } from "react";
import style from "../styles/service.module.css";
import drone from "../images/drone2.png";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import Slide from "@mui/material/Slide";
import StarIcon from '@mui/icons-material/Star';
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import Filter1OutlinedIcon from "@mui/icons-material/Filter1Outlined";
import Filter2OutlinedIcon from "@mui/icons-material/Filter2Outlined";
import Filter3OutlinedIcon from "@mui/icons-material/Filter3Outlined";
import Filter4OutlinedIcon from "@mui/icons-material/Filter4Outlined";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Router from "next/router";
import styles from "../styles/pilotPro.module.css";
const imageLink = process.env.NEXT_PUBLIC_AWS;
const highlights = [
  "Free Profile Listing",
  "List out the types of drone you will to provide service",
  "Upload your service centre pictures",
  "Set your working hours/Contact details/Address in few mints",
  "Share your service centre profile URL with your clients",
  "Bookmark",
  "Global Business Opportunities",
  "Generate the Leads",
  "Lead Management in dashboard",
];
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
function CenterPro() {
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const [expanded, setExpanded] = React.useState("");
  return (
    <div>
      <div className={style.head}>
        <Grid container spacing={0}>
          <Grid item xl={8} lg={8} md={8} sm={12} xs={12}>
            <h4 className={`${styles.companyProTitle} ${style.head1}`} style = {{color: "black"}}>
              <span className={style.span}>World&apos;s #1 Drone</span> Service
              centre directory listing Portal.
            </h4>
            <p className={`${styles.companyProContent} ${style.subDiv}`}>
              Nexdro provides fast, free, reliable, and comprehensive
              information to our users to discover Drone Service centres related
              information with stunning features like location based search,
              Direct Message, Drone Services Models,etc....
            </p>
          </Grid>
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12} sx={{alignSelf: {xs:"end"}}}>
            <div style={{ position: "relative" }}>
              <img
                src={`${imageLink}/PngItem_5332945.png`}
                className={style.image}
              />
              <div className={style.chat}>
                Have you listed your service center in{" "}
                <span style={{ fontFamily: "roboto-bold" }}>Nexdro</span>?
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
      <div>
        <Container className={`Container`}>
          <div style={{ margin: "20px 0" }}>
            <Grid container>
              <Grid item xl={6} lg={6} md={6} sm={12} xs={12} sx = {{display: {xs: "none", md: "initial"}}}>
                <img
                  src={`${imageLink}/static/Picture (2).png`}
                  style={{ width: "80%", marginTop: "50px", marginLeft:"10%" }}
                />
              </Grid>
              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                <div className={style.highBox}>
                  <div className={style.highTitle}>Highlights</div>
                  {highlights.map((item, i) => {
                    return (
                      <div className={style.highDesc} key={i}>
                        <StarIcon sx={{ color: "#4ffea3", width: "18px", height: "18px", marginRight: "7px" }} />
                        {item}
                      </div>
                    );
                  })}
                </div>
                {/* //steps */}
              </Grid>
            </Grid>
          </div>
          <div className="setupAccount">
            <h4 style={{ marginBottom: "20px", textAlign: "center" }}>
              How to Setup your account
            </h4>
            <div className={style.subCreate}>
              Its structure is a marvellous way to set up your service centre
              accounts with Nexdro portal. Just follow a few simple steps to
              complete your service centre profile page.
            </div>
            <Grid container spacing={2}>
              <Grid item xl={3} lg={3} md={3} sm={6} xs={12}>
                <div className={style.stepBox}>
                  <Filter1OutlinedIcon />
                  <h5>Create a Nexdro Account</h5>
                </div>
              </Grid>
              <Grid item xl={3} lg={3} md={3} sm={6} xs={12}>
                <div
                  className={style.stepBox}
                  // style={{ backgroundColor: "#FFE9AE" }}
                >
                  <Filter2OutlinedIcon />
                  <h5>Update your Center Info</h5>
                </div>
              </Grid>
              <Grid item xl={3} lg={3} md={3} sm={6} xs={12}>
                <div
                  className={style.stepBox}
                  // style={{ backgroundColor: "#FFB3B3" }}
                >
                  <Filter3OutlinedIcon />
                  <h5>Complete the process</h5>
                </div>
              </Grid>
              <Grid item xl={3} lg={3} md={3} sm={6} xs={12}>
                <div
                  className={style.stepBox}
                  // style={{ backgroundColor: "#CDF0EA" }}
                >
                  <Filter4OutlinedIcon />
                  <h5>Generate the leads</h5>
                </div>
              </Grid>
            </Grid>
            <div className={style.setup}>
              What are you waiting for!!!{" "}
              <span
                className={style.register}
                onClick={() => Router.push("/register")}
              >
                Register Now
              </span>
            </div>
          </div>
        </Container>
        <div
          className="proFaq"
          style={{
            backgroundColor: "#fff",
            padding: "45px 10% 40px 10%",
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
              <Typography className="faq_heading">
                How can I set up my accounts?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="faq_content">
                <div>
                  <span className="bold">Step 1:</span>{" "}
                  <span
                    style={{ textDecoration: "underline", cursor: "pointer" }}
                    onClick={() => Router.push("/register")}
                  >
                    Go to
                  </span>{" "}
                  the Registration Page
                </div>
                <div>
                  {" "}
                  <span className="bold">Step 2:</span> Select the Service
                  centre box to enrol your account as a service provider.
                </div>
                <div>
                  <span className="bold">Step 3:</span> Update with your profile
                  information and publish it.
                </div>
              </Typography>
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
              <Typography className="faq_heading">
                Are there any charges apply for profile setup?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="faq_content">
                No, it&apos;s a free service, Currently we don&apos;t have any
                subscription plan.
              </Typography>
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
              <Typography className="faq_heading">
                What is the restriction for image Upload?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className="faq_content">
                <div>
                  Kindly refer below minimal requirements while you upload your
                  service centre pictures.
                </div>
                <div>
                  <span className="bold">Photo Type:</span> JPG, PNG
                </div>
                <div>
                  <span className="bold">Photo Dimension:</span> Minimum Width:
                  250px : Minimum Height: 250px
                </div>
                <div>
                  <span className="bold">Photo Size:</span> Maximum 2 MB (For
                  Better View)
                </div>
                <div>
                  <span className="bold">Reason for Rejection:</span> Size
                  Exceed, Not Supported file formats, Image dimensions not in
                  above the recommended.
                </div>
                <div>
                  <span className="bold"> Note:</span> Photo should be in high
                  Quality in standard landscape view. and Photo should not
                  contain any violence, For More Detail kindly refer to our{" "}
                  <span
                    style={{ textDecoration: "underline", cursor: "pointer" }}
                    onClick={() => Router.push("/terms-and-conditions")}
                  >
                    
                    terms and conditions
                  </span>
                </div>
              </Typography>
            </AccordionDetails>
          </Accordion>
        </div>
      </div>
    </div>
  );
}

export default CenterPro;
