import React, { useEffect, useState } from "react";
import CompanyActivities from "../../../../components/layouts/CompanyActivities";
import styles from "../../../../styles/hirePilot.module.css";
import Button from "@mui/material/Button";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DashCss from "../../../../styles/companyDashboard.module.css";
import axios from "axios";
import Router, { useRouter } from "next/router";
import Link from "next/link";
import Alert from "@mui/material/Alert";

const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const imageLink = process.env.NEXT_PUBLIC_CDN;
const videoLink = process.env.NEXT_PUBLIC_AWS;

function Pilots() {
  const router = useRouter();
  let [folderData, setFolderData] = useState({});
  let [data, setData] = useState([]);
  useEffect(() => {
    axios
      .post(`${domain}/api/folder/getFolderData`, { folderId: router.query.id })
      .then((res) => {
        setFolderData(res.data);
      });
    axios
      .post(`${domain}/api/savePilot/getSavedPilots`, {
        folderId: router.query.id,
      })
      .then((res) => {
        setData(res.data);
        console.log(res);
      });
  }, []);
  let unsavePilot = (id) => {
    let config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };

    axios
      .post(`${domain}/api/savePilot/unsavePilot`, { pilotId: id }, config)
      .then((res) => {
        axios
          .post(`${domain}/api/savePilot/getSavedPilots`, {
            folderId: router.query.id,
          })
          .then((res) => {
            setData(res.data);
            console.log(res);
          });
      });
  };
  return (
    <div>
      <div className={DashCss.title} style={{ marginBottom: "10px" }}>
        Pilots Saved in {folderData.folderName} Folder
      </div>

      <div className={"popupSubTitle"}>{folderData.description}</div>
      {data.length == 0 ? (
        <>
          <div className={"HideTitle"}><Alert severity="info">No saved pilots yet.  Find the pilots <span style={{textDecoration:"underline"}}><Link href="/hire-pilot">here</Link></span></Alert></div>
         
        </>
      ) : (
        <></>
      )}
      {data.map((item, i) => {
        return (
          <div className={styles.hirepilotItemContainer} key={i} style={{margin:"20px auto", border:"1px solid #e5e5e5", padding:"20px", borderRadius:"10px"}}>
            <div className={styles.hirepilotUserDetailsContainer}>
              <div className={styles.hirepilotUserImg} onClick = {()=>Router.push(`/pilot/${item.pilotId.userName}`)}>
                <img
                  src={
                    item.pilotId.profilePic
                      ? `${imageLink}/200x200/${item.pilotId.profilePic}`
                      : ""
                  }
                  alt=""
                  height="100%"
                  width="100%"
                  style={{ objectFit: "cover" }}
                  data-src=""
                  loading="lazy"
                />
              </div>
              <div className={styles.hirepilotUserdata}>
                <h5 onClick = {()=>Router.push(`/pilot/${item.pilotId.userName}`)}>{item.pilotId && item.pilotId.name}</h5>
                <p className={styles.hirepilotUserProfession}>
                  {item.pilotId && item.pilotId.pilotType == "licensed"
                    ? "Licensed Pilot"
                    : "Unlicensed Pilot"}
                </p>
                <p className={styles.hirepilotUserLocation}>
                  <FmdGoodOutlinedIcon
                    style={{
                      fontSize: "16px",
                      color: "#00e7fc",
                      marginRight: "5px",
                    }}
                  />{" "}
                  {item.pilotId && item.pilotId.city}
                </p>
              
              </div>
            </div>
            <div className={styles.hirepilotSalaryDetailsContainer}>
              <div>
                <div className={styles.hirepilotSalaryDetails}>
                  <h5 className={styles.hirepilotSalary}>
                    $
                    {item.pilotId.monthlyPayment
                      ? item.pilotId.monthlyPayment
                      : item.pilotId.hourlyPayment}
                  </h5>
                  <p className={styles.hirepilotSalaryType}>
                    /{item.pilotId.monthlyPayment ? "month" : "hour"}
                  </p>
                </div>
              </div>
              <div className={styles.hirepilotSalaryBtnContainer}>
                <Link href={`/pilot/${item.pilotId.userName}`}>
                  <Button
                    className={styles.hirePitonBtn}
                    style={{ marginRight: "5px", height: "fit-content" }}
                  >
                    View Profile
                  </Button>
                </Link>
                <div
                  style={{
                    background:
                      "transparent linear-gradient(323deg,#4ffea3,#00e7fc)",
                    borderRadius: "30px",
                    padding: "7px 6px 1px 6px",
                    height: "fit-content",
                    cursor: "pointer",
                  }}
                >
                  <FavoriteIcon
                    style={{ color: "#000000" }}
                    onClick={() => unsavePilot(item.pilotId._id)}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
Pilots.Layout = CompanyActivities;
export default Pilots;
