import { Alert, Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import job from "../../../styles/job.module.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import axios from "axios";
import { Container } from "@mui/system";
import Link from "next/link";
import Router from "next/router";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import Head from "next/head";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ShareIcon from "@mui/icons-material/Share";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Dialog from "@mui/material/Dialog";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import Slide from "@mui/material/Slide";
import DashCss from "../../../styles/companyDashboard.module.css";
import io from "socket.io-client";
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
import Ivcss from "../../../styles/imageView.module.css";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
var socket, selectedChatCompare;
const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const imageLink = process.env.NEXT_PUBLIC_CDN;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const localhost = process.env.NEXT_PUBLIC_LOCALHOST;
export async function getServerSideProps(context) {
  const { params } = context;
  const { id } = params;

  const res = await fetch(`${domain}/api/company/getPlatinumCompanies`);
  const data = await res.json();
  const jobsRes = await fetch(`${domain}/api/jobs/getJobByName/${id}`);
  const jobs = await jobsRes.json();
  let metaData = await fetch(`${domain}/api/seo/getSeo/companyJobs`);
  let metaDataObj = await metaData.json();
  return {
    props: {
      platinumCompanies: data,
      id: id,
      jobs: jobs,
      metaData: metaDataObj,
    },
  };
}

function CompanyJobs({ platinumCompanies, id, jobs, metaData }) {
  let [role, setRole] = useState("");
  let [likedJobs, setLikedJobs] = useState([]);
  let [applied, setApplied] = useState([]);
  let [norole, setnorole] = useState(false);
  let [jobId, setJobId] = useState("");
  let [applyPopup, setApplyPopup] = useState(false);
  let [message, setMessage] = useState(
    "Hello, I am intrested in your role. Can we speak further?"
  );
  let [applyFailed, setApplyFailed] = useState(false);
  const [share, setShare] = React.useState(false);
  let [myId, setMyId] = useState("");
  useEffect(() => {
    console.log(jobs);
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (localStorage.getItem("access_token")) {
      axios.post(`${domain}/api/user/checkUser`, config).then((res) => {
        setRole(res.data.role);
      });
      axios.post(`${domain}/api/pilot/getLikedJobs`, config).then((res) => {
        setLikedJobs(res.data);
      });
    }
    if (localStorage.getItem("role") == "pilot") {
      axios
        .get(`${domain}/api/jobApplications/getMyAppliedJobs`, config)
        .then((res) => {
          console.log(res);
          setApplied(res.data);
        });
    }
  }, []);
  let unlike = (id) => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(`${domain}/api/jobs/unlikeJob/${id}`, config)

      .then((response) => {
        axios.post(`${domain}/api/pilot/getLikedJobs`, config).then((res) => {
          setLikedJobs(res.data);
        });
      });
  };
  const applyNow = (id) => {
    if (!applied.includes(id)) {
      if (!role) {
        setLoginPopup(true);
      } else if (role === "pilot") {
        setJobId(id);
        setApplyPopup(true);
        console.log("Entered")
      } else {
        setnorole(true);
        
      }
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
          { jobId: jobId, message: message },
          config
        )
        .then((res) => {
          document.getElementById("alert").style.display = "flex";
          setTimeout(() => {
            if (document.getElementById("alert")) {
              document.getElementById("alert").style.display = "none";
            }
          }, 4000);
          socket = io(localhost);

          axios
            .get(`${domain}/api/jobApplications/getMyAppliedJobs`, config)
            .then((res) => {
              console.log(res);
              setApplied(res.data);
            });
          setMessage(
            "Hello, I am intrested in your role. Can we speak further?"
          );
          let tempData = {
            data: res.data.data,
            id: myId,
          };
          setTimeout(() => {
            socket.emit("hello", tempData);
            socket.emit("refreshMyChats", myId);
          }, 20);
        })
        .catch((err) => {
          console.log(err)
          setApplyFailed(true);
        });
      setApplyPopup(false);
    }
  };
  let like = (id) => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(`${domain}/api/jobs/likeJob/${id}`, config)

      .then((response) => {
        axios.post(`${domain}/api/pilot/getLikedJobs`, config).then((res) => {
          setLikedJobs(res.data);
        });
      });
  };
  let changeCompany = (id) => {
    Router.push(`/job/company/${id}`);
  };
  return (
    <div>
      <Head>
        <title>{metaData.title} </title>
        <meta name="keywords" content={metaData.metaKeywords} />
        <meta name="description" content={metaData.metaDescription} />
        <meta name="title" content={metaData.metaTitle} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container className="Container">
        <div className={job.companyJobTitle}>
          Jobs from{" "}
          {jobs.length !== 0 ? jobs[0].companyId.companyName : "Company"}
        </div>

        <Grid container spacing={2}>
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <div className={job.companyJobTitle}>Top Recruiters</div>
            <div>
              {platinumCompanies.map((item, i) => {
                return (
                  <div
                    className="dayBadge"
                    style={{
                      backgroundColor: item.userId == id ? "#00e7fc" : "#eee",
                    }}
                    onClick={() => changeCompany(item.userId)}
                    key={i}
                  >
                    {item.companyName}
                  </div>
                );
              })}
            </div>
          </Grid>
          <Grid item xl={8} lg={8} md={8} sm={12} xs={12}>
          <Alert
          id="alert"
          severity="success"
          style={{
            position: "sticky",
            top: "75px",
            border: "1px solid #e5e5e5",
            zIndex: "1000",
            display: "none",
          }}
        >
          You have applied for the job. Recruiter will text you soon!!
        </Alert>
            {jobs.length == 0 ? (
              <div className="HideTitle">No Jobs Yet from this company</div>
            ) : (
              <></>
            )}

            
            {jobs.map((item, i) => {
                      return (
                        <div className={job.jobMainContainer} key = {i}>
                          <div className={job.jobBoxTitleContainer}>
                            <Link href={`/job/${item.slug}`}>
                              <a className={job.jobBoxTitle}>{item.jobTitle}</a>
                            </Link>
                            <div className={job.saveShareContainer}>
                              {!localStorage.getItem("role") ||
                              localStorage.getItem("role") === "pilot" ? (
                                <>
                                  {likedJobs.includes(item._id) ? (
                                    <button
                                      className={job.saveBtn}
                                      onClick={() => unlike(item._id)}
                                    >
                                      <BookmarkIcon />
                                      &nbsp;Saved
                                    </button>
                                  ) : (
                                    <button
                                      className={job.saveBtn}
                                      onClick={() => like(item._id)}
                                    >
                                      <BookmarkBorderIcon />
                                      &nbsp;Save
                                    </button>
                                  )}
                                </>
                              ) : (
                                ""
                              )}
                              <button
                                className={job.shareBtn}
                                onClick={() => setShare(`/job/${item.slug}`)}
                              >
                                <ShareIcon />
                              </button>
                            </div>
                          </div>
                          <div className={job.companyDetailsContainer}>
                            <div className={job.companyImageNameContainer}>
                              <img
                                src={`${imageLink}/100x100/${item.companyId.profilePic}`}
                                alt=""
                                className={job.companyImage}
                              />
                              <div className={job.companyNameContainer}>
                                <Link
                                  href={
                                    item.companyId
                                      ? `/job/company/${item.companyId.userId}`
                                      : ""
                                  }
                                >
                                  <a>
                                    <div
                                      className={job.companyName}
                                      style={{ fontSize: "14px" }}
                                    >
                                      {item.companyId &&
                                        item.companyId.companyName}
                                    </div>
                                  </a>
                                </Link>
                                <div className={`${job.companyName} tooltip`}>
                                  {item.workLocation
                                    ? item.workLocation.split(",")[0].length >
                                      15
                                      ? item.workLocation
                                          .split(",")[0]
                                          .slice(0, 15) + " ..."
                                      : item.workLocation.split(",")[0]
                                    : ""}
                                  {item.workLocation.split(",")[0].length >
                                  15 ? (
                                    <span className="tooltiptext">
                                      {item.workLocation
                                        ? item.workLocation.split(",")[0]
                                        : ""}
                                    </span>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className={job.jobDetailsContainer1}>
                              <div
                                className={`${job.pilotWorkType} ${job.pilotWorkType1}`}
                                style={{ marginRight: "30px" }}
                              >
                                <AccountCircleIcon style={{ color: "black" }} />
                                &nbsp;{item.employeeType}
                              </div>
                              <div className={job.pilotWorkType}>
                                <WorkOutlineOutlinedIcon
                                  style={{ color: "black" }}
                                />
                                &nbsp;{item.jobType}
                              </div>
                            </div>
                          </div>
                          <div className={job.jobDetailsContainer2}>
                            <div className={job.detailBtn}>
                              <span
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <LocalAtmIcon style={{ fontSize: "18px" }} />
                                &nbsp;
                                {item.minSalary
                                  ? `$${item.minSalary} - $${item.maxSalary}`
                                  : "Not Mentioned"}
                              </span>
                            </div>
                            <div className={job.detailBtn}>
                              <span
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <WorkOutlineOutlinedIcon
                                  style={{ fontSize: "18px" }}
                                />
                                &nbsp;{item.noOfOpenings} Vacancies
                              </span>
                            </div>
                            <div className={job.detailBtn}>
                              <span
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <WorkOutlineOutlinedIcon
                                  style={{ fontSize: "18px" }}
                                />
                                &nbsp;{item.experience || '0-1 years'}
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flex: 1,
                                minWidth: "fit-content"
                              }}
                            >
                              <div className={job.detailLink}>
                                <Link href={`/job/${item.slug}`}>
                                  <a
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      marginRight: "20px",
                                    }}
                                  >
                                    <OpenInNewIcon
                                      style={{ fontSize: "18px" }}
                                    />
                                    &nbsp;More Details
                                  </a>
                                </Link>
                              </div>
                              <div
                                className={job.detailLink}
                                onClick={() => applyNow(item._id)}
                                style={{
                                  opacity: applied.includes(item._id)
                                    ? "0.7"
                                    : "1",
                                  pointerEvents: applied.includes(item._id)
                                    ? "none"
                                    : "auto",
                                }}
                              >
                                <span
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <OpenInNewIcon style={{ fontSize: "18px" }} />
                                  &nbsp;
                                  {applied.includes(item._id)
                                    ? "Applied"
                                    : "Apply Now"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
          </Grid>
        </Grid>
      </Container>
      <Dialog
          open={norole}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setnorole(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <div className="popupContainer">
            <ClearRoundedIcon
              className="popupClose"
              onClick={() => setnorole(false)}
            />
            <div className="popupTitle">
              Only Pilots are allowed to apply for jobs, login with pilot
              profile
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
          <div className="popupContainer">
            <ClearRoundedIcon
              className="popupClose"
              onClick={() => setShare(false)}
            />
            <div className="popupTitle">Share</div>
            <div className={Ivcss.shareOptionsContainer}>
              <FacebookShareButton
                url={baseUrl + share}
                className={Ivcss.shareBtn}
              >
                <div className={Ivcss.shareOption}>
                  <FacebookIcon
                    size={42}
                    round={true}
                    style={{ marginRight: "10px" }}
                  />
                  Facebook
                </div>
              </FacebookShareButton>
              <LinkedinShareButton
                url={baseUrl + share}
                className={Ivcss.shareBtn}
              >
                <div className={Ivcss.shareOption}>
                  <LinkedinIcon
                    size={42}
                    round={true}
                    style={{ marginRight: "10px" }}
                  />
                  Linkedin
                </div>
              </LinkedinShareButton>
              <TwitterShareButton
                url={baseUrl + share}
                className={Ivcss.shareBtn}
              >
                <div className={Ivcss.shareOption}>
                  <TwitterIcon
                    size={42}
                    round={true}
                    style={{ marginRight: "10px" }}
                  />
                  Twitter
                </div>
              </TwitterShareButton>
              <WhatsappShareButton
                url={baseUrl + share}
                className={Ivcss.shareBtn}
              >
                <div className={Ivcss.shareOption}>
                  <WhatsappIcon
                    size={42}
                    round={true}
                    style={{ marginRight: "10px" }}
                  />
                  Whatsapp
                </div>
              </WhatsappShareButton>
            </div>
          </div>
        </Dialog>
        <Dialog
          open={applyPopup}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setApplyPopup(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <div className="popupContainer">
            <ClearRoundedIcon
              className="popupClose"
              onClick={() => setApplyPopup(false)}
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
          open={applyFailed}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setApplyFailed(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <div className="popupContainer">
            <ClearRoundedIcon
              className="popupClose"
              onClick={() => setApplyFailed(false)}
            />
            <div className={DashCss.title}>
              Something went wrong. Try after sometimes
            </div>
            <div style = {{textAlign: "center"}}>
              <div
                className="popupLoginBtn"
                onClick={() => setApplyFailed(false)}
              >
                Close
              </div>
            </div>
          </div>
        </Dialog>
    </div>
  );
}

export default CompanyJobs;
