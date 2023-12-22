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
import Dialog from "@mui/material/Dialog";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import Slide from "@mui/material/Slide";
const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const imageLink = process.env.NEXT_PUBLIC_CDN;
const videoLink = process.env.NEXT_PUBLIC_AWS;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
function Following() {
  let [open, setOpen] = useState(false)
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
      .post(`${domain}/api/follow/getMyFollowingPopulated`, config)
      .then((res) => {
        setData(res.data);
      });
  }, []);
  let [tempPilot, setTempPilot] = useState("")
  let unfollow = (id) => {
    setTempPilot(id)
    setOpen(true)
    // const config = {
    //   headers: {
    //     Authorization: "Bearer " + localStorage.getItem("access_token"),
    //   },
    // };
    // axios.post(`${domain}/api/follow/unfollow1/${id}`, config).then((res) => {
    //   axios
    //     .post(`${domain}/api/follow/getMyFollowingPopulated`, config)
    //     .then((res) => {
    //       setData(res.data);
    //     });
    // });
  };
  let confirmUnfollow = () =>{
     const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.post(`${domain}/api/follow/unfollow1/${tempPilot}`, config).then((res) => {
      axios
        .post(`${domain}/api/follow/getMyFollowingPopulated`, config)
        .then((res) => {
          setData(res.data);
          setOpen(false)
        });
    });
  }
  let viewProfile = (id) => {
    axios.post(`${domain}/api/pilot/getPilotId`, { userId: id }).then((res) => {
      Router.push(`/pilot/${res.data[0].userName}`);
    });
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
                      <Link href={`/pilot/${item.pilot.userName}`}>
                      <a className={css.sugProfilePic}>
                        <img
                          src={`${imageLink}/${item.data.profilePic}`}
                          onClick={()=>viewProfile(item.data._id, item.data.role)}
                          className = {css.sugProfilePicImg}
                        />
                      </a>
                      </Link>
                    </div>
                    <div className={css.unFollow}>
                      <GroupRemoveIcon
                        onClick={() => unfollow(item.data._id)}
                      />
                    </div>

                    <div style={{ marginTop: "10px" }}>
                      <Link href={`/pilot/${item.pilot.userName}`}>
                        <a className={css.sugName} style = {{display: "block"}}>{item.data.name}</a>
                      </Link>
                      <div className={css.sugCity}>
                        {item.pilot.pilotType === "licensed"
                          ? "Licensed Pilot"
                          : "Unlicensed Pilot"}
                      </div>
                      <div className={css.sugCity}>
                        {item.pilot.city}, {item.pilot.country}
                      </div>
                      <center>
                        <Link href={`/pilot/${item.pilot.userName}`}>
                        <a className={css.sugViewProfile} style = {{display: "inline-block"}}>
                            View Profile
                          </a>
                        </Link>
                      </center>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                          marginTop: "10px",
                          borderTop: "1px solid #bfbfbf",
                          padding: "5px 10px",
                          borderRadius: "0px 0px 10px 10px",
                        }}
                      >
                        <div className={css.widthBox}>
                          <div className={css.sugCity}>Followers</div>
                          <div className={css.sugDesc}>
                            {item.data.followers.length}
                          </div>
                        </div>
                        <div className={css.widthBox}>
                          <div className={css.sugCity}>Shots</div>
                          <div className={css.sugDesc}>{item.shots}</div>
                        </div>
                        <div
                          className={css.widthBox}
                          style={{ border: "none" }}
                        >
                          <div className={css.sugCity}>Views</div>
                          <div className={css.sugDesc}>{kFormatter(item.pilot.viewed)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Grid>
              );
            })}
          </Grid>
        </>
      )}
      <Dialog
              open={open}
              TransitionComponent={Transition}
              keepMounted
              onClose={()=>setOpen(false)}
              aria-describedby="alert-dialog-slide-description"
            >
              <div className="popupContainer">
                <ClearRoundedIcon
                  className="popupClose"
                  onClick={()=>setOpen(false)}
                />
                <div className="popupTitle" style={{ textAlign: "left" }}>
                  Unfollow Pilot?
                </div>
                <div className="popupSubTitle">
                  Are you sure you want to unfollow this pilot?
                </div>
                <center>
                  <div className="popupLoginBtn" onClick={confirmUnfollow}>
                    Unfollow
                  </div>
                </center>
              </div>
            </Dialog>
    </div>
  );
}
Following.Layout = CompanyActivities;
export default Following;
