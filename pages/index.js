import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Ivcss from "../styles/imageView.module.css";
import "../styles/Home.module.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
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

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
// const HomeLazyLoad = dynamic(() => import("../components/lazyload/HomeLazyLoad"));

const ImageLandingPopup = dynamic(() => import('../components/imageLandingPopup'), {
  suspense: true,
})

const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const imageLink = process.env.NEXT_PUBLIC_CDN;
const videoLink = process.env.NEXT_PUBLIC_AWS;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export async function getServerSideProps({ req, res }) {
  const moment = (await import('moment')).default(); //default method is to access default export
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )
  let img
  await axios
    .post(`${domain}/api/image/homepage?page=1`, {
      keyword: "recommended",
      type: "image",
      data: "",
      token: "",
    })
    .then((response) => {
      img = response.data;
    });
  const response = await fetch(`${domain}/api/seo/getSeo/home`);
  const data = await response.json();
  const inds = await fetch(`${domain}/api/industry/getIndustries`);
  const industries = await inds.json();
  return {
    props: {
      metaData: data,
      inds: industries,
      images: img,
      date: moment.format('dddd D MMMM YYYY'),
    },
  };
}

export default function Home({ metaData, images, inds }) {
  const [data, setData] = useState(images.results);
  console.log(data,'dtaa')
  const [imageLandingPopup, setImageLandingPopup] = useState(false);
  const [imageLandingPopupId, setImageLandingPopupId] = useState("");
  const [likedFiles, setLikedFiles] = useState([]);
  const [activeFileType, setActiveFileType] = useState("all");
  const [keywordFilter, setKeywordFilter] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [showUserIndex, setShowUserIndex] = useState("");
  const [user, setUser] = useState({});
  const [loginPopup, setLoginPopup] = useState(false);
  const [page, setPage] = useState(2);
  const [nextPage, setNextPage] = useState(Boolean(images.next));
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

  const updatePredicate = () => {
    if (window.innerWidth > 992) {
      setMobileView(false);
    } else {
      setMobileView(true);
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


  const [industries, setIndustries] = useState(inds);

  useEffect(() => {
    console.log(images)
    if (localStorage.getItem("access_token")){
      setIsLoggedin(true)
    }else{
      setIsLoggedin(false)
    }
    startCarousel()
    console.log(metaData);
    window.addEventListener("resize", updatePredicate);
    window.addEventListener("scroll", handleScroll);
    if (window.innerWidth <= 992) {
      setMobileView(true);
    }

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
      // setImgs(res.data)
    })

  }, []);

  const redirectPilotLanding = (id) => {
    console.log(id);
    axios.post(`${domain}/api/pilot/getPilotId`, { userId: id }).then((res) => {
      console.log(res.data,'oooooooooooooooooooo')
      if (res.data[0]) {
        Router.push(`/hire-pilot/pol/${res.data[0].userName}`);
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

  let sendToImageView = (id) => {
    Router.push(`/image/${id}`);
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
      <Head>
        <title>{metaData.title}</title>
        <meta name="keywords" content={metaData.metaKeywords} />
        <meta name="description" content={metaData.metaDescription} />
        <meta name="title" content={metaData.metaTitle} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container
        sx={{
          display: {
            xs: "block",
            sm: "none",
            position: "sticky",
            top: "56px",
            zIndex: "999",
            background: "#fff",
          },
        }}
        maxWidth="xxl"
      >
        <div className={styles.mobViewSearchContainer}>
          <div className={styles.mobViewSearchInnerContainer}>
            <input
              type="text"
              className={styles.homepageFilterInputMob}
              id="filterInput"
              value={filterInput}
              onChange={filterInputChange}
              placeholder="Search for drone shots "
              onKeyDown={enterFilter}
              autoComplete="off"
            />
            <button className={styles.mobViewSearchBtn} aria-label="search">
              <SearchIcon sx={{ color: "#fff" }} onClick={searchClickHandler} />
            </button>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              position: "relative",
            }}
            className={styles.filterIndustries}
          >
            <div className={styles.filterIndustriesContainer}>
              {industries.map((industry, index) => {
                return (
                 
                  <div
                    className={styles.filterIndustry}
                    key={index}
                    onClick={() => Router.push(`/search/${industry.industry}`)}
                  >
                    {industry.industry}
                  
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
      <div
        className={styles.filterOptionsContainer}
        // style={{
        //   backgroundImage: `url(${imageLink}/800x600/${
        //     imgs[selectedCarouselImg % imgs.length]
        //   })`,
        // }}
      >
        {imgs.map((img, index) => {
          return(
            <span key = {index} style = {{opacity: selectedCarouselImg % imgs.length==index?"1":"0", transition: "all 2s ease"}}>
              <Image src = {`${imageLink}/800x600/${img}`} layout = "fill" objectFit = "cover" alt = "banner section image" priority = {index==0}/>
            </span>
          )
        })}
        <Container
          className={styles.filterOptionsInnerContainer}
          maxWidth="xxl"
        >
          <div
            style={{ textAlign: "center" }}
            className={styles.filterSearchContainer}
          >
            {/* <Box sx={{ display: { xs: "block", sm: "none" } }}>
              <div className={`pageTitle taCenter ${styles.homepageTitle1}`}>
                World&apos;s #1{" "}
                <span className={styles.homepageTitle}>Drone Pilots</span>{" "}
                Network Platform
              </div>
              <div className={`${styles.homepageSubTitle}`}>
                Upload shots - get appreciated, apply jobs, explore drone
                service centres globally.
                {!isLoggedin && (
                  <Link href="/login" prefetch={false}>
                    <a className="homepageLink" aria-label="login">
                      Join Now
                    </a>
                  </Link>
                )}
              </div>
            </Box> */}
            <Box>
              <div className={styles.homeTitleContainer}>
                <span className = {styles.homeTitle1}>EXPLORE</span> <span className = {styles.homeTitle2}>DRONE PILOT</span> <span className = {styles.homeTitle3}>CREATIVES</span>
              </div>
              <div className={`${styles.homepageSubTitle}`}>
                WORLD&apos;S #1 PILOTS NETWORK PLATFORM IS HERE FOR YOU
              </div>
              {/* <div className={styles.homepageFilterKeywordContainer}>
                <input
                  type="text"
                  className={styles.homepageFilterInput}
                  id="filterInput1"
                  value={filterInput}
                  onChange={filterInputChange}
                  placeholder="Search for drone shots "
                  onKeyDown={enterFilter}
                />

                <SearchIcon
                  onClick={searchClickHandler}
                  className={styles.searchIcon}
                />
              </div> */}

              {/* <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                }}
                className={styles.filterIndustries}
              >
                <div
                  className={styles.filterArrowLeft}
                  onClick={() => {
                    document.getElementById(
                      "filterIndustries"
                    ).scrollLeft -= 200;
                  }}
                >
                  <ArrowBackIosIcon />
                </div>
                <div
                  className={styles.filterIndustriesContainer}
                  id="filterIndustries"
                >
                  {industries.map((industry, index) => {
                    return (
                      <div
                        className={styles.filterIndustry}
                        key={index}
                        onClick={() =>
                          Router.push(`/search/${industry.industry}`)
                        }
                      >
                        {industry.industry}
                      </div>
                    );
                  })}
                </div>
                <div
                  className={styles.filterArrowRight}
                  onClick={() => {
                    document.getElementById(
                      "filterIndustries"
                    ).scrollLeft += 200;
                  }}
                >
                  <ArrowForwardIosIcon />
                </div>
              </div> */}
            </Box>
          </div>
        </Container>
      </div>
      {/* <HomeLazyLoad /> */}
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
            <Grid container spacing={2.8}>
              {data.map((item, index) => {
                return (
                  // <Grid item xs={6} sm={4} md={3} lg={2} xl={12/7} key={index}>
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={index}>
                    <div className={styles.homepageOuterFileContainer}>
                      <Link
                        // href={`/?image=${item.slug}`}
                        // as={`/image/${item.slug}`}
                        href={`/image/${item.slug}`}
                        prefetch={false}
                      >
                        <a
                          className={styles.homepageFileContainer}
                          onClick={() => getFileDetails(index, null)}
                          aria-label={item.slug}
                        >
                          {item.fileType !== "video" ? (
                            <figure className="figure">
                              <Image
                                className={styles.homepageFile}
                                src={`${imageLink}/800x740/${item.file}`}
                                alt={item.postName}
                                width="100%"
                                height="100%"
                                layout="responsive"
                                objectFit="cover"
                                priority = {index<2}
                              />
                              {/* <figcaption className="figcaption">
                                {item.postName}
                              </figcaption> */}
                            </figure>
                          ) : (
                            <>
                              <video
                                className={styles.homepageFile}
                                muted
                                playsInline
                              >
                                <source
                                  src={`${videoLink}/${item.file}`}
                                  type="video/mp4"
                                />
                                <p>
                                  Your browser doesn&apos;t support HTML video.
                                  Here is a
                                  <Link
                                    href={`/?image=${item.slug}`}
                                    aria-label={item.slug}
                                    prefetch={false}
                                  >
                                    <a>link to the video</a>
                                  </Link>{" "}
                                  instead.
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
                            <Link href=''   prefetch={false}>
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
                            {/* {item.likes.length} */}
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
      {nextPage && <div className="loadingContainer">Loading ...</div>}
      {/* <Dialog
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
            onClick={() => router.replace("/")}
          />
          {detailPopupIndex > 0 ? (
            <Link
              href={`/?image=${data[detailPopupIndex - 1].slug}`}
              as={`/image/${data[detailPopupIndex - 1].slug}`}
              prefetch={false}
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
          {detailPopupIndex < data.length - 1 ? (
            <Link
              href={`/?image=${data[detailPopupIndex + 1].slug}`}
              as={`/image/${data[detailPopupIndex + 1].slug}`}
              shallow={true}
              prefetch={false}
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
          <Suspense fallback={`Loading...`}>
            <ImageLandingPopup />
          </Suspense>
        </section>
      </Dialog> */}
    </>
  );
}
