import { Button, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import IvCss from "../../styles/imageView.module.css";
import styles from "../../styles/Home.module.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import axios from "axios";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import Dialog from "@mui/material/Dialog";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import Slide from "@mui/material/Slide";
import Head from "next/head";
import PlayCircleOutlineOutlinedIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import { Container } from "@mui/system";
import Image from "next/image";
import CircularProgress from '@mui/material/CircularProgress';
import Ivcss from "../../styles/imageView.module.css";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ImageLandingPopup from "../../components/imageLandingPopup";

const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const imageLink = process.env.NEXT_PUBLIC_CDN;
const videoLink = process.env.NEXT_PUBLIC_AWS;
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  const res = await fetch(`${domain}/api/tag/getTags`);
  const tags = await res.json();
  const tagData = await fetch(`${domain}/api/tag/getTagData/${slug}`);
  const tag = await tagData.json();
  let data = [];
  console.log("test");
  await axios
    .post(`${domain}/api/tag/imageFilters?page=1`, { data: slug, type: "all" })
    .then((res) => {
      data = res.data;
    });
  let metaData = await fetch(`${domain}/api/seo/getSeo/shots`);
  let metaDataObj = await metaData.json();
  return {
    props: {
      tags: tags,
      data: data,
      tag: tag,
      slugParam: slug,
      metaData: metaDataObj,
    },
  };
}
let redirect = (id) => {
  Router.push(`/image/${id}`);
};
function Slug({ tags, data, tag, slugParam, test, metaData }) {
  const [page, setPage] = useState(2);
  const [nextPage, setNextPage] = useState(data.next ? true : false);
  const [open, setOpen] = React.useState(false);
  const [slug, setSlug] = useState(slugParam);
  const [mobileView, setMobileView] = useState(false);
  const [showUserIndex, setShowUserIndex] = useState("");
  const [detailPopupIndex, setDetailPopupIndex] = useState(0)

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  let [data1, setData1] = useState(data.results);
  let [myLikes, setMyLikes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!router.query.slug){
      changeTab(tag.slug);
    }
  }, [router.asPath]);

  const [count, setCount] = useState(0);
  const handleScroll = () => {
    setCount(count++);
  };
  useEffect(() => {
    handleScroll1();
  }, [count]);
  const handleScroll1 = () => {
    try {
      const wrappedElement = document.getElementById("Container");
      if (
        wrappedElement.getBoundingClientRect().bottom <=
        window.innerHeight + 1
      ) {
        if (nextPage) {
          console.log("Loadmore");
          loadMore();
        } else {
          window.removeEventListener("scroll", handleScroll);
        }
      }
    } catch {
      console.log("Error");
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    console.log(test);
    console.log(data);
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (localStorage.getItem("access_token")) {
      axios.post(`${domain}/api/user/checkUser`, config).then((res) => {
        setMyLikes(res.data.likedMedia);
      });
    }
  }, []);
  let [myLiked, setMyliked] = useState([]);
  let changeTab = (slug) => {
    Router.push(`/shot/${slug}`);
    axios
      .post(`${domain}/api/tag/imageFilters?page=1`, {
        data: slug,
        type: "all",
      })
      .then((res) => {
        setData1(res.data.results);
        setSlug(slug);
        if (res.data.next) {
          setPage(res.data.next.page);
          setNextPage(true);
        } else {
          setNextPage(false);
        }
      });
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
  const mouseOver = (index) => {
    if (window.innerWidth > 992) {
      setMobileView(false);
      setShowUserIndex(index);
    } else {
      setMobileView(true);
    }
  };

  const mouseLeave = () => {
    if (window.innerWidth > 992) {
      setMobileView(false);
      setShowUserIndex("");
    } else {
      setMobileView(true);
    }
  };
  let unlikeImage = (id, index) => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.post(`${domain}/api/image/unlikeImage/${id}`, config).then((res) => {
      axios.post(`${domain}/api/user/checkUser`, config).then((res) => {
        setMyLikes(res.data.likedMedia);
        let tempData = data1;
        tempData[index].likes.splice(tempData.indexOf(res.data._id), 1);
        setData1([...tempData]);
      });
    });
  };
  let likeImage = (id, index) => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (localStorage.getItem("access_token")) {
      axios.post(`${domain}/api/image/likeImage/${id}`, config).then((res) => {
        axios.post(`${domain}/api/user/checkUser`, config).then((res) => {
          setMyLikes(res.data.likedMedia);
          let tempData = data1;
          tempData[index].likes.push(res.data._id);
          setData1([...tempData]);
        });
      });
    } else {
      //here goes popup
      handleClickOpen();
    }
  };
  const loadMore = () => {
    setNextPage(false);
    axios
      .post(`${domain}/api/tag/imageFilters?page=${page}`, {
        data: slugParam,
        type: "all",
      })
      .then((res) => {
        setData1([...data1, ...res.data.results]);
        if (res.data.next) {
          setNextPage(true);
          setPage(res.data.next.page);
        } else {
          setNextPage(false);
        }
      });
  };
  let redirectPilot = (id) => {
    axios.post(`${domain}/api/pilot/getPilotId`, { userId: id }).then((res) => {
      Router.push(`/pilot/${res.data[0].userName}`);
    });
  };
  let showUserDetails = (id) => {
    document.getElementById(`userDetails/${id}`).style.display = "flex";
  };
  let hideUserDetails = (id) => {
    document.getElementById(`userDetails/${id}`).style.display = "none";
  };
  const loadPrevShot = () => {
    setDetailPopupIndex(detailPopupIndex-1)
  }

  const loadNextShot = () => {
    if (detailPopupIndex >= data1.length-2 && nextPage){
      console.log("Loadmore");
      loadMore();
    }
    setDetailPopupIndex(detailPopupIndex+1)
  }
  return (
    <div style={{ padding: "30px 0px" }} className={IvCss.shots}>
      <Container maxWidth={"xxl"}>
        <Head>
          <title>
            {metaData.title} {tag.slug}
          </title>
          <meta name="keywords" content={metaData.metaKeywords} />
          <meta name="description" content={metaData.metaDescription} />
          <meta name="title" content={metaData.metaTitle} />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Grid container spacing={2}>
          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
            <div className={IvCss.tag}>Shots based on {tag.tag}</div>
            <div
              style={{ padding: "10px 0px 10px 0px" }}
              className={IvCss.tagsContainer}
            >
              {tags.map((item, i) => {
                return (
                  <Link href={`/shot/${item.slug}`} key={i}>
                    <a
                      className={
                        tag.tag == item.tag ? IvCss.chips1 : IvCss.chips
                      }
                      onClick={() => changeTab(item.slug)}
                      style={
                        i === 0
                          ? { marginLeft: "0px" }
                          : i === tags.length - 1
                          ? { marginRight: "0px" }
                          : {}
                      }
                    >
                      {item.tag}
                    </a>
                  </Link>
                );
              })}
            </div>
          </Grid>
          <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
            {data1.length == 0 ? (
              <div className="ErrorToShow">No Shoots Yet</div>
            ) : (
              <></>
            )}
            <Grid container spacing={2} id="Container">
              {data1.map((item, index) => {
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={index}>
                    <div className={styles.homepageOuterFileContainer}>
                      <Link href={`/shot/${router.query.slug}?image=${item.slug}`} prefetch={false}>
                        <a
                          className={styles.homepageFileContainer}
                          onFocus={() => mouseOver(index)}
                          onMouseOver={() => mouseOver(index)}
                          onMouseLeave={() => mouseLeave(index)}
                          onClick = {()=>setDetailPopupIndex(index)}
                          aria-label={item.file}
                        >
                          {item.fileType !== "video" ? (
                            <figure className="figure">
                              <Image
                                src={`${imageLink}/500x450/${item.file}`}
                                className={styles.homepageFile}
                                priority={index<2}
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
                              <video className={styles.homepageFile} playsInline>
                                <source
                                  src={`${videoLink}/${item.file}`}
                                  type="video/mp4"
                                />
                              </video>
                              <PlayCircleOutlineOutlinedIcon
                                className={styles.homepageVideoIcon}
                              />
                            </>
                          )}
                        </a>
                      </Link>
                      <div className={styles.contentOverlay}>
                        <div
                          className={styles.homepageUserContainer}
                          onMouseOver={() => mouseOver(index)}
                          onMouseLeave={() => mouseLeave(index)}
                        >
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
                                className = 'pilotNameLink'
                              >
                                {item.name}
                              </a>
                            </Link>
                          </span>
                          <button
                            className={`${styles.homepageLikesContainer} pilotNameLink`}
                            style={{
                              color: "#fff",
                              fontFamily: "roboto-regular",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              myLikes.includes(item._id)
                                ? unlikeImage(item._id, index)
                                : likeImage(item._id, index)
                            }
                          >
                            {myLikes.includes(item._id) ? (
                              <FavoriteOutlinedIcon
                                className={styles.homepageFileLikeIcon}
                              />
                            ) : (
                              <FavoriteBorderOutlinedIcon
                                className={styles.homepageFileLikeIcon}
                              />
                            )}
                            {item.likes.length}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Grid>
                );
              })}
            </Grid>
            {nextPage && <div className="loadingContainer">Loading ...</div>}
          </Grid>
        </Grid>
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
          open={!!router.query.image}
          onClose={() => router.replace(`/shot/${router.query.slug}`)}
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
            <ClearRoundedIcon sx = {{cursor: "pointer", position: "absolute", top: "10px", left: '10px', fontSize: "30px", zIndex: "999"}} onClick = {() => router.replace(`/shot/${router.query.slug}`)}/>
            {detailPopupIndex > 0 
              ?<Link href = {`/shot/${router.query.slug}?image=${data1[detailPopupIndex-1].slug}`} ><a onClick = {loadPrevShot} className={Ivcss.ivLeftBtnContainer} style={{ zIndex: 999 }} >  <ChevronLeftOutlinedIcon className={Ivcss.ivLeftBtn} /></a></Link>
              :""
            }
            {detailPopupIndex < data1.length-1
              ?<Link href = {`/shot/${router.query.slug}?image=${data1[detailPopupIndex+1].slug}`} ><a onClick = {loadNextShot} className={Ivcss.ivRightBtnContainer} style={{ zIndex: 999 }}><ChevronRightOutlinedIcon className={Ivcss.ivRightBtn} /></a></Link>
              :""
            }
            <ImageLandingPopup />
          </section>
        </Dialog>
      </Container>
    </div>
  );
}

export default Slug;