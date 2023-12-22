import Router from "next/router";
import React, { useEffect, useState } from "react";
import job from "../../styles/job.module.css";
import DashCss from "../../styles/companyDashboard.module.css";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { Grid } from "@mui/material";
import parse from "html-react-parser";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import Link from "next/link";
import Slide from "@mui/material/Slide";
import io from "socket.io-client";
import Head from "next/head";
import ShareIcon from "@mui/icons-material/Share";
import { Container } from "@mui/material";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import Ivcss from "../../styles/imageView.module.css";
import IconButton from '@mui/material/IconButton';
var socket, selectedChatCompare;
const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const localhost = process.env.NEXT_PUBLIC_LOCALHOST;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  const temp = await fetch(`${domain}/api/jobs/getIdBySlug/${slug}`);
  const tempId = await temp.json();
  const id = tempId.id;
  const res = await fetch(`${domain}/api/jobs/jobLanding/${id}`);
  let metaData = await fetch(`${domain}/api/seo/getSeo/job`);
  let metaDataObj = await metaData.json();
  const data = await res.json();
  if (id) {
    return {
      props: {
        jobData: data,
        data: "there",
        metaData: metaDataObj,
      },
    };
  } else {
    return {
      props: {
        data: "noData",
      },
    };
  }
}
function Id({ jobData, data, metaData }) {
  const [open, setOpen] = React.useState(false);
  const [share, setShare] = React.useState(false);
  let [myId, setMyId] = useState("");
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  let [liked, setLiked] = useState([]);
  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (data == "noData") {
      Router.push("/noComponent");
    }
    if (localStorage.getItem("role") == "pilot") {
      axios.post(`${domain}/api/user/checkUser`, config).then((res) => {
        setMyId(res.data._id);
      });
      axios.post(`${domain}/api/pilot/getLikedJobs`, config).then((res) => {
        console.log(res.data);
        setLiked(res.data);
      });
      axios
        .get(`${domain}/api/jobApplications/getMyAppliedJobs`, config)
        .then((res) => {
          console.log(res);
          setApplied(res.data);
        });
    }
  }, []);
  let [message, setMessage] = useState(
    "Hello, I am interested in your role. Can we speak further?"
  );

  let [applied, setApplied] = useState([]);
  let [loginPopup, setLoginPopup] = useState(false);
  let [noPilot, setNoPilot] = useState(false);
  let unlike = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(`${domain}/api/jobs/unlikeJob/${jobData._id}`, config)
      .then((res) => {
        axios.post(`${domain}/api/pilot/getLikedJobs`, config).then((res) => {
          setLiked(res.data);
        });
      });
  };
  let like = () => {
    if (!localStorage.getItem("access_token")) {
      //popup
      setLoginPopup(true);
    } else if (localStorage.getItem("role") !== "pilot") {
      //popup
      setNoPilot(true);
    } else {
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      };
      axios
        .post(`${domain}/api/jobs/likeJob/${jobData._id}`, config)
        .then((res) => {
          axios.post(`${domain}/api/pilot/getLikedJobs`, config).then((res) => {
            setLiked(res.data);
          });
        });
    }
  };
  let sendMail = () => {
    if (message == "") {
      document.getElementById("message_error").innerHTML =
        "Message is required";
      document.getElementById("message_error").style.display = "block";
    } else if (message !== "" && (message.length < 3 || message.length > 100)) {
      document.getElementById("message_error").innerHTML =
        "Message should be between 3-100 words";
      document.getElementById("message_error").style.display = "block";
    } else {
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      };
      axios
        .post(
          `${domain}/api/jobApplications/createApplication`,
          { jobId: jobData._id, message: message },
          config
        )
        .then((res) => {
          socket = io(localhost);

          axios
            .get(`${domain}/api/jobApplications/getMyAppliedJobs`, config)
            .then((res) => {
              console.log(res);
              setApplied(res.data);
            });
          setMessage(
            "Hello, I am interested in your role. Can we speak further?"
          );
          let tempData = {
            data: res.data.data,
            id: myId,
          };
          setTimeout(() => {
            socket.emit("hello", tempData);
            socket.emit("refreshMyChats", myId);
          }, 20);
        });
      setOpen(false);
    }
  };
  let applyNow = () => {
    if (!localStorage.getItem("access_token")) {
      //popup
      setLoginPopup(true);
    } else if (localStorage.getItem("role") !== "pilot") {
      //popup
      setNoPilot(true);
    } else {
      setOpen(true);
    }
  };
  return (
    <div style={{ backgroundColor: "#F8FAFB" }}>
      <Head>
        <title>{metaData.title}</title>
        <meta name="keywords" content={metaData.metaKeywords} />
        <meta name="description" content={metaData.metaDescription} />
        <meta name="title" content={metaData.metaTitle} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {data == "noData" ? (
        <>
          <div></div>
        </>
      ) : (
        <Container maxWidth="xxl">
          <div className={job.jobContainer}>
            {/* <div className={job.jobBack} onClick={() => Router.back()}>
              Back
            </div> */}
            <div style={{ marginTop: "40px" }} className={job.jobDesc}>
              <Grid container columnSpacing={11}>
                <Grid item lg={8.5} md={9} sm={6} xs={12}>
                  <div className={job.jobShowTalentContainer} style = {{paddingRight: "16px"}}>
                    <div className={job.jobHeadBox}>
                      <div>
                        <div
                          className={job.jobBoxTitle}
                          style={{ cursor: "default", color: "#000" }}
                        >
                          {jobData.jobTitle}
                        </div>
                        <div
                          className={job.jobBoxCompanyName}
                          style={{ cursor: "default" }}
                        >
                          {jobData.industry}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          minWidth: "fit-content",
                          alignItems: "center",
                        }}
                      >
                        {applied && applied.includes(jobData._id) ? (
                          <button
                            className={job.jobApplyNow}
                            style={{ opacity: 0.5, height: "fit-content" }}
                          >
                            Enquire
                          </button>
                        ) : (
                          <button
                            className={job.jobApplyNow}
                            onClick={applyNow}
                            style={{ height: "fit-content" }}
                          >
                            Enquire Now
                          </button>
                        )}

                        {liked.includes(jobData._id) ? (
                          <IconButton onClick={unlike} className={job.jobApplyIconBtn} style = {{marginRight: "20px"}}>
                            <BookmarkIcon className={job.jobApplyIcon} style = {{color: "#00A4E2"}}/>
                          </IconButton>
                        ) : (
                          <IconButton onClick={like} className={job.jobApplyIconBtn} style = {{marginRight: "20px"}}>
                            <BookmarkBorderIcon className={job.jobApplyIcon} style = {{color: "#00A4E2"}}/>
                          </IconButton>
                        )}
                        <IconButton onClick={() => setShare(`/job/${jobData.slug}`)} className={job.jobApplyIconBtn}>
                          <ShareIcon className={job.jobApplyIcon}/>
                        </IconButton>
                      </div>
                    </div>
                  </div>
                  <div className={job.jobShowTalentContainer}>
                    <div className={job.jobBoxTitle1} style = {{marginTop: "12px"}}>Job Description</div>
                    <div className={job.jobBoxTitle1Bottom}></div>
                    <div
                      className={job.jobLeftBarDesc}
                    >
                      {parse(String(jobData.jobDesc))}
                    </div>
                  </div>
                </Grid>
                <Grid item lg={3.5} md={3} sm={6} xs={12}>
                  <div className={job.jobMainContainer}>
                    <div className={job.jobMainTitle2}>Job Details</div>
                    <div className={job.jobRightBarTitle}>Pilot Type</div>
                    <div className={job.jobRightBarDesc}>
                      {jobData.employeeType}
                    </div>
                    <div className={job.jobRightBarTitle}>Work Type</div>
                    <div className={job.jobRightBarDesc}>{jobData.jobType}</div>
                    <div className={job.jobRightBarTitle}>Salary</div>
                    <div className={job.jobRightBarDesc}>
                      {jobData.minSalary
                        ? `$${jobData.minSalary} - $${jobData.maxSalary}`
                        : "Not Mentioned"}
                    </div>
                    <div className={job.jobRightBarTitle}>No of Openings</div>
                    <div className={job.jobRightBarDesc}>
                      {jobData.noOfOpenings
                        ? jobData.noOfOpenings
                        : "Not Mentioned"}
                    </div>
                    <div className={job.jobRightBarTitle}>Posted Date</div>
                    <div className={job.jobRightBarDesc}>
                      {jobData.postingDate
                        ? jobData.postingDate.slice(0, 10)
                        : ""}
                    </div>
                    <div className={job.jobRightBarTitle}>Work Location</div>
                    <div className={job.jobRightBarDesc}>
                      {jobData.workLocation}
                    </div>
                  </div>
                </Grid>
              </Grid>
            </div>
          </div>
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => setOpen(false)}
            aria-describedby="alert-dialog-slide-description"
          >
            <div className="popupContainer">
              <ClearRoundedIcon
                className="popupClose"
                onClick={() => setOpen(false)}
              />
              <div className={DashCss.title}>
                Initialize a chat with the recruiter.
              </div>
              <div>
                <div>
                  <textarea
                    type="text"
                    className="inputBox"
                    style={{ height: "80px", resize: "none", padding: "10px" }}
                    id="folderName"
                    value={message}
                    onChange={(e) => {
                      document.getElementById("message_error").style.display =
                        "none";
                      setMessage(e.target.value);
                    }}
                  />
                  <div className="input_error_msg" id="message_error">
                    Message is required
                  </div>
                </div>
                <center>
                  <button className="popupLoginBtn" onClick={sendMail}>
                    Start Chatting
                  </button>
                </center>
              </div>
            </div>
          </Dialog>

          <Dialog
            open={share}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => setShare(false)}
            aria-describedby="alert-dialog-slide-description"
          >
            <div className="sharePopupContainer">
              <div className="sharePopupTitle">Share with social media</div>
              <div className={Ivcss.shareOptionsContainer}>
                <FacebookShareButton
                  url={baseUrl + share}
                  className={Ivcss.shareBtn}
                >
                  <div className={Ivcss.shareOption}>
                    <FacebookIcon
                      size={35}
                      round={true}
                      style={{ marginRight: "5px" }}
                    />
                  </div>
                </FacebookShareButton>
                <LinkedinShareButton
                  url={baseUrl + share}
                  className={Ivcss.shareBtn}
                >
                  <div className={Ivcss.shareOption}>
                    <LinkedinIcon
                      size={35}
                      round={true}
                      style={{ marginRight: "5px" }}
                    />
                  </div>
                </LinkedinShareButton>
                <TwitterShareButton
                  url={baseUrl + share}
                  className={Ivcss.shareBtn}
                >
                  <div className={Ivcss.shareOption}>
                    <TwitterIcon
                      size={35}
                      round={true}
                      style={{ marginRight: "5px" }}
                    />
                  </div>
                </TwitterShareButton>
                <WhatsappShareButton
                  url={baseUrl + share}
                  className={Ivcss.shareBtn}
                >
                  <div className={Ivcss.shareOption}>
                    <WhatsappIcon
                      size={35}
                      round={true}
                      style={{ marginRight: "5px" }}
                    />
                  </div>
                </WhatsappShareButton>
              </div>
            </div>
          </Dialog>
          <Dialog
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
          </Dialog>
        </Container>
      )}
    </div>
  );
}

export default Id;
