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
import Dialog from '@mui/material/Dialog';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import Slide from '@mui/material/Slide';
import Applications from "./applications";
import Alert from "@mui/material/Alert";
import ShareIcon from "@mui/icons-material/Share";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
const imageLink = process.env.NEXT_PUBLIC_CDN;
const domain = process.env.NEXT_PUBLIC_LOCALHOST;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function Expired() {
    let [tab , setTab] = useState("jobs")
   let [tempJob, setTempJob] = useState("")
    const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  let [data, setData] = useState([]);
  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.post(`${domain}/api/jobs/expiredJobs`, config).then((res) => {
      if (res.data !== "") {
        setData(res.data);
      }
      console.log(res);
    });
  }, []);
  let [tempId, setTempId] = useState("")
  let expireJob = (id) =>{
setTempId(id)
handleClickOpen()
  }
  let expireConfirm = () =>{

  const config = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    },
  };
    axios.post(`${domain}/api/jobs/expireJob`,{jobId: tempId}).then(res=>{
        axios.post(`${domain}/api/jobs/approvedJobs`, config).then((res) => {
            if (res.data !== "") {
              setData(res.data);
            }
            console.log(res);
          });
          setOpen(false)
    })
  }
let showApplications = (id) =>{
    setTempJob(id);
    setTab("applications")
}
let onCloseCandidates = (data) =>{
    setTab(data)
}
  return (
    <div>
         {
        tab === "jobs" ? <>
        {data.length == 0 ? (
        <>
         <Alert severity="success">You dont have any jobs yet</Alert>
       
        </>
      ) : (
        <></>
      )}
{data.map((item, i) => {
                      return (
                        <div className={job.jobMainContainer} key = {i}>
                          <div className={job.jobBoxTitleContainer}>
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
                              <div
                                className={job.shareBtn}
                                style = {{fontFamily: "roboto-bold", cursor: "default", color: "black"}}
                              >
                                Posted on: &nbsp;
                                <span style={{ fontFamily: "roboto-regular" }}>
                                  {item.postingDate ? item.postingDate.slice(0, 10) : "---"}
                                </span>
                              </div>
                            </div>
                            <Link href={`/job/${item.slug}`}>
                              <a className={job.jobBoxTitle}>{item.jobTitle}</a>
                            </Link>
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
                                <div className={`${job.locationName} tooltip`}>
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
                                flex: "1",
                                minWidth: "fit-content"
                              }}
                            >
                              <div className={job.detailLink}>
                              <button
                      className={job.detailBtn}
                      onClick={() => showApplications(item._id)}
                      style = {{background: "#4ffea3"}}
                    >
                      View Applications
                    </button>
                              </div>
                              
                            </div>
                          </div>
                        </div>
                      );
                    })}
      <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="popupContainer">
          <ClearRoundedIcon className="popupClose" onClick={handleClose}/>
          <div className="popupTitle" style={{textAlign: "left"}}>
         Expire Job?
          </div>
          <div className="popupSubTitle" >Are you sure you want to expire this Job?</div>
          <center>
           
          <div className="popupLoginBtn" onClick={expireConfirm}>Expire Job</div>
          </center>
        </div>
      </Dialog></>
        </> : <>
        <Applications jobId={tempJob} closeCandidates={onCloseCandidates} jobType="expired"/>
        </>
    }
      
    </div>
  );
}

export default Expired;
