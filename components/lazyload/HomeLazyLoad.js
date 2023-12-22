// https://learn.microsoft.com/en-us/windows/wsl/install-manual#step-4---download-the-linux-kernel-update-package

import Head from "next/head";
import Image from "next/image";
import styles from "../../styles/Home.module.css";
import Ivcss from "../../styles/imageView.module.css";
import "../../styles/Home.module.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import { Box} from "@mui/material";
import Router from "next/router";
import PlayCircleOutlineOutlinedIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import Link from "next/link";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/router";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ImageLandingPopup from "../imageLandingPopup";

const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const imageLink = process.env.NEXT_PUBLIC_CDN;
const videoLink = process.env.NEXT_PUBLIC_AWS;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function HomeLazyLoad() {
  const [data, setData] = useState([]);
  const [likedFiles, setLikedFiles] = useState([]);
  const [activeFileType, setActiveFileType] = useState("all");
  const [user, setUser] = useState({});
  const [loginPopup, setLoginPopup] = useState(false);
  const [page, setPage] = useState(2);
  const [nextPage, setNextPage] = useState(false);
  const [dropdownFilter, setDropdownFilter] = useState("recommended");
  const [filterInput, setFilterInput] = useState("");
  const [selectedCarouselImg, setSelecteCarouselImg] = useState(0)
  const [isLoggedin, setIsLoggedin] = useState(false)
  const [imgs, setImgs] = useState([`static/home1.jpg`,`static/home2.jpg`,`static/home3.jpg`,`static/home4.jpg`,`static/home5.jpg`])
  const [shotDetails, setShotDetails] = useState({})
  const [shotSeo, setShotSeo] = useState({})
  const [shotDetailId, setShotDetailId] = useState("")
  const [detailPopupIndex, setDetailPopupIndex] = useState(0)
  const router = useRouter();

  const LikeFile = (id, index) => {
    let config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (!localStorage.getItem("role")) {
      setLoginPopup(true);
    } else {
      if (likedFiles.includes(id)) {
        console.log(likedFiles);
        axios
          .post(`${domain}/api/image/unlikeImage/${id}`, config)
          .then(() => {
            console.log("Liked");
          })
          .catch("Failed");
        var tempLikedFiles = likedFiles;
        tempLikedFiles.splice(tempLikedFiles.indexOf(id), 1);
        console.log(tempLikedFiles);
        setLikedFiles([...tempLikedFiles]);
        var tempData = data;
        tempData[index].likes.splice(
          tempData[index].likes.indexOf(user._id),
          1
        );
        setData([...tempData]);
      } else {
        console.log(likedFiles);
        axios
          .post(`${domain}/api/image/likeImage/${id}`, config)
          .then(() => {
            console.log("Liked");
          })
          .catch((err) => {
            console.log("Failed");
          });
        var tempLikedFiles = likedFiles;
        tempLikedFiles.push(id);
        console.log(tempLikedFiles);
        setLikedFiles([...tempLikedFiles]);
        var tempData = data;
        tempData[index].likes.push(user._id);
        setData([...tempData]);
      }
    }
  };


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

  const [count, setCount] = useState(0);
  const handleScroll = () => {
    setCount(count++);
  };

  useEffect(() => {
    handleScroll1();
  }, [count]);

  useEffect(() => {
    if (localStorage.getItem("access_token")){
      setIsLoggedin(true)
    }else{
      setIsLoggedin(false)
    }
    startCarousel()
    window.addEventListener("scroll", handleScroll);

    let config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if(localStorage.getItem("access_token")){
      axios
      .get(`${domain}/api/user/getUserData`, config)
      .then((res) => {
        console.log(res.data);
        setLikedFiles(res.data.likedMedia);
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
    }
    axios.get("http://localhost:9000/api/homeImages/homeBanners")
    .then(res => {
      setImgs(res.data)
    })
    axios.post(`${domain}/api/image/homepage?page=1`, {
      keyword: "recommended",
      type: "all",
      data: "",
      token: "",
    })
    .then((res) => {
      setData([...res.data.results])
      if (res.data.next) {
        setNextPage(true);
        setPage(res.data.next.page);
      } else {
        setNextPage(false);
      }
    });

  }, []);

  const redirectPilotLanding = (id) => {
    console.log(id);
    axios.post(`${domain}/api/pilot/getPilotId`, { userId: id }).then((res) => {
      if (res.data[0]) {
        Router.push(`/pilot/${res.data[0].userName}`);
      }
      console.log(res.data);
    });
  };


  let dropdownChangeHandler = (e) => {
    document.getElementById(e.target.id).blur();
    let config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (
      e.target.value === "following" &&
      !localStorage.getItem("access_token")
    ) {
      setLoginPopup(true);
    } else {
      setDropdownFilter(e.target.value);
      setFilterInput("");
      searchFilter(activeFileType, e.target.value, "");
    }
  };
  useEffect(() => {
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    if(router.query.image){
      try{
        document.getElementById("toTop").scrollTo(0,0)
      }catch{
        console.log("No element")
      }
    }
  }, [router.asPath]);
  const loadMore = () => {
    setNextPage(false);
    axios
      .post(`${domain}/api/image/homepage?page=${page}`, {
        keyword: dropdownFilter,
        type: "all",
        data: "",
        token: localStorage.getItem("access_token"),
      })
      .then((res) => {
        console.log(res.data);
        setData([...data, ...res.data.results]);
        if (res.data.next) {
          setNextPage(true);
          setPage(res.data.next.page);
        } else {
          setNextPage(false);
        }
      })
      .catch((err) => {
        console.log("err.response");
        setNextPage(false);
      });
  };

  const searchClickHandler = () => {
    if (filterInput !== "") {
      Router.push(`/search/${filterInput}`);
    } else {
      try{
        document.getElementById("filterInput").focus();
        console.log("Try")
      }catch{
        document.getElementById("filterInput1").focus();
        console.log("Catch")
      }
    }
  };

  const searchFilter = (type, keyword, data) => {
    console.log(type, keyword, data);
    axios
      .post(`${domain}/api/image/homepage?page=1`, {
        keyword: keyword,
        type: "all",
        data: "",
        token: localStorage.getItem("access_token"),
      })
      .then((res) => {
        // scrollTo(0, 0);
        setData([...res.data.results]);
        if (res.data.next) {
          setNextPage(true);
          setPage(res.data.next.page);
        } else {
          setNextPage(false);
        }
      });
  };

  const filterInputChange = (e) => {
    if (e.target.value.trim().length > 0 || e.target.value.length === 0) {
      setFilterInput(e.target.value);
    }
  };

  const fileTypeChange = (type) => {
    setActiveFileType(type);
    searchFilter(type, dropdownFilter, filterInput);
  };

  const enterFilter = (e) => {
    if (e.key == "Enter" && filterInput !== "") {
      Router.push(`/search/${filterInput}`);
    }
  };

  const startCarousel = () => {
    setTimeout(()=>{
      setSelecteCarouselImg(selectedCarouselImg++)
    },7000)
    var carouselInterval = setInterval(()=>{
      setSelecteCarouselImg(selectedCarouselImg++)
    },7000)
  }

  const getFileDetails = (index, slug = undefined) => {
    var imgSlug
    if (slug){
      imgSlug = slug
    }else{
      imgSlug = data[index].slug
      setDetailPopupIndex(index)
    }
    setShotDetailId(imgSlug)
    axios.get(`${domain}/api/image/imageView/${imgSlug}`)
    .then(res=>{
      setShotDetails(res.data)
    })
    axios.get(`${domain}/api/seo/getSeo/image`)
    .then(res=>{
      setShotSeo(res.data)
    })
  }

  const loadPrevShot = () => {
    getFileDetails(detailPopupIndex-1, null)
  }

  const loadNextShot = () => {
    if (detailPopupIndex>=data.length-2 && nextPage){
      loadMore()
    }
    getFileDetails(detailPopupIndex+1, null)
  }

  return (
    <>
      <Container className="Container" id="Container" maxWidth="xxl">
        <div className={styles.filterRecommentedContainer}>
          <select
            className={styles.homepageFilterLine1Left}
            onChange={dropdownChangeHandler}
            value={dropdownFilter}
            id="dropdownFilter"
          >
            <option value="recommended">Recommended</option>
            <option value="">All</option>
            <option value="following">Following</option>
            <option value="viewed">Most viewed</option>
            <option value="liked">Most liked</option>
            <option value="commented">Most commented</option>
            <option value="downloaded">Most downloaded</option>
          </select>
        </div>
        <div style={{ marginBottom: "50px" }}>
          <Box>
            <Grid container spacing={1.5}>
              {data.map((item, index) => {
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={index}>
                    <div className={styles.homepageOuterFileContainer}>
                      <Link href={`/?image=${item.slug}`}
                            as={`/image/${item.slug}`} prefetch={false}>
                            
                        <a
                          className={styles.homepageFileContainer}
                          onClick = {() => getFileDetails(index, null)}
                          aria-label={item.slug}
                        >
                          {item.fileType !== "video" ? (
                            <figure className="figure">
                              <Image
                                className={styles.homepageFile}
                                src={`${imageLink}/800x740/${item.file}`}
                                alt={item.postName}
                                width="100%" height="100%" layout="responsive" objectFit="cover"
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
                                <p>
                                  Your browser doesn&apos;t support HTML video. Here is a
                                  <Link href={`/?image=${item.slug}`} aria-label={item.slug} prefetch={false}><a>link to the video</a></Link> instead.
                                </p>
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
                        >
                          <span
                            className={styles.homepageListUserName}
                            onClick={() =>
                              redirectPilotLanding(item.userId._id, index)
                            }
                          >
                            <AccountCircleIcon
                              className={styles.homepageFileUserIcon}
                            />
                            <Link href="/" prefetch={false}>
                              <a
                                style={{
                                  color: "#fff",
                                  fontFamily: "roboto-regular",
                                  cursor: "pointer",
                                }}
                                className="pilotName"
                                aria-label={item.userId.name}
                              >
                                {item.userId.name}
                              </a>
                            </Link>
                          </span>
                          <button
                            className={`${styles.homepageLikesContainer} pilotName`}
                            style={{
                              color: "#fff",
                              fontFamily: "roboto-regular",
                              cursor: "pointer",
                            }}
                            onClick={() => LikeFile(item._id, index)}
                            aria-label="pilotName"
                          >
                            {likedFiles.includes(item._id) ? (
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
          </Box>
        </div>
        <Dialog
          open={loginPopup}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => setLoginPopup(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <div className="popupContainer">
            <ClearRoundedIcon
              className="popupClose"
              onClick={() => setLoginPopup(false)}
            />
            <div className="popupTitle">
              You aren&#39;t logged into Nexdro. Please login to continue?
            </div>
            <center>
              <Link href="/login" prefetch={false}>
                <a aria-label="/login">
                  <div className="popupLoginBtn">Login/Signup</div>
                </a>
              </Link>
            </center>
          </div>
        </Dialog>
      </Container>
      {nextPage && <div className="loadingContainer">
        Loading ...
      </div>}
        <Dialog
          open={!!router.query.image}
          onClose={() => router.replace("/")}
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
            <ClearRoundedIcon sx = {{cursor: "pointer", position: "absolute", top: "10px", left: '10px', fontSize: "30px", zIndex: "999"}} onClick = {() => router.replace("/")}/>
            {detailPopupIndex > 0 
              ?<Link href = {`/?image=${data[detailPopupIndex-1].slug}`} as = {`/image/${data[detailPopupIndex-1].slug}`} prefetch={false} ><a onClick = {loadPrevShot} className={Ivcss.ivLeftBtnContainer} style={{ zIndex: 999 }} >  <ChevronLeftOutlinedIcon className={Ivcss.ivLeftBtn} /></a></Link>
              :""
            }
            {detailPopupIndex < data.length-1
              ?<Link href = {`/?image=${data[detailPopupIndex+1].slug}`} as = {`/image/${data[detailPopupIndex+1].slug}`} shallow ={true} prefetch={false}><a onClick = {loadNextShot} className={Ivcss.ivRightBtnContainer} style={{ zIndex: 999 }}><ChevronRightOutlinedIcon className={Ivcss.ivRightBtn} /></a></Link>
              :""
            }
            <ImageLandingPopup />
          </section>
        </Dialog>
    </>
  );
}
