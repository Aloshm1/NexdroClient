import { Container } from "@mui/system";
import React, { useEffect, useState } from "react";
import Shoot from "../styles/sotw.module.css";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import Slide from "@mui/material/Slide";
import Link from "next/link";
import Router from "next/router";
import Head from "next/head";
const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const imageLink = process.env.NEXT_PUBLIC_CDN;
const videoLink = process.env.NEXT_PUBLIC_AWS;
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export async function getServerSideProps(context) {
  const res = await fetch(`${domain}/api/shoot/getShoots`);
  const data = await res.json();
  let metaData = await fetch(`${domain}/api/seo/getSeo/shoot-of-the-week`);
  let metaDataObj = await metaData.json();
  return {
    props: {
      shoots: data,
      metaData: metaDataObj
    },
  };
}
function ShootOfWeek({ shoots, metaData }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  let [myFollowing, setMyFollowing] = useState([]);
  let [likedData, setLikedData] = useState([]);
  useEffect(() => {
    console.log(shoots)
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.post(`${domain}/api/follow/getMyFollowing`, config).then((res) => {
      const folowers = res.data;
      console.log(folowers);
      setMyFollowing(folowers);
    });
    axios.post(`${domain}/api/user/checkUser`, config).then((res) => {
      setLikedData(res.data.likedMedia);
    });
  }, []);
  let unfollow = (id) => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.post(`${domain}/api/pilot/getPilotId`, { userId: id }).then((res) => {
      console.log(res);
      axios
        .post(`${domain}/api/follow/removeFollow/${res.data[0]._id}`, config)
        .then((response) => {
          axios
            .post(`${domain}/api/follow/getMyFollowing`, config)
            .then((res) => {
              const folowers = res.data;
              console.log(folowers);
              setMyFollowing(folowers);
            });
        });
    });
  };
  let follow = (id) => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (localStorage.getItem("access_token")) {
      axios
        .post(`${domain}/api/pilot/getPilotId`, { userId: id })
        .then((res) => {
          console.log(res);
          axios
            .post(
              `${domain}/api/follow/createFollow/${res.data[0]._id}`,
              config
            )
            .then((response) => {
              axios
                .post(`${domain}/api/follow/getMyFollowing`, config)
                .then((res) => {
                  const folowers = res.data;
                  console.log(folowers);
                  setMyFollowing(folowers);
                });
              console.log(response);
            });
        });
    } else {
      console.log("login first");
      setOpen(true);
    }
  };
  let unlikeImage = (id) => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.post(`${domain}/api/image/unlikeImage/${id}`, config).then((res) => {
      axios.post(`${domain}/api/user/checkUser`, config).then((res) => {
        setLikedData(res.data.likedMedia);
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
          setLikedData(res.data.likedMedia);
        });
      });
    } else {
      //here goes popup
      setOpen(true);
    }
  };
  let redirectPilot = (id)=>{
    axios.post(`${domain}/api/pilot/getPilotId`, { userId: id }).then((res) => {
      Router.push(`/pilot/${res.data[0].userName}`)
    });
  }
  return (
    <div style={{ paddingTop: "30px" }}>
      <Head>
        <title>{metaData.title}</title>
        <meta name="keywords" content={metaData.metaKeywords} />
        <meta name="description" content={metaData.metaDescription} />
        <meta name="title" content={metaData.metaTitle} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container className="Container">
        <h2 style={{ textAlign: "center" }}>Shoots of the week</h2>
        <div className={Shoot.container}>
          {shoots.map((item, i) => {
            return (
              <div
                style={{
                  border: "1px solid #e9e9e9",
                  borderRadius: "5px",
                  marginBottom: "20px",
                }} key={i}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div>
                    <img
                      src={`${imageLink}/${item.pilotId.profilePic}`}
                      className={Shoot.profilePic}
                      style={{cursor:"pointer"}}
                      onClick={()=>redirectPilot(item.pilotId._id)}
                    />
                  </div>
                  <div style={{ marginLeft: "15px" }}>
                    <div className={Shoot.pilotName} onClick={()=>redirectPilot(item.pilotId._id)} style={{cursor:"pointer"}}>{item.pilotId.name}</div>
                    {myFollowing.includes(item.pilotId._id) ? (
                      <div
                        className={Shoot.follow}
                        onClick={() => unfollow(item.pilotId._id)}
                      >
                        Followed
                      </div>
                    ) : (
                      <div
                        className={Shoot.follow}
                        onClick={() => follow(item.pilotId._id)}
                      >
                        Follow
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ position: "relative" }}>
                  <img
                    src={`${imageLink}/${item.imageId.file}`}
                    className={Shoot.image}
                    onClick={()=>Router.push(`/image/${item.imageId.slug}`)}
                    style={{cursor: "pointer"}}
                  />
                  {item.place === 1 || item.place === 2 || item.place === 3 ? (
                    <WorkspacePremiumIcon className={Shoot.badge} />
                  ) : (
                    <></>
                  )}
                </div>
                <div style={{ marginLeft: "10px", display: "flex" }}>
                  <div className={Shoot.likes}>
                    {likedData.includes(item.imageId._id) ? (
                      <FavoriteRoundedIcon
                        sx={{
                          fontSize: "30px",
                          marginRight: "5px",
                          color: "#00e7fc",
                          cursor: "pointer",
                        }}
                        onClick={() => unlikeImage(item.imageId._id)}
                      />
                    ) : (
                      <FavoriteBorderRoundedIcon
                        sx={{
                          fontSize: "30px",
                          marginRight: "5px",
                          cursor: "pointer",
                        }}
                        onClick={() => likeImage(item.imageId._id)}
                      />
                    )}
                    <span>{item.imageId.likes.length}</span>
                  </div>
                  <div className={Shoot.likes}>
                    <RemoveRedEyeIcon
                      sx={{ fontSize: "30px", marginRight: "5px" }}
                    />{" "}
                    <span>{item.imageId.views}</span>
                  </div>
                  <div className={Shoot.likes}>
                    <ArrowCircleDownIcon
                      sx={{ fontSize: "30px", marginRight: "5px" }}
                    />{" "}
                    <span>{item.imageId.downloads.length}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
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
            You aren&#39;t logged into Nexdro. Please login to continue?
          </div>
          <center>
            <Link href="/login">
              <div className="popupLoginBtn">Login/Signup</div>
            </Link>
          </center>
        </div>
      </Dialog>
    </div>
  );
}

export default ShootOfWeek;
