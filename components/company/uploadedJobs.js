import React, { useEffect, useState } from "react";
import job from "../../styles/job.module.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import axios from "axios";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Dialog from "@mui/material/Dialog";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import Slide from "@mui/material/Slide";
import Applications from "./applications";
import Router from "next/router";
import Alert from "@mui/material/Alert";
import ShareIcon from "@mui/icons-material/Share";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
const imageLink = process.env.NEXT_PUBLIC_CDN;

const domain = process.env.NEXT_PUBLIC_LOCALHOST;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function Uploaded() {
  let [tab, setTab] = useState("jobs");
  let [tempJob, setTempJob] = useState("");
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [open1, setOpen1] = React.useState(false);

  const handleClickOpen1 = () => {
    setOpen1(true);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };
  let [data, setData] = useState([]);
  let [subscription, setSubscription] = useState({});
  let [jobBoosts, setJobBoosts] = useState(0);
  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .get(`${domain}/api/company/getCompanySubscription`, config)
      .then((res) => {
        console.log(res);
        setSubscription(res.data.subscription);
        setJobBoosts(res.data.jobBoosts);
      });

      setLoader(true)
    axios.post(`${domain}/api/jobs/approvedJobs`, config).then((res) => {
      if (res.data !== "") {
        setData(res.data);
        setLoader(false)
      }
      console.log(res);
    });
  }, []);
  let [tempId, setTempId] = useState("");
  let [limit, setLimit] = useState(false);
  let [loader, setLoader] = useState(false)
  let expireJob = (id) => {
    setTempId(id);
    handleClickOpen();
  };
  let [boost, setBoost] = useState(false);
  let expireConfirm = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(`${domain}/api/jobs/expireJob`, { jobId: tempId })
      .then((res) => {
        axios.post(`${domain}/api/jobs/approvedJobs`, config).then((res) => {
          if (res.data !== "") {
            setData(res.data);
          }
          console.log(res);
        });
        setOpen(false);
      });
  };
  let showApplications = (id) => {
    setTempJob(id);
    setTab("applications");
    window.scrollTo(0,0)
  };
  let onCloseCandidates = (data) => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    setTab(data);
    setLoader(true)
    axios.post(`${domain}/api/jobs/approvedJobs`, config).then((res) => {
      if (res.data !== "") {
        setData(res.data);
        setLoader(false)
      }
    })
  };
  let [idtoEdit, setIdtoEdit] = useState("");
  let editImage = (id, length) => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(`${domain}/api/jobApplications/getApplications`, { jobId: id, status: "All" }, config)
      .then((res) => {
        if (res.data.length > 0) {
          setOpen1(true);
          setIdtoEdit(id);
        } else {
          Router.push(`/job/edit/${id}`);
        }
      });
  };
  let editJob = () => {
    Router.push(`/job/edit/${idtoEdit}`);
  };
  let boostJob = (id) => {
    if (jobBoosts >= subscription.boostJob) {
      //popup
      setLimit(true);
    } else {
      setTempId(id);
      setBoost(true);
    }
  };
  let boostJobConfirm = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(`${domain}/api/jobs/boostJob`, { id: tempId }, config)
      .then((res) => {
        console.log(res);
        document.getElementById("jobBoosted").style.display = "flex";
        setTimeout(() => {
          if (document.getElementById("jobBoosted")) {
            document.getElementById("jobBoosted").style.display = "none";
          }
        }, 4000);

        axios
          .get(`${domain}/api/company/getCompanySubscription`, config)
          .then((res) => {
            console.log(res);
            setSubscription(res.data.subscription);
            setJobBoosts(res.data.jobBoosts);
          });
        setBoost(false);
      });
  };
  return (
    <div style={{ position: "relative" }}>
      <Alert
        severity="success"
        id="jobBoosted"
        style={{ display: "none", position: "sticky", top: "100px" }}
      >
        You have boosted your job. Be tuned to get top applicants
      </Alert>
      {tab === "jobs" ? (
        <>
        {
          loader ? <Skeleton
          count={3}
          style={{
            height: "170px",
            borderRadius: "5px",
            marginBottom: "20px",
            border: "1px solid #e8e8e8",
          }}
        /> : <>
        {data.length == 0 ? (
            <>
              <Alert severity="info">You dont have any jobs yet</Alert>
            </>
          ) : (
            <></>
          )}

          {data.map((item, i) => {
            return (
              <div className={job.jobMainContainer} key={i}>
                <div className={job.jobBoxTitleContainer}>
                  <div className={job.saveShareContainer}>
                    {!localStorage.getItem("role") ||
                    localStorage.getItem("role") === "pilot" ? (
                      <>
                        {likedJobs.includes(item.data._id) ? (
                          <button
                            className={job.saveBtn}
                            onClick={() => unlike(item.data._id)}
                          >
                            <BookmarkIcon />
                            &nbsp;Saved
                          </button>
                        ) : (
                          <button
                            className={job.saveBtn}
                            onClick={() => like(item.data._id)}
                          >
                            <BookmarkBorderIcon />
                            &nbsp;Save
                          </button>
                        )}
                      </>
                    ) : (
                      ""
                    )}
                    <div
                      className={job.shareBtn}
                      style={{
                        fontFamily: "roboto-regular",
                        cursor: "pointer",
                        color: "black",
                        backgroundColor: "#00e7fc",
                        padding: " 3px 10px",
                        borderRadius: "20px",
                        height: "fit-content"
                      }}
                      onClick={() => boostJob(item.data._id)}
                    >
                      Boost Job
                    </div>
                  </div>
                  <Link href={`/job/${item.data.slug}`}>
                    <a className={job.jobBoxTitle}>{item.data.jobTitle}</a>
                  </Link>
                </div>
                <div className={job.companyDetailsContainer}>
                  <div className={job.companyImageNameContainer}>
                    <img
                      src={`${imageLink}/100x100/${item.data.companyId.profilePic}`}
                      alt=""
                      className={job.companyImage}
                    />
                    <div className={job.companyNameContainer}>
                      <Link
                        href={
                          item.companyId
                            ? `/job/company/${item.data.companyId.userId}`
                            : ""
                        }
                      >
                        <a>
                          <div
                            className={job.companyName}
                            style={{ fontSize: "14px" }}
                          >
                            {item.data.companyId &&
                              item.data.companyId.companyName}
                          </div>
                        </a>
                      </Link>
                      <div className={`${job.locationName} tooltip`}>
                        {item.data.workLocation
                          ? item.data.workLocation.split(",")[0].length > 15
                            ? item.data.workLocation
                                .split(",")[0]
                                .slice(0, 15) + " ..."
                            : item.data.workLocation.split(",")[0]
                          : ""}
                        {item.data.workLocation.split(",")[0].length > 15 ? (
                          <span className="tooltiptext">
                            {item.data.workLocation
                              ? item.data.workLocation.split(",")[0]
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
                      &nbsp;{item.data.employeeType}
                    </div>
                    <div className={job.pilotWorkType}>
                      <WorkOutlineOutlinedIcon style={{ color: "black" }} />
                      &nbsp;{item.data.jobType}
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
                      {item.data.minSalary
                        ? `$${item.data.minSalary} - $${item.data.maxSalary}`
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
                      <WorkOutlineOutlinedIcon style={{ fontSize: "18px" }} />
                      &nbsp;{item.data.noOfOpenings} Vacancies
                    </span>
                  </div>
                  <div className={job.detailBtn}>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <WorkOutlineOutlinedIcon style={{ fontSize: "18px" }} />
                      &nbsp;{item.data.experience || "0-1 years"}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flex: "1",
                      minWidth: "fit-content",
                    }}
                  >
                    <div className={job.detailLink} style={{ display: "flex" , alignItems:"center"}}  id="noHover">
                      <button
                        className={job.detailBtn}
                        onClick={() => showApplications(item.data._id)}
                        style={{ background: "#4ffea3", cursor: " pointer" }}
                      >
                        View Applications ({item.jobApps})
                      </button>
                      <div style={{ position: "relative" }} id="noHover"  onClick={() => showApplications(item.data._id)}>
                        <AddAlertIcon sx={{ color: "#62a557" }} />
                        <div className={job.ujBadge}>{item.unRead}</div>
                      </div>
                    </div>

                    <div className={job.detailLink} >
                      <EditIcon
                        style={{
                          fontSize: "25px",
                          cursor: "pointer",
                          color: "#00e7fc",
                          marginRight: "10px",
                          zIndex:"999"
                        }}
                        onClick={() =>
                          editImage(
                            item.data._id,
                            item.data.applications.length
                          )
                        }
                      />
                      <DeleteForeverRoundedIcon
                        style={{
                          fontSize: "25px",
                          cursor: "pointer",
                          color: "rgb(255, 114, 111)",
                        }}
                        onClick={() => expireJob(item.data._id)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}</>
        }
          
          
          <>
            <Dialog
              open={open1}
              TransitionComponent={Transition}
              keepMounted
              onClose={handleClose1}
              aria-describedby="alert-dialog-slide-description"
            >
              <div className="popupContainer">
                <ClearRoundedIcon
                  className="popupClose"
                  onClick={handleClose1}
                />
                <div className="popupTitle" style={{ textAlign: "left" }}>
                  Edit Job?
                </div>
                <div className="popupSubTitle">
                  All your applications may be lost or cannot see your old data!
                </div>
                <center>
                  <div className="popupLoginBtn" onClick={editJob}>
                    Yes, Continue
                  </div>
                </center>
              </div>
            </Dialog>
            <Dialog
              open={open}
              TransitionComponent={Transition}
              keepMounted
              onClose={handleClose}
              aria-describedby="alert-dialog-slide-description"
            >
              <div className="popupContainer">
                <ClearRoundedIcon
                  className="popupClose"
                  onClick={handleClose}
                />
                <div className="popupTitle" style={{ textAlign: "left" }}>
                  Expire Job?
                </div>
                <div className="popupSubTitle">
                  Are you sure you want to expire this Job?
                </div>
                <center>
                  <div className="popupLoginBtn" onClick={expireConfirm}>
                    Yes, Continue
                  </div>
                </center>
              </div>
            </Dialog>
            <Dialog
              open={boost}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => setBoost(false)}
              aria-describedby="alert-dialog-slide-description"
            >
              <div className="popupContainer">
                <ClearRoundedIcon
                  className="popupClose"
                  onClick={() => setBoost(false)}
                />
                <div className="popupTitle" style={{ textAlign: "center" }}>
                  Boost Job?
                </div>
                <div className="popupSubTitle">
                  Are you sure you want to boost this Job? It will help you to get better applicants reach.
                </div>
                <center>
                  <div className="popupLoginBtn" onClick={boostJobConfirm}>
                    Boost Job
                  </div>
                </center>
              </div>
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
                  You do not have boost job Limit !! Upgrade to continue or Buy
                  Add on
                </div>
                <center>
                  <Link href="/company-pro">
                    <div className="popupLoginBtn">Upgrade</div>
                  </Link>
                </center>
              </div>
            </Dialog>
          </>
        </>
      ) : (
        <>
          <Applications
            jobId={tempJob}
            closeCandidates={onCloseCandidates}
            jobType="active"
          />
        </>
      )}
    </div>
  );
}

export default Uploaded;
