import { Container } from "@mui/system";
import Center from "../../styles/center.module.css";
import Ivcss from "../../styles/imageView.module.css";
import React, { useEffect, useState } from "react";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import Skeleton from "react-loading-skeleton";
import SearchIcon from "@mui/icons-material/Search";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Alert, Grid } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-autocomplete-places";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import popup from "../../styles/popup.module.css";
import Slide from "@mui/material/Slide";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import Link from "next/link";
import Loader from "../../components/loader";
import Router from "next/router";
import Head from "next/head";
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
import WifiCalling3OutlinedIcon from '@mui/icons-material/WifiCalling3Outlined';
import LocalPostOfficeOutlinedIcon from '@mui/icons-material/LocalPostOfficeOutlined';
import HistoryToggleOffOutlinedIcon from '@mui/icons-material/HistoryToggleOffOutlined';
import NoMeetingRoomOutlinedIcon from '@mui/icons-material/NoMeetingRoomOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import job from "../../styles/job.module.css";
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';

var socket, selectedChatCompare;
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
const msg =
  "I need some information from your service center! Give me a good time to speak?";
const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const imageLink = process.env.NEXT_PUBLIC_CDN;
const videoLink = process.env.NEXT_PUBLIC_AWS;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export async function getServerSideProps(context) {
  const { params } = context;
  const { slug } = params;
  const temp = await fetch(`${domain}/api/center/getIdbySlug/${slug}`);
  const tempId = await temp.json();
  const id = tempId.id;
  let data;
  let reviews;
  if (id !== "noData") {
    const res = await fetch(`${domain}/api/center/centerLanding/${id}`);
    let data1 = await res.json();
    data = data1;
    const res1 = await fetch(`${domain}/api/review/getReviews/${id}`);
    let reviews1 = await res1.json();
    reviews = reviews1;
  }
  let metaData = await fetch(`${domain}/api/seo/getSeo/center`);
  let metaDataObj = await metaData.json();

  if (id !== "noData") {
    return {
      props: {
        data: data,
        reviews2: reviews,
        centerId: id,
        metaData: metaDataObj,
        slug: slug,
      },
    };
  } else {
    return {
      props: {
        data: "noData",
        metaData: metaDataObj,
        slug: slug,
      },
    };
  }
}
function CenterLanding({ data, reviews2, centerId, metaData, slug }) {
  let [brand, setBrand] = useState("");
  let [loader, setLoader] = useState(false);
  let [status, setStatus] = useState(false);
  let [addPhotos, setAddPhotos] = useState(false);
  let [likedComments, setLikedComments] = useState([]);
  let [markedCenters, setMarkedCenters] = useState([]);
  let [likedReviews, setLikedReviews] = useState([]);
  let [address, setAddress] = useState([]);
  let [share, setShare] = useState(false);
  let [enquiryData, setEnquiryData] = useState({
    name: "",
    email: "",
    phone: "",
    message: msg,
  });
  let [ratingPopup, setRatingPopup] = useState(false);
  let [review, setReview] = useState("");
  let [userData, setUserData] = useState({});
  let [allBrands, setAllBrands] = useState([]);
  const [averageRating,setAverage]=useState(data.rating)
  let [myId, setMyId] = useState("");
  useEffect(() => {
    console.log(data);
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios.get(`${domain}/api/brand/getBrands`).then((res) => {
      console.log(res.data);
      setAllBrands(res.data);
    });
    if (data == "noData") {
      Router.push("/noComponent");
    }
    if (localStorage.getItem("access_token")) {
      axios.get(`${domain}/api/user/getUserData`, config).then((res) => {
        setMyId(res.data._id);
        console.log(res);
        setUserData(res.data);
        setMarkedCenters(res.data.markedCenters);
        setLikedReviews(res.data.likedReviews);
        setEnquiryData({
          ...enquiryData,
          name: res.data.name,
          phone: res.data.phoneNo,
          email: res.data.email,
        });
      });
    }

    setAddress(data.address && data.address.split(","));
  }, []);
  let [rating, setRating] = useState(0);
  let [reviews1, setReviews1] = useState(reviews2);
  let bookmark = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (localStorage.getItem("access_token")) {
      axios
        .post(`${domain}/api/center/saveCenter/${data._id}`, config)
        .then((res) => {
          console.log(res);
          axios.get(`${domain}/api/user/getUserData`, config).then((res) => {
            console.log(res);
            setMarkedCenters(res.data.markedCenters);
          });
        });
    } else {
      setLoginPopup(true);
    }
  };

  let unbookmark = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    axios
      .post(`${domain}/api/center/unsaveCenter/${data._id}`, config)
      .then((res) => {
        console.log(res);
        axios.get(`${domain}/api/user/getUserData`, config).then((res) => {
          console.log(res);
          setMarkedCenters(res.data.markedCenters);
        });
      });
  };
  let changeHandler = (e) => {
    document.getElementById(`${e.target.id}_error`).style.display = "none";
    if (e.target.id == "phone") {
      console.log(e.target.value);
      if (e.target.value.length > 10) {
      } else {
        setEnquiryData({
          ...enquiryData,
          [e.target.id]: e.target.value,
        });
      }
    } else {
      setEnquiryData({
        ...enquiryData,
        [e.target.id]: e.target.value,
      });
    }
  };
  let askEnquiry = () => {
    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };
    var focusField = "";
    var error = false;
    let fields = ["message"];
    for (let i = 0; i < fields.length; i++) {
      if (enquiryData[fields[i]] === "") {
        if (focusField == "") {
          focusField = fields[i];
        }
        document.getElementById(
          `${fields[i]}_error`
        ).innerHTML = `${fields[i]} is required`;
        document.getElementById(`${fields[i]}_error`).style.display = "block";
      }
    }

    if (
      enquiryData.message !== "" &&
      (enquiryData.message.length < 3 || enquiryData.message.length > 100)
    ) {
      document.getElementById("message_error").innerHTML =
        "message should be between 3 - 100 characters";
      document.getElementById("message_error").style.display = "block";
      error = true;
      if (focusField == "") {
        focusField = "message";
      }
    }
    if (focusField !== "") {
      document.getElementById(focusField).focus();
    } else {
      setLoader(true);

      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      };
      axios
        .post(
          `${domain}/api/enquiry/createEnquiry/${data._id}`,
          {
            emailId: enquiryData.email,
            phoneNo: enquiryData.phone,
            name: enquiryData.name,
            message: enquiryData.message,
          },
          config
        )
        .then((res) => {
          setLoader(false);
          setEnquiryData({
            ...enquiryData,
            message: msg,
          });
          setOpen(false);
          document.getElementById("alert").style.display = "flex";
          socket = io(domain);
          if (res.data.data !== "enquirySent") {
            let tempData = {
              data: res.data.data,
              id: myId,
            };

            socket.emit("hello", tempData);
            socket.emit("refreshMyChats", myId);
          }
          setTimeout(() => {
            if (document.getElementById("alert")) {
              document.getElementById("alert").style.display = "none";
            }
          }, 4000);
        });
    }
  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  let likeReview = (id) => {
    if (!localStorage.getItem("access_token")) {
      // setloginErrorPopup(true);
      //popup
      setLoginPopup(true);
    } else {
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      };
      axios
        .post(
          `${domain}/api/review/likeReview`,
          {
            reviewId: id,
          },
          config
        )
        .then((res) => {
          axios
            .get(`${domain}/api/review/getReviews/${centerId}`)
            .then((res) => {
              console.log(res.data);
              setReviews1(res.data);
            });
          axios.get(`${domain}/api/user/getUserData`, config).then((res) => {
            console.log(res);
            setMarkedCenters(res.data.markedCenters);
            setLikedReviews(res.data.likedReviews);
            setEnquiryData({
              ...enquiryData,
              name: res.data.name,
              phone: res.data.phoneNo,
              email: res.data.email,
            });
          });
        });
    }
  };
  let unlikeReview = (id) => {
    if (!localStorage.getItem("access_token")) {
      // setloginErrorPopup(true);
      //popup
      setLoginPopup(true);
    } else {
      const config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      };
      axios
        .post(
          `${domain}/api/review/unlikeReview`,
          {
            reviewId: id,
          },
          config
        )
        .then((res) => {
          axios
            .get(`${domain}/api/review/getReviews/${centerId}`)
            .then((res) => {
              console.log(res.data);
              setReviews1(res.data);
            });
          axios.get(`${domain}/api/user/getUserData`, config).then((res) => {
            console.log(res);
            setMarkedCenters(res.data.markedCenters);
            setLikedReviews(res.data.likedReviews);
            setEnquiryData({
              ...enquiryData,
              name: res.data.name,
              phone: res.data.phoneNo,
              email: res.data.email,
            });
          });
        });
    }
  };
  let createReview = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (!localStorage.getItem("access_token")) {
      //popup
      setLoginPopup(true);
      setRatingPopup(false);
      setReview("");
      setStatus(false);
    } else {
      if (review.length < 3 || review.length > 500) {
        setRatingPopup(false);
        document.getElementById("review_error").innerHTML =
          "Review should be between 3 - 500 characters";
        document.getElementById("review_error").style.display = "block";
        document.getElementById("review").focus();
      } else {
        axios
          .post(
            `${domain}/api/review/writeReview/${centerId}`,
            {
              review: review,
              rating: rating,
            },
            config
          )
          .then((res) => {
            console.log(res,'resss')
            setAverage(res?.data?.rating)
            setRating(0)
            axios
              .get(`${domain}/api/review/getReviews/${centerId}`)
              .then((res) => {
                console.log(res.data,'oop');
                setReviews1(res.data);
              
              });
            axios.get(`${domain}/api/user/getUserData`, config).then((res) => {
              console.log(res);
              setMarkedCenters(res.data.markedCenters);
              setLikedReviews(res.data.likedReviews);
              setEnquiryData({
                ...enquiryData,
                name: res.data.name,
                phone: res.data.phoneNo,
                email: res.data.email,
              });
            });
            setRatingPopup(false);
            setReview("");
            setStatus(false);
          });
      }
    }
  };
  let [loginPopup, setLoginPopup] = useState(false);
  let enquireNow = () => {
    if (!localStorage.getItem("access_token")) {
      setLoginPopup(true);
    } else {
      setOpen(true);
    }
  };
  let [tempSrc, setTempSrc] = useState(0);
  //test
  let searchBrand = (e) => {
    if (brand !== "") {
      setStatus(true);
    } else {
      setStatus(false);
    }
    setBrand(e.target.value);
    let result = allBrands.filter((allBrands) =>
      allBrands.brand.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setSuggestedBrands(result);
  };
  let [selectedBrands, setSelectedBrands] = useState([]);
  let selectBrand = (item) => {
    var tempBrands = selectedBrands;
    tempBrands.push(item);
    setSelectedBrands([...tempBrands]);
    setIsLoading(true);
    axios
      .post(`${domain}/api/center/filterCenter?page=1`, {
        address: location,
        brands: tempBrands.map((x) => x.brand),
      })
      .then((res) => {
        setCenters([...res.data.results]);
        if (res.data.next) {
          setPage(res.data.next.page);
          setNextPage(true);
        } else {
          setNextPage(false);
        }
        setIsLoading(false);
        console.log(res.data);
      })
      .catch((err) => {
        setIsLoading(false);
      });
    //from all
    const index1 = allBrands.indexOf(item);
    if (index1 > -1) {
      allBrands.splice(index1, 1);
      setAllBrands([...allBrands]);
    }
    //from suggested
    const index2 = suggestedBrands.indexOf(item);
    if (index2 > -1) {
      suggestedBrands.splice(index2, 1);
      setSuggestedBrands([...suggestedBrands]);
    }
  };
  let unSelectBrand = (item) => {
    setIsLoading(true);
    var tempBrands = selectedBrands;
    const index3 = tempBrands.indexOf(item);
    if (index3 > -1) {
      tempBrands.splice(index3, 1);
    }

    setSelectedBrands([...tempBrands]);
    allBrands.unshift(item);
    setAllBrands([...allBrands]);
    suggestedBrands.unshift(item);
    setSuggestedBrands([...suggestedBrands]);
  };
  let [isLoading, setIsLoading] = useState(false);
  let [suggestedBrands, setSuggestedBrands] = useState([]);
  let keyUp = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      let temp = {};
      temp._id = Math.random();
      temp.brand = e.target.value;
      var tempBrands = selectedBrands;
      const checkBrand = (selectedBrands) =>
        selectedBrands.brand === e.target.value;

      if (!selectedBrands.some(checkBrand)) {
        tempBrands.push(temp);
        setSelectedBrands([...tempBrands]);
      }
      setIsLoading(true);

      setBrand("");
    }
  };
  let [location, setLocation] = useState("");
  let handleChange1 = (address) => {
    if (address.trim().length > 0 || address.length === 0) {
      setIsLoading(true);
      // document.getElementById("location_error").style.display = "none";
      setLocation(address);
    }
  };

  let handleSelect = (address) => {
    if (address !== "") {
      console.log(address);
      setLocation(address);
      setIsLoading(true);
    }
  };
  let searchCenters = () => {
    localStorage.setItem("centerLocation", location);
    let temp = JSON.stringify(selectedBrands);
    localStorage.setItem("centerBrands", temp);
    Router.push("/service-center");
  };
  let redirectToLanding = (id) => {
    axios.post(`${domain}/api/user/getRoute/${id}`).then((res) => {
      console.log(res);
      if (res.data !== "booster") {
        Router.push(res.data.path);
      }
    });
  };
  
  console.log(data.rating,'rte')
  return (
    <section style = {{paddingBottom: "50px"}}>
      {data == "noData" ? (
        <>
          <div></div>
        </>
      ) : (
        <>
          <Head>
            <title>
              {metaData.title} {data.centerName}
            </title>
            <meta name="keywords" content={metaData.metaKeywords} />
            <meta name="description" content={metaData.metaDescription} />
            <meta name="title" content={metaData.metaTitle} />
            <link rel="icon" href="/favicon.ico" />
            <meta
              property="og:image"
              content={`${imageLink}/150x150/${data.profilePic}`}
            />
          </Head>
          <div style={{ position: "relative" }}>
            <Alert
              id="alert"
              severity="success"
              style={{
                position: "fixed",
                width: "100%",
                border: "1px solid #e5e5e5",
                zIndex: "1000",
                display: "none",
                top: "80px",
              }}
            >
              Your enquiry has been sent to service center, they will contact
              you soon!!
            </Alert>
            <Container maxWidth="xxl">
              <Grid
                container
                spacing={7}
                // direction={{
                //   xl: "row",
                //   lg: "row",
                //   md: "row",
                //   sm: "column-reverse",
                //   xs: "column-reverse",
                // }}
              >
                <Grid item xl={8} lg={8} md={8} sm={12} xs={12}>
                  <div className={Center.centerDetailsContainer1}>
                    <div style={{ position: "relative" }}>
                      <div
                        className={Center.overLay}
                        onClick={() => setStatus(false)}
                        style={{ position: "relative" }}
                      ></div>
                      <img
                        src={`${imageLink}/${data.coverPic}`}
                        onClick={() => setStatus(false)}
                        data-src=""
                        loading="lazy"
                        className={Center.coverPic}
                      />
                    </div>
                    <div className = {Center.bookmarkShareIcon}>
                      {markedCenters.includes(data._id) ? (
                        <IconButton onClick={unbookmark} className={job.jobApplyIconBtn} style = {{marginRight: "15px"}}>
                          <BookmarkIcon className={job.jobApplyIcon} style = {{color: "#00A4E2"}}/>
                        </IconButton>
                      ) : (
                        <IconButton onClick={bookmark} className={job.jobApplyIconBtn} style = {{marginRight: "15px"}}>
                          <BookmarkBorderIcon className={job.jobApplyIcon} style = {{color: "#00A4E2"}}/>
                        </IconButton>
                      )}
                      <IconButton onClick={() => setShare(true)} className={job.jobApplyIconBtn}>
                        <ShareOutlinedIcon className={job.jobApplyIcon}/>
                      </IconButton>
                    </div>
                    <div className={Center.centerDetailsInnerContainer1}>
                      <div className={Center.profilePicImgContainer}>
                        <img
                          src={`${imageLink}/150x150/${data.profilePic}`}
                          className={Center.profilePic}
                          data-src=""
                          loading="lazy"
                        />
                      </div>
                      <div className={Center.centerTitleEnquireContainer}>
                        <div>
                          <div className={Center.centerTitleContainer}>
                            <div className = {Center.centerTitle}>
                              {data.centerName} &nbsp;
                            </div>
                            <span style={{ display: "inline-flex", color: "gold" }}>
                              {averageRating >= 1 ? (
                                <StarRoundedIcon sx={{ color: "gold" }} />
                              ) : (
                                <StarBorderRoundedIcon />
                              )}
                              {averageRating >= 2 ? (
                                <StarRoundedIcon sx={{ color: "gold" }} />
                              ) : (
                                <StarBorderRoundedIcon />
                              )}
                              {averageRating >= 3 ? (
                                <StarRoundedIcon sx={{ color: "gold" }} />
                              ) : (
                                <StarBorderRoundedIcon />
                              )}
                              {averageRating >= 4 ? (
                                <StarRoundedIcon sx={{ color: "gold" }} />
                              ) : (
                                <StarBorderRoundedIcon />
                              )}
                              {averageRating >= 5 ? (
                                <StarRoundedIcon sx={{ color: "gold" }} />
                              ) : (
                                <StarBorderRoundedIcon />
                              )}
                            </span>
                          </div>
                          <div className={Center.centerLocation}>
                            {address[0]}, {address[1] ? address[1] : ""}.
                          </div>
                        </div>
                        <button
                          className={Center.centerEnquireBtn}
                          onClick={enquireNow}
                          style={{
                            pointerEvents:
                              userData._id === data.userId ? "none" : "auto",
                            opacity: userData._id === data.userId ? "0.5" : "1",
                          }}
                        >
                          Enquire Now
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className={Center.centerDetailsContainer2}>
                    <div>
                      <div className={Center.subHeading}>About</div>
                      <div className={Center.description}>{data.description}</div>
                      <div className={Center.subHeading}>
                        Brands we can service
                      </div>
                      <div style = {{paddingTop: "10px", marginBottom:"30px"}}>
                        {data.brandOfDrones &&
                          data.brandOfDrones.map((item, i) => {
                            return (
                              <div className={Center.brand} key={i}>
                                {item}
                              </div>
                            );
                          })}
                      </div>
                      {data.services && data.services[0] && (
                        <div className={Center.subHeading}>
                          Services we offer:
                        </div>
                      )}

                      <div style = {{paddingTop: "10px", marginBottom:"30px"}}>
                        {data.services &&
                          data.services[0] &&
                          data.services.map((item, i) => {
                            return (
                              <div className={Center.brand} key={i}>
                                {item}
                              </div>
                            );
                          })}
                      </div>
                      <div className={Center.subHeading}>
                        Additional Photos :
                      </div>
                    <Grid container spacing={2.8}>
                      {data.images &&
                        data.images.map((item, i) => {
                          return (
                            <Grid
                              item
                              xl={3}
                              lg={3}
                              md={4}
                              sm={4}
                              xs={6}
                              key={i}
                              onClick={() => setTempSrc(i)}
                            >
                              <div
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  cursor: "pointer",
                                }}
                              >
                                <img
                                  src={`${imageLink}/300x300/${item}`}
                                  style={{
                                    height: "100%",
                                    width: "100%",
                                    objectFit: "contain",
                                    borderRadius: "10px",
                                  }}
                                  onClick={() => setAddPhotos(true)}
                                  data-src=""
                                  loading="lazy"
                                />
                              </div>
                            </Grid>
                          );
                        })}
                    </Grid>
                      <Grid
                        container
                        spacing={1}
                        style={{ marginTop: "20px", marginBottom: "20px" }}
                      >
                        <Grid item xl={9} lg={9} md={9} sm={12} xs={12}>
                          <button
                            className={Center.writeReview}
                            onClick={() => setStatus(!status)}
                          >
                            Write Review
                          </button>

                          <div
                            className={Center.subHeading}
                          >
                            Reviews
                          </div>
                          {status ? (
                            <>
                              <textarea
                                className="inputBox"
                                style={{
                                  height: "100px",
                                  resize: "none",
                                  marginTop: "10px",
                                  outline: "1px solid  gray",
                                  paddingTop: "10px",
                                }}
                                value={review}
                                id="review"
                                onChange={(e) => {
                                  setReview(e.target.value);
                                  document.getElementById(
                                    "review_error"
                                  ).style.display = "none";
                                }}
                              />
                              {review !== "" ? (
                                <button
                                  className={Center.writeReview}
                                  onClick={() => setRatingPopup(true)}
                                >
                                  Submit
                                </button>
                              ) : (
                                <button
                                  className={Center.writeReview}
                                  onClick={() => setStatus(false)}
                                >
                                  Close
                                </button>
                              )}
                            </>
                          ) : (
                            <></>
                          )}
                          <div className="input_error_msg" id="review_error">
                            Review should be between 3 - 100
                          </div>
                          {reviews1.length == 0 ? (
                            <>
                              <div className="HideTitle">
                                Be the first one to review
                              </div>
                            </>
                          ) : (
                            <></>
                          )}
                          {reviews1.map((item, i) => {
                            return (
                              <>
                                <div>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      marginTop: "20px",
                                    }}
                                  >
                                    <div
                                      style={{
                                        height: "45px",
                                        width: "45px",
                                      }}
                                    >
                                      <img
                                        src={`${imageLink}/45x45/${item.userId.profilePic}`}
                                        style={{
                                          height: "100%",
                                          width: "100%",
                                          borderRadius: "50%",
                                          cursor: "pointer",
                                        }}
                                        data-src=""
                                        loading="lazy"
                                        onClick={() =>
                                          redirectToLanding(item.userId._id)
                                        }
                                      />
                                    </div>
                                    <div
                                      className={`${Ivcss.ivComName} ${Ivcss.ivCommentTitle}`}
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        redirectToLanding(item.userId._id)
                                      }
                                    >
                                      {item.userId.name}
                                      <span
                                        style={{
                                          display: "inline-flex",
                                          color: "gold",
                                          marginLeft: "5px",
                                        }}
                                      >
                                        {item.rating >= 1 ? (
                                          <StarRoundedIcon
                                            sx={{
                                              color: "gold",
                                              fontSize: "1rem",
                                            }}
                                          />
                                        ) : (
                                          <StarBorderRoundedIcon
                                            sx={{ fontSize: "1rem" }}
                                          />
                                        )}
                                        {item.rating >= 2 ? (
                                          <StarRoundedIcon
                                            sx={{
                                              color: "gold",
                                              fontSize: "1rem",
                                            }}
                                          />
                                        ) : (
                                          <StarBorderRoundedIcon
                                            sx={{ fontSize: "1rem" }}
                                          />
                                        )}
                                        {item.rating >= 3 ? (
                                          <StarRoundedIcon
                                            sx={{
                                              color: "gold",
                                              fontSize: "1rem",
                                            }}
                                          />
                                        ) : (
                                          <StarBorderRoundedIcon
                                            sx={{ fontSize: "1rem" }}
                                          />
                                        )}
                                        {item.rating >= 4 ? (
                                          <StarRoundedIcon
                                            sx={{
                                              color: "gold",
                                              fontSize: "1rem",
                                            }}
                                          />
                                        ) : (
                                          <StarBorderRoundedIcon
                                            sx={{ fontSize: "1rem" }}
                                          />
                                        )}
                                        {item.rating >= 5 ? (
                                          <StarRoundedIcon
                                            sx={{
                                              color: "gold",
                                              fontSize: "1rem",
                                            }}
                                          />
                                        ) : (
                                          <StarBorderRoundedIcon
                                            sx={{ fontSize: "1rem" }}
                                          />
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                  <div style={{ cursor: "pointer" }}>
                                    {likedReviews.includes(item._id) ? (
                                      <button
                                        className={Ivcss.ivcommentLike}
                                        onClick={() => unlikeReview(item._id)}
                                        style={{ cursor: "pointer" }}
                                      >
                                        <FavoriteIcon />
                                        {item.likes.length}
                                      </button>
                                    ) : (
                                      <button
                                        className={Ivcss.ivcommentLike}
                                        style={{
                                          color: "#000000",
                                          cursor: "pointer",
                                        }}
                                        onClick={() => likeReview(item._id)}
                                      >
                                        <FavoriteIcon
                                          style={{ color: "#a6a6a6" }}
                                        />
                                        {item.likes.length}
                                      </button>
                                    )}

                                    <div className={Ivcss.commentActual}>
                                      {item.review}
                                    </div>
                                  </div>
                                </div>
                                {i != reviews1.length - 1 && (
                                  <hr className={Ivcss.ivHr} />
                                )}
                              </>
                            );
                          })}
                        </Grid>
                      </Grid>
                    </div>
                  </div>
                </Grid>
                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={4}
                  sm={12}
                  xs={12}
                  style={{ position: "relative" }}
                >
                  <div className={Center.rightDiv}>
                    <div className={Center.rightDivTitle}>Services Center Details</div>
                    <div className = {Center.detContainer}>
                      <WifiCalling3OutlinedIcon className={Center.descTitle}/>
                      <div className={Center.descDesc}>
                        {" "}
                        <a href={`tel:${data.phoneNo}`}>
                          {" "}
                          <div
                            style={{ fontSize: "14px", display: "inline-block" }}
                          >
                            {data.phoneNo}{" "}
                          </div>
                        </a>{" "}
                        {data.secondaryNumber ? "," : ""}{" "}
                        {data.secondaryNumber ? (
                          <a href={`tel:${data.secondaryNumber}`}>
                            {" "}
                            <div
                              style={{
                                fontSize: "14px",
                                display: "inline-block",
                              }}
                            >
                              {data.secondaryNumber}{" "}
                            </div>
                          </a>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                    <div className = {Center.detContainer}>
                      <LocalPostOfficeOutlinedIcon className={Center.descTitle}/>
                      <a className="link" href={`mailto:${data.email}`}>
                        <div className={Center.descDesc}>{data.email}</div>
                      </a>
                    </div>
                    <div className = {Center.detContainer}>
                      <HistoryToggleOffOutlinedIcon  className={Center.descTitle}/>
                      <div className={Center.descDesc}>{data.workingHours}</div>
                    </div>
                    <div className = {Center.detContainer}>
                      <NoMeetingRoomOutlinedIcon  className={Center.descTitle}/>
                          <span
                            className={Center.descDesc}
                            style={{ display: "block" }}
                          >
                            {data.holidays.map((item, i) => {
                              return (
                                  `${item}, `
                              );
                            })} 
                          </span>
                    </div>
                    <div className = {Center.detContainer}>
                      <PlaceOutlinedIcon className={Center.descTitle}/>
                      <div className={Center.descDesc}>{data.address}</div>
                    </div>
                    <div className = {Center.detContainer}>
                      <CalendarMonthOutlinedIcon className={Center.descTitle}/>
                      <div className={Center.descDesc}>
                        {data.establishedYear}
                      </div>
                    </div>
                    <div className = {Center.detContainer}>

                    </div>
                    {data.whatsappNo ? (
                      <div className = {Center.detContainer}>
                        <WifiCalling3OutlinedIcon className={Center.descTitle}/>
                        <a
                          href={
                            "https://api.whatsapp.com/send/?phone=+91 " +
                            data.whatsappNo +
                            "&text=Hello"
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          <div className={Center.descDesc}>
                            {data.whatsappNo}
                          </div>
                        </a>
                      </div>
                    ) : (
                      <></>
                    )}
                    {data.website ? (
                      <div className = {Center.detContainer}>
                        <LanguageOutlinedIcon className={Center.descTitle}/>
                        <div className={Center.descDesc}>{data.website}</div>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
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
              <div className={popup.popupContainer}>
                <div className={popup.closeBtn} onClick={handleClose}>
                  <CloseRoundedIcon style={{ fontSize: "30px" }} />
                </div>
                <div className={popup.popupHead}>
                  Enquire to service center to initialize chat
                </div>

                <label className="inputLabel" htmlFor="message">
                  Message
                </label>

                <textarea
                  id="message"
                  type="text"
                  className="inputBox"
                  style={{
                    height: "100px",
                    paddingTop: "10px",
                    width: "100%",
                    resize: "none",
                  }}
                  value={enquiryData.message}
                  onChange={changeHandler}
                />
                <div className="input_error_msg" id="message_error">
                  Message is required
                </div>
                <center>
                  {loader ? (
                    <div className={popup.popupSubmit}>
                      <Loader />
                      Starting
                    </div>
                  ) : (
                    <div className={popup.popupSubmit} onClick={askEnquiry}>
                      Start Chat
                    </div>
                  )}
                </center>
              </div>
            </Dialog>
            <Dialog
              open={ratingPopup}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => setRatingPopup(false)}
              aria-describedby="alert-dialog-slide-description"
            >
              <div className={"sharePopupContainer"}>
                <div className={"sharePopupTitle"}>Choose Rating</div>
                <div style={{ marginTop: "15px" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      color: "gold",
                      fontSize: "50px",
                      cursor: "pointer",
                    }}
                  >
                   


                    {rating >= 1 ? (
                      <StarRoundedIcon
                        sx={{ color: "gold", fontSize: "30px" }}
                        onClick={() => setRating(1)}
                      />
                    ) : (
                      <StarBorderRoundedIcon
                        sx={{ color: "gold", fontSize: "30px" }}
                        onClick={() => setRating(1)}
                      />
                    )}
                    {rating >= 2 ? (
                      <StarRoundedIcon
                        sx={{ color: "gold", fontSize: "30px" }}
                        onClick={() => setRating(2)}
                      />
                    ) : (
                      <StarBorderRoundedIcon
                        sx={{ color: "gold", fontSize: "30px" }}
                        onClick={() => setRating(2)}
                    
                      />
                    )}
                    {rating >= 3 ? (
                      <StarRoundedIcon
                        sx={{ color: "gold", fontSize: "30px" }}
                        onClick={() => setRating(3)}
                      />
                    ) : (
                      <StarBorderRoundedIcon
                        sx={{ color: "gold", fontSize: "30px" }}
                        onClick={() => setRating(3)}

                      />
                    )}
                    {rating >= 4 ? (
                      <StarRoundedIcon
                        sx={{ color: "gold", fontSize: "30px" }}
                        onClick={() => setRating(4)}
                      />
                    ) : (
                      <StarBorderRoundedIcon
                        sx={{ color: "gold", fontSize: "30px" }}
                        onClick={() => setRating(4)}
                      
                      />
                    )}
                    {rating >= 5 ? (
                      <StarRoundedIcon
                        sx={{ color: "gold", fontSize: "30px" }}
                        onClick={() => setRating(5)}
                      />
                    ) : (
                      <StarBorderRoundedIcon
                        sx={{ color: "gold", fontSize: "30px" }}
                        onClick={() => setRating(5)}
                       
                      />
                    )}
                  </span>
                </div>
                <center>
                  <button className={popup.popupSubmit} onClick={createReview}>
                    Submit
                  </button>
                </center>
              </div>
            </Dialog>
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
              open={addPhotos}
              TransitionComponent={Transition}
              keepMounted
              onClose={() => setAddPhotos(false)}
              aria-describedby="alert-dialog-slide-description"
            >
              <div className="popupImage">
                <ClearRoundedIcon
                  className="popupClose1"
                  onClick={() => setAddPhotos(false)}
                />
                <ChevronRightIcon
                  className="popupright"
                  onClick={() => {
                    if (tempSrc + 1 >= 0 && tempSrc + 1 < data.images.length) {
                      setTempSrc(tempSrc + 1);
                    } else {
                      setAddPhotos(false);
                    }
                  }}
                />
                <ChevronLeftIcon
                  className="popupleft"
                  onClick={() => {
                    if (tempSrc - 1 >= 0 && tempSrc - 1 < data.images.length) {
                      setTempSrc(tempSrc - 1);
                    } else {
                      setAddPhotos(false);
                    }
                  }}
                />
                <div>
                  <img
                    src={`${imageLink}/${data.images[tempSrc]}`}
                    className={Center.popupImages}
                    data-src=""
                    loading="lazy"
                  />
                </div>
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
                    url={baseUrl + "/service-center/" + slug}
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
                    url={baseUrl + "/service-center/" + slug}
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
                    url={baseUrl + "/service-center/" + slug}
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
                    url={baseUrl + "/service-center/" + slug}
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
          </div>
        </>
      )}
    </section>
  );
}

export default CenterLanding;
