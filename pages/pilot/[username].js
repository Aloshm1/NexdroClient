import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { Container } from "@mui/system";

import DashCss from "../../styles/companyDashboard.module.css";
import ForumIcon from "@mui/icons-material/Forum";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Alert, Grid, IconButton } from "@mui/material";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import pilot from "../../styles/pilotLanding.module.css";
import GroupIcon from "@mui/icons-material/Group";
import HailIcon from "@mui/icons-material/Hail";
import countries from "../api/country.json";
import Dialog from "@mui/material/Dialog";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Link from "next/link";
import Slide from "@mui/material/Slide";
import ShareIcon from "@mui/icons-material/Share";
import axios from "axios";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import Head from "next/head";
import Ivcss from "../../styles/imageView.module.css";
import ImageLandingPopup from "../../components/imageLandingPopup";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import io from "socket.io-client";
import Image from "next/image";
var socket, selectedChatCompare;
const months = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const imageLink = process.env.NEXT_PUBLIC_CDN;
const videoLink = process.env.NEXT_PUBLIC_AWS;
const nextDomain = process.env.NEXT_PUBLIC_BASE_URL;
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const msg =
  "Hello, your profile and experience matches with the job requirements. Can we schedule a chat to learn more about the position?";
export async function getServerSideProps(context) {
  const { params } = context;
  const { username } = params;
  axios
    .post(`${domain}/api/pilot/viewPilotProfile/${username}`)
    .then((res) => {});
  const res = await fetch(`${domain}/api/pilot/pilotDetails/${username}`);
  const data = await res.json();
  const all = await fetch(`${domain}/api/pilot/getPilotMedia/${username}`);
  const allImages = await all.json();
  const im = await fetch(`${domain}/api/image/getUserImagesOnly/${username}`);
  const images = await im.json();
console.log(allImages,'old')
  console.log(images,'old')
  const three = await fetch(`${domain}/api/image/getUser3dOnly/${username}`);
  const threed = await three.json();
  const video = await fetch(
    `${domain}/api/image/getUserVideosOnly/${username}`
  );
  const videos = await video.json();
  const followersData = await fetch(
    `${domain}/api/follow/getUserFollowers/${username}`
  );
  const followers = await followersData.json();
  console.log(followers,'followers')
  const followingData = await fetch(
    `${domain}/api/follow/getUserFollowing/${username}`
  );
  const following = await followingData.json();
  const suggested = await fetch(
    `${domain}/api/pilot/similarPilots/${username}`
  );
  const suggestedData = await suggested.json();
  let metaData = await fetch(`${domain}/api/seo/getSeo/pilot`);
  let metaDataObj = await metaData.json();
  let education = await fetch(
    `${domain}/api/education/getPilotEducation/${username}`
  );
  let educationDetails = await education.json();
  let experience = await fetch(
    `${domain}/api/experience/getPilotExperience/${username}`
  );
  let experienceDetails = await experience.json();
  return {
    props: {
      data: data,
      allImages: allImages,
      images,
      threed,
      videos,
      followers,
      following,
      suggestedData,
      metaData: metaDataObj,
      username,
      educationDetails,
      experienceDetails,
    },
  };
}
function Index({
  data,
  allImages,
  images,
  threed,
  videos,
  followers,
  following,
  suggestedData,
  metaData,
  activity,
  username,
  educationDetails,
  experienceDetails,
}) {
  let router = useRouter();
  const [myFollowers,setMyFollowers]=useState(followers)
  let [myAllImages, setMyAllImages] = useState([]);
  let [myOnlyImages, setMyOnlyImages] = useState(images);
  let [myOnly3d, setMyonly3d] = useState(threed);
  let [myOnlyVideos, setMyOnlyVideos] = useState(videos);
  let [currentUserName, setCurrentUserName] = useState("")
  const [open, setOpen] = React.useState(false);
  const [detailPopupIndex, setDetailPopupIndex] = useState(0)
  var SI_SYMBOL = ["", "K", "M", "G", "T", "P", "E"];
  let kFormatter = (number) => {
    var tier = (Math.log10(Math.abs(number)) / 3) | 0;

    if (tier == 0) return number;

    var suffix = SI_SYMBOL[tier];
    var scale = Math.pow(10, tier * 3);

    var scaled = number / scale;

    return scaled.toFixed(1) + suffix;
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let [country, setCountry] = useState("");
  let [likedData, setLikedData] = useState([]);
  let [currentUser, setCurrentUser] = useState({});
  const [share, setShare] = React.useState(false);
  
  useEffect(() => {
    console.log(educationDetails);
    if (allImages.length > 0) {
      setTab("all");
    }
    let x = countries.filter((a) => {
      if (a.code == data.country) {
        return a;
      }
    });
    setMyAllImages([...images, ...threed, ...videos])
    console.log([...images, ...threed, ...videos]);
    if (x[0]) {
      setCountry(x[0].name);
    } else {
      setCountry(data.country);
    }
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(`${domain}/api/rearrange/getUserRearrange/${username}`, {
        fileType: "image",
      })
      .then((res) => {
        if (res.data !== "No media") {
          console.log(res);
          setMyOnlyImages(res.data.media);
        } else {
          axios
            .get(`${domain}/api/image/getUserImagesOnly/${username}`)
            .then((res) => {
              setMyOnlyImages(res.data);
            });
        }
      });
    axios
      .post(`${domain}/api/rearrange/getUserRearrange/${username}`, {
        fileType: "3d",
      })
      .then((res) => {
        if (res.data !== "No media") {
          console.log(res);
          setMyonly3d(res.data.media);
        } else {
          axios
            .get(`${domain}/api/image/getUser3dOnly/${username}`)
            .then((res) => {
              setMyonly3d(res.data);
            });
        }
      });
    axios
      .post(`${domain}/api/rearrange/getUserRearrange/${username}`, {
        fileType: "video",
      })
      .then((res) => {
        if (res.data !== "No media") {
          console.log(res);
          setMyOnlyVideos(res.data.media);
        } else {
          axios
            .get(`${domain}/api/image/getUserVideosOnly/${username}`)
            .then((res) => {
              setMyOnlyVideos(res.data);
            });
        }
      });
    if (localStorage.getItem("access_token")) {
      axios.post(`${domain}/api/user/checkUser`, config).then((res) => {
        setCurrentUser(res.data);
        setLikedData(res.data.likedMedia);
      });
      axios.post(`${domain}/api/follow/getMyFollowing`, config).then((res) => {
        setMyFollowing(res.data);
      });
    }
  }, [router.asPath]);
  let [subscriptionData, setSubscriptionData] = useState({});

  useEffect(() => {
    if(router.query.image){
      try{
        document.getElementById("toTop").scrollTo(0,0)
      }catch{
        console.log("No element")
      }
    }
    setCurrentUserName(router.query.username)
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (data.data) {
      Router.push("/noComponent");
    }
    if(data.delete && data.delete == true){
      Router.push("/noComponent");
    }
    if (localStorage.getItem("role") === "company") {
      axios
        .get(`${domain}/api/company/getCompanySubscription`, config)
        .then((res) => {
          console.log(res.data);
          setSubscriptionData(res.data);
        });
    }
  }, [router.asPath]);
  let [tab, setTab] = useState("about");
  let [myFollowing, setMyFollowing] = useState([]);
  let [followingTab, setFollowingTab] = useState("following");
  let followPilot = (id) => {
    console.log('vaadaaa')
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (!localStorage.getItem("access_token")) {
      setOpen(true);
    } else {
      axios
        .post(`${domain}/api/follow/createFollow/${id}`, config)
        .then((res) => {
          axios
            .post(`${domain}/api/follow/getMyFollowing`, config)
            .then((res) => {
              setMyFollowing(res.data);
              axios.get(
                `${domain}/api/follow/getUserFollowers/${username}`
              ).then((res)=>{
                setMyFollowers(res.data)
              })

             
            });
        });
    }
  };
  let unfollow = (id) => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(`${domain}/api/follow/removeFollow/${id}`, config)
      .then((response) => {
        axios
          .post(`${domain}/api/follow/getMyFollowing`, config)
          .then((res) => {
            const folowers = res.data;
            console.log(folowers);
            setMyFollowing(folowers);
          });
      });
  };
  let followMeId = (id) => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (localStorage.getItem("access_token")) {
      axios
        .post(`${domain}/api/pilot/getPilotId`, { userId: id })
        .then((res) => {
          axios
            .post(
              `${domain}/api/follow/createFollow/${res.data[0]._id}`,
              config
            )
            .then((response) => {
              axios
                .post(`${domain}/api/follow/getMyFollowing`, config)
                .then((res) => {
                  console.log(res.data,'ooooooh')
                  const folowers = res.data;
                  
                  console.log(folowers);
                  setMyFollowing(folowers);
                });
              console.log(response);
              // setBrands(response.data.brandOfDrones)
            });
        });
    } else {
      setOpen(true);
    }
  };
  let unfollowId = (id) => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.post(`${domain}/api/pilot/getPilotId`, { userId: id }).then((res) => {
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
          console.log(response);
          // setBrands(response.data.brandOfDrones)
        });
    });
  };
  let [open1, setOpen1] = useState(false);
  let [subscription, setSubscription] = useState(false);
  let HirePilot = () => {
    if (!localStorage.getItem("access_token")) {
      setOpen(true);
    } else if (localStorage.getItem("role") !== "company") {
      setOpen1(true);
    } else if (
      subscriptionData.proposals >= subscriptionData.subscription.directHires
    ) {
      setSubscriptionOver(true);
    } else if (!subscriptionData.subscription) {
      setSubscription(true);
    } else {
      setHire(true);
    }
  };
  let sendMail = () => {
    if (message == "") {
      document.getElementById("message_error").innerHTML =
        "Message is required";
      document.getElementById("message_error").style.display = "block";
    } else if (message !== "" && (message.length < 3 || message.length > 250)) {
      document.getElementById("message_error").innerHTML =
        "Message should be between 3-250 words";
      document.getElementById("message_error").style.display = "block";
    } else {
      if (
        subscriptionData.proposals >= subscriptionData.subscription.directHires
      ) {
        // alert("Limit Exceeded")
        setSubscriptionOver(true);
      } else {
        let config = {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        };
        axios
          .post(
            `${domain}/api/hireProposal/createProposal`,
            { pilotId: data._id, message: message },
            config
          )
          .then((res) => {
            let tempData = {
              data: res.data,
              id: currentUser._id,
            };
            socket = io(domain);
            setTimeout(() => {
              socket.emit("hello", tempData);
            }, 20);
            axios
              .get(`${domain}/api/company/getCompanySubscription`, config)
              .then((res) => {
                console.log(res.data);
                setSubscriptionData(res.data);
              });
          });
        document.getElementById("alert").style.display = "flex";
        setHire(false);
        setMessage(msg);
        setTimeout(() => {
          if (document.getElementById("alert")) {
            document.getElementById("alert").style.display = "none";
          }
        }, 4000);
      }
    }
  };
  let [message, setMessage] = useState(msg);
  let [hire, setHire] = useState(false);
  let [subscriptionOver, setSubscriptionOver] = useState(false);
  let redirectPilot = (id) => {
    axios.post(`${domain}/api/pilot/getPilotId`, { userId: id }).then((res) => {
      if (res.data[0]) Router.push(`/pilot/${res.data[0].userName}`);
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
        setLikedData(res.data.likedMedia);
      });
      if (tab == "all") {
        axios
          .post(`${domain}/api/rearrange/getUserRearrange/${username}`, {
            fileType: "image",
          })
          .then((res) => {
            if (res.data !== "No media") {
              console.log(res);
              setMyOnlyImages([...res.data.media]);
            } else {
              axios
                .get(`${domain}/api/image/getUserImagesOnly/${username}`)
                .then((res) => {
                  setMyOnlyImages([...res.data]);
                });
            }
          });
          axios
          .post(`${domain}/api/rearrange/getUserRearrange/${username}`, {
            fileType: "3d",
          })
          .then((res) => {
            if (res.data !== "No media") {
              console.log(res);
              setMyonly3d([...res.data.media]);
            } else {
              axios
                .get(`${domain}/api/image/getUser3dOnly/${username}`)
                .then((res) => {
                  setMyonly3d([...res.data]);
                });
            }
          });
          axios
          .post(`${domain}/api/rearrange/getUserRearrange/${username}`, {
            fileType: "video",
          })
          .then((res) => {
            if (res.data !== "No media") {
              console.log(res);
              setMyOnlyVideos([...res.data.media]);
            } else {
              axios
                .get(`${domain}/api/image/getUserVideosOnly/${username}`)
                .then((res) => {
                  setMyOnlyVideos([...res.data]);
                });
            }
          });
      } else if (tab == "images") {
        axios
          .post(`${domain}/api/rearrange/getUserRearrange/${username}`, {
            fileType: "image",
          })
          .then((res) => {
            if (res.data !== "No media") {
              console.log(res);
              setMyOnlyImages([...res.data.media]);
            } else {
              axios
                .get(`${domain}/api/image/getUserImagesOnly/${username}`)
                .then((res) => {
                  setMyOnlyImages([...res.data]);
                });
            }
          });
      } else if (tab == "3d") {
        axios
          .post(`${domain}/api/rearrange/getUserRearrange/${username}`, {
            fileType: "3d",
          })
          .then((res) => {
            if (res.data !== "No media") {
              console.log(res);
              setMyonly3d([...res.data.media]);
            } else {
              axios
                .get(`${domain}/api/image/getUser3dOnly/${username}`)
                .then((res) => {
                  setMyonly3d([...res.data]);
                });
            }
          });
      } else if (tab == "videos") {
        axios
          .post(`${domain}/api/rearrange/getUserRearrange/${username}`, {
            fileType: "video",
          })
          .then((res) => {
            if (res.data !== "No media") {
              console.log(res);
              setMyOnlyVideos([...res.data.media]);
            } else {
              axios
                .get(`${domain}/api/image/getUserVideosOnly/${username}`)
                .then((res) => {
                  setMyOnlyVideos([...res.data]);
                });
            }
          });
      }
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
          setLikedData([...res.data.likedMedia]);
        });
        if (tab == "all") {
          axios
            .post(`${domain}/api/rearrange/getUserRearrange/${username}`, {
              fileType: "image",
            })
            .then((res) => {
              if (res.data !== "No media") {
                console.log(res);
                setMyOnlyImages([...res.data.media]);
              } else {
                axios
                  .get(`${domain}/api/image/getUserImagesOnly/${username}`)
                  .then((res) => {
                    setMyOnlyImages([...res.data]);
                  });
              }
            });
            axios
            .post(`${domain}/api/rearrange/getUserRearrange/${username}`, {
              fileType: "3d",
            })
            .then((res) => {
              if (res.data !== "No media") {
                console.log(res);
                setMyonly3d([...res.data.media]);
              } else {
                axios
                  .get(`${domain}/api/image/getUser3dOnly/${username}`)
                  .then((res) => {
                    setMyonly3d([...res.data]);
                  });
              }
            });
            axios
            .post(`${domain}/api/rearrange/getUserRearrange/${username}`, {
              fileType: "video",
            })
            .then((res) => {
              if (res.data !== "No media") {
                console.log(res);
                setMyOnlyVideos([...res.data.media]);
              } else {
                axios
                  .get(`${domain}/api/image/getUserVideosOnly/${username}`)
                  .then((res) => {
                    setMyOnlyVideos([...res.data]);
                  });
              }
            });
        } else if (tab == "images") {
          axios
            .post(`${domain}/api/rearrange/getUserRearrange/${username}`, {
              fileType: "image",
            })
            .then((res) => {
              if (res.data !== "No media") {
                console.log(res);
                setMyOnlyImages([...res.data.media]);
              } else {
                axios
                  .get(`${domain}/api/image/getUserImagesOnly/${username}`)
                  .then((res) => {
                    setMyOnlyImages([...res.data]);
                  });
              }
            });
        } else if (tab == "3d") {
          axios
            .post(`${domain}/api/rearrange/getUserRearrange/${username}`, {
              fileType: "3d",
            })
            .then((res) => {
              if (res.data !== "No media") {
                console.log(res);
                setMyonly3d([...res.data.media]);
              } else {
                axios
                  .get(`${domain}/api/image/getUser3dOnly/${username}`)
                  .then((res) => {
                    setMyonly3d([...res.data]);
                  });
              }
            });
        } else if (tab == "videos") {
          axios
            .post(`${domain}/api/rearrange/getUserRearrange/${username}`, {
              fileType: "video",
            })
            .then((res) => {
              if (res.data !== "No media") {
                console.log(res);
                setMyOnlyVideos([...res.data.media]);
              } else {
                axios
                  .get(`${domain}/api/image/getUserVideosOnly/${username}`)
                  .then((res) => {
                    setMyOnlyVideos([...res.data]);
                  });
              }
            });
        }
      });
    } else {
      setOpen(true);
    }
  };


  const loadPrevShot = () => {
    setDetailPopupIndex(detailPopupIndex-1)
  }

  const loadNextShot = () => {
    setDetailPopupIndex(detailPopupIndex+1)
  }



  return (
    <>
      
      {data.data ? (
        <>
          <div></div>
        </>
      ) : (
        <>
        <Head>
        <title>
          {metaData.title} {data.userName}
        </title>
        <meta name="keywords" content={metaData.metaKeywords} />
        <meta name="description" content={metaData.metaDescription} />
        <meta name="title" content={metaData.metaTitle} />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:image" content={`${imageLink}/500x0/${data.profilePic}`} />
      </Head>
          <div
            style={{
              backgroundColor: "rgb(248, 248, 251)",
              paddingTop: "40px",
              paddingBottom: "40px",
              position: "relative",
            }}
          >
            <Container maxWidth="xxl">
              <Alert
                severity="success"
                id="alert"
                style={{
                  display: "none",
                  position: "sticky",
                  top: "70px",
                  border: "1px solid green",
                  zIndex: "1000",
                }}
              >
                Mail is successfully sent. Pilot will contact You!!!
              </Alert>
              <Grid container spacing={2}>
                {/* //left side code */}
                <Grid item xl={8} lg={8} md={8} sm={12} xs={12}>
                  <div
                    className = {pilot.leftSections1}
                  >
                    <div style={{ position: "relative" }}>
                      <img
                        src={`${imageLink}/${data.coverPic}`}
                        className={pilot.coverImg}
                        data-src=""
                        loading="lazy"
                        alt = {data.coverPic}
                      />
                      <div className={pilot.profilePic}>
                        <img
                          src={`${imageLink}/200x200/${data.profilePic}`}
                          data-src=""
                          loading="lazy"
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                          }}
                          alt = {data.profilePic}
                        />
                      </div>
                      <div className = {pilot.viewCountContainer}>
                        <div className={pilot.views}>
                          <IconButton className = {pilot.pilotIconBtn}>
                            <RemoveRedEyeIcon className = {pilot.pilotIcon}/>{" "}
                          </IconButton>
                          <span className={pilot.viewCount}>
                            {kFormatter(data.viewed)}
                          </span>
                        </div>
                        <button
                          className={pilot.shareBtn}
                          onClick={() => setShare(true)}
                          aria-label="share"
                        >
                          <IconButton className = {pilot.pilotIconBtn}>
                            <ShareIcon  className = {pilot.pilotIcon}/>
                          </IconButton>
                        </button>
                      </div>
                    </div>
                    <div className={pilot.cont}>
                      <div>
                        <div className={pilot.pilotName}>{data.name}</div>
                        <div className={pilot.pilotType}>
                          {data.pilotType == "unlicensed"
                            ? "Unlicensed Pilot"
                            : "Licensed Pilot"}{" "}
                          | {data.city}
                        </div>
                      </div>
                      <div className={pilot.moreDetailsContainer}>
                        <button
                          className={pilot.hireBtn}
                          onClick={HirePilot}
                          style={{
                            pointerEvents:
                              currentUser._id === data.userId ? "none" : "auto",
                            opacity:
                              currentUser._id === data.userId ? "0.5" : "1",
                          }}
                          aria-label="hire_pilot"
                        >Direct Hire
                        </button>
                        {myFollowing.includes(data.userId) ? (
                          <button
                            className={pilot.followBtn}
                            onClick={() => unfollow(data._id)}
                            style={{
                              pointerEvents:
                                currentUser._id === data.userId
                                  ? "none"
                                  : "auto",
                              opacity:
                                currentUser._id === data.userId ? "0.5" : "1",
                            }}
                            aria-label="follow"
                          >Followed
                          </button>
                        ) : (
                          <button
                            className={pilot.followBtn}
                            onClick={() => followPilot(data._id)}
                            style={{
                              pointerEvents:
                                currentUser._id === data.userId
                                  ? "none"
                                  : "auto",
                              opacity:
                                currentUser._id === data.userId ? "0.5" : "1",
                            }}
                            aria-label="follow"
                          >Follow Pilot
                          </button>
                        )}
                        {/* //views */}
                        {/* <div className={pilot.views}>
                          <RemoveRedEyeIcon />{" "}
                          <span className={pilot.viewCount}>
                            {kFormatter(data.viewed)}
                          </span>
                        </div>
                        <button
                          className={pilot.shareBtn}
                          onClick={() => setShare(true)}
                          aria-label="share"
                        >
                          <ShareIcon sx={{ color: "#8d8d8d" }} />
                        </button> */}
                      </div>
                    </div>
                  </div>
                    <div className = {pilot.pilotDetailSectionContainer}>
                      <Grid container spacing={0}>
                        <Grid
                          item
                          xl={2.4}
                          lg={2.4}
                          md={2.4}
                          sm={2.4}
                          xs={2.4}
                          onClick={() => setTab("all")}
                        >
                          <div
                            className={
                              tab == "all" ? pilot.tabActive : pilot.tab
                            }
                          >
                            All
                          </div>
                        </Grid>
                        <Grid
                          item
                          xl={2.4}
                          lg={2.4}
                          md={2.4}
                          sm={2.4}
                          xs={2.4}
                          onClick={() => setTab("images")}
                        >
                          <div
                            className={
                              tab == "images" ? pilot.tabActive : pilot.tab
                            }
                          >
                            Images
                          </div>
                        </Grid>
                        <Grid
                          item
                          xl={2.4}
                          lg={2.4}
                          md={2.4}
                          sm={2.4}
                          xs={2.4}
                          onClick={() => setTab("3d")}
                        >
                          <div
                            className={
                              tab == "3d" ? pilot.tabActive : pilot.tab
                            }
                          >
                            3D
                          </div>
                        </Grid>
                        <Grid
                          item
                          xl={2.4}
                          lg={2.4}
                          md={2.4}
                          sm={2.4}
                          xs={2.4}
                          onClick={() => setTab("videos")}
                        >
                          <div
                            className={
                              tab == "videos" ? pilot.tabActive : pilot.tab
                            }
                          >
                            Videos
                          </div>
                        </Grid>
                        <Grid
                          item
                          xl={2.4}
                          lg={2.4}
                          md={2.4}
                          sm={2.4}
                          xs={2.4}
                          onClick={() => setTab("about")}
                        >
                          <div
                            className={
                              tab == "about" ? pilot.tabActive : pilot.tab
                            }
                          >
                            About
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  <div
                    className = {pilot.leftSections}
                  >
                    <div style={{ padding: "20px 0px" }}>
                      {tab === "all" ? (
                        <>
                          {allImages.length == 0 ? (
                            <Alert severity="info" id="noDataAlert">
                              Pilot hasn&apos;t uploaded any media yet
                            </Alert>
                          ) : (
                            <></>
                          )}
                          <Grid container spacing={1}>
                            {myOnlyImages.map((item, i) => {
                              return (
                                <Grid
                                  item
                                  xl={4}
                                  lg={4}
                                  md={4}
                                  sm={6}
                                  xs={6}
                                  key={i}
                                >
                                  <div
                                    className = {pilot.shotDisplayContainer}
                                  >
                                    <div className={pilot.likeDiv}>
                                      {likedData.includes(item._id) ? (
                                        <FavoriteIcon
                                          sx={{
                                            color: "#4ffea3",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => unlikeImage(item._id)}
                                        />
                                      ) : (
                                        <FavoriteBorderIcon
                                          sx={{
                                            color: "#4ffea3",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => likeImage(item._id)}
                                        />
                                      )}

                                      <span className={pilot.likeNo}>
                                        {item.likes.length}
                                      </span>
                                    </div>
                                    <Link href={`/pilot/${currentUserName}?image=${item.slug}`} aria-label={item.slug}>
                                      <a className={pilot.imageContainer} onClick = {()=>setDetailPopupIndex(i)}>
                                          <Image
                                            className={pilot.img}
                                            src={`${imageLink}/600x540/${item.file}`}
                                            priority={true}
                                            width="100%"
                                            height="100%"
                                            layout="responsive"
                                            objectFit="cover"
                                            alt = {item.postName}
                                          />
                                      </a>
                                    </Link>
                                  </div>
                                </Grid>
                              );
                            })}
                            {myOnly3d.map((item, i) => {
                              return (
                                <Grid
                                  item
                                  xl={4}
                                  lg={4}
                                  md={4}
                                  sm={6}
                                  xs={6}
                                  key={i}
                                >
                                  <div
                                    className = {pilot.shotDisplayContainer}
                                  >
                                    <div className={pilot.likeDiv}>
                                      {likedData.includes(item._id) ? (
                                        <FavoriteIcon
                                          sx={{
                                            color: "#4ffea3",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => unlikeImage(item._id)}
                                        />
                                      ) : (
                                        <FavoriteBorderIcon
                                          sx={{
                                            color: "#4ffea3",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => likeImage(item._id)}
                                        />
                                      )}

                                      <span className={pilot.likeNo}>
                                        {item.likes.length}
                                      </span>
                                    </div>
                                    <Link href={`/pilot/${currentUserName}?image=${item.slug}`} aria-label={item.slug}>
                                      <a className={pilot.imageContainer} onClick = {()=>setDetailPopupIndex(i)}>
                                          <Image
                                            className={pilot.img}
                                            src={`${imageLink}/600x540/${item.file}`}
                                            priority={true}
                                            width="100%"
                                            height="100%"
                                            layout="responsive"
                                            objectFit="cover"
                                            alt = {item.postName}
                                          />
                                      </a>
                                    </Link>
                                  </div>
                                </Grid>
                              );
                            })}
                            {myOnlyVideos.map((item, i) => {
                              return (
                                <Grid
                                  item
                                  xl={4}
                                  lg={4}
                                  md={4}
                                  sm={6}
                                  xs={6}
                                  key={i}
                                >
                                  <div
                                    className = {pilot.shotDisplayContainer}
                                  >
                                    <div className={pilot.likeDiv}>
                                      {likedData.includes(item._id) ? (
                                        <FavoriteIcon
                                          sx={{
                                            color: "#4ffea3",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => unlikeImage(item._id)}
                                        />
                                      ) : (
                                        <FavoriteBorderIcon
                                          sx={{
                                            color: "#4ffea3",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => likeImage(item._id)}
                                        />
                                      )}

                                      <span className={pilot.likeNo}>
                                        {item.likes.length}
                                      </span>
                                    </div>
                                    <Link href={`/pilot/${currentUserName}?image=${item.slug}`} aria-label={item.slug}>
                                      <a>
                                        <video className={pilot.img} playsInline>
                                          <source
                                            src={`${videoLink}/${item.file}`}
                                          />
                                          <p>
                                            Your browser doesn&apos;t support HTML video. Here is a
                                            <Link href={`/pilot/${currentUserName}?image=${item.slug}`} aria-label={item.slug}><a>link to the video</a></Link> instead.
                                          </p>
                                        </video>
                                      </a>
                                    </Link>
                                    <PlayCircleOutlineIcon
                                      onClick={() => {
                                        Router.push(`/pilot/${currentUserName}?image=${item.slug}`);
                                      }}
                                      style={{
                                        position: "absolute",
                                        fontSize: "60px",
                                        top: "calc(50% - 30px)",
                                        left: "calc(50% - 30px)",
                                        color: "#fff",
                                        cursor: "pointer",
                                      }}
                                    />
                                  </div>
                                </Grid>
                              );
                            })}
                            {currentUser._id === data.userId && (
                              <Grid item xl={4} lg={4} md={6} sm={6} xs={12}>
                                <div className="pilotLandingAddShootContainer">
                                  <div style={{ width: "100%" }}>
                                    <p
                                      style={{
                                        textAlign: "center",
                                        fontFamily: "roboto-regular",
                                      }}
                                    >
                                      Upload your shots now.
                                    </p>
                                    <div
                                      style={{
                                        width: "fit-content",
                                        margin: "auto",
                                      }}
                                    >
                                      <button
                                        onClick={() =>
                                          Router.push("/upload-files")
                                        }
                                        className="formBtn2"
                                        style={{
                                          marginLeft: "auto",
                                          marginRight: "auto",
                                        }}
                                        aria-label="upload_files"
                                      >
                                        upload
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </Grid>
                            )}
                          </Grid>
                        </>
                      ) : (
                        <></>
                      )}
                      {tab === "images" ? (
                        <>
                          {images.length == 0 ? (
                            <Alert severity="info" id="noDataAlert">
                              Pilot hasn&apos;t uploaded any images yet
                            </Alert>
                          ) : (
                            <></>
                          )}
                          <Grid container spacing={1}>
                            {myOnlyImages.map((item, i) => {
                              return (
                                <Grid
                                  item
                                  xl={4}
                                  lg={4}
                                  md={4}
                                  sm={6}
                                  xs={6}
                                  key={i}
                                >
                                  <div
                                    style={{
                                      position: "relative",
                                      height: "100%",
                                    }}
                                  >
                                    <div className={pilot.likeDiv}>
                                      {likedData.includes(item._id) ? (
                                        <FavoriteIcon
                                          sx={{
                                            color: "#4ffea3",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => unlikeImage(item._id)}
                                        />
                                      ) : (
                                        <FavoriteBorderIcon
                                          sx={{
                                            color: "#4ffea3",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => likeImage(item._id)}
                                        />
                                      )}

                                      <span className={pilot.likeNo}>
                                        {item.likes.length}
                                      </span>
                                    </div>
                                    <Link href={`/image/${item.slug}`} aria-label={item.slug}>
                                      <a className={pilot.imageContainer}>
                                        <Image
                                          className={pilot.img}
                                          src={`${imageLink}/600x540/${item.file}`}
                                          priority={true}
                                          alt={item.postName}
                                          width="100%"
                                          height="100%"
                                          layout="responsive"
                                          objectFit="cover"
                                        />
                                      </a>
                                    </Link>
                                  </div>
                                </Grid>
                              );
                            })}
                          </Grid>
                        </>
                      ) : (
                        <></>
                      )}
                      {tab === "3d" ? (
                        <>
                          {threed.length == 0 ? (
                            <Alert severity="info" id="noDataAlert">
                              Pilot hasn&apos;t uploaded any 3d images yet
                            </Alert>
                          ) : (
                            <></>
                          )}
                          <Grid container spacing={1}>
                            {myOnly3d.map((item, i) => {
                              return (
                                <Grid
                                  item
                                  xl={4}
                                  lg={4}
                                  md={4}
                                  sm={6}
                                  xs={6}
                                  key={i}
                                >
                                  <div
                                    style={{
                                      position: "relative",
                                      height: "100%",
                                    }}
                                  >
                                    <div className={pilot.likeDiv}>
                                      {likedData.includes(item._id) ? (
                                        <FavoriteIcon
                                          sx={{
                                            color: "#4ffea3",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => unlikeImage(item._id)}
                                        />
                                      ) : (
                                        <FavoriteBorderIcon
                                          sx={{
                                            color: "#4ffea3",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => likeImage(item._id)}
                                        />
                                      )}

                                      <span className={pilot.likeNo}>
                                        {item.likes.length}
                                      </span>
                                    </div>
                                    <Link href={`/image/${item.slug}`} aria-label={item.slug}>
                                      <a className={pilot.imageContainer}>
                                        <Image
                                          className={pilot.img}
                                          src={`${imageLink}/600x540/${item.file}`}
                                          priority={true}
                                          alt={item.postName}
                                          width="100%"
                                          height="100%"
                                          layout="responsive"
                                          objectFit="cover"
                                        />
                                      </a>
                                    </Link>
                                  </div>
                                </Grid>
                              );
                            })}
                          </Grid>
                        </>
                      ) : (
                        <></>
                      )}
                      {tab === "videos" ? (
                        <>
                          {videos.length == 0 ? (
                            <Alert severity="info" id="noDataAlert">
                              Pilot hasn&apos;t uploaded any videos yet
                            </Alert>
                          ) : (
                            <></>
                          )}
                          <Grid container spacing={1}>
                            {myOnlyVideos.map((item, i) => {
                              return (
                                <Grid
                                  item
                                  xl={4}
                                  lg={4}
                                  md={4}
                                  sm={6}
                                  xs={6}
                                  key={i}
                                >
                                  <div
                                    className = {pilot.shotDisplayContainer}
                                  >
                                    <div className={pilot.likeDiv}>
                                      {likedData.includes(item._id) ? (
                                        <FavoriteIcon
                                          sx={{
                                            color: "#4ffea3",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => unlikeImage(item._id)}
                                        />
                                      ) : (
                                        <FavoriteBorderIcon
                                          sx={{
                                            color: "#4ffea3",
                                            cursor: "pointer",
                                          }}
                                          onClick={() => likeImage(item._id)}
                                        />
                                      )}

                                      <span className={pilot.likeNo}>
                                        {item.likes.length}
                                      </span>
                                    </div>
                                    <Link href={`/image/${item.slug}`} aria-label={item.slug}>
                                      <a>
                                        <video className={pilot.img} playsInline>
                                          <source
                                            src={`${videoLink}/${item.file}`}
                                          />
                                          <p>
                                            Your browser doesn&apos;t support HTML video. Here is a
                                            <Link href={`/image/${item.slug}`} aria-label={item.slug}><a>link to the video</a></Link> instead.
                                          </p>
                                        </video>
                                      </a>
                                    </Link>
                                    <PlayCircleOutlineIcon
                                      onClick={() => {
                                        Router.push(`/image/${item.slug}`);
                                      }}
                                      style={{
                                        position: "absolute",
                                        fontSize: "60px",
                                        top: "calc(50% - 30px)",
                                        left: "calc(50% - 30px)",
                                        color: "#fff",
                                        cursor: "pointer",
                                      }}
                                    />
                                  </div>
                                </Grid>
                              );
                            })}
                          </Grid>
                        </>
                      ) : (
                        <></>
                      )}
                      {tab === "about" ? (
                        <div>
                          <div className = {pilot.leftSections2}>
                            <Grid container columnSpacing={2}>
                              <Grid item xl={4} lg={6} md={6} sm={12} xs={12}>
                                <div className={pilot.pilotTitle1}>
                                  Employment:
                                  <span className={pilot.pilotData}>
                                    {data.workType == "full_time"
                                      ? "Full Time"
                                      : "Part time"}
                                  </span>
                                </div>
                              </Grid>
                              <Grid item xl={4} lg={6} md={6} sm={12} xs={12}>
                                <div className={pilot.pilotTitle1}>
                                  Pilot Type:
                                  <span className={pilot.pilotData}>
                                    {data.pilotType == "unlicensed"
                                      ? "Unlicensed Pilot"
                                      : "Licensed Pilot"}
                                  </span>
                                </div>
                              </Grid>
                              {(data.monthlyPayment || data.hourlyPayment) ? (
                                <Grid item xl={4} lg={6} md={6} sm={12} xs={12}>
                                  <div className={pilot.pilotTitle1}>
                                    Charges:
                                    <span className={pilot.pilotData}>
                                      $
                                      {data.monthlyPayment
                                        ? data.monthlyPayment === 500
                                          ? "0 - $500"
                                          : data.monthlyPayment === 1000
                                          ? "500 - $1000"
                                          : data.monthlyPayment === 5000
                                          ? "1000 - $5000"
                                          : data.monthlyPayment === 10000
                                          ? "5000 - $10000"
                                          : "10000 Above"
                                        : data.hourlyPayment + ".00"}
                                      {data.monthlyPayment ? "/month" : "/hour"}
                                    </span>
                                  </div>
                                </Grid>
                              ):""}

                              {data.trainingCenter ? (
                                <Grid item xl={4} lg={6} md={6} sm={12} xs={12}>
                                  <div className={pilot.pilotTitle1}>
                                    Trained from:
                                    <span className={pilot.pilotData}>
                                      {data.trainingCenter}
                                    </span>
                                  </div>
                                </Grid>
                              ) : (
                                <></>
                              )}

                              <Grid item xl={4} lg={6} md={6} sm={12} xs={12}>
                                <div className={pilot.pilotTitle1}>
                                  Experience:
                                  <span className={pilot.pilotData}>
                                    {data.monthlyExperience
                                      ? `${data.yearlyExperience} years and ${data.monthlyExperience} months`
                                      : "Not Mentioned"}
                                  </span>
                                </div>
                              </Grid>

                              {data.completedYear ? (
                                <Grid item xl={4} lg={6} md={6} sm={12} xs={12}>
                                  <div className={pilot.pilotTitle1}>
                                    Training completed on:
                                    <span className={pilot.pilotData}>
                                      {data.completedYear}
                                    </span>
                                  </div>
                                </Grid>
                              ) : (
                                <></>
                              )}
                            </Grid>
                            </div>
                            <div className = {pilot.leftSections2}>
                            <div>
                              {data.bio && (
                                <div className={pilot.pilotTitle}>
                                  Bio:
                                  <span
                                    className={pilot.pilotData}
                                    style={{
                                      display: "block",
                                      marginLeft: "0px",
                                    }}
                                  >
                                    {data.bio}
                                  </span>
                                </div>
                              )}
                            </div>
                            {data.skills &&
                            !(
                              data.skills.length === 1 && data.skills[0] === ""
                            ) ? (
                              <>
                                <div className={pilot.pilotTitle}>Skills:</div>
                                <div>
                                  {data.skills &&
                                    data.skills.map((item, i) => {
                                      return (
                                        <div
                                          className={pilot.skillBadge}
                                          key={i}
                                        >
                                          {item}
                                        </div>
                                      );
                                    })}
                                </div>
                              </>
                            ) : (
                              <></>
                            )}
                            </div>
                            <div className = {pilot.leftSections2}>
                            {data.industry &&
                            !(
                              data.industry.length === 1 &&
                              data.industry[0] === ""
                            ) ? (
                              <>
                                <div className={pilot.pilotTitle}>
                                  Industries:
                                </div>
                                <div>
                                  {data.industry &&
                                    data.industry.map((item, i) => {
                                      return (
                                        <div
                                          className={pilot.skillBadge}
                                          key={i}
                                        >
                                          {item}
                                        </div>
                                      );
                                    })}
                                </div>
                              </>
                            ) : (
                              <></>
                            )}
                            </div>
                            <div className = {pilot.leftSections2}>
                            {data.droneType &&
                            !(
                              data.droneType.length === 1 &&
                              data.droneType[0] === ""
                            ) ? (
                              <>
                                <div className={pilot.pilotTitle}>
                                  Drones I own:
                                </div>
                                <div>
                                  {data.droneType &&
                                    data.droneType.map((item, i) => {
                                      return (
                                        <div
                                          className={pilot.skillBadge}
                                          key={i}
                                        >
                                          {item}
                                        </div>
                                      );
                                    })}
                                </div>
                              </>
                            ) : (
                              <></>
                            )}
                            {/* //pilot Alert */}
                            {currentUser._id === data.userId &&
                            experienceDetails.length == 0 ? (
                              <div className = {pilot.leftSections2}>
                                <div className={pilot.experience}>
                                  Experience:
                                </div>
                                <Alert
                                  severity="info"
                                  sx={{ marginBottom: "10px" }}
                                >
                                  You have not added any work experience yet.
                                  Click{" "}
                                  <span style={{ textDecoration: "underline" }}>
                                    <Link
                                      href={`/pilot-dashboard/account/work`}
                                      aria-label="work"
                                    >
                                      here
                                    </Link>
                                  </span>{" "}
                                  to add now.
                                </Alert>
                              </div>
                            ) : (
                              <></>
                            )}
                            {currentUser._id === data.userId &&
                            educationDetails.length == 0 ? (
                              <div className = {pilot.leftSections2}>
                                <div className={pilot.experience}>
                                  Education:
                                </div>
                                <Alert
                                  severity="info"
                                  sx={{ marginBottom: "10px" }}
                                >
                                  You have not added any education details yet.
                                  Click{" "}
                                  <span style={{ textDecoration: "underline" }}>
                                    <Link href={`/pilot-dashboard/account`} aria-label="account">
                                      here
                                    </Link>
                                  </span>{" "}
                                  to add now.
                                </Alert>
                              </div>
                            ) : (
                              <></>
                            )}
                            <Grid container spacing={2}>
                              {experienceDetails.length > 0 && (
                                <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                                  <div className={pilot.experience}>
                                    Experience:
                                  </div>
                                  {experienceDetails.map((item, i) => {
                                    return (
                                      <div
                                        style={{ marginBottom: "10px" }}
                                        key={i}
                                      >
                                        <div className={pilot.role}>
                                          {item.role}
                                        </div>
                                        <div className={pilot.companyName}>
                                          {item.companyName} | {item.workType}
                                        </div>
                                        <div className={pilot.description}>
                                          {months[item.startDate.slice(6, 7)]}-
                                          {item.startDate.slice(0, 4)} to{" "}
                                          {item.endDate === "Present"
                                            ? item.endDate
                                            : months[item.endDate.slice(6, 7)] +
                                              "-" +
                                              item.endDate.slice(0, 4)}
                                        </div>
                                        <div className={pilot.description}>
                                          {item.location}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </Grid>
                              )}
                              {educationDetails.length > 0 && (
                                <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                                  <div className={pilot.experience}>
                                    Education:
                                  </div>
                                  {educationDetails.map((item, i) => {
                                    return (
                                      <div
                                        style={{ marginBottom: "10px" }}
                                        key={i}
                                      >
                                        <div className={pilot.role}>
                                          {item.courseName}
                                        </div>
                                        <div className={pilot.companyName}>
                                          {item.instituteName}
                                        </div>
                                        <div className={pilot.description}>
                                          {months[item.startDate.slice(6, 7)]}-
                                          {item.startDate.slice(0, 4)} to{" "}
                                          {item.endDate === "Present"
                                            ? item.endDate
                                            : months[item.endDate.slice(6, 7)] +
                                              "-" +
                                              item.endDate.slice(0, 4)}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </Grid>
                              )}
                            </Grid>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </Grid>
                {/* //right */}
                <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                  <div className={pilot.rightCont1}>
                    <div>
                      <Grid
                        container
                        spacing={0}
                        style={{ borderRadius: "10px" }}
                      >
                        <Grid
                          item
                          xl={6}
                          lg={6}
                          md={6}
                          sm={6}
                          xs={6}
                          className={pilot.followingTab}
                          onClick={() => setFollowingTab("following")}
                          style={{
                            backgroundColor:
                              followingTab == "following" ? "#ffffff" : "",
                            border: followingTab == "following" ? "none" : "",
                            borderRadius:
                              followingTab == "following" ? "15px" : "",
                          }}
                        >
                          <button aria-label="following">Following ({following.length})</button>
                        </Grid>
                        <Grid
                          item
                          xl={6}
                          lg={6}
                          md={6}
                          sm={6}
                          xs={6}
                          className={pilot.followingTab}
                          onClick={() => setFollowingTab("followers")}
                          style={{
                            backgroundColor:
                              followingTab == "followers" ? "#ffffff" : "",
                            border: followingTab == "followers" ? "none" : "",
                          }}
                        >
                          <button aria-label="followers">Followers ({followers.length})</button>
                        </Grid>
                      </Grid>
                      {followingTab == "followers" ? (
                        <>
                          {myFollowers.length == 0 ? (
                            <div className="hideSmall">No followers yet</div>
                          ) : (
                            <></>
                          )}
                          {myFollowers.map((item, i) => {
                            return (
                              <>
                                <div
                                  style={{
                                    padding:
                                      i !== followers.length - 1
                                        ? "5px 20px"
                                        : "5px 20px 20px 20px",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <div>
                                    <div
                                      onClick={() => redirectPilot(item._id)}
                                      className={pilot.followingPic}
                                      style={{
                                        pointerEvents:
                                          item.role != "pilot"
                                            ? "none"
                                            : "initial",
                                      }}
                                    >
                                      <img
                                        src={`${imageLink}/150x150/${item.profilePic}`}
                                        data-src=""
                                        loading="lazy"
                                        style={{
                                          height: "100%",
                                          width: "100%",
                                          objectFit: "contain",
                                        }}
                                        alt = {item.profilePic}
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <button
                                      className={pilot.followingName}
                                      onClick={() => redirectPilot(item._id)}
                                      style={{
                                        pointerEvents:
                                          item.role != "pilot"
                                            ? "none"
                                            : "initial",
                                      }}
                                      aria-label="following_name"
                                    >
                                      {item.name}
                                    </button>{" "}
                                    {item.role == "pilot" ? (
                                      myFollowing.includes(item._id) ? (
                                        <button
                                          className={pilot.follow}
                                          onClick={() => unfollowId(item._id)}
                                          style={{
                                            pointerEvents:
                                              currentUser._id === item._id
                                                ? "none"
                                                : "auto",
                                            opacity:
                                              currentUser._id === item._id
                                                ? "0.5"
                                                : "1",
                                          }}
                                          aria-label="follow"
                                        >
                                          Followed
                                        </button>
                                      ) : (
                                        <button
                                          className={pilot.follow}
                                          onClick={() => followMeId(item._id)}
                                          style={{
                                            pointerEvents:
                                              currentUser._id === item._id
                                                ? "none"
                                                : "auto",
                                            opacity:
                                              currentUser._id === item._id
                                                ? "0.5"
                                                : "1",
                                          }}
                                          aria-label="follow"
                                        >
                                          Follow
                                        </button>
                                      )
                                    ) : (
                                      <button
                                      
                                        className={pilot.follow}
                                        style={{
                                          opacity: "0.3",
                                          pointerEvents: "none",
                                        }}
                                        aria-label="follow"
                                      >
                                        Follow
                                      </button>
                                    )}
                                  </div>
                                </div>
                                {i !== followers.length - 1 ? (
                                  <hr
                                    style={{
                                      borderBottom: "1px solid #e5e5e5",
                                      borderTop: "none",
                                    }}
                                  />
                                ) : (
                                  ""
                                )}
                              </>
                            );
                          })}
                        </>
                      ) : (
                        <></>
                      )}
                      {followingTab == "following" ? (
                        <>
                          {following.length == 0 ? (
                            <div className="hideSmall">No followings yet</div>
                          ) : (
                            <></>
                          )}
                          {following.map((item, i) => {
                            return (
                              <>
                                <div
                                  style={{
                                    padding:
                                      i !== following.length - 1
                                        ? "5px 20px"
                                        : "5px 20px 20px 20px",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <div>
                                    <div
                                      onClick={() => redirectPilot(item._id)}
                                      className={pilot.followingPic}
                                    >
                                      <img
                                        src={`${imageLink}/150x150/${item.profilePic}`}
                                        data-src=""
                                        loading="lazy"
                                        style={{
                                          height: "100%",
                                          width: "100%",
                                          objectFit: "contain",
                                        }}
                                        alt = {item.profilePic}
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <button
                                      className={pilot.followingName}
                                      onClick={() => redirectPilot(item._id)}
                                      aria-label="following_name"
                                    >
                                      {item.name}
                                    </button>{" "}
                                    {item.role == "pilot" ? (
                                      myFollowing.includes(item._id) ? (
                                        <button
                                          className={pilot.follow}
                                          onClick={() => unfollowId(item._id)}
                                          style={{
                                            pointerEvents:
                                              currentUser._id === item._id
                                                ? "none"
                                                : "auto",
                                            opacity:
                                              currentUser._id === item._id
                                                ? "0.5"
                                                : "1",
                                          }}
                                          aria-label="unfollow"
                                        >
                                          Followed
                                        </button>
                                      ) : (
                                        <button
                                          className={pilot.follow}
                                          onClick={() => followMeId(item._id)}
                                          style={{
                                            pointerEvents:
                                              currentUser._id === item._id
                                                ? "none"
                                                : "auto",
                                            opacity:
                                              currentUser._id === item._id
                                                ? "0.5"
                                                : "1",
                                          }}
                                          aria-label="follow"
                                        >
                                          Follow
                                        </button>
                                      )
                                    ) : (
                                      <div
                                        className={pilot.follow}
                                        style={{ opacity: "0.3" }}
                                      >
                                        Follow
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {i !== following.length - 1 ? (
                                  <hr
                                    style={{
                                      borderBottom: "1px solid #e5e5e5",
                                      borderTop: "none",
                                    }}
                                  />
                                ) : (
                                  ""
                                )}
                              </>
                            );
                          })}
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                  {/* <div className={pilot.rightCont}>
                    <div className={pilot.recentActivity}>Recent Activity</div>
                    {activity.length == 0 ? (
                      <div className={pilot.noRecentActivity}>
                        No recent activity
                      </div>
                    ) : (
                      <></>
                    )}
                  
                    {activity.map((item, i) => {
                      return (
                        <div key={i}>
                          {item.name == "review" ? (
                            <Link href={`${baseDomain}${item.link}`}>
                              <div className="activity">
                                Pilot reviewed on a service center called{" "}
                                {item.centerId.centerName}
                              </div>
                            </Link>
                          ) : (
                            <></>
                          )}
                          {item.name == "comment" ? (
                            <Link href={`${baseDomain}${item.link}`}>
                              <div className="activity">
                                Pilot commented on a shot called{" "}
                                {item.imageId && item.imageId.postName}
                              </div>
                            </Link>
                          ) : (
                            <></>
                          )}
                          {item.name == "like" ? (
                            <Link href={`${baseDomain}${item.link}`}>
                              <div className="activity">
                                Pilot liked a shot called{" "}
                                {item.imageId && item.imageId.postName}
                              </div>
                            </Link>
                          ) : (
                            <></>
                          )}
                          {item.name == "follow" ? (
                            <Link href={`${baseDomain}${item.link}`}>
                              <div className="activity">
                                Pilot followed on a pilot called{" "}
                                {item.pilotId.name}
                              </div>
                            </Link>
                          ) : (
                            <></>
                          )}
                          <hr
                            style={{
                              borderBottom: "1px solid #e5e5e5",
                              borderTop: "none",
                            }}
                          />
                        </div>
                      );
                    })}
                  </div> */}
                </Grid>
              </Grid>
            </Container>
            <Dialog
              open={open}
              TransitionComponent={Transition}
              keepMounted
              onClose={handleClose}
              aria-describedby="alert-dialog-slide-description"
            >
              <div className="popupContainer">
                <ClearRoundedIcon
                  className="popupClose"
                  onClick={handleClose}
                />
                <div className="popupTitle">
                  You aren&#39;t logged into Nexdro. Please login to continue?
                </div>
                <center>
                  <Link href="/login"aria-label="login">
                    <button aria-label="login" className="popupLoginBtn">Login/Signup</button>
                  </Link>
                </center>
              </div>
            </Dialog>
            <Dialog
              open={open1}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => setOpen1(false)}
              aria-describedby="alert-dialog-slide-description"
            >
              <div className="popupContainer">
                <ClearRoundedIcon
                  className="popupClose"
                  onClick={() => setOpen1(false)}
                />
                <div className="popupTitle">
                  Only Companies can hire pilots now! Please login with company
                  Profile
                </div>
              </div>
            </Dialog>
            <Dialog
              open={hire}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => {
                setHire(false);
                setMessage("");
              }}
              aria-describedby="alert-dialog-slide-description"
            >
              <div className="popupContainer">
                <ClearRoundedIcon
                  className="popupClose"
                  onClick={() => {
                    setHire(false);
                    setMessage("");
                  }}
                />
                <div className={DashCss.title}>
                  Write a message to send to pilot?
                </div>
                <div>
                  <label className="inputLabel" htmlFor="folderName">
                    Message:
                  </label>
                  <div>
                    <textarea
                      type="text"
                      className="inputBox"
                      style={{
                        height: "150px",
                        resize: "none",
                        padding: "10px",
                      }}
                      id="folderName"
                      value={message}
                      onChange={(e) => {
                        document.getElementById("message_error").style.display =
                          "none";
                        setMessage(e.target.value);
                      }}
                    />
                    <div className="input_error_msg" id="message_error">
                      Message is required
                    </div>
                  </div>
                  <center>
                    <button aria-label="send_mail" className="popupLoginBtn" onClick={sendMail}>
                      Send Mail
                    </button>
                  </center>
                </div>
              </div>
            </Dialog>
            <Dialog
              open={subscriptionOver}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => setSubscriptionOver(false)}
              aria-describedby="alert-dialog-slide-description"
            >
              <div className="popupContainer">
                <ClearRoundedIcon
                  className="popupClose"
                  onClick={() => setSubscriptionOver(false)}
                />
                <div className="popupTitle">
                  Limit Exceeded !! Upgrade to continue{" "}
                </div>
                <center>
                  <Link href={"/company-pro"} aria-label="company_pro">
                    <button aria-label="upgrade" className="popupLoginBtn">Upgrade</button>
                  </Link>
                </center>
              </div>
            </Dialog>
            <Dialog
              open={subscription}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => setSubscription(false)}
              aria-describedby="alert-dialog-slide-description"
            >
              <div className="popupContainer">
                <ClearRoundedIcon
                  className="popupClose"
                  onClick={() => setSubscription(false)}
                />
                <div className="popupTitle">
                  You dont have an active subscription?{" "}
                </div>
                <center>
                  <Link href={"/company-pro"} aria-label="company_pro">
                    <button aria-label="subscribe" className="popupLoginBtn">Subscribe</button>
                  </Link>
                </center>
              </div>
            </Dialog>
            <Dialog
              open={share}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => setShare(false)}
              aria-describedby="alert-dialog-slide-description"
            >
              <div className="sharePopupContainer">
                <div className="sharePopupTitle">Share with social media</div>
                <div className={Ivcss.shareOptionsContainer}>
                  <FacebookShareButton
                    url={`${nextDomain}/pilot/${data.userName}`}
                    className={Ivcss.shareBtn}
                  >
                    <div className={Ivcss.shareOption}>
                      <FacebookIcon
                        size={35}
                        round={true}
                        style={{ marginRight: "10px" }}
                      />
                    </div>
                  </FacebookShareButton>
                  <LinkedinShareButton
                    url={`${nextDomain}/pilot/${data.userName}`}
                    className={Ivcss.shareBtn}
                  >
                    <div className={Ivcss.shareOption}>
                      <LinkedinIcon
                        size={35}
                        round={true}
                        style={{ marginRight: "10px" }}
                      />
                    </div>
                  </LinkedinShareButton>
                  <TwitterShareButton
                    url={`${nextDomain}/pilot/${data.userName}`}
                    className={Ivcss.shareBtn}
                  >
                    <div className={Ivcss.shareOption}>
                      <TwitterIcon
                        size={35}
                        round={true}
                        style={{ marginRight: "10px" }}
                      />
                    </div>
                  </TwitterShareButton>
                  <WhatsappShareButton
                    url={`${nextDomain}/pilot/${data.userName}`}
                    className={Ivcss.shareBtn}
                  >
                    <div className={Ivcss.shareOption}>
                      <WhatsappIcon
                        size={35}
                        round={true}
                        style={{ marginRight: "10px" }}
                      />
                    </div>
                  </WhatsappShareButton>
                </div>
              </div>
            </Dialog>
            <Dialog
              open={router.query.image}
              onClose={() => router.replace(`/pilot/${currentUserName}`)}
              TransitionComponent={Transition}
              keepMounted
              aria-describedby="alert-dialog-slide-description"
              maxWidth={"none"}
              PaperProps={{
                style: {
                  width: "100%",
                },
              }}
            >
              <section id = "toTop" style = {{height: "100%", overflow: "auto"}}>
                <ClearRoundedIcon sx = {{cursor: "pointer", position: "absolute", top: "10px", left: '10px', fontSize: "30px", zIndex: "999"}} onClick = {() => router.replace(`/pilot/${currentUserName}`)}/>
                {detailPopupIndex > 0 
                  ?<Link href = {`/pilot/${currentUserName}?image=${myAllImages[detailPopupIndex-1].slug}`} ><a onClick = {loadPrevShot} className={Ivcss.ivLeftBtnContainer} style={{ zIndex: 999 }} >  <ChevronLeftOutlinedIcon className={Ivcss.ivLeftBtn} /></a></Link>
                  :""
                }
                {detailPopupIndex < myAllImages.length-1
                  ?<Link href = {`/pilot/${currentUserName}?image=${myAllImages[detailPopupIndex+1].slug}`} ><a onClick = {loadNextShot} className={Ivcss.ivRightBtnContainer} style={{ zIndex: 999 }}><ChevronRightOutlinedIcon className={Ivcss.ivRightBtn} /></a></Link>
                  :""
                }
                <ImageLandingPopup />
              </section>
            </Dialog>
          </div>
        </>
      )}
    </>
  );
}

export default Index;
