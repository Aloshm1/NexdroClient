import React, { useEffect, useState } from "react";
import PilotAccount from "../../../components/layouts/PilotAccount";
import DashCss from "../../../styles/DashboardSidebar.module.css";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import axios from "axios";
import Alert from "@mui/material/Alert";
import CenterAccount from "../../../components/layouts/CenterAccount";
import BoosterAccount from "../../../components/layouts/BoosterAccount";
const domain = process.env.NEXT_PUBLIC_LOCALHOST;

function Notifications() {
  let [edit, setEdit] = useState(false);
  let saveChanges = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(
        `${domain}/api/user/updateNotifications`,
        {
          droneNews: notifications.droneNews,
          accountPrivacy: notifications.privacy,
        },
        config
      )
      .then((res) => {
        document.getElementById("alert").style.display = "flex";
        axios.get(`${domain}/api/user/getUserData`, config).then((res) => {
          console.log(res.data);
          setNotifications({
            droneNews: res.data.droneNews,
            privacy: res.data.accountPrivacy,
          });
          setEdit(false);
          setTimeout(() => {
            if (document.getElementById("alert")) {
              document.getElementById("alert").style.display = "none";
            }
          }, 2000);
          window.scrollTo(0, 0);
        });
      });
  };
  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.get(`${domain}/api/user/getUserData`, config).then((res) => {
      console.log(res.data);
      setNotifications({
        droneNews: res.data.droneNews,
        privacy: res.data.accountPrivacy,
      });
    });
  }, []);
  let [notifications, setNotifications] = useState({
    droneNews: true,
    privacy: false,
  });
  const changeHandler = (e) => {
    let value = notifications[e.target.id];
    setNotifications({
      ...notifications,
      [e.target.id]: !value,
    });
  };

  return (
    <div>
      <div
        style={{ marginBottom: "14px", display: "none", width: "100%" }}
        id="alert"
      >
        <Alert severity="success">Notifications successfully updated!</Alert>
      </div>
      <div className={DashCss.billAddress}>
        Notifications Settings
        <span className={DashCss.editIcon} onClick={() => setEdit(true)}>
          {edit ? "" : <EditRoundedIcon sx = {{width: {xs:"20px", sm: "25px"}, height: {xs:"20px", sm: "25px"}}}/>}
        </span>
      </div>
      <hr className={DashCss.pdHr} />
      <div style={{ marginBottom: "10px" }}>
        <input
          type="checkbox"
          disabled={!edit}
          checked={notifications.droneNews}
          id="droneNews"
          onChange={changeHandler}
        />
        <label className="inputLabel ml15" htmlFor="droneNews">
          Drone Zone News
        </label>
      </div>
      <div className="inputLabelSub2">
        Get Drone Zone news, announcements and competition updates
      </div>
      <hr className={DashCss.pdHr} />
      
      
      {edit ? (
        <div className={DashCss.AddSave} onClick={saveChanges}>
          Save Changes
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
Notifications.Layout = BoosterAccount;
export default Notifications;
