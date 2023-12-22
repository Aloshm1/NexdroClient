import { Alert, Box, Grid } from "@mui/material";
import { Container } from "@mui/system";
import React, { useEffect, useState } from "react";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import Link from "next/link";
import IconButton from "@mui/material/IconButton";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-autocomplete-places";
import styles from "../../styles/center.module.css";
import Router from "next/router";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SearchIcon from "@mui/icons-material/Search";
import Dialog from "@mui/material/Dialog";
import popup from "../../styles/popup.module.css";
import Slide from "@mui/material/Slide";
import axios from "axios";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Button from "@mui/material/Button";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Loader from "../../components/loader";
import Head from "next/head";
import io from "socket.io-client";
import CircularProgress from '@mui/material/CircularProgress';
import Script from "next/script";

var socket, selectedChatCompare;
const domain = process.env.NEXT_PUBLIC_LOCALHOST;
const imageLink = process.env.NEXT_PUBLIC_CDN;
const videoLink = process.env.NEXT_PUBLIC_AWS;
const localhost = process.env.NEXT_PUBLIC_LOCALHOST;
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
const msg =
  "I need some information from your service center! Give me a good time to speak?";
export async function getServerSideProps(context) {
  let data = [];
  await axios
    .post(`${domain}/api/center/filterCenter?page=1`, {
      address: "",
      brands: [],
    })
    .then((res) => {
      console.log(res);
      data = res.data;
    });
  let metaData = await fetch(`${domain}/api/seo/getSeo/centers`);
  let metaDataObj = await metaData.json();
  return {
    props: {
      data: data,
      metaData: metaDataObj,
    },
  };
}
function ServiceCenter({ data, metaData }) {
  let [loader, setLoader] = useState(false);
  let [centers, setCenters] = useState(data.results);
  let [allBrands, setAllBrands] = useState([]);
  let [location, setLocation] = useState("");
  let [suggestedBrands, setSuggestedBrands] = useState([]);
  let [page, setPage] = useState(2);
  let [nextPage, setNextPage] = useState(data.next ? true : false);
  let [loadMoreLoading, setLoadMoreLoading] = useState(false);
  let [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [userData, setUserData] = useState({});

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
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    console.log(data);
    axios.get(`${domain}/api/brand/getBrands`).then((res) => {
      console.log(res.data);
      setAllBrands(res.data);
    });
    if (localStorage.getItem("access_token")) {
      axios.get(`${domain}/api/user/getUserData`, config).then((res) => {
        console.log(res);
        setUserData(res.data);
        setEnquiryData({
          ...enquiryData,
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phoneNo,
        });
      });
    }
    if (localStorage.getItem("centerLocation")) {
      let brands = JSON.parse(localStorage.getItem("centerBrands"));
      let tempLocation = localStorage.getItem("centerLocation");
      setSelectedBrands(brands);
      setLocation(tempLocation);
      axios
        .post(`${domain}/api/center/filterCenter?page=1`, {
          address: tempLocation,
          brands: brands.map((x) => x.brand),
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
      localStorage.removeItem("centerLocation");
      localStorage.removeItem("centerBrands");
    }
  }, []);
  let [brand, setBrand] = useState("");
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
    setSelectedBrands([...tempBrands]);
    allBrands.unshift(item);
    setAllBrands([...allBrands]);
    suggestedBrands.unshift(item);
    setSuggestedBrands([...suggestedBrands]);
  };
  let [status, setStatus] = useState(false);
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
      setBrand("");
    }
  };
  let handleChange1 = (address) => {
    if (address.trim().length > 0 || address.length === 0) {
      setIsLoading(true);
      // document.getElementById("location_error").style.display = "none";
      setLocation(address);
      axios
        .post(`${domain}/api/center/filterCenter?page=1`, {
          address: address,
          brands: selectedBrands.map((x) => x.brand),
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
    }
  };

  const joinNow = () => {
    let role = localStorage.getItem("role");
    if (role === "booster") {
      Router.push("/create-center");
    } else {
      Router.push("/register");
    }
  };

  let handleSelect = (address) => {
    if (address !== "") {
      console.log(address);
      setLocation(address);
      setIsLoading(true);
      axios
        .post(`${domain}/api/center/filterCenter?page=1`, {
          address: address,
          brands: selectedBrands.map((x) => x.brand),
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
    }
  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  let [enquiryData, setEnquiryData] = useState({
    name: "",
    email: "",
    phone: "",
    message: msg,
  });
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
          `${domain}/api/enquiry/createEnquiry/${tempId}`,
          {
            emailId: enquiryData.email,
            phoneNo: enquiryData.phone,
            name: enquiryData.name,
            message: enquiryData.message,
          },
          config
        )
        .then((res) => {
          setEnquiryData({
            ...enquiryData,
            message: msg,
          });
          setOpen(false);
          setLoader(false);
          document.getElementById("alert").style.display = "flex";
          socket = io(localhost);
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

  const loadMore = () => {
    setLoadMoreLoading(true);
    setNextPage(false);
    axios
      .post(`${domain}/api/center/filterCenter?page=${page}`, {
        address: location,
        brands: selectedBrands.map((x) => x.brand),
      })
      .then((res) => {
        setCenters([...centers, ...res.data.results]);
        if (res.data.next) {
          setPage(res.data.next.page);
          setNextPage(true);
        } else {
          setNextPage(false);
        }
        setLoadMoreLoading(false);
        console.log(res.data);
      })
      .catch((err) => {
        setLoadMoreLoading(false);
      });
  };

  let [tempId, setTempId] = useState("");
  let serchFilter = () => {
    if (selectedBrands.length == 0 && location == "") {
      document.getElementById("locationInput").focus();
    } else {
      setIsLoading(true);
      setStatus(false);
      setBrand("");
      axios
        .post(`${domain}/api/center/filterCenter?page=1`, {
          address: location,
          brands: selectedBrands.map((x) => x.brand),
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
    }
  };
  let [loginPopup, setLoginPopup] = useState(false);
  let enquireNow = (id) => {
    if (!localStorage.getItem("access_token")) {
      setLoginPopup(true);
    } else {
      setOpen(true);
      setTempId(id);
    }
  };
  let [centerButton, setCenterButton] = useState(false);
  let [myId, setMyId] = useState("");
  useEffect(() => {
    const config = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    };
    if (localStorage.getItem("access_token")) {
      axios.post(`${domain}/api/user/checkUser`, config).then((res) => {
        setMyId(res.data._id);
      });
    }
    if (!localStorage.getItem("access_token")) {
      setCenterButton(true);
    }
    if (localStorage.getItem("role") == "booster") {
      setCenterButton(true);
    }
  }, []);
  let navigate = () => {
    if (!localStorage.getItem("access_token")) {
      Router.push("/login");
      localStorage.setItem("lastTab", "service-center");
    }
    if (localStorage.getItem("role") == "booster") {
      Router.push("/create-center");
    }
  };
  return (
    <div style={{ backgroundColor: "#f8fafb", position: "relative" }}>
      <Head>
        <title>{metaData.title}</title>
        <meta name="keywords" content={metaData.metaKeywords} />
        <meta name="description" content={metaData.metaDescription} />
        <meta name="title" content={metaData.metaTitle} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {centerButton ? (
        <div className="listCenterContainer">
          <Container
            maxWidth = "xxl"
            style={{ display: "flex", alignItems: "center" }}
          >
            <Box
              className="listCenterImgContainer"
              sx={{ display: { xs: "none", md: "block" } }}
            >
              <img src="https://cdn-icons-png.flaticon.com/512/2720/2720641.png" alt="hero" />
            </Box>
            <div className="listCenterTextContainer">
              <div className="listCenterText">
                <span className="listCenterTitle">
                  List your service center
                </span>
                <span className="listCenterContent">
                  {" "}
                  and get connected with drone pilots networks &#38; generate
                  business.
                </span>
              </div>
            </div>
            <button
              className="formBtn8"
              style={{ color: "white" }}
              onClick={joinNow}
            >
              Join Now
            </button>
          </Container>
        </div>
      ) : (
        <></>
      )}
      <div className={styles.centerFilterContainer}>
        <div className={styles.centerFilter}>
          <Grid container spacing={0}>
            <Grid item xl={4} lg={4} md={4} sm={6} xs={6}>
              <div
                style={{
                  backgroundColor: "#fff",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  height: "55px",
                  borderRadius: "30px 0px 0px 30px",
                  position: "relative",
                }}
              >
                <IconButton
                  sx={{ p: "10px", marginLeft: "10px" }}
                  aria-label="menu"
                >
                  <SearchIcon />
                </IconButton>

                <InputBase
                  sx={{ ml: 1, flex: 1, display: { xs: "none", md: "block" } }}
                  placeholder="Search Brands"
                  value={brand}
                  onChange={searchBrand}
                  onKeyUp={keyUp}
                />
                <InputBase
                  sx={{ ml: 1, flex: 1, display: { xs: "block", md: "none" } }}
                  placeholder="Brands"
                  value={brand}
                  onChange={searchBrand}
                  onKeyUp={keyUp}
                />
                <IconButton
                  sx={{ p: "10px" }}
                  aria-label="search"
                  onClick={() => {
                    setStatus(!status);
                  }}
                >
                  <ArrowDropDownOutlinedIcon />
                </IconButton>
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                {status ? (
                  <div
                    style={{
                      position: "absolute",
                      top: "58px",
                      width: "95%",
                      backgroundColor: "#ffffff",
                      borderRadius: "10px",
                      padding: "10px",
                      maxHeight: "400px",
                      overflow: "auto",
                      border: "1px solid #dfdfdf",
                      zIndex: "1000",
                    }}
                  >
                    {selectedBrands.lenth > 0 ? (
                      <div className="boldText" style={{ margin: "10px" }}>
                        Your Selected
                      </div>
                    ) : (
                      <></>
                    )}

                    <div style={{ position: "block" }}>
                      {selectedBrands.map((item, i) => {
                        return (
                          <div
                            className="dayBadge"
                            onClick={() => unSelectBrand(item)}
                            key={i}
                          >
                            {item.brand}
                          </div>
                        );
                      })}
                    </div>
                    <div
                      className="boldText"
                      style={{ textAlign: "left", margin: "10px" }}
                    >
                      Suggested
                    </div>
                    <div>
                      {suggestedBrands.length === 0 ? (
                        <div>No brands suggested</div>
                      ) : (
                        <></>
                      )}
                      {suggestedBrands.map((item, i) => {
                        return (
                          <div
                            className="dayBadge"
                            style={{ backgroundColor: "#e5e5e5" }}
                            onClick={() => selectBrand(item)}
                            key={i}
                          >
                            {item.brand}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </Grid>
            <Grid
              item
              xl={8}
              lg={8}
              md={8}
              sm={6}
              xs={6}
              onClick={() => setStatus(false)}
            >
              <div
                style={{
                  backgroundColor: "#fff",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  height: "55px",
                  borderRadius: "0px 30px 30px 0px",
                  position: "relative",
                }}
              >
                <IconButton
                  sx={{ p: "10px" }}
                  aria-label="search"
                  onClick={serchFilter}
                >
                  <SearchIcon />
                </IconButton>
                <PlacesAutocomplete
                  value={location}
                  onChange={handleChange1}
                  onSelect={handleSelect}
                  className="inputBox"
                >
                  {({
                    getInputProps,
                    suggestions,
                    getSuggestionItemProps,
                    loading,
                  }) => (
                    <>
                      <InputBase
                        sx={{ ml: 1, flex: 1, width: "100%" }}
                        {...getInputProps({
                          placeholder: "Search Places ...",
                          className: "location-search-input c_j_form_input ",
                        })}
                        id="locationInput"
                      />
                      <div
                        className="autocomplete-dropdown-container"
                        style={{
                          width: "100%",

                          position: "absolute",
                          top: "100%",
                          zIndex: 1000,
                          fontFamily: "roboto-regular",
                          fontSize: "16px",
                          border:
                            suggestions.length === 0 ? "" : "1px solid grey",
                          overflow: "hidden",
                          borderEndStartRadius: "10px",
                          borderEndEndRadius: "10px",
                          background: "white",
                        }}
                      >
                        {loading && <div>Loading...</div>}
                        {suggestions.map((suggestion, i) => {
                          const className = suggestion.active
                            ? "suggestion-item--active"
                            : "suggestion-item";
                          // inline style for demonstration purpose
                          const style = suggestion.active
                            ? {
                                backgroundColor: "#e1e1e1",
                                cursor: "pointer",
                                padding: "10px 20px",
                              }
                            : {
                                backgroundColor: "#ffffff",
                                cursor: "pointer",
                                padding: "10px 20px",
                              };
                          return (
                            <div
                              {...getSuggestionItemProps(suggestion, {
                                className,
                                style,
                              })}
                              key={i}
                            >
                              <span>{suggestion.description}</span>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </PlacesAutocomplete>
                
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
      <Container
      maxWidth = "xxl"
        style={{ paddingTop: "50px", paddingBottom: "50px" }}
      >
        <Alert
          id="alert"
          severity="success"
          style={{
            position: "sticky",
            top: "75px",
            border: "1px solid #e5e5e5",
            zIndex: "1000",
            display: "none",
          }}
        >
          Your enquiry has been sent to center, they will contact you soon!!
        </Alert>

        <Grid container columnSpacing={6.8} rowSpacing = {5} id="Container">
          {isLoading && (
            <>
              <Grid item xl={3} lg={4} md={4} sm={6} xs={6}>
                <Skeleton
                  style={{
                    height: "250px",
                    borderRadius: "10px",
                    marginBottom: "20px",
                    border: "1px solid #e8e8e8",
                  }}
                />
              </Grid>
              <Grid item xl={3} lg={4} md={4} sm={6} xs={6}>
                <Skeleton
                  style={{
                    height: "250px",
                    borderRadius: "10px",
                    marginBottom: "20px",
                    border: "1px solid #e8e8e8",
                  }}
                />
              </Grid>
              <Grid item xl={3} lg={4} md={4} sm={6} xs={6}>
                <Skeleton
                  style={{
                    height: "250px",
                    borderRadius: "10px",
                    marginBottom: "20px",
                    border: "1px solid #e8e8e8",
                  }}
                />
              </Grid>
              <Grid item xl={3} lg={4} md={4} sm={6} xs={6}>
                <Skeleton
                  style={{
                    height: "250px",
                    borderRadius: "10px",
                    marginBottom: "20px",
                    border: "1px solid #e8e8e8",
                  }}
                />
              </Grid>
              <Grid item xl={3} lg={4} md={4} sm={6} xs={6}>
                <Skeleton
                  style={{
                    height: "250px",
                    borderRadius: "10px",
                    marginBottom: "20px",
                    border: "1px solid #e8e8e8",
                  }}
                />
              </Grid>
              <Grid item xl={3} lg={4} md={4} sm={6} xs={6}>
                <Skeleton
                  style={{
                    height: "250px",
                    borderRadius: "10px",
                    marginBottom: "20px",
                    border: "1px solid #e8e8e8",
                  }}
                />
              </Grid>
            </>
          )}
          {centers.map((item, i) => {
            return (
              <Grid item xl={3} lg={4} md={6} sm={6} xs={12} key={i}>
                <div
                  className = {styles.centerItemContainer}
                > 
                  <div>
                    <div style={{ position: "relative" }}>
                      <img
                        src={`${imageLink}/${item.coverPic}`}
                        className = {styles.centerCoverPic}
                        data-src=""
                        alt="coverpic"
                        loading="lazy"
                      />
                      <div className={styles.profilePicContainer}>
                        <Link href={`/service-center/${item.slug}`}>
                          <a>
                            <img
                              className={styles.profilePicImg}
                              src={`${imageLink}/${item.profilePic}`}
                              data-src=""
                              loading="lazy"
                              alt="profilePic"
                            />
                          </a>
                        </Link>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          position: "absolute",
                          right: "0px",
                          top: "0px",
                          backgroundColor: "#ffffff80",
                          padding: "8px",
                          borderRadius: "0px 0px 0px 10px",
                        }}
                      >
                        {item.rating >= 1 ? (
                          <StarRoundedIcon sx={{ color: "gold" }} />
                        ) : (
                          <StarBorderRoundedIcon />
                        )}
                        {item.rating >= 2 ? (
                          <StarRoundedIcon sx={{ color: "gold" }} />
                        ) : (
                          <StarBorderRoundedIcon />
                        )}
                        {item.rating >= 3 ? (
                          <StarRoundedIcon sx={{ color: "gold" }} />
                        ) : (
                          <StarBorderRoundedIcon />
                        )}
                        {item.rating >= 4 ? (
                          <StarRoundedIcon sx={{ color: "gold" }} />
                        ) : (
                          <StarBorderRoundedIcon />
                        )}
                        {item.rating >= 5 ? (
                          <StarRoundedIcon sx={{ color: "gold" }} />
                        ) : (
                          <StarBorderRoundedIcon />
                        )}
                      </div>
                    </div>
                    <div style={{ padding: "20px 20px 20px 20px" }}>
                      <Link href={`/service-center/${item.slug}`}>
                        <a className="scName">{item.centerName}</a>
                      </Link>
                      <Grid container columnSpacing={1} rowSpacing={0}>
                        <Grid item xl={5} lg={5} md={5} sm={12} xs={12}>
                          <div className="scTitle">Working Time :</div>
                          <div className="scDesc"> {item.workingHours}</div>
                        </Grid>
                        <Grid item xl={7} lg={7} md={7} sm={12} xs={12}>
                          <div className="scTitle">Location :</div>
                          <div className="scDesc">
                            {" "}
                            {item.address ? item.address.split(",")[0] : ""}
                            {item.address
                              ? item.address.split(",")[1]
                                ? "," + item.address.split(",")[1]
                                : ""
                              : ""}
                          </div>
                        </Grid>
                        {/* <Grid
                          item
                          xl={12}
                          lg={12}
                          md={6}
                          sm={12}
                          xs={12}
                          style={{ height: "60px" }}
                        >
                        
                        </Grid> */}
                        <Grid item xl={12} lg={12} md={6} sm={12} xs={12}>
                          <div className="scTitle">Brands :</div>
                          <div
                            className="scDesc"
                            style={{ display: "inline-block" }}
                          >
                            {" "}
                            {item.brandOfDrones
                              .slice(0, 3)
                              .map((brand, index) => {
                                return (
                                  <div
                                    className="service_center_brand_list"
                                    key={index}
                                    style={{ display: "inline-block" }}
                                  >
                                    {brand}
                                    {index + 1 <
                                      item.brandOfDrones.slice(0, 4).length &&
                                      ","}{" "}
                                    &nbsp;{" "}
                                  </div>
                                );
                              })}{" "}
                            {item.brandOfDrones.length > 4 && `. . .`}
                          </div>
                        </Grid>
                      </Grid>

                      {/* {item.whatsappNo ? (
                        <a
                          href={
                            "https://api.whatsapp.com/send/?phone=+91 " +
                            item.whatsappNo +
                            "&text=Hello"
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          <div
                            style={{
                              cursor: "pointer",
                              float: "right",
                              marginLeft: "20px",
                              marginTop: "5px",
                            }}
                          >
                            <WhatsAppIcon sx={{ color: "#25D366" }} />
                          </div>
                        </a>
                      ) : (
                        <></>
                      )} */}
                    </div>
                  </div>
                  <button
                    className={styles.enquireBtn2}
                    onClick={() => enquireNow(item._id)}
                    style={{
                      pointerEvents:
                        userData._id === item.userId ? "none" : "auto",
                      opacity: userData._id === item.userId ? "0.5" : "1",
                    }}
                  >
                    ENQUIRE NOW
                  </button>
                </div>
              </Grid>
            );
          })}
        </Grid>
        {nextPage && <div className="loadingContainer">
          <CircularProgress sx = {{color: "#00e7fc"}} />
        </div>}
        {!isLoading && centers.length <= 0 && (
          <div style={{ textAlign: "center", color: "#989898" }}>
            No data based on your search
          </div>
        )}
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
              <button className={popup.popupSubmit} onClick={askEnquiry}>
                Start Chat
              </button>
            )}
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
    </div>
  );
}

export default ServiceCenter;
