import Grid from "@mui/material/Grid"; // Grid version 1
import * as React from "react";
import { Alert } from "@mui/material";
import { useEffect } from "react";
import Drawer from "@mui/material/Drawer";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

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
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import ShareIcon from "@mui/icons-material/Share";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import io from "socket.io-client";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Timeline from "@mui/lab/Timeline";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import Carousel from "react-material-ui-carousel";
import countries from "../../api/country.json";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import pilot from "../../../styles/pilotLanding.module.css";
import axios from "axios";
import { IconButton } from "@mui/material";
import ImageLandingPopup from "../../../components/imageLandingPopup";
import Link from "next/link";
import Dialog from "@mui/material/Dialog";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import MobileStepper from "@mui/material/MobileStepper";
import Paper from "@mui/material/Paper";
import DashCss from "../../../styles/companyDashboard.module.css";
import Container from "@mui/material/Container";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Button from "@mui/material/Button";
import styles from "../../../styles/pol.module.css";
import Image from "next/image";
import Ivcss from "../../../styles/imageView.module.css";
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
import { useState } from "react";
import DrawerComponent from "../../../components/DrawerComponent";
import Slide from "@mui/material/Slide";
import { useRouter } from "next/router";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const imageLink = process.env.NEXT_PUBLIC_CDN;
const videoLink = process.env.NEXT_PUBLIC_AWS;
const nextDomain = process.env.NEXT_PUBLIC_BASE_URL;
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


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
const msg =
  "Hello, your profile and experience matches with the job requirements. Can we schedule a chat to learn more about the position?";
var socket, selectedChatCompare;

export async function getServerSideProps(context) {
  const { params } = context;
  const { username } = params;
  const delist= await fetch(`${domain}/api/pilot/deactivatedPilots/${username}`)
  const list=await delist.json()
  
  const res = await fetch(`${domain}/api/pilot/pilotDetails/${username}`);
  const data = await res.json();

  //following
  const followersData = await fetch(
    `${domain}/api/follow/getUserFollowers/${username}`
  );
  const followers = await followersData.json();
  const followingData = await fetch(
    `${domain}/api/follow/getUserFollowing/${username}`
  );
  const following = await followingData.json();
  const all = await fetch(`${domain}/api/pilot/getPilotMedia/${username}`);
  const allImages = await all.json();
  console.log(allImages,'okii')
  const im = await fetch(`${domain}/api/image/getUserImagesOnly/${username}`);
  
  const images = await im.json();
  console.log(images,'opui')
  // const images = []
  console.log("===============================================");
  // console.log(await im.json())
  console.log("===============================================");
  let threed = []
  let videos = []
  let educationDetails = []
  let experienceDetails = {}
  if (images.data){
    return {
      props: {
        data: data,
        followers,
        following,
        allImages,
        images,
        threed,
        videos,
        educationDetails,
        username,
        experienceDetails,
        list
      },
    };
  }
  const three = await fetch(`${domain}/api/image/getUser3dOnly/${username}`);
  threed = await three.json();
  const video = await fetch(
    `${domain}/api/image/getUserVideosOnly/${username}`
  );
  videos = await video.json();
  const education = await fetch(
    `${domain}/api/education/getPilotEducation/${username}`
  );
  educationDetails = await education.json();
  const experience = await fetch(
    `${domain}/api/experience/getPilotExperience/${username}`
  );
  experienceDetails = await experience.json();
  return {
    props: {
      data: data,
      followers,
      following,
      allImages,
      images,
      threed,
      videos,
      educationDetails,
      username,
      experienceDetails,
      list
    },
  };
}
const newone = ({
  data,
  followers,
  following,
  allImages,
  images,
  threed,
  videos,
  educationDetails,
  username,
  experienceDetails,
  list,
}) => {

  const router = useRouter();
  const [myFollowers,setMyFollowers]=useState(followers)

  const [followersC, setFollowersC] = useState(followers.length);
  const [followingC, setFollowingC] = useState(following.length);
  const [currentUserName, setCurrentUserName] = useState("");
  const [followingTab, setFollowingTab] = useState("following");
  const [myFollowing, setMyFollowing] = useState([]);
  const [subscriptionData, setSubscriptionData] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [tab, setTab] = useState("images");
  const [detailPopupIndex, setDetailPopupIndex] = useState(0);
  const [myAllImages, setMyAllImages] = useState([]);
  const [myOnlyImages, setMyOnlyImages] = useState(images);
  const [open1, setOpen1] = useState(false);
  const [open, setOpen] = useState(false);
  const [myOnlyVideos, setMyOnlyVideos] = useState(videos);
  const [country, setCountry] = useState("");
  const [likedData, setLikedData] = useState([]);
  const [share, setShare] = useState(false);
  const [message, setMessage] = useState(msg);
  const [hire, setHire] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [subscriptionOver, setSubscriptionOver] = useState(false);
  const [subscription, setSubscription] = useState(false);

  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = images.length;

  let kFormatter = (number) => {
    var tier = (Math.log10(Math.abs(number)) / 3) | 0;

    if (tier == 0) return number;

    var suffix = SI_SYMBOL[tier];
    var scale = Math.pow(10, tier * 3);

    var scaled = number / scale;

    return scaled.toFixed(1) + suffix;
  };
  useEffect(()=>{
    if(list?.destatus){
      router.push('/noComponent')
    }
  })
  
  const redirectPilot = (id) => {
    axios.post(`${domain}/api/pilot/getPilotId`, { userId: id }).then((res) => {
      if (res.data[0]) router.push(`/pilot/${res.data[0].userName}`);
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const sendMail = () => {
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

  const followPilot = (id) => {
    setFollowersC((prev) => prev + 1);
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

  const unfollow = (id) => {
    followersC > 0 ? setFollowersC((prev) => prev - 1) : "";
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
          
            setMyFollowing(res.data);
            axios.get(
              `${domain}/api/follow/getUserFollowers/${username}`
            ).then((res)=>{
              setMyFollowers(res.data)
            })
          });
      });
  };
  let followMeId = (id) => {
    if(currentUser._id === data.userId){
      setFollowingC((prev) => prev + 1);
    }
    
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
  const handleFollowers = () => {
    setFollowingTab("followers");
    toggleDrawer();
  };
  const handleFollowing = () => {
    setFollowingTab("following");
    toggleDrawer();
  };
  const unfollowId = (id) => {
    if(currentUser._id === data.userId){
      followingC > 0 ? setFollowingC((prev) => prev - 1) : "";
    }
   
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
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const HirePilot = () => {
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

  useEffect(() => {
  
    if (router.query.image) {
      try {
        document.getElementById("toTop").scrollTo(0, 0);
      } catch {
        console.log("No element");
      }
    }
    setCurrentUserName(router.query.username);
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (data.data) {
      router.push("/noComponent");
    }
    if (data.delete && data.delete == true) {
      router.push("/noComponent");
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

  useEffect(() => {
    console.log(educationDetails);
    if (data.data) {
      router.push("/noComponent");
    }

    let x = countries.filter((a) => {
      if (a.code == data.country) {
        return a;
      }
    });

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
        console.log(res.data,'rearrange');
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
      if (tab == "images") {
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
        if (tab == "images") {
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
    setDetailPopupIndex(detailPopupIndex - 1);
  };

  const loadNextShot = () => {
    setDetailPopupIndex(detailPopupIndex + 1);
  };

  return (
    <>
    {list?.destatus ?(
      ''
    ):( <>
     {data.data ? (
        <>
          <div style = {{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <h2>404 | No Page Found</h2>
          </div>
        </>
      ) : (
      <Container sx={{ marginTop: "60px" }}>
        <Alert
          severity="success"
          id="alert"
          style={{
            display: "none",
            position: "sticky",
            top: "0px",
            border: "1px solid green",
            zIndex: "1000",
          }}
        >
          Mail is successfully sent. Pilot will contact You!!!
        </Alert>
        <div className={styles.main_container}>
          <div className={styles.image_container}>
            <div>
              {/* <Paper
        square
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: 50,
          pl: 2,
          bgcolor: 'background.default',
        }}
  
        
      </Paper>  */}
              {/* <AutoPlaySwipeableViews
                axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                index={activeStep}
                onChangeIndex={()=>handleStepChange(activeStep)}
                enableMouseEvents
              > */}
              <div style={{ width: "150px"  }}>
                {myOnlyVideos.length == 0 ? (
                  <Carousel   animation="slide" navButtonsAlwaysInvisible={true}>
                    <div style={{ height:'150px' }}>
                      
                      <Image
                        src={`${imageLink}/500x0/${data.profilePic}`}
                        width="150px"
                        height="150px"
                        style={{ borderRadius: "50%" }}
                        draggable="false"
                      />
                    </div>

                    <div className={styles.share_icon}>
                      <div>
                        <RemoveRedEyeIcon
                          sx={{ cursor: "pointer" }}
                          className={pilot.pilotIcon}
                        />
                        <span className={pilot.viewCount}>
                          {kFormatter(data.viewed)}
                        </span>
                      </div>
                      <div>
                        <button
                          className={pilot.shareBtn}
                          onClick={() => setShare(true)}
                          aria-label="share"
                        >
                          <IconButton className={pilot.pilotIconBtn}>
                            <ShareIcon className={pilot.pilotIcon} />
                          </IconButton>
                        </button>
                      </div>
                    </div>
                  </Carousel>
                ) : (
                  <Carousel  animation="slide" navButtonsAlwaysInvisible={true}>
                    <div style={{ height:'150px' }}>
                      
                      <Image
                        src={`${imageLink}/500x0/${data.profilePic}`}
                        width="150px"
                        height="150px"
                        style={{ borderRadius: "50%" }}
                        draggable="false"
                      />
                    </div>

                   
                      <div style={{ position: "relative", height:'150px'}}>
                        <Link
                          href={`/hire-pilot/pol/${currentUserName}?image=${myOnlyVideos[0].slug}`}
                          aria-label={myOnlyVideos[0].slug}
                        >
                          <a>
                            <video
                              className={styles.video_carousel}
                              playsInline
                            >
                              <source
                                src={`${videoLink}/${myOnlyVideos[0].file}`}
                              />
                              <p>
                                Your browser doesn&apos;t support HTML video.
                                Here is a
                                <Link
                                  href={`/hire-pilot/pol/${currentUserName}?image=${myOnlyVideos[0].slug}`}
                                  aria-label={myOnlyVideos[0].slug}
                                >
                                  <a>link to the video</a>
                                </Link>{" "}
                                instead.
                              </p>
                            </video>
                          </a>
                        </Link>
                        <PlayCircleOutlineIcon
                          onClick={() => {
                            router.push(
                              `/hire-pilot/pol/${currentUserName}?image=${myOnlyVideos[0].slug}`
                            );
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
                    

                    <div className={styles.share_icon}>
                      <div>
                        <RemoveRedEyeIcon
                          sx={{ cursor: "pointer" }}
                          className={pilot.pilotIcon}
                        />{" "}
                        <span className={pilot.viewCount}>
                          {kFormatter(data.viewed)}
                        </span>
                      </div>
                      <div>
                        <button
                          className={pilot.shareBtn}
                          onClick={() => setShare(true)}
                          aria-label="share"
                        >
                          <IconButton className={pilot.pilotIconBtn}>
                            <ShareIcon className={pilot.pilotIcon} />
                          </IconButton>
                        </button>
                      </div>
                    </div>
                  </Carousel>
                )}
              </div>
              {/* </AutoPlaySwipeableViews>
              <MobileStepper
                className="MuiMobileStepper-dotActive"
                sx={{ justifyContent:'center', marginTop:'16px'}}
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                onClick = {(e)=>console.log(e)}
              /> */}
            </div>

            <div className={styles.bio_container}>
              <div className={styles.name_container}>
                <div>
                  <h2 className={styles.name_c}>{data.userName}</h2>
                </div>

                <div>
                  {data.pilotType == "unlicensed" ? (
                    ""
                  ) : (
                    <VerifiedUserIcon
                      sx={{
                        fontSize: "26.5px",
                        paddingTop: "5px",
                        color: "#12DEAE",
                      }}
                    />
                  )}
                </div>
              </div>

              <div className={styles.loc_container}>
                <LocationOnIcon sx={{ width: "19px", height: "19px" }} />{" "}
                <p style={{ margin: 0 }} className={styles.loc_p}>
                  {data.city},{data.country}({data.workType})
                </p>
              </div>

              <div className={styles.btn_container}>
                <Button
                  sx={{
                    border: "1px solid #12E4B2",
                    borderRadius: "100px",
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                    lineHeight: "19px",
                    color: "#303F4B",
                    padding: "9px  17px 8px 18px ",
                    fontSize: "16px",
                    textAlign: "left",
                    opacity: 1,
                    width: "fit-content",
                    textTransform: "inherit",
                  }}
                  onClick={HirePilot}
                >
                  Hire Me
                </Button>
                {myFollowing.includes(data.userId) ? (
                  <Button
                    sx={{
                      fontFamily: "roboto",
                      fontWeight: "bold",
                      lineHeight: "19px",
                      color: "#303F4B",
                      padding: "9px  17px 8px 18px ",
                      fontSize: "16px",
                      textAlign: "left",
                      opacity: 1,
                      width: "fit-content",
                      textTransform: "inherit",
                      marginLeft: "2px",
                    }}
                    onClick={() => unfollow(data._id)}
                  >
                    Unfollow
                  </Button>
                ) : (
                  <Button
                    sx={{
                      fontFamily: "roboto",
                      fontWeight: "bold",
                      lineHeight: "19px",
                      color: "#303F4B",
                      padding: "9px  17px 8px 18px ",
                      fontSize: "16px",
                      textAlign: "left",
                      opacity: 1,
                      width: "fit-content",
                      textTransform: "inherit",
                      marginLeft: "2px",
                    }}
                    onClick={() => followPilot(data._id)}
                  >
                    Follow
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className={styles.fan_container}>
            <div onClick={handleFollowers} className={styles.fan_me_container}>
              <p className={styles.fan_para}>Fans of me</p>
              <h2 className={styles.fan_h}>{followersC}</h2>
            </div>

            <div onClick={handleFollowing} className={styles.fan_me_container}>
              <p className={styles.fan_para}>Fans of mine</p>
              <h2 className={styles.fan_h}>{followingC}</h2>
            </div>
          </div>
        </div>
        <div className={styles.view_selector}>
          <Button
            onClick={() => setTab("images")}
            className={
              tab == "images" ? styles.feed_option_select : styles.feed_option
            }
          >
            Images
          </Button>
          <Button
            onClick={() => setTab("videos")}
            className={
              tab == "videos" ? styles.feed_option_select : styles.feed_option
            }
          >
            Video
          </Button>
          <Button
            onClick={() => setTab("about")}
            className={
              tab == "about" ? styles.feed_option_select : styles.feed_option
            }
            sx={{ marginRight: 0 }}
          >
            About
          </Button>
        </div>
        {tab === "images" ? (
          images.length == 0 ? (
            <>
              <Alert
                severity="info"
                id="noDataAlert"
                sx={{ marginBottom: "60px", marginTop: "26px" }}
              >
                Pilot hasn&apos;t uploaded any images yet
              </Alert>
              {currentUser._id === data.userId && (
                <Grid
                  container
                  spacing={2.8}
                  sx={{ marginTop: "0px", marginBottom: "60px" }}
                >
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
                            onClick={() => router.push("/upload-files")}
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
                </Grid>
              )}
            </>
          ) : (
            <>
              <Grid
                container
                spacing={2.8}
                sx={{ marginTop: "0px", marginBottom: "60px" }}
              >
                {myOnlyImages.map((item, i) => (
                  <Grid
                    key={i}
                    sx={{ height: { xs: "200px", sm: "340px" } }}
                    item
                    xs={6}
                    md={4}
                    lg={i % 3 === 0 ? 6 : 3}
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
                      <Link
                        href={`/hire-pilot/pol/${currentUserName}?image=${item.slug}`}
                        aria-label={item.slug}
                      >
                        <img
                          className={styles.img_pilot_land}
                          src={`${imageLink}/600x540/${item.file}`}
                          alt={item}
                        />
                      </Link>
                    </div>
                  </Grid>
                ))}
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
                            onClick={() => router.push("/upload-files")}
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
          )
        ) : (
          <></>
        )}
        {tab === "videos" ? (
          myOnlyVideos.length == 0 ? (
            <>
              <Alert
                severity="info"
                id="noDataAlert"
                sx={{ marginBottom: "60px", marginTop: "26px" }}
              >
                Pilot hasn&apos;t uploaded any videos yet
              </Alert>
              {currentUser._id === data.userId && (
                <Grid
                  container
                  spacing={2.8}
                  sx={{ marginTop: "0px", marginBottom: "60px" }}
                >
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
                            onClick={() => router.push("/upload-files")}
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
                </Grid>
              )}
            </>
          ) : (
            <>
              <Grid
                container
                spacing={2.8}
                sx={{ marginTop: "0px", marginBottom: "60px" }}
              >
                {myOnlyVideos.map((item, i) => (
                  <Grid
                    key={i}
                    sx={{
                      height: { xs: "200px", sm: "340px" },
                      position: "relative",
                    }}
                    item
                    xs={6}
                    md={4}
                    lg={i % 3 === 0 ? 6 : 3}
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
                      <Link
                        href={`/hire-pilot/pol/${currentUserName}?image=${item.slug}`}
                        aria-label={item.slug}
                      >
                        <a>
                          <video className={styles.img_pilot_land} playsInline>
                            <source src={`${videoLink}/${item.file}`} />
                            <p>
                              Your browser doesn&apos;t support HTML video. Here
                              is a
                              <Link
                                href={`/hire-pilot/pol/${currentUserName}?image=${item.slug}`}
                                aria-label={item.slug}
                              >
                                <a>link to the video</a>
                              </Link>{" "}
                              instead.
                            </p>
                          </video>
                        </a>
                      </Link>
                      <PlayCircleOutlineIcon
                        onClick={() => {
                          router.push(
                            `/hire-pilot/pol/${currentUserName}?image=${item.slug}`
                          );
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
                ))}

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
                            onClick={() => router.push("/upload-files")}
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
          )
        ) : (
          <></>
        )}{" "}
        {tab === "about" ? (
          <div>
            <div className={pilot.leftSections2}>
              <Grid container columnSpacing={2}>
                <Grid item xl={4} lg={6} md={6} sm={12} xs={12}>
                  <div className={pilot.pilotTitle1}>
                    Employment:
                    <span className={pilot.pilotData}>
                      {data.workType == "full_time" ? "Full Time" : "Part time"}
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
                {data.monthlyPayment || data.hourlyPayment ? (
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
                ) : (
                  ""
                )}

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
            <div className={pilot.leftSections2}>
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
              !(data.skills.length === 1 && data.skills[0] === "") ? (
                <>
                  <div className={pilot.pilotTitle}>Skills:</div>
                  <div>
                    {data.skills &&
                      data.skills.map((item, i) => {
                        return (
                          <div className={pilot.skillBadge} key={i}>
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
            <div className={pilot.leftSections2}>
              {data.industry &&
              !(data.industry.length === 1 && data.industry[0] === "") ? (
                <>
                  <div className={pilot.pilotTitle}>Industries:</div>
                  <div>
                    {data.industry &&
                      data.industry.map((item, i) => {
                        return (
                          <div className={pilot.skillBadge} key={i}>
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
            <div className={pilot.leftSections2}>
              {data.droneType &&
              !(data.droneType.length === 1 && data.droneType[0] === "") ? (
                <>
                  <div className={pilot.pilotTitle}>Drones I own:</div>
                  <div>
                    {data.droneType &&
                      data.droneType.map((item, i) => {
                        return (
                          <div className={pilot.skillBadge} key={i}>
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
                <div className={pilot.leftSections2}>
                  <div className={pilot.experience}>Experience:</div>
                  <Alert severity="info" sx={{ marginBottom: "10px" }}>
                    You have not added any work experience yet. Click{" "}
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
                <div className={pilot.leftSections2}>
                  <div className={pilot.experience}>Education:</div>
                  <Alert severity="info" sx={{ marginBottom: "10px" }}>
                    You have not added any education details yet. Click{" "}
                    <span style={{ textDecoration: "underline" }}>
                      <Link
                        href={`/pilot-dashboard/account`}
                        aria-label="account"
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
              <Grid container spacing={2}>
                {experienceDetails.length > 0 && (
                  <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                    <div className={pilot.experience}>Experience:</div>
                    {experienceDetails.map((item, i) => {
                      return (
                        <div style={{ marginBottom: "10px" }} key={i}>
                          <div className={pilot.role}>{item.role}</div>
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
                    <div className={pilot.experience}>Education:</div>
                    {educationDetails.map((item, i) => {
                      return (
                        <div style={{ marginBottom: "10px" }} key={i}>
                          <div className={pilot.role}>{item.courseName}</div>
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
        <Dialog
          open={router.query.image}
          onClose={() => router.replace(`/hire-pilot/pol/${currentUserName}`)}
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
          <section id="toTop" style={{ height: "100%", overflow: "auto" }}>
            <ClearRoundedIcon
              sx={{
                cursor: "pointer",
                position: "absolute",
                top: "10px",
                left: "10px",
                fontSize: "30px",
                zIndex: "999",
              }}
              onClick={() =>
                router.replace(`/hire-pilot/pol/${currentUserName}`)
              }
            />
            {detailPopupIndex > 0 ? (
              <Link
                href={`/hire-pilot/pol/${currentUserName}?image=${
                  myAllImages[detailPopupIndex - 1].slug
                }`}
              >
                <a
                  onClick={loadPrevShot}
                  className={Ivcss.ivLeftBtnContainer}
                  style={{ zIndex: 999 }}
                >
                  {" "}
                  <ChevronLeftOutlinedIcon className={Ivcss.ivLeftBtn} />
                </a>
              </Link>
            ) : (
              ""
            )}
            {detailPopupIndex < myAllImages.length - 1 ? (
              <Link
                href={`/hire-pilot/pol/${currentUserName}?image=${
                  myAllImages[detailPopupIndex + 1].slug
                }`}
              >
                <a
                  onClick={loadNextShot}
                  className={Ivcss.ivRightBtnContainer}
                  style={{ zIndex: 999 }}
                >
                  <ChevronRightOutlinedIcon className={Ivcss.ivRightBtn} />
                </a>
              </Link>
            ) : (
              ""
            )}
            <ImageLandingPopup    />
          </section>
        </Dialog>
        {/* hire */}
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
              <Link href="/login" aria-label="login">
                <button aria-label="login" className="popupLoginBtn">
                  Login/Signup
                </button>
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
                <button
                  aria-label="send_mail"
                  className="popupLoginBtn"
                  onClick={sendMail}
                >
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
                <button aria-label="upgrade" className="popupLoginBtn">
                  Upgrade
                </button>
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
                <button aria-label="subscribe" className="popupLoginBtn">
                  Subscribe
                </button>
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
        <Drawer
          PaperProps={{
            style: {
              width: 300,
            },
          }}
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <div role="presentation" style={{ marginTop: "20px" }}>
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
                                item.role != "pilot" ? "none" : "initial",
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
                              alt={item.profilePic}
                            />
                          </div>
                        </div>
                        <div>
                          <button
                            className={pilot.followingName}
                            onClick={() => redirectPilot(item._id)}
                            style={{
                              pointerEvents:
                                item.role != "pilot" ? "none" : "initial",
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
                                    currentUser._id === item._id ? "0.5" : "1",
                                }}
                                aria-label="follow"
                              >
                                Unfollow
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
                                    currentUser._id === item._id ? "0.5" : "1",
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
                              alt={item.profilePic}
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
                                    currentUser._id === item._id ? "0.5" : "1",
                                }}
                                aria-label="unfollow"
                              >
                                Unfollow
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
                                    currentUser._id === item._id ? "0.5" : "1",
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
        </Drawer>
      </Container>
      )}
      </>
      )}
    </>
  );
};
export default newone;
