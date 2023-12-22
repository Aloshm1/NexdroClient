import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import PilotActivities from "../../../components/layouts/PilotActivities";
import DashCss from "../../../styles/pilotDashboard.module.css";
import css from "../../../styles/center.module.css";
import axios from "axios";
import Link from "next/link";
import Router from "next/router";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
import CompanyActivities from "../../../components/layouts/CompanyActivities";
import Alert from "@mui/material/Alert";
const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const imageLink = process.env.NEXT_PUBLIC_CDN;
const videoLink = process.env.NEXT_PUBLIC_AWS;
function Followers() {
  let [data, setData] = useState([]);
  var SI_SYMBOL = ["", "K", "M", "G", "T", "P", "E"];
  let  kFormatter = (number) =>{

     var tier = Math.log10(Math.abs(number)) / 3 | 0;

     if(tier == 0) return number;
 
     var suffix = SI_SYMBOL[tier];
     var scale = Math.pow(10, tier * 3);
 
     var scaled = number / scale;
 
     return scaled.toFixed(1) + suffix;
}
  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(`${domain}/api/follow/getMyFollowersPopulated`, config)
      .then((res) => {
        setData(res.data);
      });
  }, []);
  let unfollow = (id) => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.post(`${domain}/api/follow/unfollow/${id}`, config).then((res) => {
      axios
        .post(`${domain}/api/follow/getMyFollowersPopulated`, config)
        .then((res) => {
          setData(res.data);
        });
    });
  };
  let viewProfile = (id, role) => {
    if (role == "pilot") {
      axios
        .post(`${domain}/api/pilot/getPilotId`, { userId: id })
        .then((res) => {
          Router.push(`/pilot/${res.data[0].userName}`);
        });
    }
  };
  return (
    <div>
      {/* {
         data.length == 0 ? <></> :
         <>
         <div className={DashCss.followingHead}>Following</div>
         <hr className={DashCss.followingHr} />
         </>
      } */}

      {data.length == 0 ? (
        <>
          <div className={DashCss.HideTitle}>
            <Alert severity="info">
              You dont follow anyone yet. Find the pilots{" "}
              <span style={{ textDecoration: "underline" }}>
                <Link href="/hire-pilot">here</Link>
              </span>
            </Alert>
          </div>
        </>
      ) : (
        <>
          <Grid container spacing={2}>
            {data.map((item, i) => {
              return (
                <Grid item xl={4} lg={4} md={6} sm={6} xs={12} key={i}>
                  <div className={css.sugMain}>
                    <div style={{ position: "relative" }}>
                      <img
                        src={`${imageLink}/${item.data.coverPic}`}
                        className={css.sugCoverPic}
                      />
                      <div className={css.sugProfilePic}>
                        <img
                          src={`${imageLink}/${item.data.profilePic}`}
                          onClick={()=>viewProfile(item.data._id, item.data.role)}
                          className = {css.sugProfilePicImg}
                        />
                      </div>
                    </div>
                    <div className={css.unFollow}>
                      <GroupRemoveIcon
                        onClick={() => unfollow(item.data._id)}
                      />
                    </div>

                    <div style={{ marginTop: "10px" }}>
                        <div className={css.sugName} onClick={()=>viewProfile(item.data._id, item.data.role)}>{item.data.name}</div>
                      <div className={css.sugCity}>
                        {item.data.role == "pilot" && "Pilot"}
                        {item.data.role == "service_center" && "Service Center"}
                        {item.data.role == "company" && "Company"}
                        {item.data.role == "booster" && "Nexdro User"}
                        {!item.data.role && "Nexdro User"}
                      </div>
                     
                      <center>
                          <button className={css.sugViewProfile} onClick={()=>viewProfile(item.data._id, item.data.role)} style={{opacity: item.data.role !== "pilot" ? 0.4 : 1}}>
                            View Profile
                          </button>
                      </center>

                      </div>
                  </div>
                </Grid>
              );
            })}
          </Grid>
        </>
      )}
    </div>
  );
}
Followers.Layout = PilotActivities;
export default Followers;
