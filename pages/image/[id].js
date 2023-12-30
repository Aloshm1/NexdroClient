import React, { useEffect, useState } from "react";
import Ivcss from "../../styles/imageView.module.css";
import Router, { useRouter } from "next/router";
import PlayCircleOutlineRoundedIcon from "@mui/icons-material/PlayCircleOutlineRounded";
import Link from "next/link";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import Grid from "@mui/material/Grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import styles from "../../styles/Home.module.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import axios from "axios";
import Button from "@mui/material/Button";
import { saveAs } from "file-saver";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
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
import Head from "next/head";
import { Container } from "@mui/material";
import Image from "next/image";
import DeleteIcon from '@mui/icons-material/Delete';
import Script from "next/script";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { ManageAccounts } from "@mui/icons-material";
const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const nextDomain = process.env.NEXT_PUBLIC_BASE_URL;
const imageLink = process.env.NEXT_PUBLIC_CDN;
const videoLink = process.env.NEXT_PUBLIC_AWS;
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export async function getServerSideProps(context) {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )
  const { params } = context;
  const { id } = params;
  const res = await fetch(`${domain}/api/image/imageView/${id}`);
  const data = await res.json();
  let metaData = await fetch(`${domain}/api/seo/getSeo/image`);
  let metaDataObj = await metaData.json();

  if (data.imageData) {
    return {
      props: {
        imageData: data.imageData,
        otherImages: data.otherImages,
        comments1: data.comments,
        relatedImages: data.relatedImages,
        currentId: id,
        data: "there",
        metaData: metaDataObj,
      },
    };
  } else {
    return {
      props: {
        data: "noData",
        metaData: metaDataObj,
      },
    };
  }
}
function Id({
  imageData,
  otherImages,
  comments1,
  relatedImages,
  currentId,
  data,
  metaData,
  isDetailPopup = false,
}) {
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
  let [comments, setComments] = useState(comments1);
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
  let [replies, setReplies] = useState([])
  let [userId, setUserId] = useState("")
  let [deleteCommentReplyId, setDeleteCommentReplyId] = useState(false)
  let [deleteCommentId, setDeleteCommentId] = useState(false)

  const updateReplies = (commentsLength) => {
    var tempReplies = [];
    for (var i = 0; i < commentsLength; i++) {
      tempReplies.push([]);
    }
    setReplies(tempReplies);
  };

  useEffect(() => {
    setImageLoader(true);
    setShowReplies([]);
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (data == "noData") {
      Router.push("/noComponent");
    }
    console.log("Open");
    if (localStorage.getItem("access_token")) {
      axios.post(`${domain}/api/user/checkUser`, config).then((res) => {
        setUserId(res.data._id)
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

    axios.get(`${domain}/api/image/imageView/${currentId}`).then((res) => {
      console.log(res.data);
      setImageCount(res.data.imageData);
      setSuggestedImages(res.data.relatedImages);
      setTimeout(() => {
        setImageLoader(false);
      }, 700);
    });
    if (comments1.length > 0) {
      setComments(comments1);
      setShowReplies([]);
      updateReplies(comments1.length);
    }
  }, [router.asPath]);
  let [myFollowing, setMyFollowing] = useState([]);
  let clickedOnImage = (id) => {
    axios.get(`${domain}/api/image/imageView/${id}`).then((res) => {
      setComments([...res.data.comments]);
      console.log(res.data.comments);
      setShowReplies([]);
      updateReplies(res.data.comments.length);
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
              console.log(res.data.comments);
              setShowReplies([]);
              updateReplies(res.data.comments.length);
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
              console.log(res.data.comments);
              setShowReplies([]);
              updateReplies(res.data.comments.length);
            });
          Router.push(`/image/${res.data.slug}`);
        }
      });
  };
  const upHandler = ({ key }) => {
    if (key === "ArrowRight") {
      nextImage();
    } else if (key === "ArrowLeft") {
      previousImage();
    }
  };
  React.useEffect(() => {
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keyup", upHandler);
    };
  });

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
            console.log(res.data.comments);
            setShowReplies([]);
            updateReplies(res.data.comments.length);
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
              console.log(res.data.comments);
              setShowReplies([]);
              updateReplies(res.data.comments.length);
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
      if (comment.length < 2 || comment.length > 200) {
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
                console.log(res.data.comments);
                setShowReplies([]);
                updateReplies(res.data.comments.length);
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
      axios
        .post(
          `${domain}/api/reply/createReply`,
          { commentId: replyCommentId, reply: replyInput },
          config
        )
        .then((res) => {
          console.log(res);
          setReplySuccess(true);
          axios
            .get(`${domain}/api/image/imageView/${imageData.slug}`)
            .then((res) => {
              setComments([...res.data.comments]);
              console.log(res.data.comments);
              setShowReplies([]);
              updateReplies(res.data.comments.length);
            });
        })
        .catch((err) => {
          console.log(err);
          setReportSubmitError(true);
        });
    }
  };
  const showRepliesHandler = (index) => {
    console.log('entereddyydydyddyyyy')
    getReplies(index);
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
    
    replies.filter((item)=>{
      return item._id!=deleteCommentReplyId
    })
    
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
      {data == "noData" ? (
        <></>
      ) : (
        <>
          <Script
            id="script_id"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org/",
                "@type": "ImageObject",
                contentUrl: `https://www.nexdro.com/image/${imageData.slug}`,
                license: "https://www.nexdro.com/",
                acquireLicensePage: `https://www.nexdro.com/${imageData.slug}`,
                creditText: `${imageData.postName}`,
                creator: {
                  "@type": "Person",
                  name: `${imageData.name}`,
                },
                copyrightNotice: "Nexdro Technologies",
              }),
            }}
          />
          <Head>
            <title>
              {metaData.title} {imageData ? imageData.postName : ""}
            </title>
            <meta name="keywords" content={metaData.metaKeywords} />
            <meta name="description" content={metaData.metaDescription} />
            <meta name="title" content={metaData.metaTitle} />

            <meta property="og:image" content={`${imageLink}/500x0/${imageData.file}`} />
            <link rel="icon" href="/favicon.ico" />

          </Head>
          {!isDetailPopup ? (
              <>
                <div
                  onClick={previousImage}
                  className={Ivcss.ivLeftBtnContainer}
                  style={{ zIndex: 999 }}
                >
                  <ChevronLeftOutlinedIcon className={Ivcss.ivLeftBtn} />
                </div>
                <div
                  onClick={nextImage}
                  className={Ivcss.ivRightBtnContainer}
                  style={{ zIndex: 999 }}
                >
                  <ChevronRightOutlinedIcon className={Ivcss.ivRightBtn} />
                </div>
              </>
            ) : (
              ""
            )}
          <section className={Ivcss.mainContainer}>
            <Container id="Container" maxWidth = "lg">
              <div className = {Ivcss.ivMainHeadContainer}>
                <div className={Ivcss.ivMainHead}>{imageData.postName}</div>
                <div
                  className={Ivcss.ivMainHeadBtns}
                >
                  <div className={Ivcss.viewCount}>
                    <span className = {Ivcss.viewIconContainer}>
                      <RemoveRedEyeOutlinedIcon className = {Ivcss.viewIcon} />
                    </span>
                    &nbsp; {kFormatter(imageData.views)}
                  </div>
                  {likedData.includes(imageData._id) ? (
                    <div className={Ivcss.likeCount}>
                      <span className = {Ivcss.likeIconContainer}>
                        <FavoriteIcon className = {Ivcss.likeIcon} onClick={unlikeImage}/>
                      </span>
                      &nbsp; {kFormatter(imageCount.likedCount)}
                    </div>
                  ) : (
                    <div className={Ivcss.likeCount}>
                      <span className = {Ivcss.likeIconContainer}>
                        <FavoriteBorderIcon className = {Ivcss.likeIcon} onClick={likeImage}/>
                      </span>
                      &nbsp; {kFormatter(imageCount.likedCount)}
                    </div>
                  )}

                  <button
                    className={Ivcss.downBtn}
                    onClick={downloadImage}
                    aria-label="down_btn"
                  >
                    <DownloadForOfflineIcon sx = {{color: "#27b17d"}} />
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
                    <span className={Ivcss.counts} style = {{color: "#27b17d"}}>
                      ({kFormatter(imageCount.downloadCount)})
                    </span>
                  </button>
                  <button
                    className={Ivcss.moreBtn}
                    onClick={() => showMoreOptionsHandler()}
                    aria-label="more_btn"
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
              </div>
              <div
                className={Ivcss.imageContainer}
              >
                {/* {imageLoader ? (
                  // <Skeleton
                  //   count={1}
                  //   style={{
                  //     height: "800px",
                  //     borderRadius: "10px",
                  //     marginBottom: "20px",
                  //     border: "1px solid #e8e8e8",
                  //   }}
                  // />
                  <></>
                ) : ( */}
                  <>
                    {imageData.fileType !== "video" ? (
                      <>
                        {/* <img
                          src={`${imageLink}/1400x0/${imageData.file}`}
                          alt={imageData.postName}
                          className={Ivcss.ivMainImage}
                          width="100%"
                          height="100%"
                        /> */}
                        <Image
                          className={Ivcss.ivMainImage}
                          src={`${imageLink}/1400x0/${imageData.file}`}
                          alt={imageData.postName}
                          width="100%"
                          height="100%"
                          layout = 'fill'
                          priority={true}
                          sizes=""
                        />
                      </>
                    ) : (
                      <video
                        className={Ivcss.ivMainVideo}
                        autoPlay
                        muted
                        controls
                        controlsList="nodownload"
                        playsInline
                      >
                        <source
                          src={`${videoLink}/${imageData.file}`}
                          type="video/mp4"
                        />
                      </video>
                    )}
                  </>
                {/* )} */}
              </div>
              <Grid container spacing={5}>
                {/* //left */}
                <Grid item lg={8} md={8} sm={12} xs={12}>
                  <div>
                    {/* //profile image & name */}
                    <div className={Ivcss.userDetailsContainer}>
                      <div
                        onClick={() => redirectPilot(imageData.userId._id)}
                        className={Ivcss.userProfilePicContainer}
                      >
                        {/* <img
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
                          alt = {imageData.postName}
                        /> */}
                        <Image
                          src={
                            imageData.userId
                              ? `${imageLink}/150x150/${imageData.userId.profilePic}`
                              : `${imageLink}/${imageData.file}`
                          }
                          className = {Ivcss.userProfilePic}
                          alt = {imageData.postName}
                          layout='fill'
                          priority
                        />
                      </div>
                      <div>
                        <div
                          className={Ivcss.ivName}
                          onClick={() => redirectPilot(imageData.userId._id)}
                          style={{ cursor: "pointer", color: "#00A4E2", }}
                        >
                          {imageData.userId ? imageData.userId.name : ""}
                        </div>
                        {myFollowing.includes(
                          imageData.userId ? imageData.userId._id : ""
                        ) ? (
                          <button
                            className={Ivcss.ivfollow}
                            onClick={unfollow}
                            style={{
                              pointerEvents:
                                imageData.userId &&
                                currentUser._id === imageData.userId._id
                                  ? "none"
                                  : "auto",
                              opacity:
                                imageData.userId &&
                                currentUser._id === imageData.userId._id
                                  ? "0.5"
                                  : "1",
                            }}
                            aria-label="follow"
                          >
                            Followed
                          </button>
                        ) : (
                          <button
                            className={Ivcss.ivfollow}
                            onClick={follow}
                            style={{
                              pointerEvents:
                                imageData.userId &&
                                currentUser._id === imageData.userId._id
                                  ? "none"
                                  : "auto",
                              opacity:
                                imageData.userId &&
                                currentUser._id === imageData.userId._id
                                  ? "0.5"
                                  : "1",
                            }}
                            aria-label="follow"
                          >
                            Follow
                          </button>
                        )}
                      </div>
                    </div>
                    <div style={{ margin: "20px 0px 10px 0px" }}>
                      <div className={Ivcss.ivHello}>
                        {imageData.experience}
                      </div>
                    </div>
                    <Grid container className={Ivcss.allCommentsContainer}>
                      <Grid
                        item
                        lg={12}
                        md={12}
                        sm={12}
                        xs={12}
                      >
                        <div className = {Ivcss.commentsContainer}>
                          <button
                            className={Ivcss.ivDownloadBtn}
                            onClick={showCommentBox}
                            aria-label="comment"
                          >
                            Write comment
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
                                aria-label="download"
                              >
                                Close
                              </button>
                            ) : (
                              <button
                                className={Ivcss.ivDownloadBtn}
                                onClick={createComment}
                                aria-label="download"
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
                                    className = {Ivcss.commentProfileTitleContainer}
                                  >
                                    {/* <img
                                      src={`${imageLink}/86x86/${
                                        item.comment.userId
                                          ? item.comment.userId.profilePic
                                          : ""
                                      }`}
                                      style={{
                                        height: "45px",
                                        width: "45px",
                                        borderRadius: "22.5px",
                                        cursor: "pointer",
                                        border: "1px solid #c5c5c5",
                                      }}
                                      onClick={() =>
                                        redirectToLanding(
                                          item.comment.userId
                                            ? item.comment.userId._id
                                            : ""
                                        )
                                      }
                                      data-src={``}
                                      alt="profile"
                                    />{" "} */}
                                    <Image
                                      src={`${imageLink}/86x86/${
                                        item.comment.userId
                                          ? item.comment.userId.profilePic
                                          : ""
                                      }`}
                                      onClick={() =>
                                        redirectToLanding(
                                          item.comment.userId
                                            ? item.comment.userId._id
                                            : ""
                                        )
                                      }
                                      alt="profile"
                                      layout="fill"
                                      className = {Ivcss.commentProfile}
                                      priority = {i < 2}
                                    />
                                    <div
                                      className={`${Ivcss.ivComName} ${Ivcss.ivCommentTitle}`}
                                      onClick={() =>
                                        redirectToLanding(
                                          item.comment.userId
                                            ? item.comment.userId._id
                                            : ""
                                        )
                                      }
                                      style={{ cursor: "pointer" }}
                                    >
                                      {item.comment.userId
                                        ? item.comment.userId.name
                                        : ""}
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
                                      {likedComments.includes(
                                        item.comment._id
                                      ) ? (
                                        <button
                                          className={Ivcss.ivcommentLike}
                                          onClick={() =>
                                            unlikeComment(item.comment._id)
                                          }
                                          aria-label="unlike"
                                        >
                                          <FavoriteIcon
                                            style={{ color: "#2BC48A", marginRight: "10px" }}
                                          />
                                          {item.comment.likes.length}
                                        </button>
                                      ) : (
                                        <button
                                          className={Ivcss.ivcommentLike}
                                          style={{ color: "#000000" }}
                                          onClick={() =>
                                            likeComment(item.comment._id)
                                          }
                                          aria-label="comment_like"
                                        >
                                          <FavoriteBorderIcon
                                            style={{ color: "#2BC48A", marginRight: "10px" }}
                                          />
                                          {item.comment.likes
                                            ? item.comment.likes.length
                                            : ""}
                                        </button>
                                      )}
                                      <button
                                        className={Ivcss.ivcommentLike}
                                        style={{ color: "#000000" }}
                                        onClick={() =>
                                          replyComment(item.comment._id)
                                        }
                                        aria-label="comment_like"
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
                                  {item.replies > 0 ? (
                                    <button
                                      aria-label="comment_reply"
                                      className={Ivcss.commentviewReplies}
                                      onClick={() => showRepliesHandler(i)}
                                    >
                                      {showReplies.includes(i) ? "Hide" : "View"}{" "}
                                      replies ({item.replies})
                                    </button>
                                  ) : (
                                    ""
                                  )}
                                  {showReplies.includes(i) ? (
                                    <div className={Ivcss.commentAllReplies}>
                                      {replies[i].map((reply, index) => {
                                        return (
                                          <div
                                            className={Ivcss.commentReply}
                                            key={index}
                                          >
                                            <div
                                              className={
                                                Ivcss.commentReplyImageName
                                              }
                                            >
                                              <img
                                                src={`${imageLink}/45x45/${reply.userId.profilePic}`}
                                                className={
                                                  Ivcss.commentReplyImage
                                                }
                                                onClick={() =>
                                                  redirectToLanding(
                                                    reply.userId._id
                                                  )
                                                }
                                                data-src={``}
                                                alt={reply.userId.profilePic}
                                              />{" "}
                                              <div
                                                onClick={() =>
                                                  redirectToLanding(
                                                    reply.userId._id
                                                  )
                                                }
                                                className={Ivcss.commentReplyName}
                                              >
                                                {reply.userId.name}
                                              </div>
                                            </div>
                                            <div
                                              className={Ivcss.commentReplyActual}
                                            >
                                              {reply.reply}
                                              {userId === reply.userId._id
                                              ?<DeleteIcon className = {Ivcss.deleteComment} onClick = {()=>deleteCommentReply(reply._id)} sx = {{float: "right"}}/>
                                              :""
                                              }
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </div>
                                {i < comments.length-1?
                                  <hr className={Ivcss.ivHr} />
                                  :""
                                }
                              </>
                            );
                          })}
                        </div>
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
                              <Link
                             
                                href={`/image/${item.slug}`}
                                aria-label={item.slug}
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
                                      priority
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
                                      Your browser does not support the video
                                      tag.
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
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                        xl={12/5}
                        key={index}
                      >
                        <div className={styles.homepageOuterFileContainer}>
                          <Link
                          
                            href={`/image/${item.slug}`}
                            aria-label={item.slug}
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
                                    priority
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
                                <Link href="/" aria-label="home">
                                  <a
                                    style={{
                                      color: "#fff",
                                      fontFamily: "muli-regular",
                                      cursor: "pointer",
                                    }}
                                    className="pilotName"
                                  >
                                    {item.name}
                                  </a>
                                </Link>
                              </span>
                              <button
                                className={`${styles.homepageLikesContainer} pilotName`}
                                style={{
                                  color: "#fff",
                                  fontFamily: "muli-regular",
                                  cursor: "pointer",
                                }}
                                aria-label="like"
                              >
                                {likedData.includes(item._id) ? (
                                  <FavoriteOutlinedIcon
                                    className={styles.homepageFileLikeIcon}
                                    onClick={() => unlikeImg(item._id)}
                                  />
                                ) : (
                                  <FavoriteBorderOutlinedIcon
                                    className={styles.homepageFileLikeIcon}
                                    onClick={() => likeImg(item._id)}
                                  />
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
                <ClearRoundedIcon
                  className="popupClose"
                  onClick={handleClose}
                />
                <div className="popupTitle">
                  You aren&#39;t logged into Nexdro. Please login to continue?
                </div>
                <center>
                  <Link href="/login" aria-label="login">
                    <div className="popupLoginBtn">Login/Signup</div>
                  </Link>
                </center>
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
                  Reported. Our team will review.
                </div>
                <center>
                  <button
                    className={`formBtn2 ${Ivcss.reportInputBtn}`}
                    onClick={() => setReportSubmitSuccess(false)}
                    aria-label="close_report"
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
                    aria-label="close_reply_success"
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
                    aria-label="report_input_close"
                  >
                    Close
                  </button>
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
                      aria-label="submit_report"
                    >
                      Submit
                    </button>
                  </div>
                </div>
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
                      aria-label="submit_report"
                    >
                      Submit
                    </button>
                  </div>
                </div>
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
          </section>
        </>
      )}
    </>
  );
}
export default Id;