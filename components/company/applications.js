import React, { useEffect, useState } from "react";
import job from "../../styles/job.module.css";
import css from "../../styles/center.module.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import axios from "axios";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Grid } from "@mui/material";
import Chat from "../../pages/chat/[id]";
import AddIcCallIcon from "@mui/icons-material/AddIcCall";
import MessageIcon from "@mui/icons-material/Message";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import Dialog from "@mui/material/Dialog";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import Slide from "@mui/material/Slide";
import Link from "next/link";
import Router from "next/router";
const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const imageLink = process.env.NEXT_PUBLIC_CDN;
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Applications(props) {
  const [limit, setLimit] = useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [tab, setTab] = useState("applications");
  const handleChange = (panel) => (event, isExpanded) => {
    console.log(panel);
    setExpanded(isExpanded ? panel : false);
  };
  let [applications, setApplications] = useState([]);
  let [job1, setJob1] = useState({});
  let [subscription, setSubscription] = useState({});
  const [open, setOpen] = React.useState(false);
  var SI_SYMBOL = ["", "K", "M", "G", "T", "P", "E"];
  let  kFormatter = (number) =>{

     var tier = Math.log10(Math.abs(number)) / 3 | 0;

     if(tier == 0) return number;
 
     var suffix = SI_SYMBOL[tier];
     var scale = Math.pow(10, tier * 3);
 
     var scaled = number / scale;
 
     return scaled.toFixed(1) + suffix;
}
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(
        `${domain}/api/jobApplications/getApplications`,
        {
          jobId: props.jobId,
          status: filter,
        },
        config
      )
      .then((res) => {
        console.log(res);
        setApplications(res.data);
      });
  };
  useEffect(() => {
    axios.get(`${domain}/api/jobs/jobLanding/${props.jobId}`).then((res) => {
      setJob1(res.data);
    });
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    setLoader(true);
    axios
      .post(
        `${domain}/api/jobApplications/getApplications`,
        {
          jobId: props.jobId,
          status: "All",
        },
        config
      )
      .then((res) => {
        console.log(res);
        setApplications(res.data);
        setLoader(false);
      });
    if (localStorage.getItem("role") == "company") {
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      };
      axios
        .get(`${domain}/api/company/getCompanySubscription`, config)
        .then((res) => {
          setSubscription(res.data);
        });
    }
  }, []);
  let [tempId, setTempId] = useState("");
  let [mark, setMark] = useState(false);
  let [tempEnquiry, setTempEnquiry] = useState("");
  let [status, setStatus] = useState("");
  let [loader, setLoader] = useState(false);
  let showSuggested = () => {
    if (
      subscription.subscription &&
      subscription.subscription.suggestedPilots
    ) {
      setLoader(true)
      axios
        .post(`${domain}/api/pilot/getSuggestions`, {
          industry: job1.industry,
        })
        .then((res) => {
          console.log(res.data);
          setApplications(res.data);
          setLoader(false)
        });
      setTab("suggestions");
    } else {
      setLimit(true);
    }
  };
  let showApplications = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    setFilter("All");
    axios
      .post(
        `${domain}/api/jobApplications/getApplications`,
        {
          jobId: props.jobId,
          status: "All",
        },
        config
      )
      .then((res) => {
        console.log(res);
        setApplications(res.data);
        setTab("applications");
      });
  };
  let closeCandidates = () => {
    props.closeCandidates("jobs");
  };
  let [temp, setTemp] = useState("");
  let openChat = (otherId) => {
    setTemp("");
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(
        `${domain}/api/chat/createChat`,
        { chatType: "jobApplication", otherId, jobId: props.jobId },
        config
      )
      .then((res) => {
        setTemp(res.data._id);
        setOpen(true);
      });
  };
  let tempLoadData = (data) => {};
  let openStatusBox = (id, status) => {
    setTempEnquiry(id);
    setStatus(status);
    setMark(true);
  };
  let changeStatus = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(`${domain}/api/jobApplications/changeJobStatus`, {
        id: tempEnquiry,
        status: status,
      })
      .then((res) => {
        const config = {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        };
        axios
          .post(
            `${domain}/api/jobApplications/getApplications`,
            {
              jobId: props.jobId,
              status: "All",
            },
            config
          )
          .then((res) => {
            console.log(res);
            setApplications(res.data);
          });
        setMark(false);
      });
  };
  let [filter, setFilter] = useState("All");
  let filterChange = (e) => {
    setFilter(e.target.value);
    setLoader(true);
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(
        `${domain}/api/jobApplications/getApplications`,
        {
          jobId: props.jobId,
          status: e.target.value,
        },
        config
      )
      .then((res) => {
        setLoader(false);
        console.log(res);
        setApplications(res.data);
      });
  };
  return (
    <div>
      <div className={job.applicationContainer}>
        {props.jobType == "active" ? (
          <>
            {tab === "applications" ? (
              <>
                <div className={job.suggestedBtn} onClick={showSuggested}>
                  Show Suggested
                </div>
              </>
            ) : (
              <div
                className={job.suggestedBtn}
                style={{ backgroundColor: "#4ffea3" }}
                onClick={showApplications}
              >
                Show Applications
              </div>
            )}
          </>
        ) : (
          <></>
        )}

        <div>
          <div className={job.jobBoxTitle}>{job1.jobTitle}</div>
          <div className={job.jobBoxCompanyName}>{job1.industry}</div>
          {/* //type  */}
          <div>
            <div style={{ display: "flex", justifyContents: "center" }}>
              <AccountCircleIcon />
              <div className={job.jobWorkType}>{job1.employeeType}</div>
              <LocalAtmIcon style={{ marginLeft: "50px" }} />
              <div className={job.jobWorkType}>
                {job1.minSalary
                  ? `$${job1.minSalary} - $${job1.maxSalary}`
                  : "Not Mentioned"}
              </div>
            </div>

            {/* //buttons */}
            <div className={job.jobButtons}>
              <div className={job.jobLocationBtn}>
                <LocationOnOutlinedIcon />{" "}
                <span style={{ marginLeft: "10px" }}>
                  {job1.workLocation ? job1.workLocation.split(",")[0] : ""}
                </span>
              </div>
              <div className={job.jobLocationBtn}>
                <WorkOutlineOutlinedIcon />{" "}
                <span style={{ marginLeft: "10px" }}>{job1.jobType}</span>
              </div>
              <div className={job.jobLocationBtn1} onClick={closeCandidates}>
                Back to uploaded jobs
              </div>
            </div>
          </div>
        </div>
      </div>

      {tab == "applications" && (
        <div>
          <select
            value={filter}
            onChange={filterChange}
            className={job.filterSelect}
          >
            <option value="All">All</option>
            <option value="Selected">Selected</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      )}

      {loader ? (
        <Skeleton
          count={2}
          style={{
            height: "100px",
            borderRadius: "5px",
            marginBottom: "20px",
            border: "1px solid #e8e8e8",
          }}
        />
      ) : (
        <>
          <div>
            {applications.length == 0 && tab == "applications" ? (
              <div>
                <div className="HideTitle">
                  No Applications Received to show
                </div>
              </div>
            ) : (
              <></>
            )}
           
          </div>
          {tab == "applications" ? (
            //applications
            <div>
              <div style={{ marginTop: "20px" }}>
                {applications.map((item, i) => {
                  return (
                    <div className={job.ceMainDiv} key={i}>
                      <Grid container spacing={0}>
                        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                          <Grid container spacing={0}>
                            <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                              <div className={css.ceTitle}>Applied on</div>
                              <div className={css.ceDesc}>
                                {item.data.createdAt.slice(0, 10)}
                              </div>
                            </Grid>
                            <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                              <div className={css.ceTitle}>Last Interacted</div>
                              <div className={css.ceDesc}>
                                {item.lastChat.slice(0, 10)}
                              </div>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                          <Link href={`/pilot/${item.data.pilotId.userName}`}>
                            <div
                              className={css.ceDesc}
                              style={{
                                fontFamily: "roboto-bold",
                                cursor: "pointer",
                              }}
                            >
                              {item.data.pilotId.name}
                            </div>
                          </Link>
                          <a href={`tel:${item.data.pilotId.userId.phoneNo}`}>
                            <div
                              className={css.ceDesc}
                              style={{ textDecoration: "underline" }}
                            >
                              {item.data.pilotId.userId.phoneNo}
                            </div>
                          </a>
                          <a href={`mailto:${item.data.pilotId.userId.email}`}>
                            <div className={css.ceDesc}>
                              {item.data.pilotId.userId.email}
                            </div>
                          </a>
                        </Grid>
                        <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-around",
                              alignItems: "center",
                            }}
                          >
                            <div
                              style={{ position: "relative" }}
                              onClick={() => {
                                openChat(item.data.pilotId.userId._id);
                              }}
                            >
                              <MessageIcon
                                sx={{ color: "#00e7fc", cursor: "pointer" }}
                              />
                              <div className={css.ceBadge}>
                                {item.allMessages}
                              </div>
                            </div>
                            <div
                              style={{ position: "relative" }}
                              onClick={() => {
                                openChat(item.data.pilotId.userId._id);
                              }}
                            >
                              <AddAlertIcon
                                sx={{ color: "green", cursor: "pointer" }}
                              />
                              <div className={css.ceBadge1}>{item.unRead}</div>
                            </div>
                            <a href={`tel:${item.data.pilotId.userId.phoneNo}`}>
                              <div style={{ position: "relative" }}>
                                <AddIcCallIcon sx={{ cursor: "pointer" }} />
                              </div>
                            </a>
                            <div style={{}}>
                              <div
                                className={css.ceDesc}
                                style={{ textDecoration: "underline" }}
                              >
                                Marked as
                              </div>
                              <div
                                onClick={() =>
                                  openStatusBox(item.data._id, item.data.status)
                                }
                              >
                                {item.data.status == "Rejected" && (
                                  <div className={css.ceClosedBtn}>
                                    {item.data.status}
                                  </div>
                                )}
                                {item.data.status == "Pending" && (
                                  <div className={css.cePendingBtn}>
                                    {item.data.status}
                                  </div>
                                )}
                                {item.data.status == "Selected" && (
                                  <div className={css.ceCanceledBtn}>
                                    {item.data.status}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            //suggested
            <div>
              <div style={{ marginTop: "20px" }}>
                <div className={css.sugTitle}>Suggestions based on your Job Industry and Experience Level</div>
                {applications.length == 0 && tab == "suggestions" ? (
              <div>
                <div className="HideTitle">No Suggestions to show</div>
              </div>
            ) : (
              <></>
            )}
                <Grid container spacing={2}>
                  {applications.map((item, i) => {
                    return (
                      <Grid item xl={4} lg={4} md={4} sm={6} xs={12} key={i}>
                        <div className={css.sugMain}>
                          <div style={{ position: "relative" }}>
                            <img
                              src={`${imageLink}/${item.data.coverPic}`}
                              className={css.sugCoverPic}
                            />
                            <Link href={`/pilot/${item.data.userName}`}>
                            <img
                             src={`${imageLink}/${item.data.profilePic}`}
                              className={css.sugProfilePic}
                            />
                            </Link>
                          </div>

                          <div style={{ marginTop: "30px" }}>
                          <Link href={`/pilot/${item.data.userName}`}>
                            <div className={css.sugName}>{item.data.name}</div>
                            </Link>
                            <div className={css.sugCity}>{item.data.pilotType === "unlicensed" ? "Unlicensed Pilot" : "Licensed Pilot"}</div>
                            <div className={css.sugCity}>{item.data.city}, {item.data.country}</div>
                            <center>
                              <Link href={`/pilot/${item.data.userName}`}>
                              <button className={css.sugViewProfile}>

                                View Profile
                              </button>
                              </Link>
                            </center>
                            
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-around",
                                marginTop: "10px",
                                borderTop: "1px solid #bfbfbf",
                                padding:"5px 10px",
                                borderRadius: "0px 0px 10px 10px"
                              }}
                            >
                              <div className={css.widthBox}>
                                <div className={css.sugCity}>Followers</div>
                                <div className={css.sugDesc}>{item.followers}</div>
                              </div>
                              <div className={css.widthBox}>
                                <div className={css.sugCity}>Shots</div>
                                <div className={css.sugDesc}>{item.shots}</div>
                              </div>
                              <div className={css.widthBox} style={{border:"none"}}>
                                <div className={css.sugCity}>Views</div>
                                <div className={css.sugDesc}>{kFormatter(item.data.viewed)}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Grid>
                    );
                  })}
                </Grid>
              </div>
            </div>
          )}
        </>
      )}

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <ClearRoundedIcon className="popupClose" onClick={handleClose} />
        <div>{temp ? <Chat id={temp} loadData={tempLoadData} /> : <></>}</div>
      </Dialog>
      <Dialog
        open={limit}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setLimit(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="popupContainer">
          <ClearRoundedIcon
            className="popupClose"
            onClick={() => setLimit(false)}
          />
          <div className="popupTitle">
            Please upgrade to view suggested pilots.
          </div>
          <center>
            <Link href="/company-pro">
              <div className="popupLoginBtn">Upgrade</div>
            </Link>
          </center>
        </div>
      </Dialog>
      <Dialog
        open={mark}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setMark(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <ClearRoundedIcon
          className="popupClose"
          onClick={() => setMark(false)}
          style={{ zIndex: "999" }}
        />
        <div className="popupContainer">
          <div className="popupTitle">Mark this application as?</div>

          <div>
            <select
              className="inputBox"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <center>
            <button className="popupLoginBtn" onClick={changeStatus}>
              Update
            </button>
          </center>
        </div>
      </Dialog>
    </div>
  );
}

export default Applications;
