import Container from "@mui/system/Container";
import React, { useState, useEffect } from "react";
import search from "../../styles/search.module.css";
import styles from "../../styles/Home.module.css";
import SearchIcon from "@mui/icons-material/Search";
import "../../styles/Home.module.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import Router, { useRouter } from "next/router";
import PlayCircleOutlineOutlinedIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import Link from "next/link";
import Grid from "@mui/material/Grid";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Image from "next/image";
import Ivcss from "../../styles/imageView.module.css";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ImageLandingPopup from "../../components/imageLandingPopup";
import Head from "next/head";
import { IconButton } from "@mui/material";

const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const imageLink = process.env.NEXT_PUBLIC_CDN;
const videoLink = process.env.NEXT_PUBLIC_AWS;
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export async function getServerSideProps(context) {
  const { params } = context;
  const { keyword } = params;
  let data = [];
  let nextPage = false
  await axios
    .post(`${domain}/api/image/getSearchImages?page=1`, {
      data: keyword,
      sort: "all",
    })
    .then((res) => {
      data = res.data.results;
      nextPage = res.data.next?true:false
    });
  return {
    props: {
      keyword: keyword,
      data1: data,
      isNextPage: nextPage
    },
  };
}
function Keyword({ keyword, data1, isNextPage }) {
  const router = useRouter();
  const [data, setData] = useState(data1);
  const [likedFiles, setLikedFiles] = useState([]);
  const [activeFileType, setActiveFileType] = useState("all");
  const [keywordFilter, setKeywordFilter] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [showUserIndex, setShowUserIndex] = useState("");
  const [user, setUser] = useState({});
  const [loginPopup, setLoginPopup] = useState(false);
  const [page, setPage] = useState(2);
  const [nextPage, setNextPage] = useState(isNextPage);
  const [dropdownFilter, setDropdownFilter] = useState("");
  const [filterInput, setFilterInput] = useState("");
  const [detailPopupIndex, setDetailPopupIndex] = useState(0)
  const topSearches = [
    { link: "beach", title: "Beach" },
    { link: "water", title: "Water" },
    { link: "nature pics", title: "Nature Pics" },
    { link: "cinematography", title: "Cinematography" },
    { link: "ariel shots", title: "Ariel Shots" },
    { link: "agriculture", title: "Agriculture" },
    { link: "construction", title: "Construction" },
    { link: "infrastructure", title: "Infrastructure" },
  ];
  useEffect(() => {
    console.log(data1);
    if (!router.query.image){
      axios
        .post(`${domain}/api/image/getSearchImages?page=1`, {
          data: keyword,
          sort: "all",
        })
        .then((res) => {
          setData(res.data.results);
        });
    }
  }, [router.asPath]);
  let moveRight = () => {
    document.getElementById("tags").scrollBy(100, 0);
  };
  let moveLeft = () => {
    document.getElementById("tags").scrollBy(-100, 0);
  };
  let [sort, setSort] = useState("all");
  let changeSort = (e) => {
    window.scrollTo(0, 0);
    console.log(e.target.value);
    setSort(e.target.value);
    axios
      .post(`${domain}/api/image/getSearchImages?page=1`, {
        data: keyword,
        sort: e.target.value,
      })
      .then((res) => {
        setData(res.data.results);
      });
  };

  //from home page
  const LikeFile = (id, index) => {
    let config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (!localStorage.getItem("access_token")) {
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
      const wrappedElement = document.getElementById("mainDiv");
      if (
        wrappedElement.getBoundingClientRect().bottom <=
        window.innerHeight + 1
      ) {
        if (nextPage) {
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
    if (localStorage.getItem("access_token")) {
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
  }, []);

  const redirectPilotLanding = (id) => {
    console.log(id);
    axios.post(`${domain}/api/pilot/getPilotId`, { userId: id }).then((res) => {
      if (res.data[0]) {
        console.log(res.data[0]);
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

  let sendToImageView = (id) => {
    Router.push(`/image/${id}`);
  };

  let searchSubmit = (e) => {
    e.preventDefault()
    let slug = document.getElementById("searchInput").value
    console.log(slug)
    Router.push(`/search/${slug}`);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const loadMore = () => {
    console.log(page);
    window.removeEventListener("scroll", handleScroll);
    axios
      .post(`${domain}/api/image/homepage?page=${page}`, {
        keyword: dropdownFilter,
        type: activeFileType,
        data: filterInput,
        token: localStorage.getItem("access_token"),
      })
      .then((res) => {
        console.log(res.data);
        setData([...data, ...res.data.results]);
        if (res.data.next) {
          setNextPage(true);
          setPage(res.data.next.page);
          window.addEventListener("scroll", handleScroll);
        } else {
          setNextPage(false);
          window.removeEventListener("scroll", handleScroll);
        }
      })
      .catch((err) => {
        setNextPage(false);
        window.removeEventListener("scroll", handleScroll);
      });
  };

  const searchFilter = (type, keyword, data) => {
    console.log(type, keyword, data);
    axios
      .post(`${domain}/api/image/homepage?page=1`, {
        keyword: keyword,
        type: type,
        data: data,
        token: localStorage.getItem("access_token"),
      })
      .then((res) => {
        scrollTo(0, 0);
        setData([...res.data.results]);
        if (res.data.next) {
          setNextPage(true);
          setPage(res.data.next.page);
        } else {
          setNextPage(false);
        }
      });
  };
  const loadPrevShot = () => {
    setDetailPopupIndex(detailPopupIndex-1)
  }

  const loadNextShot = () => {
    if (detailPopupIndex >= data.length-2 && nextPage){
      console.log("Loadmore");
      loadMore();
    }
    setDetailPopupIndex(detailPopupIndex+1)
  }

  //from home page
  return (
    <>
      <Head>
        <title>Search page</title>
        <meta name="keywords" content= "Search content"/>
        <meta name="description" content="Search description" />
        <meta name="title" content="Search title" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ position: "relative", paddingBottom: "50px" }} id="mainDiv">
        {/* //nav */}
        <div className={search.nav}>
          <Container maxWidth = "xxl">
            <form className={search.navContainer} onSubmit = {searchSubmit}>
              {/* <h5 className={search.title}>{keyword} Images</h5> */}
              <input type = "text" className = {search.searchInput} placeholder="Search for drone shots" id = "searchInput"/>
              <IconButton color="primary" aria-label="upload picture" component="label" className = {search.searchIcon} onClick = {searchSubmit}>
                <SearchIcon className = {search.searchIconInner}/>
              </IconButton>
              {/* <select
                className={search.dropDown}
                value={sort}
                onChange={changeSort}
              >
                <option className={search.option} value="all">
                  Sort by: All
                </option>
                <option className={search.option} value="views">
                  Sort by: Views
                </option>
                <option className={search.option} value="likes">
                  Sort by: Likes
                </option>
                <option className={search.option} value="downloads">
                  Sort by: Downloads
                </option>
                <option className={search.option} value="comments">
                  Sort by: Comments
                </option>
              </select> */}
            </form>
          </Container>
        </div>
        {/* //content */}
        <Container sx={{ marginTop: "20px" }} maxWidth = "xxl">
          <div className={search.similar}>Top Searches</div>
          <div className={search.similarSearchContainer}>
            <div className={search.tags} id="tags">
              <ChevronLeftIcon className={search.leftarrrow} onClick={moveLeft} />
              <ChevronRightIcon
                className={search.rightarrow}
                onClick={moveRight}
              />
              {topSearches.map((item, index) => {
                return (
                  <Link href={`/search/${item.link}`} key={index}>
                    <a
                      className={`${search.tag}`}
                      aria-label={item.link}
                      prefetch={false}
                    >
                      <span className={search.tagText}>{item.title}</span>
                    </a>
                  </Link>
                );
              })}
            </div>
          </div>
          {data.length == 0 ? (
            <center>
              <div className={search.noImages}>
                There are no media based on your search, explore from our top
                searches above.
              </div>
            </center>
          ) : (
            <></>
          )}
          <Grid container spacing={2.8}>
            {data.map((item, index) => {
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={index}>
                  <div className={styles.homepageOuterFileContainer}>
                    <Link href={`/search/${router.query.keyword}/?image=${item.slug}`}>
                      <a
                        className={styles.homepageFileContainer}
                        onFocus={() => mouseOver(index)}
                        onMouseOver={() => mouseOver(index)}
                        onMouseLeave={() => mouseLeave(index)}
                        onClick = {()=>setDetailPopupIndex(index)}
                        aria-label={item.slug}
                        prefetch={false}
                      >
                        {item.fileType !== "video" ? (
                          <figure className="figure">
                            <Image
                              src={`${imageLink}/500x450/${item.file}`}
                              className={styles.homepageFile}
                              alt={item.postName}
                              width="100%"
                              height="100%"
                              layout="responsive"
                              objectFit="cover"
                              priority={index<2}
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
                          onClick={() => redirectPilotLanding(item.userId, index)}
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
                              className="pilotName"
                              aria-label={item.name}
                              prefetch={false}
                            >
                              {item.name}
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
          {nextPage && <div className="loadingContainer">Loading ...</div>}
        </Container>
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
              <Link href="/login">
                <div className="popupLoginBtn">Login/Signup</div>
              </Link>
            </center>
          </div>
        </Dialog>
        <Dialog
            open={!!router.query.image}
            onClose={() => router.replace(`/search/${router.query.keyword}`)}
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
              <ClearRoundedIcon sx = {{cursor: "pointer", position: "absolute", top: "10px", left: '10px', fontSize: "30px", zIndex: "999"}} onClick = {() => router.replace(`/search/${router.query.keyword}`)}/>
            
              {detailPopupIndex > 0 && !!router.query.image
                ?<Link href = {`/search/${router.query.keyword}?image=${data[detailPopupIndex-1].slug}`} ><a onClick = {loadPrevShot} className={Ivcss.ivLeftBtnContainer} style={{ zIndex: 999 }} aria-label="prev-link" prefetch={false}>  <ChevronLeftOutlinedIcon className={Ivcss.ivLeftBtn} /></a></Link>
                :""
              }
              {detailPopupIndex < data.length-1 && !!router.query.image
                ?<Link href = {`/search/${router.query.keyword}?image=${data[detailPopupIndex+1].slug}`} ><a onClick = {loadNextShot} className={Ivcss.ivRightBtnContainer} style={{ zIndex: 999 }} aria-label="next-link" prefetch={false}><ChevronRightOutlinedIcon className={Ivcss.ivRightBtn} /></a></Link>
                :""
              }
              <ImageLandingPopup />
            </section>
          </Dialog>
        
      </div>
    </>
  );
}

export default Keyword;
