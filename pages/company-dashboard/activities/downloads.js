import React, { useState, useEffect } from "react";
import PilotActivities from "../../../components/layouts/PilotActivities";
import DashCss from "../../../styles/DashboardSidebar.module.css";
import axios from "axios";
import styles from "../../../styles/Home.module.css";
import { Grid } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import Router from "next/router";
import CompanyActivities from "../../../components/layouts/CompanyActivities";
import Alert from "@mui/material/Alert";
import Link from "next/link";
import Image from "next/image";

const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const imageLink = process.env.NEXT_PUBLIC_CDN;
const videoLink = process.env.NEXT_PUBLIC_AWS;

function Downloads() {
  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (localStorage.getItem("lastTabDashboard")) {
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      };
      setSelectedTab(localStorage.getItem("lastTabDashboard"));
      axios
        .post(`${domain}/api/pilot/getDownloadedMedia`, config)
        .then((res) => {
          console.log(res.data);
          let Images = res.data.filter(
            (data) => data.fileType == localStorage.getItem("lastTabDashboard")
          );
          if (Images.length == 0) {
            document.getElementById("mediaToHide").style.display = "block";
          } else {
            document.getElementById("mediaToHide").style.display = "none";
          }
          setData(Images);
        });
    } else {
      axios
        .post(`${domain}/api/pilot/getDownloadedMedia`, config)
        .then((res) => {
          console.log(res.data);
          let Images = res.data.filter((data) => data.fileType == "image");
          if (Images.length == 0) {
            document.getElementById("mediaToHide").style.display = "block";
          } else {
            document.getElementById("mediaToHide").style.display = "none";
          }
          setData(Images);
        });
      axios
        .get(`${domain}/api/user/getUserData`, config)
        .then((res) => {
          console.log(res.data);
          setMyliked(res.data.likedMedia);
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
    setTimeout(() => {
      localStorage.removeItem("lastTabDashboard");
    }, 2000);
  }, []);
  let [myLiked, setMyliked] = useState([]);
  let [data, setData] = useState([]);
  let [selectedTab, setSelectedTab] = useState("image");
  let changeTab = (tab) => {
    setSelectedTab(tab);
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.post(`${domain}/api/pilot/getDownloadedMedia`, config).then((res) => {
      console.log(res.data);
      let Images = res.data.filter((data) => data.fileType == tab);
      if (Images.length == 0) {
        document.getElementById("mediaToHide").style.display = "block";
      } else {
        document.getElementById("mediaToHide").style.display = "none";
      }
      setData(Images);
    });
  };
  let openImageView = (id) => {
    localStorage.setItem("lastTabDashboard", selectedTab);
  };
  let profileRedirect = (id) => {
    axios.post(`${domain}/api/pilot/getPilotId`, { userId: id }).then((res) => {
      Router.push(`/pilot/${res.data[0].userName}`);
    });
  };
  let unlikeImage = (id) => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.post(`${domain}/api/image/unlikeImage/${id}`, config).then((res) => {
      axios.post(`${domain}/api/user/checkUser`, config).then((res) => {
        setMyliked(res.data.likedMedia);
      });
      axios
        .post(`${domain}/api/pilot/getDownloadedMedia`, config)
        .then((res) => {
          console.log(res.data);
          let Images = res.data.filter((data) => data.fileType == selectedTab);

          setData(Images);
        });
    });
  };
  let likeImage = (id) => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (localStorage.getItem("access_token")) {
      axios.post(`${domain}/api/image/likeImage/${id}`, config).then((res) => {
        axios.post(`${domain}/api/user/checkUser`, config).then((res) => {
          setMyliked(res.data.likedMedia);
        });
        axios
          .post(`${domain}/api/pilot/getDownloadedMedia`, config)
          .then((res) => {
            console.log(res.data);
            let Images = res.data.filter(
              (data) => data.fileType == selectedTab
            );

            setData(Images);
          });
      });
    }
  };
  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <button
          className={
            selectedTab == "image"
              ? DashCss.helpBadgesActive
              : DashCss.helpBadges
          }
          onClick={() => changeTab("image")}
        >
          Images
        </button>
        <button
          className={
            selectedTab == "video"
              ?DashCss.helpBadgesActive
              : DashCss.helpBadges
          }
          onClick={() => changeTab("video")}
        >
          Videos
        </button>
        <button
          className={
            selectedTab == "3d"
              ? DashCss.helpBadgesActive
              : DashCss.helpBadges }
          onClick={() => changeTab("3d")}
        >
          3D Images
        </button>
      </div>
      <center>
        <div id="mediaToHide" style={{ display: "none" }}>
          <Alert severity="info">No downloded {selectedTab} <Link href = "/"><a style = {{textDecoration: "underline"}}>Browse</a></Link> now</Alert>
        </div>
      </center>
      <Grid container spacing={2}>
      {data.map((item, i) => {
          return (
            <Grid item xl ={3} lg={4} md={6} sm={6} xs={12} key={i}>
              <div style={{ position: "relative", height: "100%" }}>
                {item.fileType !== "video" ? (
                  <Link href = {`/image/${item.slug}`}>
                  <a target="_blank">
                    <Image
                      className = {styles.downloadImg}
                      src={`${imageLink}/1000x902/${item.file}`}
                      priority={true}
                      alt="image"
                      width="100%"
                      height="100%"
                      layout="responsive"
                      objectFit="cover"
                    />
                  </a>
                  </Link>
                ) : (
                  <Link href = {`/image/${item.slug}`}>
                    <a target="_blank">
                      <video
                        className = {styles.downloadVideo}
                        onClick={() => openImageView(item.slug)}
                        playsInline
                      >
                        <source
                          src={`${videoLink}/${item.file}`}
                          type="video/mp4"
                        />
                        <source
                          src={`${videoLink}/${item.file}`}
                          type="video/ogg"
                        />
                        Your browser does not support the video tag.
                      </video>
                    </a>
                  </Link>
                )}
                <div className={styles.contentOverlay} onClick={() => openImageView(item.slug)} style = {{borderRadius: "5px", cursor: "pointer"}}></div>
                <div className={styles.homepageUserContainer} style = {{bottom: "0px", borderRadius: "5px", opacity: 1}}>
                  <span
                    className={styles.homepageListUserName}
                    onClick={() => profileRedirect(item.userId)}
                  >
                    <AccountCircleIcon
                      className={styles.homepageFileUserIcon}
                    />
                    {item.name}
                  </span>
                  <span className={styles.homepageLikesContainer}>
                    {myLiked.includes(item._id) ? (
                      <FavoriteOutlinedIcon
                        className={styles.homepageFileLikeIcon}
                        onClick={() => unlikeImage(item._id)}
                      />
                    ) : (
                      <FavoriteBorderOutlinedIcon
                        className={styles.homepageFileLikeIcon}
                        onClick={() => likeImage(item._id)}
                      />
                    )}
                    {item.likes.length}
                  </span>
                </div>
              </div>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}
Downloads.Layout = CompanyActivities;

export default Downloads;
