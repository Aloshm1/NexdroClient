import React, { useEffect, useState } from "react";
import job from "../../styles/job.module.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import axios from "axios";
import Alert from "@mui/material/Alert";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
const domain = process.env.NEXT_PUBLIC_LOCALHOST;
function Pending() {
  let [data, setData] = useState([]);
  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.post(`${domain}/api/jobs/pendingJobs`, config).then((res) => {
      if (res.data !== "") {
        setData(res.data);
      }
      console.log(res);
    });
  }, []);
  return (
    <div>
      {data.length == 0 ? (
        <>
          <Alert severity="info">You dont have any jobs yet</Alert>
        </>
      ) : (
        <></>
      )}

      {data.map((item, i) => {
        return (
          <div key={i}>
            <div className={job.jobBoxDate}>
              Posted on: &nbsp;
              <span style={{ fontFamily: "roboto-regular" }}>
                {item.postingDate ? item.postingDate.slice(0, 10) : "---"}
              </span>
            </div>
            <div className={job.jobBoxTitle}>
              {item.jobTitle ? item.jobTitle : "---"}
            </div>
            <div className={job.jobBoxCompanyName}>
              {item.industry ? item.industry : "---"}
            </div>
            {/* //type  */}
            <div>
              <div style={{ display: "flex", justifyContents: "center" }}>
                <AccountCircleIcon />
                <div className={job.jobWorkType}>{item.employeeType}</div>
                <LocalAtmIcon style={{ marginLeft: "50px" }} />
                <div className={job.jobWorkType}>
                  {item.minSalary
                    ? `$${item.minSalary} - $${item.maxSalary}`
                    : "not mentioned"}
                </div>
              </div>

              {/* //buttons */}
              <div className={job.jobButtons}>
                <div className={`${job.jobLocationBtn} tooltip`}>
                  <LocationOnOutlinedIcon />{" "}
                  <span style={{ marginLeft: "10px" }}>
                    {item.workLocation
                      ? `${item.workLocation.split(",")[0].slice(0, 15)}${
                          item.workLocation.split(",")[0].length > 15
                            ? " ..."
                            : ""
                        }`
                      : "---"}
                  </span>
                  {item.workLocation &&
                    item.workLocation.split(",")[0].length > 15 && (
                      <span className="tooltiptext">
                        {item.workLocation
                          ? item.workLocation.split(",")[0]
                          : ""}
                      </span>
                    )}
                </div>
                <div className={job.jobLocationBtn}>
                  <WorkOutlineOutlinedIcon />{" "}
                  <span style={{ marginLeft: "10px" }}>{item.jobType}</span>
                </div>
              </div>
              <hr className={job.jobBoxHr} style={{ margin: "20px 0px" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Pending;
