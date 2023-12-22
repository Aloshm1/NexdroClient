import React, { useEffect, useState } from "react";
import PilotActivities from "../../../components/layouts/PilotActivities";
import job from "../../../styles/job.module.css";
import axios from "axios";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Link from "next/link";
import Chat from "../../chat/[id]";
import Dialog from "@mui/material/Dialog";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import Slide from "@mui/material/Slide";
import Alert from "@mui/material/Alert";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ShareIcon from "@mui/icons-material/Share";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Ivcss from "../../../styles/imageView.module.css";
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

const imageLink = process.env.NEXT_PUBLIC_CDN;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function AppliedJobs() {
  let [data, setData] = useState([]);
  const [open, setOpen] = React.useState(false);
  let [temp, setTemp] = useState("");
  const [share, setShare] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  let tempLoadData = (data) =>{
  }
  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .get(`${domain}/api/pilot/appliedJobsMine`, config)
      .then((response) => {
        console.log(response);
        setData(response.data);
      });
    axios.post(`${domain}/api/pilot/getLikedJobs`, config).then((res) => {
      console.log(res.data);
      setLiked(res.data);
    });
  }, []);
  let [liked, setLiked] = useState([]);
  let unlike = (id) => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(`${domain}/api/jobs/unlikeJob/${id}`, config)

      .then((response) => {
        axios
          .get(`${domain}/api/pilot/appliedJobsMine`, config)
          .then((response) => {
            console.log(response);
            setData(response.data);
          });
        axios.post(`${domain}/api/pilot/getLikedJobs`, config).then((res) => {
          console.log(res.data);
          setLiked(res.data);
        });
        if (response.data === "please Login") {
          // history.push("/pilot_dashboard/account")
          alert("loginFirst");
        }
      });
  };
  let likeJob = (id) => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(`${domain}/api/jobs/likeJob/${id}`, config)

      .then((response) => {
        axios
          .get(`${domain}/api/pilot/appliedJobsMine`, config)
          .then((response) => {
            console.log(response);
            setData(response.data);
          });
        axios.post(`${domain}/api/pilot/getLikedJobs`, config).then((res) => {
          console.log(res.data);
          setLiked(res.data);
        });
        if (response.data === "please Login") {
          // history.push("/pilot_dashboard/account")
          alert("loginFirst");
        }
      });
  };
  let newChat = (otherId, jobId) => {
    console.log(otherId);
    setTemp("");
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(
        `${domain}/api/chat/createChat`,
        { chatType: "jobApplication", otherId, jobId: jobId },
        config
      )
      .then((res) => {
        setTemp(res.data._id);
        setOpen(true);
      });
  };
  return (
    <div>
      {data.length == 0 ? (
          <Alert severity="info">No Applied Jobs Yet</Alert>
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
                    {liked.includes(item._id) ? (
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
                        onClick={() => likeJob(item._id)}
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
                        {item.companyId && item.companyId.companyName}
                      </div>
                    </a>
                  </Link>
                  <div className={`${job.locationName} tooltip`}>
                    {item.workLocation
                      ? item.workLocation.split(",")[0].length > 15
                        ? item.workLocation.split(",")[0].slice(0, 15) + " ..."
                        : item.workLocation.split(",")[0]
                      : ""}
                    {item.workLocation.split(",")[0].length > 15 ? (
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
                  <WorkOutlineOutlinedIcon style={{ color: "black" }} />
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
                  <WorkOutlineOutlinedIcon style={{ fontSize: "18px" }} />
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
                  <WorkOutlineOutlinedIcon style={{ fontSize: "18px" }} />
                  &nbsp;{item.experience || "0-1 years"}
                </span>
              </div>
              <div className={job.detailBtn} style = {{backgroundColor: "#00e7fc", cursor: "pointer"}} onClick={()=>newChat(item.companyId.userId, item._id)}>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      Chat History
                    </span>
                  </div>
            </div>
          </div>
        );
      })}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <div>
          <ClearRoundedIcon className="popupClose" onClick={handleClose} />
          {temp ? <Chat id={temp} loadData={tempLoadData} /> : <></>}
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
    </div>
  );
}
AppliedJobs.Layout = PilotActivities;
export default AppliedJobs;
