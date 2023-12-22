import React, { useEffect, useState } from "react";
import PilotAccount from "../../../components/layouts/PilotAccount";
import DashCss from "../../../styles/DashboardSidebar.module.css";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import axios from "axios";
import Alert from "@mui/material/Alert";
import CenterAccount from "../../../components/layouts/CenterAccount";
import TrainingCenterAccount from "../../../components/layouts/TrainingCenterAccount";

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
          messageAlerts: notifications.messagesMe,
          enquiresMe: notifications.enquiresMe
        },
        config
      )
      .then((res) => {
        document.getElementById("alert").style.display = "flex";
        axios.get(`${domain}/api/user/getUserData`, config).then((res) => {
          console.log(res.data);
          setNotifications({
            droneNews: res.data.droneNews,
            messagesMe: res.data.messageAlerts,
            enquiresMe: res.data.enquiresMe
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
        messagesMe: res.data.messageAlerts,
        enquiresMe: res.data.enquiresMe
      });
    });
  }, []);
  let [notifications, setNotifications] = useState({
    droneNews : false,
    messagesMe: false,
    enquiresMe: false,
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
        <Alert severity="success">Notifications settings successfully updated!</Alert>
      </div>
      <div className={DashCss.billAddress}>
        Notifications Settings
        <button style={{display:"inline"}} className={DashCss.editIcon} onClick={() => setEdit(true)}>
          {edit ? "" : <EditRoundedIcon sx = {{width: {xs:"20px", sm: "25px"}, height: {xs:"20px", sm: "25px"}}}/>}
        </button>
      </div>
      <hr className={DashCss.pdHr} />
      <div style={{ marginBottom: "10px" }}>
        <input
          type="checkbox"
          disabled={!edit}
          checked={notifications.droneNews}
          onChange={changeHandler}
          id="droneNews"
        />
        <label className="inputLabel ml15" htmlFor="droneNews">
          Nexdro drone news
        </label>
      </div>
    
        <hr className={DashCss.pdHr} />
        <div style={{ marginBottom: "10px" }}>
          <input
            type="checkbox"
            disabled={!edit}
            checked={notifications.enquiresMe}
            id="enquiresMe"
            onChange={changeHandler}
          />
          <label className="inputLabel ml15" htmlFor="enquiresMe">
            Anyone enquires my course
          </label>
        </div>
        <hr className={DashCss.pdHr} />
        <div style={{ marginBottom: "10px" }}>
          <input
            type="checkbox"
            disabled={!edit}
            checked={notifications.messagesMe}
            id="messagesMe"
            onChange={changeHandler}
          />
          <label className="inputLabel ml15" htmlFor="messagesMe">
            Anyone messages me
          </label>
        </div>
        <hr className={DashCss.pdHr} />
       
      
      {edit ? (
        <button className={DashCss.AddSave} onClick={saveChanges}>
          Save Changes
        </button>
      ) : (
        <></>
      )}
    </div>
  );
}

Notifications.Layout = TrainingCenterAccount;
export default Notifications