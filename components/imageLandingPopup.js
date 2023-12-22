import React, { useEffect, useState } from "react";
import Ivcss from "../styles/imageView.module.css";
import Router, { useRouter } from "next/router";
import PlayCircleOutlineRoundedIcon from "@mui/icons-material/PlayCircleOutlineRounded";
import Link from "next/link";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import Grid from "@mui/material/Grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import styles from "../styles/Home.module.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import axios from "axios";
import { saveAs } from "file-saver";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
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
import { Container } from "@mui/material";
import Image from "next/image";
import DeleteIcon from '@mui/icons-material/Delete';

const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const nextDomain = process.env.NEXT_PUBLIC_BASE_URL;
const imageLink = process.env.NEXT_PUBLIC_CDN;
const videoLink = process.env.NEXT_PUBLIC_AWS;
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ImageLandingPopup() {

  const router = useRouter();
  var SI_SYMBOL = ["", "K", "M", "G", "T", "P", "E"];
  let kFormatter = (number) => {
    var tier = (Math.log10(Math.abs(number)) / 3) | 0;

    if (tier == 0) return number;

    var suffix = SI_SYMBOL[tier];
    var scale = Math.pow(10, tier * 3);

    var scaled = number / scale;

    return scaled.toFixed(1) + suffix;
  };
  let [imageLoader, setImageLoader] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [share, setShare] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  let [likedData, setLikedData] = useState([]);
  let [likedComments, setLikedComments] = useState([]);
  let [comments, setComments] = useState([]);
  let [suggestedImages, setSuggestedImages] = useState([]);
  let [currentUser, setCurrentUser] = useState({});
  let [imageCount, setImageCount] = useState({});
  let [showMoreOptions, setShowMoreOptions] = useState(false);
  let [report, setReport] = useState(false);
  let [reportInput, setReportInput] = useState("");
  let [reportSubmitSuccess, setReportSubmitSuccess] = useState(false);
  let [reportSubmitError, setReportSubmitError] = useState(false);
  let [replyCommentPopup, setReplyCommentPopup] = useState(false);
  let [replyCommentId, setReplyCommentId] = useState("");
  let [replyInput, setReplyInput] = useState("");
  let [replySuccess, setReplySuccess] = useState(false);
  let [showReplies, setShowReplies] = useState([]);

  // Props
  let [imageData, setImageData] = useState({});
  let [otherImages, setOtherImages] = useState([]);
  let [relatedImages, setRelatedImages] = useState([]);
  let [currentId, setCurrentId] = useState("");
  let [data, setData] = useState("there");
  let [metaData, setMetaData] = useState("there");
  let [replies, setReplies] = useState([])
  let [userId, setUserId] = useState("")
  let [deleteCommentReplyId, setDeleteCommentReplyId] = useState(false)
  let [deleteCommentId, setDeleteCommentId] = useState(false)

  const updateReplies = (commentsLength) => {
    var tempReplies = []
    for(var i = 0; i < commentsLength; i++){
      tempReplies.push([])
    }
    setReplies(tempReplies)
  }

  useEffect(() => {
    var currentId = router.query.image
    if(currentId){
      console.log("Entered")
      setShowReplies([])
      setImageLoader(true);
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      };
      if (data == "noData") {
        Router.push("/noComponent");
      }
      axios.get(`${domain}/api/image/imageView/${currentId}`).then((res) => {
        console.log("Incremented")
        setImageCount(res.data.imageData);
        setImageData(res.data.imageData)
        setOtherImages(res.data.otherImages)
        setComments([...res.data.comments]);
        console.log(res.data.comments)
        setShowReplies([])
        updateReplies(res.data.comments.length)
        console.log(res.data);
        setSuggestedImages(res.data.relatedImages);
        setTimeout(() => {
          setImageLoader(false);
        }, 700);
      });
      
      if (localStorage.getItem("access_token")) {
        axios.post(`${domain}/api/user/checkUser`, config).then((res) => {
          setUserId(res.data._id)
          console.log(res.data,'kpppa')
          setCurrentUser(res.data);
          setLikedData(res.data.likedMedia);
          

          
        });
        axios.post(`${domain}/api/comments/getMyComments`, config).then((res) => {
          console.log(res);
          setLikedComments(res.data);
        });
        axios.post(`${domain}/api/follow/getMyFollowing`, config).then((res) => {
          setMyFollowing(res.data);
        });
      }
    }
  }, [router.asPath]);
  let [myFollowing, setMyFollowing] = useState([]);
  let clickedOnImage = (id) => {
    axios
          .get(`${domain}/api/image/imageView/${id}`)
          .then((res) => {
            setComments([...res.data.comments]);
            console.log(res.data.comments)
            setShowReplies([])
            updateReplies(res.data.comments.length)
          });
  };
  let nextImage = () => {
    axios
      .post(`${domain}/api/image/getNextImage`, { currentId: currentId })
      .then((res) => {
        console.log(res);
        if (res.data._id) {
          axios
          .get(`${domain}/api/image/imageView/${res.data.slug}`)
          .then((res) => {
            setComments([...res.data.comments]);
            console.log(res.data.comments)
            setShowReplies([])
            updateReplies(res.data.comments.length)
          });
          Router.push(`/image/${res.data.slug}`);
        }
      });
  };
  let previousImage = () => {
    axios
      .post(`${domain}/api/image/getPreviousImage`, { currentId: currentId })
      .then((res) => {
        console.log(res);

        if (res.data._id) {
          axios
          .get(`${domain}/api/image/imageView/${res.data.slug}`)
          .then((res) => {
            setComments([...res.data.comments]);
            console.log(res.data.comments)
            setShowReplies([])
            updateReplies(res.data.comments.length)
          });
          Router.push(`/image/${res.data.slug}`);
        }
      });
  };

  const [touchStart, setTouchStart] = React.useState(0);
  const [touchEnd, setTouchEnd] = React.useState(0);

  function handleTouchStart(e) {
    console.log(e);
    console.log("started");
    setTouchStart(e.targetTouches[0].clientX);
  }

  function handleTouchMove(e) {
    console.log("moved");
    setTouchEnd(e.targetTouches[0].clientX);
  }

  function handleTouchEnd() {
    if (touchStart !== 0 && touchEnd !== 0) {
      console.log(touchStart);
      console.log(touchEnd);
      if (touchStart > touchEnd && touchStart - touchEnd > 50) {
        // do your stuff here for left swipe
        // moveSliderRight();
        console.log("right Swiped");
        nextImage();
      } else if (touchStart < touchEnd && touchStart - touchEnd < -50) {
        // do your stuff here for right swipe
        // moveSliderLeft();
        console.log("left swiped");
        previousImage();
      }
    } else {
      console.log("Same Co ordinates");
    }

    setTouchStart(0);
    setTouchEnd(0);
  }
  let [comment, setComment] = useState("");
  let commentHandler = (e) => {
    document.getElementById("commentInput").style.backgroundColor = "#f5f5f7";
    setComment(e.target.value);
  };
  let showCommentBox = () => {
    document.getElementById("commentBox").style.display = "block";
  };
  let hideCommentBox = () => {
    document.getElementById("commentBox").style.display = "none";
  };
  let unlikeImage = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(`${domain}/api/image/unlikeImage/${imageData._id}`, config)
      .then((res) => {
        setImageCount({
          ...imageCount,
          likedCount: imageCount.likedCount - 1,
        });
        axios.post(`${domain}/api/user/checkUser`, config).then((res) => {
          setLikedData(res.data.likedMedia);
        });
      });
  };
  let likeImage = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (localStorage.getItem("access_token")) {
      axios
        .post(`${domain}/api/image/likeImage/${imageData._id}`, config)
        .then((res) => {
          setImageCount({
            ...imageCount,
            likedCount: imageCount.likedCount + 1,
          });
          axios.post(`${domain}/api/user/checkUser`, config).then((res) => {
            setLikedData(res.data.likedMedia);
          });
        });
    } else {
      //here goes popup
      handleClickOpen();
    }
  };
  const redirectPilotLanding = (id) => {
    console.log(id);
    axios.post(`${domain}/api/pilot/getPilotId`, { userId: id }).then((res) => {
      if (res.data[0]) {
        Router.push(`/pilot/${res.data[0].userName}`);
      }
      console.log(res.data);
    });
  };

  let unlikeComment = (id) => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(`${domain}/api/comments/unlikeComment`, { commentId: id }, config)
      .then((res) => {
        axios
          .get(`${domain}/api/image/imageView/${imageData.slug}`)
          .then((res) => {
            setComments([...res.data.comments]);
            console.log(res.data.comments)
            setShowReplies([])
            updateReplies(res.data.comments.length)
          });
        console.log(res);
        axios
          .post(`${domain}/api/comments/getMyComments`, config)
          .then((res) => {
            setLikedComments(res.data);
          });
      });
  };
  let likeComment = (id) => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (localStorage.getItem("access_token")) {
      axios
        .post(`${domain}/api/comments/likeComment`, { commentId: id }, config)
        .then((res) => {
          axios
          .get(`${domain}/api/image/imageView/${imageData.slug}`)
          .then((res) => {
            setComments([...res.data.comments]);
            console.log(res.data.comments)
            setShowReplies([])
            updateReplies(res.data.comments.length)
          });
          console.log(res);
          axios
            .post(`${domain}/api/comments/getMyComments`, config)
            .then((res) => {
              console.log(res);
              setLikedComments(res.data);
            });
        });
    } else {
      //popup goes here
      handleClickOpen();
    }
  };
  let createComment = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (localStorage.getItem("access_token")) {
      if (comment.length <= 2 || comment.length > 200) {
        document.getElementById("commentInput").style.backgroundColor =
          "#ffcccb";
      } else {
        axios
          .post(
            `${domain}/api/comments/createComment/${imageData._id}`,
            { comment },
            config
          )
          .then((res) => {
            axios
              .get(`${domain}/api/image/imageView/${imageData.slug}`)
              .then((res) => {
                setComments([...res.data.comments]);
                console.log(res.data.comments)
                setShowReplies([])
                updateReplies(res.data.comments.length)
              });
          });
        setComment("");
        document.getElementById("commentBox").style.display = "none";
      }
    } else {
      //popup goes here
      handleClickOpen();
    }
  };
  let follow = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (localStorage.getItem("access_token")) {
      axios
        .post(`${domain}/api/pilot/getPilotId`, {
          userId: imageData.userId._id,
        })
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
      handleClickOpen();
    }
  };
  let unfollow = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(`${domain}/api/pilot/getPilotId`, { userId: imageData.userId._id })
      .then((res) => {
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
            console.log(response);
          });
      });
  };
  const downloadImage = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (localStorage.getItem("access_token")) {
      saveAs(
        `https://nexdro1.s3.ap-south-1.amazonaws.com/${imageData.file}`,
        `${imageData.file}`
      );
      axios
        .post(`${domain}/api/image/downloadImage/${imageData._id}`, config)
        .then((res) => {
          setImageCount({
            ...imageCount,
            downloadCount: imageCount.downloadCount + 1,
          });
          console.log(res.data);
        });
    } else {
      handleClickOpen();
    }
  };
  let redirectPilot = (id) => {
    axios.post(`${domain}/api/pilot/getPilotId`, { userId: id }).then((res) => {
      Router.push(`/pilot/${res.data[0].userName}`);
    });
  };
  let likeImg = (id) => {
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
        axios.get(`${domain}/api/image/imageView/${currentId}`).then((res) => {
          setSuggestedImages(res.data.relatedImages);
        });
      });
    } else {
      //here goes popup
      setOpen(true);
    }
  };

  let unlikeImg = (id) => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.post(`${domain}/api/image/unlikeImage/${id}`, config).then((res) => {
      axios.post(`${domain}/api/user/checkUser`, config).then((res) => {
        setLikedData(res.data.likedMedia);
      });
      axios.get(`${domain}/api/image/imageView/${currentId}`).then((res) => {
        setSuggestedImages(res.data.relatedImages);
      });
    });
  };
  let showUserDetails = (id) => {
    document.getElementById(`userDetails_${id}`).style.display = "flex";
  };
  let clearUserDetails = (id) => {
    document.getElementById(`userDetails_${id}`).style.display = "none";
  };
  let redirectToLanding = (id) => {
    axios.post(`${domain}/api/user/getRoute/${id}`).then((res) => {
      console.log(res);
      if (res.data !== "booster") {
        Router.push(res.data.path);
      }
    });
  };
  const showMoreOptionsHandler = () => {
    setShowMoreOptions(!showMoreOptions);
  };
  const reportChangeHandler = (e) => {
    setReportInput(e.target.value.slice(0, 150));
  };
  const submitReport = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (reportInput.length > 0) {
      var reportData = {
        message: reportInput,
        imageId: imageData._id,
      };
      axios
        .post(`${domain}/api/report/createReport`, reportData, config)
        .then((res) => {
          if (res.data !== "error") {
            setReportSubmitSuccess(true);
            console.log(res.data);
          } else {
            setReportSubmitError(true);
          }
        });
      console.log(reportInput);
      setReportInput("");
      setReport(false);
    }
  };
  const reportShot = () => {
    if (localStorage.getItem("access_token")) {
      setReport(true);
    } else {
      handleClickOpen();
    }
  };
  const replyComment = (commentId) => {
    if (localStorage.getItem("access_token")) {
      console.log(commentId);
      setReplyCommentId(commentId);
      setReplyCommentPopup(true);
    } else {
      handleClickOpen();
    }
  };
  const replyChangeHandler = (e) => {
    var value = e.target.value;
    setReplyInput(value.slice(0, 150));
  };
  const submitReply = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (replyInput.length > 0) {
      setReplyInput("");
      setReplyCommentPopup(false);
      axios.post(`${domain}/api/reply/createReply`, {commentId: replyCommentId, reply: replyInput}, config).then(res=>{
        console.log(res)
        setReplySuccess(true);
        axios
          .get(`${domain}/api/image/imageView/${imageData.slug}`)
          .then((res) => {
            setComments([...res.data.comments]);
            console.log(res.data.comments)
            setShowReplies([])
            updateReplies(res.data.comments.length)
          });
      }).catch(err=>{
        console.log(err)
        setReportSubmitError(true);
      })
    }
  };
  const showRepliesHandler = (index) => {
    getReplies(index)
    console.log(index);
    var tempShowReplies = showReplies;
    if (tempShowReplies.includes(index)) {
      tempShowReplies.splice(tempShowReplies.indexOf(index));
    } else {
      tempShowReplies.push(index);
    }
    console.log(tempShowReplies);
    setShowReplies([...tempShowReplies]);
  };

  const getReplies = (index) => {
    console.log(index)
    var tempCommentId = comments[index].comment._id
    console.log(tempCommentId)
    axios.get(`${domain}/api/reply/getReplies/${tempCommentId}`)
    .then(res => {
      console.log(res.data)
      var tempReplies = replies
      tempReplies[index] = res.data
      setReplies([...tempReplies])
    })
    .catch(err => {
      console.log("Error")
    })
  }
  const deleteComment = (id) => {
    setDeleteCommentId(id)
  }
  const deleteCommentReply = (id) => {
    setDeleteCommentReplyId(id)
  }
  const confirmCommentDelete = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.post(`${domain}/api/comments/deleteComment`, {commentId: deleteCommentId}, config)
    .then(res => {
      console.log(res.data)
      setDeleteCommentId(false)
      axios
        .get(`${domain}/api/image/imageView/${imageData.slug}`)
        .then((res) => {
          setComments([...res.data.comments]);
          console.log(res.data.comments)
          setShowReplies([])
          updateReplies(res.data.comments.length)
        });
    })
    .catch(err => {
      console.log(err.response)
      setDeleteCommentId(false)
    })
  }
  const confirmReplyDelete = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.post(`${domain}/api/reply/deleteReplyComment`, {replyId: deleteCommentReplyId}, config)
    .then(res => {
      console.log(res.data)
      setDeleteCommentReplyId(false)
      axios
        .get(`${domain}/api/image/imageView/${imageData.slug}`)
        .then((res) => {
          setComments([...res.data.comments]);
          console.log(res.data.comments)
          setShowReplies([])
          updateReplies(res.data.comments.length)
        });
    })
    .catch(err => {
      console.log(err.response)
      setDeleteCommentReplyId(false)
    })
  }

  return (
    <>
      <section className={Ivcss.mainContainer}>
        <Container maxWidth="xxl">
          <div
            style={{
              textAlign: "right",
              marginBottom: "10px",
              position: "relative",
            }}
          >
            <div className={Ivcss.viewCount}>
              <VisibilityIcon sx={{ color: "#e5e5e5" }} />
              &nbsp; {kFormatter(imageData.views)}
            </div>
            {likedData.includes(imageData._id) ? (
              <button className={Ivcss.likeBtn} onClick={unlikeImage}>
                <FavoriteIcon sx={{ color: "pink" }} />
                <span
                  style={{
                    marginLeft: "5px",
                    marginTop: "2px",
                    display: "flex",
                    alignItems: "center",
                  }}
                  id="likeImage"
                >
                  Liked&nbsp;{" "}
                </span>
                <span className={Ivcss.counts}>
                  ({kFormatter(imageCount.likedCount)})
                </span>
              </button>
            ) : (
              <button className={Ivcss.likeBtn} onClick={likeImage}>
                <FavoriteBorderIcon />
                <span
                  style={{
                    marginLeft: "5px",
                    marginTop: "2px",
                    display: "flex",
                    alignItems: "center",
                  }}
                  id="likeImage"
                >
                  Like &nbsp;
                </span>
                <span className={Ivcss.counts}>
                  {" "}
                  ({kFormatter(imageCount.likedCount)})
                </span>
              </button>
            )}

            <button className={Ivcss.downBtn} onClick={downloadImage}>
              <DownloadForOfflineIcon />
              <span
                style={{
                  marginLeft: "5px",
                  display: "flex",
                  alignItems: "center",
                }}
                id="likeImage"
              >
                Download&nbsp;
              </span>
              <span className={Ivcss.counts}>
                ({kFormatter(imageCount.downloadCount)})
              </span>
            </button>
            {/* <button
                className={Ivcss.moreBtn}
                onClick={() => setShare(true)}
              >
                <MoreVertIcon />
              </button> */}
            <button
              className={Ivcss.moreBtn}
              onClick={() => showMoreOptionsHandler()}
            >
              <MoreVertIcon />
            </button>
            {showMoreOptions ? (
              <div
                className={Ivcss.showMore}
                onMouseLeave={() => showMoreOptionsHandler()}
              >
                <div
                  className={Ivcss.showMoreOption}
                  onClick={() => setShare(true)}
                >
                  <ShareOutlinedIcon />
                  Share
                </div>
                <div className={Ivcss.showMoreOption} onClick={reportShot}>
                  <FlagOutlinedIcon />
                  Report
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className={Ivcss.ivMainHead}>{imageData.postName}</div>
          <div
            className={Ivcss.imageContainer}
            onTouchStart={(touchStartEvent) =>
              handleTouchStart(touchStartEvent)
            }
            // onTouchMove={(touchMoveEvent) => handleTouchMove(touchMoveEvent)}
            // onTouchEnd={() => handleTouchEnd()}
          >
            {imageLoader ? (
              <Skeleton
                count={1}
                style={{
                  height: "800px",
                  borderRadius: "10px",
                  marginBottom: "20px",
                  border: "1px solid #e8e8e8",
                }}
              />
            ) : (
              <>
                {imageData.fileType !== "video" ? (
                  <img
                    src={`${imageLink}/1400x0/${imageData.file}`}
                    alt={imageData.postName}
                    className={Ivcss.ivMainImage}
                    width="100%"
                    height="100%"
                  />
                ) : (
                  <video
                    className={Ivcss.ivMainImage}
                    autoPlay
                    muted
                    controls
                    controlsList="nodownload"
                  >
                    <source
                      src={`${videoLink}/${imageData.file}`}
                      type="video/mp4"
                    />
                  </video>
                )}
              </>
            )}
          </div>
          <Grid container spacing={5}>
            {/* //left */}
            <Grid item lg={8} md={8} sm={12} xs={12}>
              <div>
                {/* //profile image & name */}
                {imageData.userId ? (
                  <div className={Ivcss.userDetailsContainer}>
                    <div
                      onClick={() => redirectPilot(imageData.userId._id)}
                      className={Ivcss.userProfilePicContainer}
                    >
                      <img
                        src={
                          imageData.userId
                            ? `${imageLink}/75x75/${imageData.userId.profilePic}`
                            : `${imageLink}/${imageData.file}`
                        }
                        data-src={``}
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "cover",
                          borderRadius: "50%",
                          cursor: "pointer",
                        }}
                      />
                    </div>
                    <div>
                      <div
                        className={Ivcss.ivName}
                        onClick={() => redirectPilot(imageData.userId._id)}
                        style={{ cursor: "pointer" }}
                      >
                        {imageData.userId.name}
                      </div>
                      {myFollowing.includes(imageData.userId._id) ? (
                        <button
                          className={Ivcss.ivfollow}
                          onClick={unfollow}
                          style={{
                            pointerEvents:
                              currentUser._id === imageData.userId._id
                                ? "none"
                                : "auto",
                            opacity:
                              currentUser._id === imageData.userId._id
                                ? "0.5"
                                : "1",
                          }}
                        >
                          Followed
                        </button>
                      ) : (
                        <button
                          className={Ivcss.ivfollow}
                          onClick={follow}
                          style={{
                            pointerEvents:
                              currentUser._id === imageData.userId._id
                                ? "none"
                                : "auto",
                            opacity:
                              currentUser._id === imageData.userId._id
                                ? "0.5"
                                : "1",
                          }}
                        >
                          Follow
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <div style={{ margin: "20px 0px 10px 0px" }}>
                  <div className={Ivcss.ivHello}>{imageData.experience}</div>
                </div>
                <Grid container className={Ivcss.allCommentsContainer}>
                      <Grid
                        item
                        lg={9}
                        md={12}
                        sm={12}
                        xs={12}
                        style={{
                          borderTop: "1px solid #d5d5d5",
                          paddingTop: "15px",
                        }}
                      >
                        <button
                          className={Ivcss.ivDownloadBtn}
                          onClick={showCommentBox}
                        >
                          Add a comment
                        </button>
                        <div className={Ivcss.ivCommentTitle}>Comments</div>
                        <div style={{ display: "none" }} id="commentBox">
                          <textarea
                            type="text"
                            className="inputBox"
                            style={{
                              height: "100px",
                              resize: "none",
                              marginTop: "5px",
                              paddingTop: "10px",
                            }}
                            id="commentInput"
                            value={comment}
                            onChange={commentHandler}
                          />

                          {comment == "" ? (
                            <button
                              className={Ivcss.ivDownloadBtn}
                              onClick={hideCommentBox}
                            >
                              Close
                            </button>
                          ) : (
                            <button
                              className={Ivcss.ivDownloadBtn}
                              onClick={createComment}
                            >
                              Submit
                            </button>
                          )}
                        </div>
                        {comments.length == 0 ? (
                          <div className={Ivcss.ncy}>
                            Be the first one to appreciate
                          </div>
                        ) : (
                          <></>
                        )}
                        {comments.map((item, i) => {
                          return (
                            <>
                              <div key={i}>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginTop: "20px",
                                  }}
                                >
                                  <img
                                    src={`${imageLink}/45x45/${item.comment.userId?item.comment.userId.profilePic:""}`}
                                    style={{
                                      height: "45px",
                                      width: "45px",
                                      borderRadius: "22.5px",
                                      cursor: "pointer",
                                      border: "1px solid #c5c5c5"
                                    }}
                                    onClick={() =>
                                      redirectToLanding(item.comment.userId?item.comment.userId._id:"")
                                    }
                                    data-src={``}
                                  />{" "}
                                  <div
                                    className={`${Ivcss.ivComName} ${Ivcss.ivCommentTitle}`}
                                    onClick={() =>
                                      redirectToLanding(item.comment.userId?item.comment.userId._id:"")
                                    }
                                    style={{ cursor: "pointer" }}
                                  >
                                    {item.comment.userId?item.comment.userId.name:""}
                                  </div>
                                </div>
                                <div>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      float: "right",
                                    }}
                                  >
                                    {likedComments.includes(item.comment._id) ? (
                                      <button
                                        className={Ivcss.ivcommentLike}
                                        onClick={() => unlikeComment(item.comment._id)}
                                      >
                                        <FavoriteIcon />
                                        {item.comment.likes.length}
                                      </button>
                                    ) : (
                                      <button
                                        className={Ivcss.ivcommentLike}
                                        style={{ color: "#000000" }}
                                        onClick={() => likeComment(item.comment._id)}
                                      >
                                        <FavoriteIcon
                                          style={{ color: "#a6a6a6" }}
                                        />
                                        {item.comment.likes?item.comment.likes.length:""}
                                      </button>
                                    )}
                                    <button
                                      className={Ivcss.ivcommentLike}
                                      style={{ color: "#000000" }}
                                      onClick={() => replyComment(item.comment._id)}
                                    >
                                      Reply
                                    </button>
                                    {item.replies == 0 && item.comment.userId && userId === item.comment.userId._id
                                    ?<DeleteIcon className = {Ivcss.deleteComment} onClick = {()=>deleteComment(item.comment._id)}/>
                                    :""
                                    }
                                  </div>
                                  <div className={Ivcss.commentActual}>
                                    {item.comment.comment}
                                  </div>
                                </div>
                              </div>
                              <div className={Ivcss.commentRepliesContainer}>
                                {item.replies > 0
                                ?
                                <button className={Ivcss.commentviewReplies} onClick = {()=>showRepliesHandler(i)}>
                                  {showReplies.includes(i)?"Hide":"View"} replies ({item.replies})
                                </button>
                                :""
                                }
                                {
                                  showReplies.includes(i)?
                                  <div className={Ivcss.commentAllReplies}>
                                    {replies[i].map((reply, index) => {
                                      return (
                                        <div className={Ivcss.commentReply} key = {index}>
                                          <div
                                            className={Ivcss.commentReplyImageName}
                                          >
                                            <img
                                              src={`${imageLink}/45x45/${reply.userId.profilePic}`}
                                              className={Ivcss.commentReplyImage}
                                              onClick={() =>
                                                redirectToLanding(reply.userId._id)
                                              }
                                              data-src={``}
                                            />{" "}
                                            <div
                                              onClick={() =>
                                                redirectToLanding(reply.userId._id)
                                              }
                                              className={Ivcss.commentReplyName}
                                            >
                                              {reply.userId.name}
                                            </div>
                                          </div>
                                          <div className={Ivcss.commentReplyActual}>
                                            {reply.reply}
                                            {userId === reply.userId._id
                                            ?<DeleteIcon className = {Ivcss.deleteComment} onClick = {()=>deleteCommentReply(reply._id)} sx = {{float: "right"}}/>
                                            :""
                                            }
                                          </div>
                                        </div>
                                      )})
                                    }
                                  </div>
                                  :""
                                }
                              </div>

                              <hr className={Ivcss.ivHr} />
                            </>
                          );
                        })}
                      </Grid>
                    </Grid>
                <div></div>
              </div>
            </Grid>
            <Grid item lg={4} md={4} sm={12} xs={12}>
              <div>
                <div className={Ivcss.ivCommentTitle}>
                  More Shots from{" "}
                  {imageData.userId ? imageData.userId.name : ""}
                </div>
                <div style={{ margin: "20px 0px" }}>
                  <Grid container spacing={1}>
                    {otherImages.map((item, i) => {
                      return (
                        <Grid item lg={6} md={6} sm={4} xs={6} key={i}>
                          <Link href={router?router.asPath.replace(router.query.image, item.slug):""}
                                >
                            {item.fileType !== "video" ? (
                              <a>
                                <Image
                                  className={Ivcss.ivThumbnail}
                                  src={`${imageLink}/400x400/${item.file}`}
                                  alt={item.postName}
                                  width="100%"
                                  height="100%"
                                  layout="responsive"
                                  objectFit="cover"
                                  onClick={() => clickedOnImage(item.slug)}
                                  sx={{
                                    height: "100%",
                                    width: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              </a>
                            ) : (
                              <a>
                                <video
                                  className={Ivcss.ivThumbnail}
                                  style={{
                                    height: "100%",
                                    width: "100%",
                                    objectFit: "cover",
                                  }}
                                  onClick={() => clickedOnImage(item.slug)}
                                  playsInline
                                >
                                  <source
                                    className={Ivcss.ivThumbnail}
                                    src={`${videoLink}/${item.file}`}
                                    type="video/mp4"
                                  />
                                  <source
                                    className={Ivcss.ivThumbnail}
                                    src={`${videoLink}/${item.file}`}
                                    type="video/ogg"
                                  />
                                  Your browser does not support the video tag.
                                </video>
                              </a>
                            )}
                          </Link>
                        </Grid>
                      );
                    })}
                  </Grid>
                </div>
              </div>
            </Grid>
          </Grid>
          <div>
            <div className={Ivcss.ivName}>Shots you might like</div>
            <Grid container spacing={2} style={{ marginTop: "20px" }}>
              {suggestedImages.map((item, index) => {
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={12/5} key={index}>
                    <div className={styles.homepageOuterFileContainer}>
                      <Link href={`/?image=${item.slug}`}
                            >
                        <a className={styles.homepageFileContainer}>
                          {item.fileType !== "video" ? (
                            <figure className="figure">
                              <Image
                                className={styles.homepageFile}
                                src={`${imageLink}/500x450/${item.file}`}
                                alt={item.postName}
                                width="100%"
                                height="100%"
                                layout="responsive"
                                objectFit="cover"
                              />
                              <figcaption className="figcaption">{item.postName}</figcaption>
                            </figure>
                          ) : (
                            <>
                              <video className={styles.homepageFile} muted playsInline>
                                <source
                                  src={`${videoLink}/${item.file}`}
                                  type="video/mp4"
                                />
                                <source
                                  src={`${videoLink}/${item.file}`}
                                  type="video/ogg"
                                />
                              </video>
                              <PlayCircleOutlineRoundedIcon
                                className={styles.homepageVideoIcon}
                              />
                            </>
                          )}
                        </a>
                      </Link>
                      <div className={styles.contentOverlay}>
                        <div className={styles.homepageUserContainer}>
                          <span
                            className={styles.homepageListUserName}
                            onClick={() =>
                              redirectPilotLanding(item.userId, index)
                            }
                          >
                            <AccountCircleIcon
                              className={styles.homepageFileUserIcon}
                            />
                            <Link href="/">
                              <a
                                style={{
                                  color: "#fff",
                                  fontFamily: "roboto-regular",
                                  cursor: "pointer",
                                }}
                                id="pilotName"
                              >
                                {item.name}
                              </a>
                            </Link>
                          </span>
                          <button
                            className={styles.homepageLikesContainer}
                            style={{
                              color: "#fff",
                              fontFamily: "roboto-regular",
                              cursor: "pointer",
                            }}
                            id="pilotName"
                          >
                            {likedData.includes(item._id) ? (
                              <>
                                <FavoriteOutlinedIcon
                                  className={styles.homepageFileLikeIcon}
                                  onClick={() => unlikeImg(item._id)}
                                />
                                <span onClick={() => unlikeImg(item._id)}>{item.likes.length + 1}</span>
                              </>
                            ) : (
                              <>
                                <FavoriteBorderOutlinedIcon
                                  className={styles.homepageFileLikeIcon}
                                  onClick={() => likeImg(item._id)}
                                />
                                <span onClick={() => likeImg(item._id)}>{item.likes.length}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Grid>
                );
              })}
            </Grid>
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
                url={`${nextDomain}/image/${imageData.slug}`}
                className={Ivcss.shareBtn}
              >
                <div className={Ivcss.shareOption}>
                  <FacebookIcon
                    size={35}
                    round={true}
                    style={{ marginRight: "5px" }}
                  />
                </div>
              </FacebookShareButton>
              <LinkedinShareButton
                url={`${nextDomain}/image/${imageData.slug}`}
                className={Ivcss.shareBtn}
              >
                <div className={Ivcss.shareOption}>
                  <LinkedinIcon
                    size={35}
                    round={true}
                    style={{ marginRight: "5px" }}
                  />
                </div>
              </LinkedinShareButton>
              <TwitterShareButton
                url={`${nextDomain}/image/${imageData.slug}`}
                className={Ivcss.shareBtn}
              >
                <div className={Ivcss.shareOption}>
                  <TwitterIcon
                    size={35}
                    round={true}
                    style={{ marginRight: "5px" }}
                  />
                </div>
              </TwitterShareButton>
              <WhatsappShareButton
                url={`${nextDomain}/image/${imageData.slug}`}
                className={Ivcss.shareBtn}
              >
                <div className={Ivcss.shareOption}>
                  <WhatsappIcon
                    size={35}
                    round={true}
                    style={{ marginRight: "5px" }}
                  />
                </div>
              </WhatsappShareButton>
            </div>
          </div>
        </Dialog>
        <Dialog
          open={report}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setReport(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <div className="sharePopupContainer">
            <div className="sharePopupTitle">Report Shot</div>
            <div className={Ivcss.reportInputContainer}>
              <label htmlFor="reportInput">
                <div className="label">Your concern</div>
              </label>
              <textarea
                type="text"
                id="reportInput"
                className={`inputBox ${Ivcss.reportInput}`}
                value={reportInput}
                name="reportInput"
                onChange={reportChangeHandler}
              />
              <div>
                <button
                  className={`formBtn2 ${Ivcss.reportInputBtn}`}
                  onClick={submitReport}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </Dialog>
        <Dialog
          open={reportSubmitSuccess}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setReportSubmitSuccess(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <div className="popupContainer">
            <ClearRoundedIcon
              className="popupClose"
              onClick={() => setReportSubmitSuccess(false)}
            />
            <div className="popupTitle">
              Report added successfully. Our team will take action soon.
            </div>
            <center>
              <button
                className={`formBtn2 ${Ivcss.reportInputBtn}`}
                onClick={() => setReportSubmitSuccess(false)}
              >
                Close
              </button>
            </center>
          </div>
        </Dialog>
        <Dialog
          open={replySuccess}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setReplySuccess(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <div className="popupContainer">
            <ClearRoundedIcon
              className="popupClose"
              onClick={() => setReplySuccess(false)}
            />
            <div className="popupTitle">Replied successfully.</div>
            <center>
              <button
                className={`formBtn2 ${Ivcss.reportInputBtn}`}
                onClick={() => setReplySuccess(false)}
              >
                Close
              </button>
            </center>
          </div>
        </Dialog>
        <Dialog
          open={reportSubmitError}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setReportSubmitError(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <div className="popupContainer">
            <ClearRoundedIcon
              className="popupClose"
              onClick={() => setReportSubmitError(false)}
            />
            <div className="popupTitle">
              Something went wrong. Please try again.
            </div>
            <center>
              <button
                className={`formBtn2 ${Ivcss.reportInputBtn}`}
                onClick={() => setReportSubmitError(false)}
              >
                Close
              </button>
            </center>
          </div>
        </Dialog>
        <Dialog
          open={deleteCommentReplyId}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setDeleteCommentReplyId(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <div className="popupContainer">
            <ClearRoundedIcon
              className="popupClose"
              onClick={() => setDeleteCommentReplyId(false)}
            />
            <div className="popupTitle">
              Are you sure! you want to delete?
            </div>
            <center>
              <button
                className={`formBtn2 ${Ivcss.reportInputBtn}`}
                onClick={confirmReplyDelete}
              >
                Delete
              </button>
            </center>
          </div>
        </Dialog>
        <Dialog
          open={deleteCommentId}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setDeleteCommentId(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <div className="popupContainer">
            <ClearRoundedIcon
              className="popupClose"
              onClick={() => setDeleteCommentId(false)}
            />
            <div className="popupTitle">
              Are you sure! you want to delete?
            </div>
            <center>
              <button
                className={`formBtn2 ${Ivcss.reportInputBtn}`}
                onClick={confirmCommentDelete}
              >
                Delete
              </button>
            </center>
          </div>
        </Dialog>
        <Dialog
          open={replyCommentPopup}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setReplyCommentPopup(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <div className="sharePopupContainer">
            <div className="sharePopupTitle">Reply comment</div>
            <div className={Ivcss.reportInputContainer}>
              <label htmlFor="replyInput">
                <div className="label">Your reply</div>
              </label>
              <textarea
                type="text"
                id="replyInput"
                className={`inputBox ${Ivcss.reportInput}`}
                value={replyInput}
                name="replyInput"
                onChange={replyChangeHandler}
              />
              <div>
                <button
                  className={`formBtn2 ${Ivcss.reportInputBtn}`}
                  onClick={submitReply}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </Dialog>
      </section>
    </>
  );
}
export default ImageLandingPopup;
