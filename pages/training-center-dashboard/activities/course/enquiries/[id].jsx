import React, { useState, useEffect } from "react";
import TrainingCenterActivities from "../../../../../components/layouts/TrainingCenterActivities";
import job from "../../../../../styles/job.module.css";
import { Grid } from "@mui/material";
import css from "../../../../../styles/center.module.css";
import Link from "next/link";
import AddIcCallIcon from "@mui/icons-material/AddIcCall";
import MessageIcon from "@mui/icons-material/Message";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import Dialog from "@mui/material/Dialog";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import Slide from "@mui/material/Slide";
import Router, { useRouter } from "next/router";
import axios from "axios";
import Alert from "@mui/material/Alert";

const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const imageLink = process.env.NEXT_PUBLIC_CDN;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Enquiries() {
  let router = useRouter();
  let [mark, setMark] = useState(false);
  let [status, setStatus] = useState("");
  let [course, setCourse] = useState({});
  let [applicants, setApplicants] = useState([]);
  let [filter, setFilter] = useState("All");
  let [updateId, setUpdateId] = useState("")

  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (router.query.id){
      axios.get(`${domain}/api/courses/getCourse/${router.query.id}`)
      .then(res => {
        console.log(res.data)
        setCourse(res.data);
      })
      .catch(err => {
        console.log(err)
      })
      axios.get(`${domain}/api/courses/allCourseEnquiries/${router.query.id}`, config)
      .then(res => {
        console.log(res.data)
        setApplicants(res.data);
      })
      .catch(err => {
        console.log(err)
      })
    }
  }, [router.asPath]);

  let openStatusBox = (id, status) => {
    setUpdateId(id)
    setStatus(status);
    setMark(true);
  };

  let changeStatus = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.post(`${domain}/api/courses/courseEnquiryUpdateStatus/${updateId}`, {status: status}, config)
    .then(res => {
      axios.get(`${domain}/api/courses/getCourse/${router.query.id}`)
      .then(res => {
        console.log(res.data)
        setCourse(res.data);
      })
      .catch(err => {
        console.log(err)
      })
      axios.get(`${domain}/api/courses/allCourseEnquiries/${router.query.id}`, config)
      .then(res => {
        console.log(res.data)
        setApplicants(res.data);
      })
      .catch(err => {
        console.log(err)
      })
    })
    .catch(err => {
      alert("error")
      console.log(err)
    })
    setMark(false);
  };

  let filterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <div>
      <h2>Enquiries of {course.courseTitle || " . . . "}</h2>
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
      <div style={{ marginTop: "20px" }}>
        {
          applicants && applicants.length
          ?<>
            {applicants.map((item, i) => {
            return (
              <>
                {(filter === "All" || filter === item.status) &&
                  <div className={job.ceMainDiv} key={i}>
                    <Grid container spacing={0}>
                      <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                        <Grid container spacing={0}>
                          <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                            <div className={css.ceTitle}>Applied on</div>
                            <div className={css.ceDesc}>
                              {item.createdAt.slice(0, 10)}
                            </div>
                          </Grid>
                          <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                            <div className={css.ceTitle}>Last Interacted</div>
                            <div className={css.ceDesc}>
                              {item.updatedAt.slice(0, 10)}
                            </div>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                        <Link href={`/pilot/${item.pilotId.userName}`}>
                          <a
                            className={css.ceDesc}
                            style={{
                              fontFamily: "roboto-bold",
                              cursor: "pointer",
                            }}
                          >
                            {item.pilotId.name}
                          </a>
                        </Link>
                        <a href={`tel:${item.pilotId.phoneNo}`}>
                          <div
                            className={css.ceDesc}
                            style={{ textDecoration: "underline" }}
                          >
                            {item.pilotId.phoneNo}
                          </div>
                        </a>
                        <a href={`mailto:${item.pilotId.emailId}`}>
                          <div className={css.ceDesc}>
                            {item.pilotId.emailId}
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
                              openChat(item.pilotId._id);
                            }}
                          >
                            <MessageIcon
                              sx={{ color: "#00e7fc", cursor: "pointer" }}
                            />
                            <div className={css.ceBadge}>0</div>
                          </div>
                          <div
                            style={{ position: "relative" }}
                            onClick={() => {
                              openChat(item.pilotId._id);
                            }}
                          >
                            <AddAlertIcon
                              sx={{ color: "green", cursor: "pointer" }}
                            />
                            <div className={css.ceBadge1}>0</div>
                          </div>
                          <a href={`tel:${item.pilotId.phoneNo}`}>
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
                                openStatusBox(item._id, item.status)
                              }
                            >
                              {item.status == "Rejected" && (
                                <div className={css.ceClosedBtn}>
                                  {item.status}
                                </div>
                              )}
                              {item.status == "Pending" && (
                                <div className={css.cePendingBtn}>
                                  {item.status}
                                </div>
                              )}
                              {item.status == "Selected" && (
                                <div className={css.ceCanceledBtn}>
                                  {item.status}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                }
              </>
            );
          })}
          </>
          :<Alert severity="info">
              No applicants yet.
            </Alert>
        }
      </div>
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
Enquiries.Layout = TrainingCenterActivities;
export default Enquiries;

