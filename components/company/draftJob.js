import React, { useEffect, useState } from "react";
import job from "../../styles/job.module.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import axios from "axios";
import Link from "next/link";
import Router from "next/router";
import Dialog from "@mui/material/Dialog";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import Slide from "@mui/material/Slide";
import Alert from "@mui/material/Alert";
import { Container } from "@mui/material";
const imageLink = process.env.NEXT_PUBLIC_CDN;
const domain = process.env.NEXT_PUBLIC_LOCALHOST;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function DraftJob() {
  let [data, setData] = useState([]);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if(localStorage.getItem("role")== "company"){
      
      axios.post(`${domain}/api/draftJob/getMyDrafts`, config).then((res) => {
        console.log(res);
        setData(res.data);
      });
    }
  }, []);

  let [tempId, setTempId] = useState("");
  let deleteDraft = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(`${domain}/api/draftJob/deleteDraft`, { jobId: tempId }, config)
      .then((res) => {
        axios.post(`${domain}/api/draftJob/getMyDrafts`, config).then((res) => {
          console.log(res);
          setData(res.data);
        });
        handleClose();
      });
  };
  return (
    <div>
      <div style={{ backgroundColor: "rgb(248,248,251)", paddingTop: "30px", paddingBottom: '10px' }}>
        <Container>
          <div className={job.jobShowTalentContainer}>
            <div className={job.jobMainTitle}>Inactive Jobs</div>
            <div className={job.jobMainDesc}>
            Keep you inactive jobs here and publish them at any time by a few simple clicks
            </div>
          </div>
          {data.length == 0 ? (
            <Alert severity = "info" style = {{marginBottom: "20px"}}>No Draft Yet</Alert>
          ) : (
            <></>
          )}

          
          {data.map((item, i) => {
            return (
              <div className={job.jobMainContainer} key = {i}>
                <div className={job.jobBoxTitleContainer}>
                  <div className={job.saveShareContainer}>
                    <div className={job.jobBoxDate}>
                      Created on: &nbsp;
                      <span style={{ fontFamily: "roboto-regular" }}>
                        {item.createdAt ? item.createdAt.slice(0, 10) : "---"}
                      </span>
                    </div>
                  </div>
                  <div className={job.jobBoxTitle}>{item.jobTitle}</div>
                </div>
                <div className={job.companyDetailsContainer}>
                  <div className={job.companyImageNameContainer}>
                    {/* <img
                                src={`${imageLink}/100x100/${item.companyId.profilePic}`}
                                alt=""
                                className={job.companyImage}
                              /> */}
                    <div className={job.companyNameContainer}>
                          <div
                            className={job.companyName}
                            style={{ fontSize: "14px" }}
                          >
                            {(item.companyId && item.companyId.companyName) ||
                              "- - -"}
                          </div>
                      <div className={`${job.locationName} tooltip`}>
                        {item.workLocation
                          ? item.workLocation.split(",")[0].length > 15
                            ? item.workLocation.split(",")[0].slice(0, 15) +
                              " ..."
                            : item.workLocation.split(",")[0]
                          : " - - -"}
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
                      &nbsp;{item.jobType || "Not mentioned"}
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
                      &nbsp;{item.noOfOpenings || " - - -"} Vacancies
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
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flex: "1",
                      minWidth: "fit-content",
                    }}
                  >
                    <div className={job.detailLink} style = {{cursor: "initial"}}>
                      <Link href={`/job/edit-draft/${item._id}`}>
                        <button className={job.detailBtn} style = {{cursor: "pointer", background: '#00e7fc'}}>
                          Post Now
                        </button>
                      </Link>
                    </div>
                    <div
                      className={job.detailLink}
                    >
                      <>
                      <DeleteForeverRoundedIcon
                        style={{
                          fontSize: "25px",
                          cursor: "pointer",
                          color: "#D22B2B",
                        }}
                        onClick={() => {
                          setTempId(item._id);
                          handleClickOpen();
                        }}
                      />
                    </>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Container>
      </div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="popupContainer">
          <ClearRoundedIcon className="popupClose" onClick={handleClose} />
          <div className="popupTitle">
            Are you sure you want to delete this Draft?
          </div>
          <center>
            <div className="popupLoginBtn" onClick={deleteDraft}>
              Delete Draft
            </div>
          </center>
        </div>
      </Dialog>
    </div>
  );
}

export default DraftJob;
